import { PageResult } from 'src/common/models';
import { CommodityEntity } from '../entities/commodity.entity';
import {
  CommodityFilterContract,
  CreateCommodityContract,
  UpdateCommodityContract,
} from '../contracts';

export interface CommodityRepository {
  findMany(
    filter: CommodityFilterContract,
  ): Promise<PageResult<CommodityEntity>>;
  findById(id: string): Promise<CommodityEntity | null>;
  create(
    contract: CreateCommodityContract,
    code: string,
    userId: string,
  ): Promise<CommodityEntity>;
  update(
    id: string,
    contract: UpdateCommodityContract,
    userId: string,
  ): Promise<CommodityEntity>;
  softDelete(id: string, userId: string): Promise<void>;
  existsByName(name: string, excludeId?: string): Promise<boolean>;
}

export const CommodityRepository = Symbol('CommodityRepository');
