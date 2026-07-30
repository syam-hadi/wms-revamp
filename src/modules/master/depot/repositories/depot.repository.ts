import { PageResult } from 'src/common/models';
import {
  DepotFilterContract,
  CreateDepotContract,
  UpdateDepotContract,
} from '../contracts';
import { DepotEntity } from '../entities/depot.entity';

export abstract class DepotRepository {
  abstract findMany(
    filter: DepotFilterContract,
  ): Promise<PageResult<DepotEntity>>;

  abstract findById(id: string): Promise<DepotEntity | null>;

  abstract exists(code: string, excludeId?: string): Promise<boolean>;

  abstract create(
    contract: CreateDepotContract,
    createdBy: string,
  ): Promise<DepotEntity>;

  abstract update(
    id: string,
    contract: UpdateDepotContract,
    updatedBy: string,
  ): Promise<DepotEntity>;

  abstract softDelete(id: string, deletedBy: string): Promise<void>;
}
