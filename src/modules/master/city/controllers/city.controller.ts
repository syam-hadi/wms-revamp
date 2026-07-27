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
import { CityService } from '../services/city.service';
import { CityEntity } from '../entities/city.entity';
import { PageResult } from 'src/common/models';

import {
  CityFilterValidation,
  CreateCityValidation,
  UpdateCityValidation,
} from '../validations';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import { CityFilterContract } from '../contracts/city-filter.contract';
import { CreateCityContract } from '../contracts/create-city.contract';
import { CurrentUserModel } from 'src/common/models/current-user.model';
import { UpdateCityContract } from '../contracts/update-city.contract';

@ApiTags('Cities')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({ summary: 'Get many cities' })
  @ApiPaginatedResponse(CityEntity)
  findMany(
    @Query(new JoiValidationPipe(CityFilterValidation))
    filter: CityFilterContract,
  ): Promise<PageResult<CityEntity>> {
    return this.cityService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get city by id' })
  @ApiOkResponse({ type: CityEntity })
  findById(
    @Param('id')
    id: string,
  ): Promise<CityEntity> {
    return this.cityService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.CITY.CREATED)
  @ApiOperation({ summary: 'Create a new city' })
  @ApiCreatedResponse({ type: CityEntity })
  @ApiBody({ type: CreateCityContract })
  create(
    @Body(new JoiValidationPipe(CreateCityValidation))
    contract: CreateCityContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<CityEntity> {
    return this.cityService.create(contract, user.id);
  }

  @Patch(':id')
  @ResponseMessage(Messages.CITY.UPDATED)
  @ApiOperation({ summary: 'Update a city' })
  @ApiOkResponse({ type: CityEntity })
  @ApiBody({ type: UpdateCityContract })
  update(
    @Param('id')
    id: string,

    @Body(new JoiValidationPipe(UpdateCityValidation))
    contract: UpdateCityContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<CityEntity> {
    return this.cityService.update(id, contract, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(Messages.CITY.DELETED)
  @ApiOperation({ summary: 'Delete a city' })
  @ApiOkResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.cityService.remove(id, user.id);
  }
}
