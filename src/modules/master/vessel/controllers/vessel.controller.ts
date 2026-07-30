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

import { CurrentUser, ResponseMessage } from 'src/common/decorators';
import { ApiGenericResponse } from 'src/common/swagger/decorators/api-generic-response.decorator';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import { CurrentUserModel } from 'src/common/models/current-user.model';
import { PageResult } from 'src/common/models';
import { Messages } from 'src/common/constants';

import {
  CreateVesselContract,
  UpdateVesselContract,
  VesselContract,
  VesselFilterContract,
} from '../contracts';
import { VesselEntity } from '../entities/vessel.entity';
import { VesselService } from '../services/vessel.service';
import {
  createVesselValidation,
  updateVesselValidation,
  vesselFilterValidation,
} from '../validations';

@ApiTags('Master - Vessel')
@Controller('master/vessels')
export class VesselController {
  constructor(private readonly vesselService: VesselService) {}

  @Get()
  @ApiOperation({
    summary: 'Get list of vessels',
    operationId: 'getManyVessels',
  })
  @ApiGenericResponse(VesselContract, { isPaginated: true })
  async findMany(
    @Query(new JoiValidationPipe(vesselFilterValidation))
    filter: VesselFilterContract,
  ): Promise<PageResult<VesselEntity>> {
    return this.vesselService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get vessel detail by ID',
    operationId: 'getVesselById',
  })
  @ApiGenericResponse(VesselContract)
  async findById(@Param('id') id: string): Promise<VesselEntity> {
    return this.vesselService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.VESSEL.CREATED)
  @ApiOperation({
    summary: 'Create new vessel',
    operationId: 'createVessel',
  })
  @ApiGenericResponse(VesselContract, { status: 201 })
  @ApiBody({ type: CreateVesselContract })
  async create(
    @Body(new JoiValidationPipe(createVesselValidation))
    contract: CreateVesselContract,
    @CurrentUser() user: CurrentUserModel,
  ): Promise<VesselEntity> {
    return this.vesselService.create(contract, user.id);
  }

  @Patch(':id')
  @ResponseMessage(Messages.VESSEL.UPDATED)
  @ApiOperation({
    summary: 'Update existing vessel',
    operationId: 'updateVessel',
  })
  @ApiGenericResponse(VesselContract)
  @ApiBody({ type: UpdateVesselContract })
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(updateVesselValidation))
    contract: UpdateVesselContract,
    @CurrentUser() user: CurrentUserModel,
  ): Promise<VesselEntity> {
    return this.vesselService.update(id, contract, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(Messages.VESSEL.DELETED)
  @ApiOperation({
    summary: 'Delete vessel',
    operationId: 'deleteVessel',
  })
  @ApiGenericResponse()
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserModel,
  ): Promise<void> {
    return this.vesselService.delete(id, user.id);
  }
}
