import { Injectable } from '@nestjs/common';

import { PrismaRepository } from 'src/infrastructure/prisma/prisma.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

import { PageResult } from 'src/common/models';

import { Prisma, Status } from '@prisma/client';
import { ConfigFilterContract } from '../contracts/config-filter.contract';
import { CreateConfigContract } from '../contracts/create-config.contract';
import { UpdateConfigContract } from '../contracts/update-config.contract';
import { ConfigEntity } from '../entities/config.entity';
import { ConfigRepository } from './config.repository';

@Injectable()
export class PrismaConfigRepository
  extends PrismaRepository
  implements ConfigRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(
    filter: ConfigFilterContract,
  ): Promise<PageResult<ConfigEntity>> {
    const where: Prisma.ConfigWhereInput = {
      deletedAt: null,

      ...(filter.configGroup && {
        configGroup: filter.configGroup,
      }),

      ...(filter.status && {
        status: filter.status,
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
      this.prisma.config.findMany({
        where,
        ...this.paginate(filter),
        orderBy: {
          [filter.sortBy ?? 'code']:
            filter.sortOrder.toLowerCase() as Prisma.SortOrder,
        },
      }),

      this.prisma.config.count({
        where,
      }),
    ]);

    return this.pageResult(
      models.map((model) => this.toEntity(model)),
      filter,
      totalItems,
    );
  }

  async findById(id: string): Promise<ConfigEntity | null> {
    const model = await this.prisma.config.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return model ? this.toEntity(model) : null;
  }

  async findActiveByGroup(configGroup: string): Promise<ConfigEntity[]> {
    const models = await this.prisma.config.findMany({
      where: {
        configGroup,
        status: Status.ACTIVE,
        deletedAt: null,
      },
      orderBy: {
        name: Prisma.SortOrder.asc,
      },
    });

    return models.map((model) => this.toEntity(model));
  }

  async exists(
    configGroup: string,
    code: string,
    excludeId?: string,
  ): Promise<boolean> {
    const total = await this.prisma.config.count({
      where: {
        configGroup,
        code,
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
    contract: CreateConfigContract,
    code: string,
    createdBy: string,
  ): Promise<ConfigEntity> {
    const model = await this.prisma.config.create({
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
    contract: UpdateConfigContract,
    updatedBy: string,
  ): Promise<ConfigEntity> {
    const model = await this.prisma.config.update({
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
    await this.prisma.config.update({
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
    model: Prisma.ConfigGetPayload<Record<string, never>>,
  ): ConfigEntity {
    return Object.assign(new ConfigEntity(), {
      id: model.id,
      code: model.code,
      name: model.name,
      description: model.description,
      configGroup: model.configGroup,
      optionType: model.optionType,
      status: model.status,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
    });
  }
}
