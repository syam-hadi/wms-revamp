import { PageResult } from 'src/common/models';
import {
  CreateVesselContract,
  UpdateVesselContract,
  VesselFilterContract,
} from '../contracts';
import { VesselEntity } from '../entities/vessel.entity';

export const VesselRepository = Symbol('VesselRepository');

export interface VesselRepository {
  findMany(filter: VesselFilterContract): Promise<PageResult<VesselEntity>>;
  findById(id: string): Promise<VesselEntity | null>;
  exists(id: string): Promise<boolean>;
  existsByImoNumber(imoNumber: string, excludeId?: string): Promise<boolean>;
  create(
    contract: CreateVesselContract,
    createdBy: string,
  ): Promise<VesselEntity>;
  update(
    id: string,
    contract: UpdateVesselContract,
    updatedBy: string,
  ): Promise<VesselEntity>;
  softDelete(id: string, deletedBy: string): Promise<void>;
}
