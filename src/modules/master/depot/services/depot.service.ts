import { Inject, Injectable } from '@nestjs/common';

import { Assertion } from 'src/common/assertions';
import { Messages } from 'src/common/constants';
import { PageResult } from 'src/common/models';

import { CacheKeys } from 'src/infrastructure/redis/constants/cache.keys';
import { CacheTTL } from 'src/infrastructure/redis/constants/cache.ttl';
import { CacheService } from 'src/infrastructure/redis/services/cache.service';
import { DepotRepository } from '../repositories/depot.repository';
import {
  DepotFilterContract,
  CreateDepotContract,
  UpdateDepotContract,
} from '../contracts';
import { DepotEntity } from '../entities/depot.entity';

@Injectable()
export class DepotService {
  constructor(
    @Inject(DepotRepository)
    private readonly repository: DepotRepository,

    private readonly cacheService: CacheService,
  ) {}

  async findMany(
    filter: DepotFilterContract,
  ): Promise<PageResult<DepotEntity>> {
    return this.repository.findMany(filter);
  }

  async findById(id: string): Promise<DepotEntity> {
    return this.getDepotOrThrow(id);
  }

  async create(
    contract: CreateDepotContract,
    userId: string,
  ): Promise<DepotEntity> {
    const isDuplicate = await this.repository.exists(contract.code);

    Assertion.duplicate(isDuplicate, Messages.DEPOT.DUPLICATE_CODE);

    const entity = await this.repository.create(contract, userId);

    await this.invalidateCache();

    return entity;
  }

  async update(
    id: string,
    contract: UpdateDepotContract,
    userId: string,
  ): Promise<DepotEntity> {
    await this.getDepotOrThrow(id);

    const entity = await this.repository.update(id, contract, userId);

    await this.invalidateCache(id);

    return entity;
  }

  async remove(id: string, userId: string): Promise<void> {
    const current = await this.getDepotOrThrow(id);

    await this.repository.softDelete(current.id, userId);

    await this.invalidateCache(id);
  }

  private async getDepotOrThrow(id: string): Promise<DepotEntity> {
    const entity = await this.cacheService.remember(
      CacheKeys.depot.detail(id),
      CacheTTL.DEPOT,
      () => this.repository.findById(id),
    );

    Assertion.notFound(entity, Messages.DEPOT.NOT_FOUND);

    return entity;
  }

  private async invalidateCache(id?: string): Promise<void> {
    if (id) {
      await this.cacheService.invalidate(CacheKeys.depot.detail(id));
    }
  }
}
