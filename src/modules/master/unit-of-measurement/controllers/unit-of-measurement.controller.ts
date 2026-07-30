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
import { UnitOfMeasurementEntity } from '../entities/unit-of-measurement.entity';
import { UnitOfMeasurementService } from '../services/unit-of-measurement.service';

import { CurrentUserModel } from 'src/common/models/current-user.model';
import { ApiGenericResponse } from 'src/common/swagger/decorators/api-generic-response.decorator';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import {
  UnitOfMeasurementFilterContract,
  UnitOfMeasurementContract,
  CreateUnitOfMeasurementContract,
  UpdateUnitOfMeasurementContract,
} from '../contracts';
import {
  UnitOfMeasurementFilterValidation,
  CreateUnitOfMeasurementValidation,
  UpdateUnitOfMeasurementValidation,
} from '../validations';

@ApiTags('Master - Unit of Measurement')
@Controller('unit-of-measurements')
export class UnitOfMeasurementController {
  constructor(
    private readonly unitOfMeasurementService: UnitOfMeasurementService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get many units of measurement',
    operationId: 'getManyUnitOfMeasurements',
  })
  @ApiGenericResponse(UnitOfMeasurementContract, { isPaginated: true })
  findMany(
    @Query(new JoiValidationPipe(UnitOfMeasurementFilterValidation))
    filter: UnitOfMeasurementFilterContract,
  ): Promise<PageResult<UnitOfMeasurementEntity>> {
    return this.unitOfMeasurementService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get unit of measurement by id',
    operationId: 'getUnitOfMeasurementById',
  })
  @ApiGenericResponse(UnitOfMeasurementContract)
  findById(
    @Param('id')
    id: string,
  ): Promise<UnitOfMeasurementEntity> {
    return this.unitOfMeasurementService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.UNIT_OF_MEASUREMENT.CREATED)
  @ApiOperation({
    summary: 'Create a new unit of measurement',
    operationId: 'createUnitOfMeasurement',
  })
  @ApiGenericResponse(UnitOfMeasurementContract, { status: 201 })
  @ApiBody({ type: CreateUnitOfMeasurementContract })
  create(
    @Body(new JoiValidationPipe(CreateUnitOfMeasurementValidation))
    contract: CreateUnitOfMeasurementContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<UnitOfMeasurementEntity> {
    return this.unitOfMeasurementService.create(contract, user.id);
  }

  @Patch(':id')
  @ResponseMessage(Messages.UNIT_OF_MEASUREMENT.UPDATED)
  @ApiOperation({
    summary: 'Update a unit of measurement',
    operationId: 'updateUnitOfMeasurement',
  })
  @ApiGenericResponse(UnitOfMeasurementContract)
  @ApiBody({ type: UpdateUnitOfMeasurementContract })
  update(
    @Param('id')
    id: string,

    @Body(new JoiValidationPipe(UpdateUnitOfMeasurementValidation))
    contract: UpdateUnitOfMeasurementContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<UnitOfMeasurementEntity> {
    return this.unitOfMeasurementService.update(id, contract, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(Messages.UNIT_OF_MEASUREMENT.DELETED)
  @ApiOperation({
    summary: 'Delete a unit of measurement',
    operationId: 'deleteUnitOfMeasurement',
  })
  @ApiGenericResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.unitOfMeasurementService.remove(id, user.id);
  }
}
