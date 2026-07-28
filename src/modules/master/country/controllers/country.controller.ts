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
import { CountryEntity } from '../entities/country.entity';
import { CountryService } from '../services/country.service';

import { CurrentUserModel } from 'src/common/models/current-user.model';
import { ApiGenericResponse } from 'src/common/swagger/decorators/api-generic-response.decorator';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import { CountryFilterContract } from '../contracts/country-filter.contract';
import { CountryContract } from '../contracts/country.contract';
import { CreateCountryContract } from '../contracts/create-country.contract';
import { UpdateCountryContract } from '../contracts/update-country.contract';
import {
  CountryFilterValidation,
  CreateCountryValidation,
  UpdateCountryValidation,
} from '../validations';

@ApiTags('Master - Country')
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @ApiOperation({
    summary: 'Get many countries',
    operationId: 'getManyCountries',
  })
  @ApiGenericResponse(CountryContract, { isPaginated: true })
  findMany(
    @Query(new JoiValidationPipe(CountryFilterValidation))
    filter: CountryFilterContract,
  ): Promise<PageResult<CountryEntity>> {
    return this.countryService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get country by id', operationId: 'getCountryById' })
  @ApiGenericResponse(CountryContract)
  findById(
    @Param('id')
    id: string,
  ): Promise<CountryEntity> {
    return this.countryService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.COUNTRY.CREATED)
  @ApiOperation({
    summary: 'Create a new country',
    operationId: 'createCountry',
  })
  @ApiGenericResponse(CountryContract, { status: 201 })
  @ApiBody({ type: CreateCountryContract })
  create(
    @Body(new JoiValidationPipe(CreateCountryValidation))
    contract: CreateCountryContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<CountryEntity> {
    return this.countryService.create(contract, user.id);
  }

  @Patch(':id')
  @ResponseMessage(Messages.COUNTRY.UPDATED)
  @ApiOperation({ summary: 'Update a country', operationId: 'updateCountry' })
  @ApiGenericResponse(CountryContract)
  @ApiBody({ type: UpdateCountryContract })
  update(
    @Param('id')
    id: string,

    @Body(new JoiValidationPipe(UpdateCountryValidation))
    contract: UpdateCountryContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<CountryEntity> {
    return this.countryService.update(id, contract, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(Messages.COUNTRY.DELETED)
  @ApiOperation({ summary: 'Delete a country', operationId: 'deleteCountry' })
  @ApiGenericResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.countryService.remove(id, user.id);
  }
}
