import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaRepository } from 'src/infrastructure/prisma/prisma.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PageResult } from 'src/common/models';

import {
  DepotFilterContract,
  CreateDepotContract,
  UpdateDepotContract,
} from '../contracts';
import { DepotEntity } from '../entities/depot.entity';
import { DepotRepository } from './depot.repository';

@Injectable()
export class PrismaDepotRepository
  extends PrismaRepository
  implements DepotRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(
    filter: DepotFilterContract,
  ): Promise<PageResult<DepotEntity>> {
    const where: Prisma.DepotWhereInput = this.buildActiveWhere({
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
      this.prisma.depot.findMany({
        where,
        ...this.paginate(filter),
        orderBy: {
          [filter.sortBy ?? 'code']:
            filter.sortOrder.toLowerCase() as Prisma.SortOrder,
        },
      }),

      this.prisma.depot.count({
        where,
      }),
    ]);

    return this.pageResult(
      models.map((model) => this.toEntity(model)),
      filter,
      totalItems,
    );
  }

  async findById(id: string): Promise<DepotEntity | null> {
    const model = await this.prisma.depot.findFirst({
      where: this.buildActiveWhere({
        id,
      }),
    });

    return model ? this.toEntity(model) : null;
  }

  async exists(code: string, excludeId?: string): Promise<boolean> {
    const total = await this.prisma.depot.count({
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
    contract: CreateDepotContract,
    createdBy: string,
  ): Promise<DepotEntity> {
    const model = await this.prisma.depot.create({
      data: {
        ...contract,
        createdBy,
      },
    });

    return this.toEntity(model);
  }

  async update(
    id: string,
    contract: UpdateDepotContract,
    updatedBy: string,
  ): Promise<DepotEntity> {
    const model = await this.prisma.depot.update({
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
    await this.prisma.depot.update({
      where: {
        id,
      },
      data: this.buildSoftDeleteData(deletedBy),
    });
  }

  private toEntity(
    model: Prisma.DepotGetPayload<Record<string, never>>,
  ): DepotEntity {
    return Object.assign(new DepotEntity(), {
      id: model.id,
      code: model.code,
      name: model.name,
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
