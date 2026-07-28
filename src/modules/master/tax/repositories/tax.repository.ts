import { PageResult } from 'src/common/models';
import { TaxFilterContract } from '../contracts/tax-filter.contract';
import { CreateTaxContract } from '../contracts/create-tax.contract';
import { UpdateTaxContract } from '../contracts/update-tax.contract';
import { TaxEntity } from '../entities/tax.entity';

export abstract class TaxRepository {
  abstract findMany(filter: TaxFilterContract): Promise<PageResult<TaxEntity>>;

  abstract findById(id: string): Promise<TaxEntity | null>;

  abstract existsByName(name: string, excludeId?: string): Promise<boolean>;

  abstract create(
    contract: CreateTaxContract,
    createdBy: string,
  ): Promise<TaxEntity>;

  abstract update(
    id: string,
    contract: UpdateTaxContract,
    updatedBy: string,
  ): Promise<TaxEntity>;

  abstract softDelete(id: string, deletedBy: string): Promise<void>;
}
