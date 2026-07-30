import { PageResult } from 'src/common/models';
import {
  ProvinceFilterContract,
  CreateProvinceContract,
  UpdateProvinceContract,
} from '../contracts';
import { ProvinceEntity } from '../entities/province.entity';

export abstract class ProvinceRepository {
  abstract findMany(
    filter: ProvinceFilterContract,
  ): Promise<PageResult<ProvinceEntity>>;

  abstract findById(id: string): Promise<ProvinceEntity | null>;

  abstract findByCountry(countryId: string): Promise<ProvinceEntity[]>;

  abstract exists(
    code: string,
    countryId: string,
    excludeId?: string,
  ): Promise<boolean>;

  abstract create(
    contract: CreateProvinceContract,
    createdBy: string,
  ): Promise<ProvinceEntity>;

  abstract update(
    id: string,
    contract: UpdateProvinceContract,
    updatedBy: string,
  ): Promise<ProvinceEntity>;

  abstract softDelete(id: string, deletedBy: string): Promise<void>;
}
