import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaRepository } from 'src/infrastructure/prisma/prisma.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PageResult } from 'src/common/models';

import {
  CountryFilterContract,
  CreateCountryContract,
  UpdateCountryContract,
} from '../contracts';
import { CountryEntity } from '../entities/country.entity';
import { CountryRepository } from './country.repository';

@Injectable()
export class PrismaCountryRepository
  extends PrismaRepository
  implements CountryRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(
    filter: CountryFilterContract,
  ): Promise<PageResult<CountryEntity>> {
    const where: Prisma.CountryWhereInput = this.buildActiveWhere({
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
      this.prisma.country.findMany({
        where,
        ...this.paginate(filter),
        orderBy: {
          [filter.sortBy ?? 'code']:
            filter.sortOrder.toLowerCase() as Prisma.SortOrder,
        },
      }),

      this.prisma.country.count({
        where,
      }),
    ]);

    return this.pageResult(
      models.map((model) => this.toEntity(model)),
      filter,
      totalItems,
    );
  }

  async findById(id: string): Promise<CountryEntity | null> {
    const model = await this.prisma.country.findFirst({
      where: this.buildActiveWhere({
        id,
      }),
    });

    return model ? this.toEntity(model) : null;
  }

  async exists(code: string, excludeId?: string): Promise<boolean> {
    const total = await this.prisma.country.count({
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
    contract: CreateCountryContract,
    createdBy: string,
  ): Promise<CountryEntity> {
    const model = await this.prisma.country.create({
      data: {
        ...contract,
        createdBy,
      },
    });

    return this.toEntity(model);
  }

  async update(
    id: string,
    contract: UpdateCountryContract,
    updatedBy: string,
  ): Promise<CountryEntity> {
    const model = await this.prisma.country.update({
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
    await this.prisma.country.update({
      where: {
        id,
      },
      data: this.buildSoftDeleteData(deletedBy),
    });
  }

  private toEntity(
    model: Prisma.CountryGetPayload<Record<string, never>>,
  ): CountryEntity {
    return Object.assign(new CountryEntity(), {
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
