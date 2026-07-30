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
import { DepotEntity } from '../entities/depot.entity';
import { DepotService } from '../services/depot.service';

import { CurrentUserModel } from 'src/common/models/current-user.model';
import { ApiGenericResponse } from 'src/common/swagger/decorators/api-generic-response.decorator';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import {
  DepotFilterContract,
  DepotContract,
  CreateDepotContract,
  UpdateDepotContract,
} from '../contracts';
import {
  DepotFilterValidation,
  CreateDepotValidation,
  UpdateDepotValidation,
} from '../validations';

@ApiTags('Master - Depot')
@Controller('depots')
export class DepotController {
  constructor(private readonly depotService: DepotService) {}

  @Get()
  @ApiOperation({
    summary: 'Get many depots',
    operationId: 'getManyDepots',
  })
  @ApiGenericResponse(DepotContract, { isPaginated: true })
  findMany(
    @Query(new JoiValidationPipe(DepotFilterValidation))
    filter: DepotFilterContract,
  ): Promise<PageResult<DepotEntity>> {
    return this.depotService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get depot by id',
    operationId: 'getDepotById',
  })
  @ApiGenericResponse(DepotContract)
  findById(
    @Param('id')
    id: string,
  ): Promise<DepotEntity> {
    return this.depotService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.DEPOT.CREATED)
  @ApiOperation({
    summary: 'Create a new depot',
    operationId: 'createDepot',
  })
  @ApiGenericResponse(DepotContract, { status: 201 })
  @ApiBody({ type: CreateDepotContract })
  create(
    @Body(new JoiValidationPipe(CreateDepotValidation))
    contract: CreateDepotContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<DepotEntity> {
    return this.depotService.create(contract, user.id);
  }

  @Patch(':id')
  @ResponseMessage(Messages.DEPOT.UPDATED)
  @ApiOperation({ summary: 'Update a depot', operationId: 'updateDepot' })
  @ApiGenericResponse(DepotContract)
  @ApiBody({ type: UpdateDepotContract })
  update(
    @Param('id')
    id: string,

    @Body(new JoiValidationPipe(UpdateDepotValidation))
    contract: UpdateDepotContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<DepotEntity> {
    return this.depotService.update(id, contract, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(Messages.DEPOT.DELETED)
  @ApiOperation({ summary: 'Delete a depot', operationId: 'deleteDepot' })
  @ApiGenericResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.depotService.remove(id, user.id);
  }
}
