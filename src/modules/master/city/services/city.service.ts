import { Inject, Injectable } from '@nestjs/common';

import { Assertion } from 'src/common/assertions';
import { Messages } from 'src/common/constants';
import { PageResult } from 'src/common/models';

import { CacheKeys } from 'src/infrastructure/redis/constants/cache.keys';
import { CacheTTL } from 'src/infrastructure/redis/constants/cache.ttl';
import { CacheService } from 'src/infrastructure/redis/services/cache.service';

import { CityRepository } from '../repositories/city.repository';
import { CityFilterContract } from '../contracts/city-filter.contract';
import { CityEntity } from '../entities/city.entity';
import { CreateCityContract } from '../contracts/create-city.contract';
import { UpdateCityContract } from '../contracts/update-city.contract';
import { ProvinceRepository } from '../../province/repositories/province.repository';

@Injectable()
export class CityService {
  constructor(
    @Inject(CityRepository)
    private readonly repository: CityRepository,

    @Inject(ProvinceRepository)
    private readonly provinceRepository: ProvinceRepository,

    private readonly cacheService: CacheService,
  ) {}

  async findMany(filter: CityFilterContract): Promise<PageResult<CityEntity>> {
    return this.repository.findMany(filter);
  }

  async findById(id: string): Promise<CityEntity> {
    return this.getCityOrThrow(id);
  }

  async create(
    contract: CreateCityContract,
    userId: string,
  ): Promise<CityEntity> {
    const province = await this.provinceRepository.findById(
      contract.provinceId,
    );
    Assertion.notFound(province, Messages.PROVINCE.NOT_FOUND);

    const isDuplicate = await this.repository.exists(
      contract.code,
      contract.provinceId,
    );
    Assertion.duplicate(isDuplicate, Messages.CITY.DUPLICATE_CODE);

    const entity = await this.repository.create(contract, userId);

    await this.invalidateCache();

    return entity;
  }

  async update(
    id: string,
    contract: UpdateCityContract,
    userId: string,
  ): Promise<CityEntity> {
    const current = await this.getCityOrThrow(id);

    const provinceIdToCheck = contract.provinceId ?? current.provinceId;

    if (contract.provinceId && contract.provinceId !== current.provinceId) {
      const province = await this.provinceRepository.findById(
        contract.provinceId,
      );
      Assertion.notFound(province, Messages.PROVINCE.NOT_FOUND);
    }

    if (contract.code && contract.code !== current.code) {
      const isDuplicate = await this.repository.exists(
        contract.code,
        provinceIdToCheck,
        id,
      );
      Assertion.duplicate(isDuplicate, Messages.CITY.DUPLICATE_CODE);
    } else if (
      contract.provinceId &&
      contract.provinceId !== current.provinceId
    ) {
      const isDuplicate = await this.repository.exists(
        current.code,
        provinceIdToCheck,
        id,
      );
      Assertion.duplicate(isDuplicate, Messages.CITY.DUPLICATE_CODE);
    }

    const entity = await this.repository.update(id, contract, userId);

    await this.invalidateCache(id);

    return entity;
  }

  async remove(id: string, userId: string): Promise<void> {
    const current = await this.getCityOrThrow(id);

    await this.repository.softDelete(current.id, userId);

    await this.invalidateCache(id);
  }

  private async getCityOrThrow(id: string): Promise<CityEntity> {
    const entity = await this.cacheService.remember(
      CacheKeys.city.detail(id),
      CacheTTL.CITY,
      () => this.repository.findById(id),
    );

    Assertion.notFound(entity, Messages.CITY.NOT_FOUND);

    return entity;
  }

  private async invalidateCache(id?: string): Promise<void> {
    if (id) {
      await this.cacheService.invalidate(CacheKeys.city.detail(id));
    }
  }
}
