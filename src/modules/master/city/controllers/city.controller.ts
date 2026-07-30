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
import { CityEntity } from '../entities/city.entity';
import { CityService } from '../services/city.service';

import { CurrentUserModel } from 'src/common/models/current-user.model';
import { ApiGenericResponse } from 'src/common/swagger/decorators/api-generic-response.decorator';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import {
  CityFilterContract,
  CityContract,
  CreateCityContract,
  UpdateCityContract,
} from '../contracts';
import {
  CityFilterValidation,
  CreateCityValidation,
  UpdateCityValidation,
} from '../validations';

@ApiTags('Master - City')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({ summary: 'Get many cities', operationId: 'getManyCities' })
  @ApiGenericResponse(CityContract, { isPaginated: true })
  findMany(
    @Query(new JoiValidationPipe(CityFilterValidation))
    filter: CityFilterContract,
  ): Promise<PageResult<CityEntity>> {
    return this.cityService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get city by id', operationId: 'getCityById' })
  @ApiGenericResponse(CityContract)
  findById(
    @Param('id')
    id: string,
  ): Promise<CityEntity> {
    return this.cityService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.CITY.CREATED)
  @ApiOperation({ summary: 'Create a new city', operationId: 'createCity' })
  @ApiGenericResponse(CityContract, { status: 201 })
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
  @ApiOperation({ summary: 'Update a city', operationId: 'updateCity' })
  @ApiGenericResponse(CityContract)
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
  @ApiOperation({ summary: 'Delete a city', operationId: 'deleteCity' })
  @ApiGenericResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.cityService.remove(id, user.id);
  }
}
