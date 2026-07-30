import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CacheService } from 'src/infrastructure/redis/services/cache.service';
import { CacheKeys } from 'src/infrastructure/redis/constants/cache.keys';
import { CacheTTL } from 'src/infrastructure/redis/constants/cache.ttl';
import { PageResult } from 'src/common/models';
import { Messages } from 'src/common/constants';

import {
  CreateVesselContract,
  UpdateVesselContract,
  VesselFilterContract,
} from '../contracts';
import { VesselEntity } from '../entities/vessel.entity';
import { VesselRepository } from '../repositories/vessel.repository';

@Injectable()
export class VesselService {
  constructor(
    @Inject(VesselRepository)
    private readonly vesselRepository: VesselRepository,
    private readonly cacheService: CacheService,
  ) {}

  async findMany(
    filter: VesselFilterContract,
  ): Promise<PageResult<VesselEntity>> {
    return this.vesselRepository.findMany(filter);
  }

  async findById(id: string): Promise<VesselEntity> {
    const cacheKey = CacheKeys.vessel.detail(id);

    return this.cacheService.remember(cacheKey, CacheTTL.ONE_HOUR, async () => {
      const vessel = await this.vesselRepository.findById(id);

      if (!vessel) {
        throw new NotFoundException(Messages.VESSEL.NOT_FOUND);
      }

      return vessel;
    });
  }

  async create(
    contract: CreateVesselContract,
    createdBy: string,
  ): Promise<VesselEntity> {
    const existsByImoNumber = await this.vesselRepository.existsByImoNumber(
      contract.imoNumber,
    );

    if (existsByImoNumber) {
      throw new ConflictException(Messages.VESSEL.DUPLICATE_IMO);
    }

    const vessel = await this.vesselRepository.create(contract, createdBy);

    await this.invalidateCache();

    return vessel;
  }

  async update(
    id: string,
    contract: UpdateVesselContract,
    updatedBy: string,
  ): Promise<VesselEntity> {
    const exists = await this.vesselRepository.exists(id);

    if (!exists) {
      throw new NotFoundException(Messages.VESSEL.NOT_FOUND);
    }

    const vessel = await this.vesselRepository.update(id, contract, updatedBy);

    await this.invalidateCache(id);

    return vessel;
  }

  async delete(id: string, deletedBy: string): Promise<void> {
    const exists = await this.vesselRepository.exists(id);

    if (!exists) {
      throw new NotFoundException(Messages.VESSEL.NOT_FOUND);
    }

    await this.vesselRepository.softDelete(id, deletedBy);
    await this.invalidateCache(id);
  }

  private async invalidateCache(id?: string): Promise<void> {
    const keys = [CacheKeys.vessel.list()];

    if (id) {
      keys.push(CacheKeys.vessel.detail(id));
    }

    await this.cacheService.invalidateMany(keys);
  }
}
