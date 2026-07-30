import { PageResult } from 'src/common/models';
import {
  UnitOfMeasurementFilterContract,
  CreateUnitOfMeasurementContract,
  UpdateUnitOfMeasurementContract,
} from '../contracts';
import { UnitOfMeasurementEntity } from '../entities/unit-of-measurement.entity';

export const UnitOfMeasurementRepository = Symbol(
  'UnitOfMeasurementRepository',
);

export interface UnitOfMeasurementRepository {
  findMany(
    filter: UnitOfMeasurementFilterContract,
  ): Promise<PageResult<UnitOfMeasurementEntity>>;

  findById(id: string): Promise<UnitOfMeasurementEntity | null>;

  exists(code: string, excludeId?: string): Promise<boolean>;

  create(
    contract: CreateUnitOfMeasurementContract,
    createdBy: string,
  ): Promise<UnitOfMeasurementEntity>;

  update(
    id: string,
    contract: UpdateUnitOfMeasurementContract,
    updatedBy: string,
  ): Promise<UnitOfMeasurementEntity>;

  softDelete(id: string, deletedBy: string): Promise<void>;
}
