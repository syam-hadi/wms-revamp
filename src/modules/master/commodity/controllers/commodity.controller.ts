import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Messages } from 'src/common/constants';
import { CurrentUser, ResponseMessage } from 'src/common/decorators';
import { PageResult } from 'src/common/models';
import { CommodityEntity } from '../entities/commodity.entity';
import { CommodityService } from '../services/commodity.service';

import { CurrentUserModel } from 'src/common/models/current-user.model';
import { ApiGenericResponse } from 'src/common/swagger/decorators/api-generic-response.decorator';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import { CommodityFilterContract } from '../contracts/commodity-filter.contract';
import { CommodityContract } from '../contracts/commodity.contract';
import { CreateCommodityContract } from '../contracts/create-commodity.contract';
import { UpdateCommodityContract } from '../contracts/update-commodity.contract';
import {
  CommodityFilterValidation,
  CreateCommodityValidation,
  UpdateCommodityValidation,
} from '../validations';

@ApiTags('Master - Commodity')
@Controller('commodities')
export class CommodityController {
  constructor(private readonly commodityService: CommodityService) {}

  @Get()
  @ApiOperation({
    summary: 'Get many commodities',
    operationId: 'getManyCommodities',
  })
  @ApiGenericResponse(CommodityContract, { isPaginated: true })
  findMany(
    @Query(new JoiValidationPipe(CommodityFilterValidation))
    filter: CommodityFilterContract,
  ): Promise<PageResult<CommodityEntity>> {
    return this.commodityService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get commodity by id',
    operationId: 'getCommodityById',
  })
  @ApiGenericResponse(CommodityContract)
  findById(
    @Param('id')
    id: string,
  ): Promise<CommodityEntity> {
    return this.commodityService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.COMMODITY.CREATED)
  @ApiOperation({
    summary: 'Create a new commodity',
    operationId: 'createCommodity',
  })
  @ApiGenericResponse(CommodityContract, { status: 201 })
  @ApiBody({ type: CreateCommodityContract })
  create(
    @Body(new JoiValidationPipe(CreateCommodityValidation))
    contract: CreateCommodityContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<CommodityEntity> {
    return this.commodityService.create(contract, user.id);
  }

  @Patch(':id')
  @ResponseMessage(Messages.COMMODITY.UPDATED)
  @ApiOperation({
    summary: 'Update a commodity',
    operationId: 'updateCommodity',
  })
  @ApiGenericResponse(CommodityContract)
  @ApiBody({ type: UpdateCommodityContract })
  update(
    @Param('id')
    id: string,

    @Body(new JoiValidationPipe(UpdateCommodityValidation))
    contract: UpdateCommodityContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<CommodityEntity> {
    return this.commodityService.update(id, contract, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(Messages.COMMODITY.DELETED)
  @ApiOperation({
    summary: 'Delete a commodity',
    operationId: 'deleteCommodity',
  })
  @ApiGenericResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.commodityService.remove(id, user.id);
  }
}
