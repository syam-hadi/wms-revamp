import { Inject, Injectable } from '@nestjs/common';

import { Assertion } from 'src/common/assertions';
import { Messages } from 'src/common/constants';
import { PageResult } from 'src/common/models';

import { CacheKeys } from 'src/infrastructure/redis/constants/cache.keys';
import { CacheTTL } from 'src/infrastructure/redis/constants/cache.ttl';
import { CacheService } from 'src/infrastructure/redis/services/cache.service';
import { TaxRepository } from '../repositories/tax.repository';
import { TaxFilterContract } from '../contracts/tax-filter.contract';
import { TaxEntity } from '../entities/tax.entity';
import { CreateTaxContract } from '../contracts/create-tax.contract';
import { UpdateTaxContract } from '../contracts/update-tax.contract';

@Injectable()
export class TaxService {
  constructor(
    @Inject(TaxRepository)
    private readonly repository: TaxRepository,

    private readonly cacheService: CacheService,
  ) {}

  async findMany(filter: TaxFilterContract): Promise<PageResult<TaxEntity>> {
    return this.repository.findMany(filter);
  }

  async findById(id: string): Promise<TaxEntity> {
    return this.getTaxOrThrow(id);
  }

  async create(
    contract: CreateTaxContract,
    userId: string,
  ): Promise<TaxEntity> {
    const isDuplicateName = await this.repository.existsByName(contract.name);
    Assertion.duplicate(isDuplicateName, Messages.TAX.DUPLICATE_NAME);

    const entity = await this.repository.create(contract, userId);

    await this.invalidateCache();

    return entity;
  }

  async update(
    id: string,
    contract: UpdateTaxContract,
    userId: string,
  ): Promise<TaxEntity> {
    const current = await this.getTaxOrThrow(id);

    if (contract.name && contract.name !== current.name) {
      const isDuplicate = await this.repository.existsByName(contract.name, id);
      Assertion.duplicate(isDuplicate, Messages.TAX.DUPLICATE_NAME);
    }

    const entity = await this.repository.update(id, contract, userId);

    await this.invalidateCache(id);

    return entity;
  }

  async remove(id: string, userId: string): Promise<void> {
    const current = await this.getTaxOrThrow(id);

    await this.repository.softDelete(current.id, userId);

    await this.invalidateCache(id);
  }

  private async getTaxOrThrow(id: string): Promise<TaxEntity> {
    const entity = await this.cacheService.remember(
      CacheKeys.tax.detail(id),
      CacheTTL.TAX,
      () => this.repository.findById(id),
    );

    Assertion.notFound(entity, Messages.TAX.NOT_FOUND);

    return entity;
  }

  private async invalidateCache(id?: string): Promise<void> {
    if (id) {
      await this.cacheService.invalidate(CacheKeys.tax.detail(id));
    }
  }
}
