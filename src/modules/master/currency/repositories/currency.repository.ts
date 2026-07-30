import { PageResult } from 'src/common/models';
import {
  CurrencyFilterContract,
  CreateCurrencyContract,
  UpdateCurrencyContract,
} from '../contracts';
import { CurrencyEntity } from '../entities/currency.entity';

export abstract class CurrencyRepository {
  abstract findMany(
    filter: CurrencyFilterContract,
  ): Promise<PageResult<CurrencyEntity>>;

  abstract findById(id: string): Promise<CurrencyEntity | null>;

  abstract exists(code: string, excludeId?: string): Promise<boolean>;

  abstract create(
    contract: CreateCurrencyContract,
    createdBy: string,
  ): Promise<CurrencyEntity>;

  abstract update(
    id: string,
    contract: UpdateCurrencyContract,
    updatedBy: string,
  ): Promise<CurrencyEntity>;

  abstract softDelete(id: string, deletedBy: string): Promise<void>;
}
