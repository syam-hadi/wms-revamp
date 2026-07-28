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
import { RateService } from '../services/rate.service';
import { RateEntity } from '../entities/rate.entity';

import { CurrentUserModel } from 'src/common/models/current-user.model';
import { ApiGenericResponse } from 'src/common/swagger/decorators/api-generic-response.decorator';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import { RateFilterContract } from '../contracts/rate-filter.contract';
import { RateContract } from '../contracts/rate.contract';
import { CreateRateContract } from '../contracts/create-rate.contract';
import { UpdateRateContract } from '../contracts/update-rate.contract';
import {
  RateFilterValidation,
  CreateRateValidation,
  UpdateRateValidation,
} from '../validations';

@ApiTags('Master - Rate')
@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  @ApiOperation({
    summary: 'Get many rates',
    operationId: 'getManyRates',
  })
  @ApiGenericResponse(RateContract, { isPaginated: true })
  findMany(
    @Query(new JoiValidationPipe(RateFilterValidation))
    filter: RateFilterContract,
  ): Promise<PageResult<RateEntity>> {
    return this.rateService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rate by id', operationId: 'getRateById' })
  @ApiGenericResponse(RateContract)
  findById(
    @Param('id')
    id: string,
  ): Promise<RateEntity> {
    return this.rateService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.RATE.CREATED)
  @ApiOperation({
    summary: 'Create a new rate',
    operationId: 'createRate',
  })
  @ApiGenericResponse(RateContract, { status: 201 })
  @ApiBody({
    type: CreateRateContract,
    examples: {
      example1: {
        value: {
          currencyCode: '550e8400-e29b-41d4-a716-446655440000',
          description: 'USD exchange rate effective July 2025',
          value: 16525.75,
          validFrom: '2025-07-01',
        },
      },
      example2: {
        value: {
          currencyCode: '9d0ef7c5-32d5-4f0c-8b54-dfa93d7c2c7d',
          description: 'JPY exchange rate effective August 2025',
          value: 112.45,
          validFrom: '2025-08-01',
        },
      },
    },
  })
  create(
    @Body(new JoiValidationPipe(CreateRateValidation))
    contract: CreateRateContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<RateEntity> {
    return this.rateService.create(contract, user.id);
  }

  @Patch(':id')
  @ResponseMessage(Messages.RATE.UPDATED)
  @ApiOperation({ summary: 'Update a rate', operationId: 'updateRate' })
  @ApiGenericResponse(RateContract)
  @ApiBody({
    type: UpdateRateContract,
    examples: {
      example1: {
        value: {
          currencyCode: '550e8400-e29b-41d4-a716-446655440000',
          description: 'USD exchange rate effective July 2025',
          value: 16525.75,
          validFrom: '2025-07-01',
        },
      },
    },
  })
  update(
    @Param('id')
    id: string,

    @Body(new JoiValidationPipe(UpdateRateValidation))
    contract: UpdateRateContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<RateEntity> {
    return this.rateService.update(id, contract, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(Messages.RATE.DELETED)
  @ApiOperation({ summary: 'Delete a rate', operationId: 'deleteRate' })
  @ApiGenericResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.rateService.remove(id, user.id);
  }
}
