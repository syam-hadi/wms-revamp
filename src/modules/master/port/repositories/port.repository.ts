import { PageResult } from 'src/common/models';
import {
  PortFilterContract,
  CreatePortContract,
  UpdatePortContract,
} from '../contracts';
import { PortEntity } from '../entities/port.entity';

export abstract class PortRepository {
  abstract findMany(
    filter: PortFilterContract,
  ): Promise<PageResult<PortEntity>>;

  abstract findById(id: string): Promise<PortEntity | null>;

  abstract exists(code: string, excludeId?: string): Promise<boolean>;

  abstract create(
    contract: CreatePortContract,
    createdBy: string,
  ): Promise<PortEntity>;

  abstract update(
    id: string,
    contract: UpdatePortContract,
    updatedBy: string,
  ): Promise<PortEntity>;

  abstract softDelete(id: string, deletedBy: string): Promise<void>;
}
