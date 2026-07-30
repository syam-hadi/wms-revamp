import { Inject, Injectable } from '@nestjs/common';

import { Assertion } from 'src/common/assertions';
import { Messages } from 'src/common/constants';
import { PageResult } from 'src/common/models';

import { CacheKeys } from 'src/infrastructure/redis/constants/cache.keys';
import { CacheTTL } from 'src/infrastructure/redis/constants/cache.ttl';
import { CacheService } from 'src/infrastructure/redis/services/cache.service';

import { ProvinceRepository } from '../repositories/province.repository';
import {
  ProvinceFilterContract,
  CreateProvinceContract,
  UpdateProvinceContract,
} from '../contracts';
import { ProvinceEntity } from '../entities/province.entity';
import { CountryRepository } from '../../country/repositories/country.repository';

@Injectable()
export class ProvinceService {
  constructor(
    @Inject(ProvinceRepository)
    private readonly repository: ProvinceRepository,

    @Inject(CountryRepository)
    private readonly countryRepository: CountryRepository,

    private readonly cacheService: CacheService,
  ) {}

  async findMany(
    filter: ProvinceFilterContract,
  ): Promise<PageResult<ProvinceEntity>> {
    return this.repository.findMany(filter);
  }

  async findById(id: string): Promise<ProvinceEntity> {
    return this.getProvinceOrThrow(id);
  }

  async create(
    contract: CreateProvinceContract,
    userId: string,
  ): Promise<ProvinceEntity> {
    const country = await this.countryRepository.findById(contract.countryId);
    Assertion.notFound(country, Messages.COUNTRY.NOT_FOUND);

    const isDuplicate = await this.repository.exists(
      contract.code,
      contract.countryId,
    );
    Assertion.duplicate(isDuplicate, Messages.PROVINCE.DUPLICATE_CODE);

    const entity = await this.repository.create(contract, userId);

    await this.invalidateCache();

    return entity;
  }

  async update(
    id: string,
    contract: UpdateProvinceContract,
    userId: string,
  ): Promise<ProvinceEntity> {
    const current = await this.getProvinceOrThrow(id);

    const countryIdToCheck = contract.countryId ?? current.countryId;

    if (contract.countryId && contract.countryId !== current.countryId) {
      const country = await this.countryRepository.findById(contract.countryId);
      Assertion.notFound(country, Messages.COUNTRY.NOT_FOUND);
    }

    if (contract.code && contract.code !== current.code) {
      const isDuplicate = await this.repository.exists(
        contract.code,
        countryIdToCheck,
        id,
      );
      Assertion.duplicate(isDuplicate, Messages.PROVINCE.DUPLICATE_CODE);
    } else if (contract.countryId && contract.countryId !== current.countryId) {
      const isDuplicate = await this.repository.exists(
        current.code,
        countryIdToCheck,
        id,
      );
      Assertion.duplicate(isDuplicate, Messages.PROVINCE.DUPLICATE_CODE);
    }

    const entity = await this.repository.update(id, contract, userId);

    await this.invalidateCache(id);

    return entity;
  }

  async remove(id: string, userId: string): Promise<void> {
    const current = await this.getProvinceOrThrow(id);

    await this.repository.softDelete(current.id, userId);

    await this.invalidateCache(id);
  }

  private async getProvinceOrThrow(id: string): Promise<ProvinceEntity> {
    const entity = await this.cacheService.remember(
      CacheKeys.province.detail(id),
      CacheTTL.PROVINCE,
      () => this.repository.findById(id),
    );

    Assertion.notFound(entity, Messages.PROVINCE.NOT_FOUND);

    return entity;
  }

  private async invalidateCache(id?: string): Promise<void> {
    if (id) {
      await this.cacheService.invalidate(CacheKeys.province.detail(id));
    }
  }
}
