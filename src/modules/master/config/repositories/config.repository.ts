import { PageResult } from 'src/common/models';
import {
  ConfigFilterContract,
  CreateConfigContract,
  UpdateConfigContract,
} from '../contracts';
import { ConfigEntity } from '../entities/config.entity';

export abstract class ConfigRepository {
  abstract findMany(
    filter: ConfigFilterContract,
  ): Promise<PageResult<ConfigEntity>>;

  abstract findById(id: string): Promise<ConfigEntity | null>;

  abstract findActiveByGroup(configGroup: string): Promise<ConfigEntity[]>;

  abstract exists(
    configGroup: string,
    code: string,
    excludeId?: string,
  ): Promise<boolean>;

  abstract create(
    contract: CreateConfigContract,
    code: string,
    createdBy: string,
  ): Promise<ConfigEntity>;

  abstract update(
    id: string,
    contract: UpdateConfigContract,
    updatedBy: string,
  ): Promise<ConfigEntity>;

  abstract softDelete(id: string, deletedBy: string): Promise<void>;
}
