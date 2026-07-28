import { PageResult } from 'src/common/models';
import { RateEntity } from '../entities/rate.entity';
import { RateFilterContract } from '../contracts/rate-filter.contract';
import { CreateRateContract } from '../contracts/create-rate.contract';
import { UpdateRateContract } from '../contracts/update-rate.contract';

export interface RateRepository {
  findMany(filter: RateFilterContract): Promise<PageResult<RateEntity>>;
  findById(id: string): Promise<RateEntity | null>;
  create(contract: CreateRateContract, userId: string): Promise<RateEntity>;
  update(
    id: string,
    contract: UpdateRateContract,
    userId: string,
  ): Promise<RateEntity>;
  softDelete(id: string, userId: string): Promise<void>;
}

export const RateRepository = Symbol('RateRepository');
