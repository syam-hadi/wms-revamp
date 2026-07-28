import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaRepository } from 'src/infrastructure/prisma/prisma.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PageResult } from 'src/common/models';
import { DecimalValue } from 'src/common/domain/value-objects';

import { TaxFilterContract } from '../contracts/tax-filter.contract';
import { CreateTaxContract } from '../contracts/create-tax.contract';
import { UpdateTaxContract } from '../contracts/update-tax.contract';
import { TaxEntity } from '../entities/tax.entity';
import { TaxRepository } from './tax.repository';

@Injectable()
export class PrismaTaxRepository
  extends PrismaRepository
  implements TaxRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(filter: TaxFilterContract): Promise<PageResult<TaxEntity>> {
    const where: Prisma.TaxWhereInput = this.buildActiveWhere({
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
          {
            description: {
              contains: filter.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    });

    const [models, totalItems] = await this.prisma.$transaction([
      this.prisma.tax.findMany({
        where,
        ...this.paginate(filter),
        orderBy: {
          [filter.sortBy ?? 'code']:
            filter.sortOrder.toLowerCase() as Prisma.SortOrder,
        },
      }),

      this.prisma.tax.count({
        where,
      }),
    ]);

    return this.pageResult(
      models.map((model) => this.toEntity(model)),
      filter,
      totalItems,
    );
  }

  async findById(id: string): Promise<TaxEntity | null> {
    const model = await this.prisma.tax.findFirst({
      where: this.buildActiveWhere({
        id,
      }),
    });

    return model ? this.toEntity(model) : null;
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const total = await this.prisma.tax.count({
      where: this.buildActiveWhere({
        name,
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
    contract: CreateTaxContract,
    code: string,
    createdBy: string,
  ): Promise<TaxEntity> {
    const model = await this.prisma.tax.create({
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
    contract: UpdateTaxContract,
    updatedBy: string,
  ): Promise<TaxEntity> {
    const model = await this.prisma.tax.update({
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
    await this.prisma.tax.update({
      where: {
        id,
      },
      data: this.buildSoftDeleteData(deletedBy),
    });
  }

  private toEntity(
    model: Prisma.TaxGetPayload<Record<string, never>>,
  ): TaxEntity {
    return Object.assign(new TaxEntity(), {
      id: model.id,
      code: model.code,
      name: model.name,
      description: model.description,
      value: DecimalValue.of(model.value.toString()),
      flagType: model.flagType,
      coa: model.coa,
      taxCode: model.taxCode,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
    });
  }
}
