import { Inject, Injectable } from '@nestjs/common';

import { Assertion } from 'src/common/assertions';
import { Messages } from 'src/common/constants';
import { PageResult } from 'src/common/models';

import { CacheKeys } from 'src/infrastructure/redis/constants/cache.keys';
import { CacheTTL } from 'src/infrastructure/redis/constants/cache.ttl';
import { CacheService } from 'src/infrastructure/redis/services/cache.service';
import { ConfigRepository } from '../repositories/config.repository';
import { ConfigFilterContract } from '../contracts/config-filter.contract';
import { ConfigEntity } from '../entities/config.entity';
import { CreateConfigContract } from '../contracts/create-config.contract';
import { UpdateConfigContract } from '../contracts/update-config.contract';

@Injectable()
export class ConfigService {
  constructor(
    @Inject(ConfigRepository)
    private readonly repository: ConfigRepository,

    private readonly cacheService: CacheService,
  ) {}

  async findMany(
    filter: ConfigFilterContract,
  ): Promise<PageResult<ConfigEntity>> {
    return this.repository.findMany(filter);
  }

  async findById(id: string): Promise<ConfigEntity> {
    return this.getConfigOrThrow(id);
  }

  async findActiveByGroup(configGroup: string): Promise<ConfigEntity[]> {
    return this.cacheService.remember(
      CacheKeys.config.group(configGroup),
      CacheTTL.CONFIG,
      () => this.repository.findActiveByGroup(configGroup),
    );
  }

  async create(
    contract: CreateConfigContract,
    userId: string,
  ): Promise<ConfigEntity> {
    const isDuplicate = await this.repository.exists(
      contract.configGroup,
      contract.code,
    );

    Assertion.duplicate(isDuplicate, Messages.CONFIG.DUPLICATE_CODE);

    const entity = await this.repository.create(contract, userId);

    await this.invalidateCache(contract.configGroup);

    return entity;
  }

  async update(
    id: string,
    contract: UpdateConfigContract,
    userId: string,
  ): Promise<ConfigEntity> {
    const current = await this.getConfigOrThrow(id);

    const entity = await this.repository.update(id, contract, userId);

    await this.invalidateCache(current.configGroup, id);

    return entity;
  }

  async remove(id: string, userId: string): Promise<void> {
    const current = await this.getConfigOrThrow(id);

    await this.repository.softDelete(current.id, userId);

    await this.invalidateCache(current.configGroup, id);
  }

  private async getConfigOrThrow(id: string): Promise<ConfigEntity> {
    const entity = await this.cacheService.remember(
      CacheKeys.config.detail(id),
      CacheTTL.CONFIG,
      () => this.repository.findById(id),
    );

    Assertion.notFound(entity, Messages.CONFIG.NOT_FOUND);

    return entity;
  }

  private async invalidateCache(
    configGroup: string,
    id?: string,
  ): Promise<void> {
    await this.cacheService.invalidate(CacheKeys.config.group(configGroup));
    if (id) {
      await this.cacheService.invalidate(CacheKeys.config.detail(id));
    }
  }
}
