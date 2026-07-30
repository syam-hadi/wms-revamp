import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaRepository } from 'src/infrastructure/prisma/prisma.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PageResult } from 'src/common/models';
import { DecimalValue } from 'src/common/domain/value-objects';

import {
  RateFilterContract,
  CreateRateContract,
  UpdateRateContract,
} from '../contracts';
import { RateEntity } from '../entities/rate.entity';
import { RateRepository } from './rate.repository';

@Injectable()
export class PrismaRateRepository
  extends PrismaRepository
  implements RateRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(filter: RateFilterContract): Promise<PageResult<RateEntity>> {
    const where: Prisma.RateWhereInput = this.buildActiveWhere({
      ...(filter.currencyCode && {
        currencyCode: filter.currencyCode,
      }),
      ...(filter.search && {
        description: {
          contains: filter.search,
          mode: Prisma.QueryMode.insensitive,
        },
      }),
    });

    const [models, totalItems] = await this.prisma.$transaction([
      this.prisma.rate.findMany({
        where,
        ...this.paginate(filter),
        orderBy: {
          [filter.sortBy ?? 'validFrom']:
            filter.sortOrder.toLowerCase() as Prisma.SortOrder,
        },
      }),

      this.prisma.rate.count({
        where,
      }),
    ]);

    return this.pageResult(
      models.map((model) => this.toEntity(model)),
      filter,
      totalItems,
    );
  }

  async findById(id: string): Promise<RateEntity | null> {
    const model = await this.prisma.rate.findFirst({
      where: this.buildActiveWhere({
        id,
      }),
    });

    return model ? this.toEntity(model) : null;
  }

  async create(
    contract: CreateRateContract,
    createdBy: string,
  ): Promise<RateEntity> {
    const model = await this.prisma.rate.create({
      data: {
        ...contract,
        createdBy,
      },
    });

    return this.toEntity(model);
  }

  async update(
    id: string,
    contract: UpdateRateContract,
    updatedBy: string,
  ): Promise<RateEntity> {
    const model = await this.prisma.rate.update({
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
    await this.prisma.rate.update({
      where: {
        id,
      },
      data: this.buildSoftDeleteData(deletedBy),
    });
  }

  private toEntity(
    model: Prisma.RateGetPayload<Record<string, never>>,
  ): RateEntity {
    return Object.assign(new RateEntity(), {
      id: model.id,
      currencyCode: model.currencyCode,
      description: model.description,
      value: DecimalValue.of(model.value.toString()),
      validFrom: model.validFrom,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
    });
  }
}
