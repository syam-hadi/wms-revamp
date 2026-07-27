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
import { CountryService } from '../services/country.service';
import { CountryEntity } from '../entities/country.entity';
import { PageResult } from 'src/common/models';

import {
  CountryFilterValidation,
  CreateCountryValidation,
  UpdateCountryValidation,
} from '../validations';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import { CountryFilterContract } from '../contracts/country-filter.contract';
import { CreateCountryContract } from '../contracts/create-country.contract';
import { CurrentUserModel } from 'src/common/models/current-user.model';
import { UpdateCountryContract } from '../contracts/update-country.contract';

@ApiTags('Countries')
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @ApiOperation({ summary: 'Get many countries' })
  @ApiPaginatedResponse(CountryEntity)
  findMany(
    @Query(new JoiValidationPipe(CountryFilterValidation))
    filter: CountryFilterContract,
  ): Promise<PageResult<CountryEntity>> {
    return this.countryService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get country by id' })
  @ApiOkResponse({ type: CountryEntity })
  findById(
    @Param('id')
    id: string,
  ): Promise<CountryEntity> {
    return this.countryService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.COUNTRY.CREATED)
  @ApiOperation({ summary: 'Create a new country' })
  @ApiCreatedResponse({ type: CountryEntity })
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
  @ApiOperation({ summary: 'Update a country' })
  @ApiOkResponse({ type: CountryEntity })
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
  @ApiOperation({ summary: 'Delete a country' })
  @ApiOkResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.countryService.remove(id, user.id);
  }
}
