import { PageResult } from 'src/common/models';
import { BankFilterContract } from '../contracts/bank-filter.contract';
import { CreateBankContract } from '../contracts/create-bank.contract';
import { UpdateBankContract } from '../contracts/update-bank.contract';
import { BankEntity } from '../entities/bank.entity';

export abstract class BankRepository {
  abstract findMany(
    filter: BankFilterContract,
  ): Promise<PageResult<BankEntity>>;

  abstract findById(id: string): Promise<BankEntity | null>;

  abstract existsByShortName(
    shortName: string,
    excludeId?: string,
  ): Promise<boolean>;

  abstract existsByName(name: string, excludeId?: string): Promise<boolean>;

  abstract create(
    contract: CreateBankContract,
    code: string,
    createdBy: string,
  ): Promise<BankEntity>;

  abstract update(
    id: string,
    contract: UpdateBankContract,
    updatedBy: string,
  ): Promise<BankEntity>;

  abstract softDelete(id: string, deletedBy: string): Promise<void>;
}
