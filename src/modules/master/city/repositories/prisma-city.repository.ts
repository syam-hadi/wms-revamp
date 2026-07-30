import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaRepository } from 'src/infrastructure/prisma/prisma.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PageResult } from 'src/common/models';

import {
  CityFilterContract,
  CreateCityContract,
  UpdateCityContract,
} from '../contracts';
import { CityEntity } from '../entities/city.entity';
import { CityRepository } from './city.repository';

@Injectable()
export class PrismaCityRepository
  extends PrismaRepository
  implements CityRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(filter: CityFilterContract): Promise<PageResult<CityEntity>> {
    const where: Prisma.CityWhereInput = this.buildActiveWhere({
      ...(filter.provinceId && {
        provinceId: filter.provinceId,
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
    });

    const [models, totalItems] = await this.prisma.$transaction([
      this.prisma.city.findMany({
        where,
        ...this.paginate(filter),
        orderBy: {
          [filter.sortBy ?? 'code']:
            filter.sortOrder.toLowerCase() as Prisma.SortOrder,
        },
      }),

      this.prisma.city.count({
        where,
      }),
    ]);

    return this.pageResult(
      models.map((model) => this.toEntity(model)),
      filter,
      totalItems,
    );
  }

  async findById(id: string): Promise<CityEntity | null> {
    const model = await this.prisma.city.findFirst({
      where: this.buildActiveWhere({
        id,
      }),
    });

    return model ? this.toEntity(model) : null;
  }

  async findByProvince(provinceId: string): Promise<CityEntity[]> {
    const models = await this.prisma.city.findMany({
      where: this.buildActiveWhere({
        provinceId,
      }),
    });

    return models.map((model) => this.toEntity(model));
  }

  async exists(
    code: string,
    provinceId: string,
    excludeId?: string,
  ): Promise<boolean> {
    const total = await this.prisma.city.count({
      where: this.buildActiveWhere({
        code,
        provinceId,
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
    contract: CreateCityContract,
    createdBy: string,
  ): Promise<CityEntity> {
    const model = await this.prisma.city.create({
      data: {
        ...contract,
        createdBy,
      },
    });

    return this.toEntity(model);
  }

  async update(
    id: string,
    contract: UpdateCityContract,
    updatedBy: string,
  ): Promise<CityEntity> {
    const model = await this.prisma.city.update({
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
    await this.prisma.city.update({
      where: {
        id,
      },
      data: this.buildSoftDeleteData(deletedBy),
    });
  }

  private toEntity(
    model: Prisma.CityGetPayload<Record<string, never>>,
  ): CityEntity {
    return Object.assign(new CityEntity(), {
      id: model.id,
      provinceId: model.provinceId,
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
