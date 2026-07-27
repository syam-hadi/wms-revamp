import { Inject, Injectable } from '@nestjs/common';

import { Assertion } from 'src/common/assertions';
import { Messages } from 'src/common/constants';
import { PageResult } from 'src/common/models';

import { CacheKeys } from 'src/infrastructure/redis/constants/cache.keys';
import { CacheTTL } from 'src/infrastructure/redis/constants/cache.ttl';
import { CacheService } from 'src/infrastructure/redis/services/cache.service';
import { CountryRepository } from '../repositories/country.repository';
import { CountryFilterContract } from '../contracts/country-filter.contract';
import { CountryEntity } from '../entities/country.entity';
import { CreateCountryContract } from '../contracts/create-country.contract';
import { UpdateCountryContract } from '../contracts/update-country.contract';

@Injectable()
export class CountryService {
  constructor(
    @Inject(CountryRepository)
    private readonly repository: CountryRepository,

    private readonly cacheService: CacheService,
  ) {}

  async findMany(
    filter: CountryFilterContract,
  ): Promise<PageResult<CountryEntity>> {
    return this.repository.findMany(filter);
  }

  async findById(id: string): Promise<CountryEntity> {
    return this.getCountryOrThrow(id);
  }

  async create(
    contract: CreateCountryContract,
    userId: string,
  ): Promise<CountryEntity> {
    const isDuplicate = await this.repository.exists(contract.code);

    Assertion.duplicate(isDuplicate, Messages.COUNTRY.DUPLICATE_CODE);

    const entity = await this.repository.create(contract, userId);

    await this.invalidateCache();

    return entity;
  }

  async update(
    id: string,
    contract: UpdateCountryContract,
    userId: string,
  ): Promise<CountryEntity> {
    const current = await this.getCountryOrThrow(id);

    if (contract.code && contract.code !== current.code) {
      const isDuplicate = await this.repository.exists(contract.code, id);
      Assertion.duplicate(isDuplicate, Messages.COUNTRY.DUPLICATE_CODE);
    }

    const entity = await this.repository.update(id, contract, userId);

    await this.invalidateCache(id);

    return entity;
  }

  async remove(id: string, userId: string): Promise<void> {
    const current = await this.getCountryOrThrow(id);

    await this.repository.softDelete(current.id, userId);

    await this.invalidateCache(id);
  }

  private async getCountryOrThrow(id: string): Promise<CountryEntity> {
    const entity = await this.cacheService.remember(
      CacheKeys.country.detail(id),
      CacheTTL.COUNTRY,
      () => this.repository.findById(id),
    );

    Assertion.notFound(entity, Messages.COUNTRY.NOT_FOUND);

    return entity;
  }

  private async invalidateCache(id?: string): Promise<void> {
    await this.cacheService.invalidate(CacheKeys.country.list());
    if (id) {
      await this.cacheService.invalidate(CacheKeys.country.detail(id));
    }
  }
}
