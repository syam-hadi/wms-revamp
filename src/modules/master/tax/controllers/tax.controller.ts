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
import { TaxEntity } from '../entities/tax.entity';
import { TaxService } from '../services/tax.service';

import { CurrentUserModel } from 'src/common/models/current-user.model';
import { ApiGenericResponse } from 'src/common/swagger/decorators/api-generic-response.decorator';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import { TaxFilterContract } from '../contracts/tax-filter.contract';
import { TaxContract } from '../contracts/tax.contract';
import { CreateTaxContract } from '../contracts/create-tax.contract';
import { UpdateTaxContract } from '../contracts/update-tax.contract';
import {
  TaxFilterValidation,
  CreateTaxValidation,
  UpdateTaxValidation,
} from '../validations';

@ApiTags('Master - Tax')
@Controller('taxes')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get()
  @ApiOperation({
    summary: 'Get many taxes',
    operationId: 'getManyTaxes',
  })
  @ApiGenericResponse(TaxContract, { isPaginated: true })
  findMany(
    @Query(new JoiValidationPipe(TaxFilterValidation))
    filter: TaxFilterContract,
  ): Promise<PageResult<TaxEntity>> {
    return this.taxService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tax by id', operationId: 'getTaxById' })
  @ApiGenericResponse(TaxContract)
  findById(
    @Param('id')
    id: string,
  ): Promise<TaxEntity> {
    return this.taxService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.TAX.CREATED)
  @ApiOperation({
    summary: 'Create a new tax',
    operationId: 'createTax',
  })
  @ApiGenericResponse(TaxContract, { status: 201 })
  @ApiBody({ type: CreateTaxContract })
  create(
    @Body(new JoiValidationPipe(CreateTaxValidation))
    contract: CreateTaxContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<TaxEntity> {
    return this.taxService.create(contract, user.id);
  }

  @Patch(':id')
  @ResponseMessage(Messages.TAX.UPDATED)
  @ApiOperation({ summary: 'Update a tax', operationId: 'updateTax' })
  @ApiGenericResponse(TaxContract)
  @ApiBody({ type: UpdateTaxContract })
  update(
    @Param('id')
    id: string,

    @Body(new JoiValidationPipe(UpdateTaxValidation))
    contract: UpdateTaxContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<TaxEntity> {
    return this.taxService.update(id, contract, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(Messages.TAX.DELETED)
  @ApiOperation({ summary: 'Delete a tax', operationId: 'deleteTax' })
  @ApiGenericResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.taxService.remove(id, user.id);
  }
}
