import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
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

import {
  CurrentUser,
  ResponseMessage,
  ApiPaginatedResponse,
} from 'src/common/decorators';
import { Messages } from 'src/common/constants';
import { ConfigService } from '../services/config.service';
import { ConfigEntity } from '../entities/config.entity';
import { PageResult } from 'src/common/models';

import {
  ConfigFilterValidation,
  CreateConfigValidation,
  UpdateConfigValidation,
} from '../validations';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import { ConfigFilterContract } from '../contracts/config-filter.contract';
import { CreateConfigContract } from '../contracts/create-config.contract';
import { CurrentUserModel } from 'src/common/models/current-user.model';
import { UpdateConfigContract } from '../contracts/update-config.contract';

@ApiTags('Configs')
@Controller('configs')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}
  @Get()
  @ApiOperation({ summary: 'Get many configs' })
  @ApiPaginatedResponse(ConfigEntity)
  findMany(
    @Query(new JoiValidationPipe(ConfigFilterValidation))
    filter: ConfigFilterContract,
  ): Promise<PageResult<ConfigEntity>> {
    return this.configService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get config by id' })
  @ApiOkResponse({ type: ConfigEntity })
  findById(
    @Param('id')
    id: string,
  ): Promise<ConfigEntity> {
    return this.configService.findById(id);
  }

  @Get('group/:configGroup')
  @ApiOperation({ summary: 'Get active configs by group' })
  @ApiOkResponse({ type: [ConfigEntity] })
  findActiveByGroup(
    @Param('configGroup')
    configGroup: string,
  ): Promise<ConfigEntity[]> {
    return this.configService.findActiveByGroup(configGroup);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.CONFIG.CREATED)
  @ApiOperation({ summary: 'Create a new config' })
  @ApiCreatedResponse({ type: ConfigEntity })
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
  @ApiOperation({ summary: 'Update a config' })
  @ApiOkResponse({ type: ConfigEntity })
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
  @ApiOperation({ summary: 'Delete a config' })
  @ApiOkResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.configService.remove(id, user.id);
  }
}
