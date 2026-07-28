import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaRepository } from 'src/infrastructure/prisma/prisma.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PageResult } from 'src/common/models';

import { CommodityFilterContract } from '../contracts/commodity-filter.contract';
import { CreateCommodityContract } from '../contracts/create-commodity.contract';
import { UpdateCommodityContract } from '../contracts/update-commodity.contract';
import { CommodityEntity } from '../entities/commodity.entity';
import { CommodityRepository } from './commodity.repository';

@Injectable()
export class PrismaCommodityRepository
  extends PrismaRepository
  implements CommodityRepository
{
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findMany(
    filter: CommodityFilterContract,
  ): Promise<PageResult<CommodityEntity>> {
    const where: Prisma.CommodityWhereInput = this.buildActiveWhere({
      ...(filter.isHazardous !== undefined && {
        isHazardous: filter.isHazardous,
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
      this.prisma.commodity.findMany({
        where,
        ...this.paginate(filter),
        orderBy: {
          [filter.sortBy ?? 'code']:
            filter.sortOrder.toLowerCase() as Prisma.SortOrder,
        },
      }),

      this.prisma.commodity.count({
        where,
      }),
    ]);

    return this.pageResult(
      models.map((model) => this.toEntity(model)),
      filter,
      totalItems,
    );
  }

  async findById(id: string): Promise<CommodityEntity | null> {
    const model = await this.prisma.commodity.findFirst({
      where: this.buildActiveWhere({
        id,
      }),
    });

    return model ? this.toEntity(model) : null;
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const total = await this.prisma.commodity.count({
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
    contract: CreateCommodityContract,
    code: string,
    createdBy: string,
  ): Promise<CommodityEntity> {
    const model = await this.prisma.commodity.create({
      data: {
        ...contract,
        minTemperature: contract.minTemperature ?? null,
        maxTemperature: contract.maxTemperature ?? null,
        code,
        createdBy,
      },
    });

    return this.toEntity(model);
  }

  async update(
    id: string,
    contract: UpdateCommodityContract,
    updatedBy: string,
  ): Promise<CommodityEntity> {
    const model = await this.prisma.commodity.update({
      where: {
        id,
      },
      data: {
        ...contract,
        minTemperature:
          contract.minTemperature !== undefined
            ? contract.minTemperature
            : undefined,
        maxTemperature:
          contract.maxTemperature !== undefined
            ? contract.maxTemperature
            : undefined,
        updatedBy,
      },
    });

    return this.toEntity(model);
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    await this.prisma.commodity.update({
      where: {
        id,
      },
      data: this.buildSoftDeleteData(deletedBy),
    });
  }

  private toEntity(
    model: Prisma.CommodityGetPayload<Record<string, never>>,
  ): CommodityEntity {
    return Object.assign(new CommodityEntity(), {
      id: model.id,
      code: model.code,
      name: model.name,
      hsCode: model.hsCode,
      category: model.category,
      isHazardous: model.isHazardous,
      imdgClass: model.imdgClass,
      requiresReefer: model.requiresReefer,
      minTemperature: model.minTemperature
        ? Number(model.minTemperature)
        : null,
      maxTemperature: model.maxTemperature
        ? Number(model.maxTemperature)
        : null,
      remarks: model.remarks,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
    });
  }
}
