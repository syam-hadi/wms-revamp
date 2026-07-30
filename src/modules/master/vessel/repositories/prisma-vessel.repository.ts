import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaRepository } from 'src/infrastructure/prisma/prisma.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PageResult } from 'src/common/models';
import { DecimalValue } from 'src/common/domain/value-objects';

import {
  VesselFilterContract,
  CreateVesselContract,
  UpdateVesselContract,
} from '../contracts';
import { VesselEntity } from '../entities/vessel.entity';
import { VesselRepository } from './vessel.repository';

@Injectable()
export class PrismaVesselRepository
  extends PrismaRepository
  implements VesselRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(
    filter: VesselFilterContract,
  ): Promise<PageResult<VesselEntity>> {
    const where: Prisma.VesselWhereInput = this.buildActiveWhere({
      ...(filter.search && {
        OR: [
          {
            name: {
              contains: filter.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            imoNumber: {
              contains: filter.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    });

    const [models, totalItems] = await this.prisma.$transaction([
      this.prisma.vessel.findMany({
        where,
        ...this.paginate(filter),
        orderBy: {
          [filter.sortBy ?? 'name']:
            (filter.sortOrder?.toLowerCase() as Prisma.SortOrder) ?? 'asc',
        },
      }),

      this.prisma.vessel.count({
        where,
      }),
    ]);

    return this.pageResult(
      models.map((model) => this.toEntity(model)),
      filter,
      totalItems,
    );
  }

  async findById(id: string): Promise<VesselEntity | null> {
    const model = await this.prisma.vessel.findFirst({
      where: this.buildActiveWhere({
        id,
      }),
    });

    return model ? this.toEntity(model) : null;
  }

  async exists(id: string): Promise<boolean> {
    const total = await this.prisma.vessel.count({
      where: this.buildActiveWhere({ id }),
    });

    return total > 0;
  }

  async existsByImoNumber(
    imoNumber: string,
    excludeId?: string,
  ): Promise<boolean> {
    const total = await this.prisma.vessel.count({
      where: this.buildActiveWhere({
        imoNumber,
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
    contract: CreateVesselContract,
    createdBy: string,
  ): Promise<VesselEntity> {
    const model = await this.prisma.vessel.create({
      data: {
        ...contract,
        createdBy,
      },
    });

    return this.toEntity(model);
  }

  async update(
    id: string,
    contract: UpdateVesselContract,
    updatedBy: string,
  ): Promise<VesselEntity> {
    const model = await this.prisma.vessel.update({
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
    await this.prisma.vessel.update({
      where: {
        id,
      },
      data: this.buildSoftDeleteData(deletedBy),
    });
  }

  private toEntity(
    model: Prisma.VesselGetPayload<Record<string, never>>,
  ): VesselEntity {
    return Object.assign(new VesselEntity(), {
      id: model.id,
      name: model.name,
      imoNumber: model.imoNumber,
      callSign: model.callSign,
      grossTonnage: model.grossTonnage,
      teuCapacity: model.teuCapacity,
      loaMeters: model.loaMeters
        ? DecimalValue.of(model.loaMeters.toString())
        : null,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
    });
  }
}
