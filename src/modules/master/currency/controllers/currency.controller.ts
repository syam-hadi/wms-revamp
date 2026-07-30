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
import { CurrencyEntity } from '../entities/currency.entity';
import { CurrencyService } from '../services/currency.service';

import { CurrentUserModel } from 'src/common/models/current-user.model';
import { ApiGenericResponse } from 'src/common/swagger/decorators/api-generic-response.decorator';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import {
  CurrencyFilterContract,
  CurrencyContract,
  CreateCurrencyContract,
  UpdateCurrencyContract,
} from '../contracts';
import {
  CurrencyFilterValidation,
  CreateCurrencyValidation,
  UpdateCurrencyValidation,
} from '../validations';

@ApiTags('Master - Currency')
@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  @ApiOperation({
    summary: 'Get many currencies',
    operationId: 'getManyCurrencies',
  })
  @ApiGenericResponse(CurrencyContract, { isPaginated: true })
  findMany(
    @Query(new JoiValidationPipe(CurrencyFilterValidation))
    filter: CurrencyFilterContract,
  ): Promise<PageResult<CurrencyEntity>> {
    return this.currencyService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get currency by id',
    operationId: 'getCurrencyById',
  })
  @ApiGenericResponse(CurrencyContract)
  findById(
    @Param('id')
    id: string,
  ): Promise<CurrencyEntity> {
    return this.currencyService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.CURRENCY.CREATED)
  @ApiOperation({
    summary: 'Create a new currency',
    operationId: 'createCurrency',
  })
  @ApiGenericResponse(CurrencyContract, { status: 201 })
  @ApiBody({ type: CreateCurrencyContract })
  create(
    @Body(new JoiValidationPipe(CreateCurrencyValidation))
    contract: CreateCurrencyContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<CurrencyEntity> {
    return this.currencyService.create(contract, user.id);
  }

  @Patch(':id')
  @ResponseMessage(Messages.CURRENCY.UPDATED)
  @ApiOperation({ summary: 'Update a currency', operationId: 'updateCurrency' })
  @ApiGenericResponse(CurrencyContract)
  @ApiBody({ type: UpdateCurrencyContract })
  update(
    @Param('id')
    id: string,

    @Body(new JoiValidationPipe(UpdateCurrencyValidation))
    contract: UpdateCurrencyContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<CurrencyEntity> {
    return this.currencyService.update(id, contract, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(Messages.CURRENCY.DELETED)
  @ApiOperation({ summary: 'Delete a currency', operationId: 'deleteCurrency' })
  @ApiGenericResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.currencyService.remove(id, user.id);
  }
}
