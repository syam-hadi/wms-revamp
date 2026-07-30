import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaRepository } from 'src/infrastructure/prisma/prisma.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PageResult } from 'src/common/models';

import {
  CurrencyFilterContract,
  CreateCurrencyContract,
  UpdateCurrencyContract,
} from '../contracts';
import { CurrencyEntity } from '../entities/currency.entity';
import { CurrencyRepository } from './currency.repository';

@Injectable()
export class PrismaCurrencyRepository
  extends PrismaRepository
  implements CurrencyRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(
    filter: CurrencyFilterContract,
  ): Promise<PageResult<CurrencyEntity>> {
    const where: Prisma.CurrencyWhereInput = this.buildActiveWhere({
      ...(filter.search && {
        OR: [
          {
            code: {
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
    });

    const [models, totalItems] = await this.prisma.$transaction([
      this.prisma.currency.findMany({
        where,
        ...this.paginate(filter),
        orderBy: {
          [filter.sortBy ?? 'code']:
            filter.sortOrder.toLowerCase() as Prisma.SortOrder,
        },
      }),

      this.prisma.currency.count({
        where,
      }),
    ]);

    return this.pageResult(
      models.map((model) => this.toEntity(model)),
      filter,
      totalItems,
    );
  }

  async findById(id: string): Promise<CurrencyEntity | null> {
    const model = await this.prisma.currency.findFirst({
      where: this.buildActiveWhere({
        id,
      }),
    });

    return model ? this.toEntity(model) : null;
  }

  async exists(code: string, excludeId?: string): Promise<boolean> {
    const total = await this.prisma.currency.count({
      where: this.buildActiveWhere({
        code,
        ...(excludeId && {
          id: {
            not: excludeId,
          },
        }),
      }),
    });

    return total > 0;
  }

  async create(
    contract: CreateCurrencyContract,
    createdBy: string,
  ): Promise<CurrencyEntity> {
    const model = await this.prisma.currency.create({
      data: {
        ...contract,
        createdBy,
      },
    });

    return this.toEntity(model);
  }

  async update(
    id: string,
    contract: UpdateCurrencyContract,
    updatedBy: string,
  ): Promise<CurrencyEntity> {
    const model = await this.prisma.currency.update({
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
    await this.prisma.currency.update({
      where: {
        id,
      },
      data: this.buildSoftDeleteData(deletedBy),
    });
  }

  private toEntity(
    model: Prisma.CurrencyGetPayload<Record<string, never>>,
  ): CurrencyEntity {
    return Object.assign(new CurrencyEntity(), {
      id: model.id,
      code: model.code,
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
