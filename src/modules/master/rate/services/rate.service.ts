import { Inject, Injectable } from '@nestjs/common';

import { Assertion } from 'src/common/assertions';
import { Messages } from 'src/common/constants';
import { PageResult } from 'src/common/models';

import { CacheKeys } from 'src/infrastructure/redis/constants/cache.keys';
import { CacheTTL } from 'src/infrastructure/redis/constants/cache.ttl';
import { CacheService } from 'src/infrastructure/redis/services/cache.service';
import { RateRepository } from '../repositories/rate.repository';
import { RateFilterContract } from '../contracts/rate-filter.contract';
import { CreateRateContract } from '../contracts/create-rate.contract';
import { UpdateRateContract } from '../contracts/update-rate.contract';
import { RateEntity } from '../entities/rate.entity';

@Injectable()
export class RateService {
  constructor(
    @Inject(RateRepository)
    private readonly repository: RateRepository,

    private readonly cacheService: CacheService,
  ) {}

  async findMany(filter: RateFilterContract): Promise<PageResult<RateEntity>> {
    return this.repository.findMany(filter);
  }

  async findById(id: string): Promise<RateEntity> {
    return this.getRateOrThrow(id);
  }

  async create(
    contract: CreateRateContract,
    userId: string,
  ): Promise<RateEntity> {
    const entity = await this.repository.create(contract, userId);

    await this.invalidateCache();

    return entity;
  }

  async update(
    id: string,
    contract: UpdateRateContract,
    userId: string,
  ): Promise<RateEntity> {
    await this.getRateOrThrow(id);

    const entity = await this.repository.update(id, contract, userId);

    await this.invalidateCache(id);

    return entity;
  }

  async remove(id: string, userId: string): Promise<void> {
    const current = await this.getRateOrThrow(id);

    await this.repository.softDelete(current.id, userId);

    await this.invalidateCache(id);
  }

  private async getRateOrThrow(id: string): Promise<RateEntity> {
    const entity = await this.cacheService.remember(
      CacheKeys.rate.detail(id),
      CacheTTL.RATE,
      () => this.repository.findById(id),
    );

    Assertion.notFound(entity, Messages.RATE.NOT_FOUND);

    return entity;
  }

  private async invalidateCache(id?: string): Promise<void> {
    if (id) {
      await this.cacheService.invalidate(CacheKeys.rate.detail(id));
    }
  }
}
