import { Inject, Injectable } from '@nestjs/common';

import { Assertion } from 'src/common/assertions';
import { Messages } from 'src/common/constants';
import { PageResult } from 'src/common/models';

import { CacheKeys } from 'src/infrastructure/redis/constants/cache.keys';
import { CacheTTL } from 'src/infrastructure/redis/constants/cache.ttl';
import { CacheService } from 'src/infrastructure/redis/services/cache.service';
import { CommodityRepository } from '../repositories/commodity.repository';
import {
  CommodityFilterContract,
  CreateCommodityContract,
  UpdateCommodityContract,
} from '../contracts';
import { CommodityEntity } from '../entities/commodity.entity';
import { CodeGeneratorService } from 'src/common/code-generator/code-generator.service';
import { CodeModule } from 'src/common/code-generator/code-generator.enum';

@Injectable()
export class CommodityService {
  constructor(
    @Inject(CommodityRepository)
    private readonly repository: CommodityRepository,

    private readonly cacheService: CacheService,
    private readonly codeGenerator: CodeGeneratorService,
  ) {}

  async findMany(
    filter: CommodityFilterContract,
  ): Promise<PageResult<CommodityEntity>> {
    return this.repository.findMany(filter);
  }

  async findById(id: string): Promise<CommodityEntity> {
    return this.getCommodityOrThrow(id);
  }

  async create(
    contract: CreateCommodityContract,
    userId: string,
  ): Promise<CommodityEntity> {
    const isDuplicateName = await this.repository.existsByName(contract.name);
    Assertion.duplicate(isDuplicateName, Messages.COMMODITY.DUPLICATE_NAME);

    const code = await this.codeGenerator.generate({
      module: CodeModule.COMMODITY,
    });

    const entity = await this.repository.create(contract, code, userId);

    await this.invalidateCache();

    return entity;
  }

  async update(
    id: string,
    contract: UpdateCommodityContract,
    userId: string,
  ): Promise<CommodityEntity> {
    const current = await this.getCommodityOrThrow(id);

    if (contract.name && contract.name !== current.name) {
      const isDuplicate = await this.repository.existsByName(contract.name, id);
      Assertion.duplicate(isDuplicate, Messages.COMMODITY.DUPLICATE_NAME);
    }

    const entity = await this.repository.update(id, contract, userId);

    await this.invalidateCache(id);

    return entity;
  }

  async remove(id: string, userId: string): Promise<void> {
    const current = await this.getCommodityOrThrow(id);

    await this.repository.softDelete(current.id, userId);

    await this.invalidateCache(id);
  }

  private async getCommodityOrThrow(id: string): Promise<CommodityEntity> {
    const entity = await this.cacheService.remember(
      CacheKeys.commodity.detail(id),
      CacheTTL.COMMODITY,
      () => this.repository.findById(id),
    );

    Assertion.notFound(entity, Messages.COMMODITY.NOT_FOUND);

    return entity;
  }

  private async invalidateCache(id?: string): Promise<void> {
    if (id) {
      await this.cacheService.invalidate(CacheKeys.commodity.detail(id));
    }
  }
}
