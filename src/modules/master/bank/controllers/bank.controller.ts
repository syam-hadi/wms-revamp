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
import { BankEntity } from '../entities/bank.entity';
import { BankService } from '../services/bank.service';

import { CurrentUserModel } from 'src/common/models/current-user.model';
import { ApiGenericResponse } from 'src/common/swagger/decorators/api-generic-response.decorator';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import { BankFilterContract } from '../contracts/bank-filter.contract';
import { BankContract } from '../contracts/bank.contract';
import { CreateBankContract } from '../contracts/create-bank.contract';
import { UpdateBankContract } from '../contracts/update-bank.contract';
import {
  BankFilterValidation,
  CreateBankValidation,
  UpdateBankValidation,
} from '../validations';

@ApiTags('Master - Bank')
@Controller('banks')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get()
  @ApiOperation({
    summary: 'Get many banks',
    operationId: 'getManyBanks',
  })
  @ApiGenericResponse(BankContract, { isPaginated: true })
  findMany(
    @Query(new JoiValidationPipe(BankFilterValidation))
    filter: BankFilterContract,
  ): Promise<PageResult<BankEntity>> {
    return this.bankService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bank by id', operationId: 'getBankById' })
  @ApiGenericResponse(BankContract)
  findById(
    @Param('id')
    id: string,
  ): Promise<BankEntity> {
    return this.bankService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.BANK.CREATED)
  @ApiOperation({
    summary: 'Create a new bank',
    operationId: 'createBank',
  })
  @ApiGenericResponse(BankContract, { status: 201 })
  @ApiBody({ type: CreateBankContract })
  create(
    @Body(new JoiValidationPipe(CreateBankValidation))
    contract: CreateBankContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<BankEntity> {
    return this.bankService.create(contract, user.id);
  }

  @Patch(':id')
  @ResponseMessage(Messages.BANK.UPDATED)
  @ApiOperation({ summary: 'Update a bank', operationId: 'updateBank' })
  @ApiGenericResponse(BankContract)
  @ApiBody({ type: UpdateBankContract })
  update(
    @Param('id')
    id: string,

    @Body(new JoiValidationPipe(UpdateBankValidation))
    contract: UpdateBankContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<BankEntity> {
    return this.bankService.update(id, contract, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(Messages.BANK.DELETED)
  @ApiOperation({ summary: 'Delete a bank', operationId: 'deleteBank' })
  @ApiGenericResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.bankService.remove(id, user.id);
  }
}
