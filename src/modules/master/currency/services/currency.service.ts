import { Inject, Injectable } from '@nestjs/common';

import { Assertion } from 'src/common/assertions';
import { Messages } from 'src/common/constants';
import { PageResult } from 'src/common/models';

import { CacheKeys } from 'src/infrastructure/redis/constants/cache.keys';
import { CacheTTL } from 'src/infrastructure/redis/constants/cache.ttl';
import { CacheService } from 'src/infrastructure/redis/services/cache.service';
import { CurrencyRepository } from '../repositories/currency.repository';
import {
  CurrencyFilterContract,
  CreateCurrencyContract,
  UpdateCurrencyContract,
} from '../contracts';
import { CurrencyEntity } from '../entities/currency.entity';

@Injectable()
export class CurrencyService {
  constructor(
    @Inject(CurrencyRepository)
    private readonly repository: CurrencyRepository,

    private readonly cacheService: CacheService,
  ) {}

  async findMany(
    filter: CurrencyFilterContract,
  ): Promise<PageResult<CurrencyEntity>> {
    return this.repository.findMany(filter);
  }

  async findById(id: string): Promise<CurrencyEntity> {
    return this.getCurrencyOrThrow(id);
  }

  async create(
    contract: CreateCurrencyContract,
    userId: string,
  ): Promise<CurrencyEntity> {
    const isDuplicate = await this.repository.exists(contract.code);

    Assertion.duplicate(isDuplicate, Messages.CURRENCY.DUPLICATE_CODE);

    const entity = await this.repository.create(contract, userId);

    await this.invalidateCache();

    return entity;
  }

  async update(
    id: string,
    contract: UpdateCurrencyContract,
    userId: string,
  ): Promise<CurrencyEntity> {
    await this.getCurrencyOrThrow(id);

    const entity = await this.repository.update(id, contract, userId);

    await this.invalidateCache(id);

    return entity;
  }

  async remove(id: string, userId: string): Promise<void> {
    const current = await this.getCurrencyOrThrow(id);

    await this.repository.softDelete(current.id, userId);

    await this.invalidateCache(id);
  }

  private async getCurrencyOrThrow(id: string): Promise<CurrencyEntity> {
    const entity = await this.cacheService.remember(
      CacheKeys.currency.detail(id),
      CacheTTL.CURRENCY,
      () => this.repository.findById(id),
    );

    Assertion.notFound(entity, Messages.CURRENCY.NOT_FOUND);

    return entity;
  }

  private async invalidateCache(id?: string): Promise<void> {
    if (id) {
      await this.cacheService.invalidate(CacheKeys.currency.detail(id));
    }
  }
}
