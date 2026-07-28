import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaRepository } from 'src/infrastructure/prisma/prisma.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PageResult } from 'src/common/models';

import { BankFilterContract } from '../contracts/bank-filter.contract';
import { CreateBankContract } from '../contracts/create-bank.contract';
import { UpdateBankContract } from '../contracts/update-bank.contract';
import { BankEntity } from '../entities/bank.entity';
import { BankRepository } from './bank.repository';

@Injectable()
export class PrismaBankRepository
  extends PrismaRepository
  implements BankRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(filter: BankFilterContract): Promise<PageResult<BankEntity>> {
    const where: Prisma.BankWhereInput = {
      deletedAt: null,
      ...(filter.search && {
        OR: [
          {
            code: {
              contains: filter.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            shortName: {
              contains: filter.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            name: {
              contains: filter.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    };

    const [models, totalItems] = await this.prisma.$transaction([
      this.prisma.bank.findMany({
        where,
        ...this.paginate(filter),
        orderBy: {
          [filter.sortBy ?? 'code']:
            filter.sortOrder.toLowerCase() as Prisma.SortOrder,
        },
      }),

      this.prisma.bank.count({
        where,
      }),
    ]);

    return this.pageResult(
      models.map((model) => this.toEntity(model)),
      filter,
      totalItems,
    );
  }

  async findById(id: string): Promise<BankEntity | null> {
    const model = await this.prisma.bank.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return model ? this.toEntity(model) : null;
  }

  async existsByShortName(
    shortName: string,
    excludeId?: string,
  ): Promise<boolean> {
    const total = await this.prisma.bank.count({
      where: {
        shortName,
        deletedAt: null,
        ...(excludeId && {
          id: {
            not: excludeId,
          },
        }),
      },
    });

    return total > 0;
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const total = await this.prisma.bank.count({
      where: {
        name,
        deletedAt: null,
        ...(excludeId && {
          id: {
            not: excludeId,
          },
        }),
      },
    });

    return total > 0;
  }

  async create(
    contract: CreateBankContract,
    code: string,
    createdBy: string,
  ): Promise<BankEntity> {
    const model = await this.prisma.bank.create({
      data: {
        ...contract,
        code,
        createdBy,
      },
    });

    return this.toEntity(model);
  }

  async update(
    id: string,
    contract: UpdateBankContract,
    updatedBy: string,
  ): Promise<BankEntity> {
    const model = await this.prisma.bank.update({
      where: {
        id,
      },
      data: {
        ...contract,
        updatedBy,
      },
    });

    return this.toEntity(model);
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    await this.prisma.bank.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });
  }

  private toEntity(
    model: Prisma.BankGetPayload<Record<string, never>>,
  ): BankEntity {
    return Object.assign(new BankEntity(), {
      id: model.id,
      code: model.code,
      shortName: model.shortName,
      name: model.name,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
    });
  }
}
