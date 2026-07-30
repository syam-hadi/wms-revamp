import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaRepository } from 'src/infrastructure/prisma/prisma.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PageResult } from 'src/common/models';

import {
  UnitOfMeasurementFilterContract,
  CreateUnitOfMeasurementContract,
  UpdateUnitOfMeasurementContract,
} from '../contracts';
import { UnitOfMeasurementEntity } from '../entities/unit-of-measurement.entity';
import { UnitOfMeasurementRepository } from './unit-of-measurement.repository';

@Injectable()
export class PrismaUnitOfMeasurementRepository
  extends PrismaRepository
  implements UnitOfMeasurementRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(
    filter: UnitOfMeasurementFilterContract,
  ): Promise<PageResult<UnitOfMeasurementEntity>> {
    const where: Prisma.UnitOfMeasurementWhereInput = this.buildActiveWhere({
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
      this.prisma.unitOfMeasurement.findMany({
        where,
        ...this.paginate(filter),
        orderBy: {
          [filter.sortBy ?? 'code']:
            filter.sortOrder.toLowerCase() as Prisma.SortOrder,
        },
      }),

      this.prisma.unitOfMeasurement.count({
        where,
      }),
    ]);

    return this.pageResult(
      models.map((model) => this.toEntity(model)),
      filter,
      totalItems,
    );
  }

  async findById(id: string): Promise<UnitOfMeasurementEntity | null> {
    const model = await this.prisma.unitOfMeasurement.findFirst({
      where: this.buildActiveWhere({
        id,
      }),
    });

    return model ? this.toEntity(model) : null;
  }

  async exists(code: string, excludeId?: string): Promise<boolean> {
    const total = await this.prisma.unitOfMeasurement.count({
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
    contract: CreateUnitOfMeasurementContract,
    createdBy: string,
  ): Promise<UnitOfMeasurementEntity> {
    const model = await this.prisma.unitOfMeasurement.create({
      data: {
        ...contract,
        createdBy,
      },
    });

    return this.toEntity(model);
  }

  async update(
    id: string,
    contract: UpdateUnitOfMeasurementContract,
    updatedBy: string,
  ): Promise<UnitOfMeasurementEntity> {
    const model = await this.prisma.unitOfMeasurement.update({
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
    await this.prisma.unitOfMeasurement.update({
      where: {
        id,
      },
      data: this.buildSoftDeleteData(deletedBy),
    });
  }

  private toEntity(
    model: Prisma.UnitOfMeasurementGetPayload<Record<string, never>>,
  ): UnitOfMeasurementEntity {
    return Object.assign(new UnitOfMeasurementEntity(), {
      id: model.id,
      code: model.code,
      name: model.name,
      unit: model.unit,
      description: model.description,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
    });
  }
}
