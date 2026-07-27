import { PageResult } from 'src/common/models';
import { CityFilterContract } from '../contracts/city-filter.contract';
import { CreateCityContract } from '../contracts/create-city.contract';
import { UpdateCityContract } from '../contracts/update-city.contract';
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
