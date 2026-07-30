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
import { ConfigEntity } from '../entities/config.entity';
import { ConfigService } from '../services/config.service';

import { CurrentUserModel } from 'src/common/models/current-user.model';
import { ApiGenericResponse } from 'src/common/swagger/decorators/api-generic-response.decorator';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import {
  ConfigFilterContract,
  ConfigContract,
  CreateConfigContract,
  UpdateConfigContract,
} from '../contracts';
import {
  ConfigFilterValidation,
  CreateConfigValidation,
  UpdateConfigValidation,
} from '../validations';

@ApiTags('Master - Config')
@Controller('configs')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get many configs', operationId: 'getManyConfigs' })
  @ApiGenericResponse(ConfigContract, { isPaginated: true })
  findMany(
    @Query(new JoiValidationPipe(ConfigFilterValidation))
    filter: ConfigFilterContract,
  ): Promise<PageResult<ConfigEntity>> {
    return this.configService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get config by id', operationId: 'getConfigById' })
  @ApiGenericResponse(ConfigContract)
  findById(
    @Param('id')
    id: string,
  ): Promise<ConfigEntity> {
    return this.configService.findById(id);
  }

  @Get('group/:configGroup')
  @ApiOperation({
    summary: 'Get active configs by group',
    operationId: 'getActiveConfigsByGroup',
  })
  @ApiGenericResponse(ConfigContract, { isArray: true })
  findActiveByGroup(
    @Param('configGroup')
    configGroup: string,
  ): Promise<ConfigEntity[]> {
    return this.configService.findActiveByGroup(configGroup);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.CONFIG.CREATED)
  @ApiOperation({ summary: 'Create a new config', operationId: 'createConfig' })
  @ApiGenericResponse(ConfigContract, { status: 201 })
  @ApiBody({ type: CreateConfigContract })
  create(
    @Body(new JoiValidationPipe(CreateConfigValidation))
    contract: CreateConfigContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<ConfigEntity> {
    return this.configService.create(contract, user.id);
  }

  @Patch(':id')
  @ResponseMessage(Messages.CONFIG.UPDATED)
  @ApiOperation({ summary: 'Update a config', operationId: 'updateConfig' })
  @ApiGenericResponse(ConfigContract)
  @ApiBody({ type: UpdateConfigContract })
  update(
    @Param('id')
    id: string,

    @Body(new JoiValidationPipe(UpdateConfigValidation))
    contract: UpdateConfigContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<ConfigEntity> {
    return this.configService.update(id, contract, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(Messages.CONFIG.DELETED)
  @ApiOperation({ summary: 'Delete a config', operationId: 'deleteConfig' })
  @ApiGenericResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.configService.remove(id, user.id);
  }
}
