import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaRepository } from 'src/infrastructure/prisma/prisma.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PageResult } from 'src/common/models';

import {
  PortFilterContract,
  CreatePortContract,
  UpdatePortContract,
} from '../contracts';
import { PortEntity } from '../entities/port.entity';
import { PortRepository } from './port.repository';

@Injectable()
export class PrismaPortRepository
  extends PrismaRepository
  implements PortRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(filter: PortFilterContract): Promise<PageResult<PortEntity>> {
    const where: Prisma.PortWhereInput = this.buildActiveWhere({
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
      this.prisma.port.findMany({
        where,
        ...this.paginate(filter),
        orderBy: {
          [filter.sortBy ?? 'code']:
            filter.sortOrder.toLowerCase() as Prisma.SortOrder,
        },
      }),

      this.prisma.port.count({
        where,
      }),
    ]);

    return this.pageResult(
      models.map((model) => this.toEntity(model)),
      filter,
      totalItems,
    );
  }

  async findById(id: string): Promise<PortEntity | null> {
    const model = await this.prisma.port.findFirst({
      where: this.buildActiveWhere({
        id,
      }),
    });

    return model ? this.toEntity(model) : null;
  }

  async exists(code: string, excludeId?: string): Promise<boolean> {
    const total = await this.prisma.port.count({
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
    contract: CreatePortContract,
    createdBy: string,
  ): Promise<PortEntity> {
    const model = await this.prisma.port.create({
      data: {
        ...contract,
        createdBy,
      },
    });

    return this.toEntity(model);
  }

  async update(
    id: string,
    contract: UpdatePortContract,
    updatedBy: string,
  ): Promise<PortEntity> {
    const model = await this.prisma.port.update({
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
    await this.prisma.port.update({
      where: {
        id,
      },
      data: this.buildSoftDeleteData(deletedBy),
    });
  }

  private toEntity(
    model: Prisma.PortGetPayload<Record<string, never>>,
  ): PortEntity {
    return Object.assign(new PortEntity(), {
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
