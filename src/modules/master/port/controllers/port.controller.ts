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
import { PortEntity } from '../entities/port.entity';
import { PortService } from '../services/port.service';

import { CurrentUserModel } from 'src/common/models/current-user.model';
import { ApiGenericResponse } from 'src/common/swagger/decorators/api-generic-response.decorator';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import {
  PortFilterContract,
  PortContract,
  CreatePortContract,
  UpdatePortContract,
} from '../contracts';
import {
  PortFilterValidation,
  CreatePortValidation,
  UpdatePortValidation,
} from '../validations';

@ApiTags('Master - Port')
@Controller('ports')
export class PortController {
  constructor(private readonly portService: PortService) {}

  @Get()
  @ApiOperation({
    summary: 'Get many ports',
    operationId: 'getManyPorts',
  })
  @ApiGenericResponse(PortContract, { isPaginated: true })
  findMany(
    @Query(new JoiValidationPipe(PortFilterValidation))
    filter: PortFilterContract,
  ): Promise<PageResult<PortEntity>> {
    return this.portService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get port by id',
    operationId: 'getPortById',
  })
  @ApiGenericResponse(PortContract)
  findById(
    @Param('id')
    id: string,
  ): Promise<PortEntity> {
    return this.portService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.PORT.CREATED)
  @ApiOperation({
    summary: 'Create a new port',
    operationId: 'createPort',
  })
  @ApiGenericResponse(PortContract, { status: 201 })
  @ApiBody({ type: CreatePortContract })
  create(
    @Body(new JoiValidationPipe(CreatePortValidation))
    contract: CreatePortContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<PortEntity> {
    return this.portService.create(contract, user.id);
  }

  @Patch(':id')
  @ResponseMessage(Messages.PORT.UPDATED)
  @ApiOperation({ summary: 'Update a port', operationId: 'updatePort' })
  @ApiGenericResponse(PortContract)
  @ApiBody({ type: UpdatePortContract })
  update(
    @Param('id')
    id: string,

    @Body(new JoiValidationPipe(UpdatePortValidation))
    contract: UpdatePortContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<PortEntity> {
    return this.portService.update(id, contract, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(Messages.PORT.DELETED)
  @ApiOperation({ summary: 'Delete a port', operationId: 'deletePort' })
  @ApiGenericResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.portService.remove(id, user.id);
  }
}
