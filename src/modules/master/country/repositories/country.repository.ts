import { PageResult } from 'src/common/models';
import { CountryFilterContract } from '../contracts/country-filter.contract';
import { CreateCountryContract } from '../contracts/create-country.contract';
import { UpdateCountryContract } from '../contracts/update-country.contract';
import { CountryEntity } from '../entities/country.entity';

export abstract class CountryRepository {
  abstract findMany(
    filter: CountryFilterContract,
  ): Promise<PageResult<CountryEntity>>;

  abstract findById(id: string): Promise<CountryEntity | null>;

  abstract exists(code: string, excludeId?: string): Promise<boolean>;

  abstract create(
    contract: CreateCountryContract,
    createdBy: string,
  ): Promise<CountryEntity>;

  abstract update(
    id: string,
    contract: UpdateCountryContract,
    updatedBy: string,
  ): Promise<CountryEntity>;

  abstract softDelete(id: string, deletedBy: string): Promise<void>;
}
