import { Inject, Injectable } from '@nestjs/common';

import { Assertion } from 'src/common/assertions';
import { Messages } from 'src/common/constants';
import { PageResult } from 'src/common/models';

import { CacheKeys } from 'src/infrastructure/redis/constants/cache.keys';
import { CacheTTL } from 'src/infrastructure/redis/constants/cache.ttl';
import { CacheService } from 'src/infrastructure/redis/services/cache.service';
import { UnitOfMeasurementRepository } from '../repositories/unit-of-measurement.repository';
import {
  UnitOfMeasurementFilterContract,
  CreateUnitOfMeasurementContract,
  UpdateUnitOfMeasurementContract,
} from '../contracts';
import { UnitOfMeasurementEntity } from '../entities/unit-of-measurement.entity';

@Injectable()
export class UnitOfMeasurementService {
  constructor(
    @Inject(UnitOfMeasurementRepository)
    private readonly repository: UnitOfMeasurementRepository,

    private readonly cacheService: CacheService,
  ) {}

  async findMany(
    filter: UnitOfMeasurementFilterContract,
  ): Promise<PageResult<UnitOfMeasurementEntity>> {
    return this.repository.findMany(filter);
  }

  async findById(id: string): Promise<UnitOfMeasurementEntity> {
    return this.getUnitOfMeasurementOrThrow(id);
  }

  async create(
    contract: CreateUnitOfMeasurementContract,
    userId: string,
  ): Promise<UnitOfMeasurementEntity> {
    const isDuplicate = await this.repository.exists(contract.code);

    Assertion.duplicate(
      isDuplicate,
      Messages.UNIT_OF_MEASUREMENT.DUPLICATE_CODE,
    );

    const entity = await this.repository.create(contract, userId);

    await this.invalidateCache();

    return entity;
  }

  async update(
    id: string,
    contract: UpdateUnitOfMeasurementContract,
    userId: string,
  ): Promise<UnitOfMeasurementEntity> {
    await this.getUnitOfMeasurementOrThrow(id);

    const entity = await this.repository.update(id, contract, userId);

    await this.invalidateCache(id);

    return entity;
  }

  async remove(id: string, userId: string): Promise<void> {
    const current = await this.getUnitOfMeasurementOrThrow(id);

    await this.repository.softDelete(current.id, userId);

    await this.invalidateCache(id);
  }

  private async getUnitOfMeasurementOrThrow(
    id: string,
  ): Promise<UnitOfMeasurementEntity> {
    const entity = await this.cacheService.remember(
      CacheKeys.unitOfMeasurement.detail(id),
      CacheTTL.UNIT_OF_MEASUREMENT,
      () => this.repository.findById(id),
    );

    Assertion.notFound(entity, Messages.UNIT_OF_MEASUREMENT.NOT_FOUND);

    return entity;
  }

  private async invalidateCache(id?: string): Promise<void> {
    if (id) {
      await this.cacheService.invalidate(
        CacheKeys.unitOfMeasurement.detail(id),
      );
    }
  }
}
