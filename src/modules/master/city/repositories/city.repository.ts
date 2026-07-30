import { PageResult } from 'src/common/models';
import {
  CityFilterContract,
  CreateCityContract,
  UpdateCityContract,
} from '../contracts';
import { CityEntity } from '../entities/city.entity';

export abstract class CityRepository {
  abstract findMany(
    filter: CityFilterContract,
  ): Promise<PageResult<CityEntity>>;

  abstract findById(id: string): Promise<CityEntity | null>;

  abstract findByProvince(provinceId: string): Promise<CityEntity[]>;

  abstract exists(
    code: string,
    provinceId: string,
    excludeId?: string,
  ): Promise<boolean>;

  abstract create(
    contract: CreateCityContract,
    createdBy: string,
  ): Promise<CityEntity>;

  abstract update(
    id: string,
    contract: UpdateCityContract,
    updatedBy: string,
  ): Promise<CityEntity>;

  abstract softDelete(id: string, deletedBy: string): Promise<void>;
}
