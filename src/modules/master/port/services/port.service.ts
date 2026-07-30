import { Inject, Injectable } from '@nestjs/common';

import { Assertion } from 'src/common/assertions';
import { Messages } from 'src/common/constants';
import { PageResult } from 'src/common/models';

import { CacheKeys } from 'src/infrastructure/redis/constants/cache.keys';
import { CacheTTL } from 'src/infrastructure/redis/constants/cache.ttl';
import { CacheService } from 'src/infrastructure/redis/services/cache.service';
import { PortRepository } from '../repositories/port.repository';
import {
  PortFilterContract,
  CreatePortContract,
  UpdatePortContract,
} from '../contracts';
import { PortEntity } from '../entities/port.entity';

@Injectable()
export class PortService {
  constructor(
    @Inject(PortRepository)
    private readonly repository: PortRepository,

    private readonly cacheService: CacheService,
  ) {}

  async findMany(filter: PortFilterContract): Promise<PageResult<PortEntity>> {
    return this.repository.findMany(filter);
  }

  async findById(id: string): Promise<PortEntity> {
    return this.getPortOrThrow(id);
  }

  async create(
    contract: CreatePortContract,
    userId: string,
  ): Promise<PortEntity> {
    const isDuplicate = await this.repository.exists(contract.code);

    Assertion.duplicate(isDuplicate, Messages.PORT.DUPLICATE_CODE);

    const entity = await this.repository.create(contract, userId);

    await this.invalidateCache();

    return entity;
  }

  async update(
    id: string,
    contract: UpdatePortContract,
    userId: string,
  ): Promise<PortEntity> {
    await this.getPortOrThrow(id);

    const entity = await this.repository.update(id, contract, userId);

    await this.invalidateCache(id);

    return entity;
  }

  async remove(id: string, userId: string): Promise<void> {
    const current = await this.getPortOrThrow(id);

    await this.repository.softDelete(current.id, userId);

    await this.invalidateCache(id);
  }

  private async getPortOrThrow(id: string): Promise<PortEntity> {
    const entity = await this.cacheService.remember(
      CacheKeys.port.detail(id),
      CacheTTL.PORT,
      () => this.repository.findById(id),
    );

    Assertion.notFound(entity, Messages.PORT.NOT_FOUND);

    return entity;
  }

  private async invalidateCache(id?: string): Promise<void> {
    if (id) {
      await this.cacheService.invalidate(CacheKeys.port.detail(id));
    }
  }
}
