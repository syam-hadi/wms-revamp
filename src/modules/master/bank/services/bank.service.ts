import { Inject, Injectable } from '@nestjs/common';

import { Assertion } from 'src/common/assertions';
import { Messages } from 'src/common/constants';
import { PageResult } from 'src/common/models';

import { CacheKeys } from 'src/infrastructure/redis/constants/cache.keys';
import { CacheTTL } from 'src/infrastructure/redis/constants/cache.ttl';
import { CacheService } from 'src/infrastructure/redis/services/cache.service';
import { BankRepository } from '../repositories/bank.repository';
import {
  BankFilterContract,
  CreateBankContract,
  UpdateBankContract,
} from '../contracts';
import { BankEntity } from '../entities/bank.entity';
import { CodeGeneratorService } from 'src/common/code-generator/code-generator.service';
import { CodeModule } from 'src/common/code-generator/code-generator.enum';

@Injectable()
export class BankService {
  constructor(
    @Inject(BankRepository)
    private readonly repository: BankRepository,

    private readonly cacheService: CacheService,
    private readonly codeGenerator: CodeGeneratorService,
  ) {}

  async findMany(filter: BankFilterContract): Promise<PageResult<BankEntity>> {
    return this.repository.findMany(filter);
  }

  async findById(id: string): Promise<BankEntity> {
    return this.getBankOrThrow(id);
  }

  async create(
    contract: CreateBankContract,
    userId: string,
  ): Promise<BankEntity> {
    const isDuplicateShortName = await this.repository.existsByShortName(
      contract.shortName,
    );
    Assertion.duplicate(
      isDuplicateShortName,
      Messages.BANK.DUPLICATE_SHORT_NAME,
    );

    const isDuplicateName = await this.repository.existsByName(contract.name);
    Assertion.duplicate(isDuplicateName, Messages.BANK.DUPLICATE_NAME);

    const code = await this.codeGenerator.generate({
      module: CodeModule.BANK,
    });

    const entity = await this.repository.create(contract, code, userId);

    await this.invalidateCache();

    return entity;
  }

  async update(
    id: string,
    contract: UpdateBankContract,
    userId: string,
  ): Promise<BankEntity> {
    const current = await this.getBankOrThrow(id);

    if (contract.shortName && contract.shortName !== current.shortName) {
      const isDuplicate = await this.repository.existsByShortName(
        contract.shortName,
        id,
      );
      Assertion.duplicate(isDuplicate, Messages.BANK.DUPLICATE_SHORT_NAME);
    }

    if (contract.name && contract.name !== current.name) {
      const isDuplicate = await this.repository.existsByName(contract.name, id);
      Assertion.duplicate(isDuplicate, Messages.BANK.DUPLICATE_NAME);
    }

    const entity = await this.repository.update(id, contract, userId);

    await this.invalidateCache(id);

    return entity;
  }

  async remove(id: string, userId: string): Promise<void> {
    const current = await this.getBankOrThrow(id);

    await this.repository.softDelete(current.id, userId);

    await this.invalidateCache(id);
  }

  private async getBankOrThrow(id: string): Promise<BankEntity> {
    const entity = await this.cacheService.remember(
      CacheKeys.bank.detail(id),
      CacheTTL.BANK,
      () => this.repository.findById(id),
    );

    Assertion.notFound(entity, Messages.BANK.NOT_FOUND);

    return entity;
  }

  private async invalidateCache(id?: string): Promise<void> {
    if (id) {
      await this.cacheService.invalidate(CacheKeys.bank.detail(id));
    }
  }
}
