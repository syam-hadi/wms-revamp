import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaRepository } from 'src/infrastructure/prisma/prisma.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PageResult } from 'src/common/models';

import { ProvinceFilterContract } from '../contracts/province-filter.contract';
import { CreateProvinceContract } from '../contracts/create-province.contract';
import { UpdateProvinceContract } from '../contracts/update-province.contract';
import { ProvinceEntity } from '../entities/province.entity';
import { ProvinceRepository } from './province.repository';

@Injectable()
export class PrismaProvinceRepository
  extends PrismaRepository
  implements ProvinceRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(
    filter: ProvinceFilterContract,
  ): Promise<PageResult<ProvinceEntity>> {
    const where: Prisma.ProvinceWhereInput = {
      deletedAt: null,
      ...(filter.countryId && {
        countryId: filter.countryId,
      }),
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
    };

    const [models, totalItems] = await this.prisma.$transaction([
      this.prisma.province.findMany({
        where,
        ...this.paginate(filter),
        orderBy: {
          [filter.sortBy ?? 'code']:
            filter.sortOrder.toLowerCase() as Prisma.SortOrder,
        },
      }),

      this.prisma.province.count({
        where,
      }),
    ]);

    return this.pageResult(
      models.map((model) => this.toEntity(model)),
      filter,
      totalItems,
    );
  }

  async findById(id: string): Promise<ProvinceEntity | null> {
    const model = await this.prisma.province.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return model ? this.toEntity(model) : null;
  }

  async findByCountry(countryId: string): Promise<ProvinceEntity[]> {
    const models = await this.prisma.province.findMany({
      where: {
        countryId,
        deletedAt: null,
      },
    });

    return models.map((model) => this.toEntity(model));
  }

  async exists(
    code: string,
    countryId: string,
    excludeId?: string,
  ): Promise<boolean> {
    const total = await this.prisma.province.count({
      where: {
        code,
        countryId,
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
    contract: CreateProvinceContract,
    createdBy: string,
  ): Promise<ProvinceEntity> {
    const model = await this.prisma.province.create({
      data: {
        ...contract,
        createdBy,
      },
    });

    return this.toEntity(model);
  }

  async update(
    id: string,
    contract: UpdateProvinceContract,
    updatedBy: string,
  ): Promise<ProvinceEntity> {
    const model = await this.prisma.province.update({
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
    await this.prisma.province.update({
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
    model: Prisma.ProvinceGetPayload<Record<string, never>>,
  ): ProvinceEntity {
    return Object.assign(new ProvinceEntity(), {
      id: model.id,
      countryId: model.countryId,
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
