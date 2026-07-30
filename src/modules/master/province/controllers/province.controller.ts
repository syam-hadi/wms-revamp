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
import { ProvinceEntity } from '../entities/province.entity';
import { ProvinceService } from '../services/province.service';

import { CurrentUserModel } from 'src/common/models/current-user.model';
import { ApiGenericResponse } from 'src/common/swagger/decorators/api-generic-response.decorator';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import {
  CreateProvinceContract,
  ProvinceFilterContract,
  ProvinceContract,
  UpdateProvinceContract,
} from '../contracts';
import {
  CreateProvinceValidation,
  ProvinceFilterValidation,
  UpdateProvinceValidation,
} from '../validations';

@ApiTags('Master - Province')
@Controller('provinces')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  @ApiOperation({
    summary: 'Get many provinces',
    operationId: 'getManyProvinces',
  })
  @ApiGenericResponse(ProvinceContract, { isPaginated: true })
  findMany(
    @Query(new JoiValidationPipe(ProvinceFilterValidation))
    filter: ProvinceFilterContract,
  ): Promise<PageResult<ProvinceEntity>> {
    return this.provinceService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get province by id',
    operationId: 'getProvinceById',
  })
  @ApiGenericResponse(ProvinceContract)
  findById(
    @Param('id')
    id: string,
  ): Promise<ProvinceEntity> {
    return this.provinceService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.PROVINCE.CREATED)
  @ApiOperation({
    summary: 'Create a new province',
    operationId: 'createProvince',
  })
  @ApiGenericResponse(ProvinceContract, { status: 201 })
  @ApiBody({ type: CreateProvinceContract })
  create(
    @Body(new JoiValidationPipe(CreateProvinceValidation))
    contract: CreateProvinceContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<ProvinceEntity> {
    return this.provinceService.create(contract, user.id);
  }

  @Patch(':id')
  @ResponseMessage(Messages.PROVINCE.UPDATED)
  @ApiOperation({ summary: 'Update a province', operationId: 'updateProvince' })
  @ApiGenericResponse(ProvinceContract)
  @ApiBody({ type: UpdateProvinceContract })
  update(
    @Param('id')
    id: string,

    @Body(new JoiValidationPipe(UpdateProvinceValidation))
    contract: UpdateProvinceContract,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<ProvinceEntity> {
    return this.provinceService.update(id, contract, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(Messages.PROVINCE.DELETED)
  @ApiOperation({
    summary: 'Delete a province',
    operationId: 'deleteProvince',
  })
  @ApiGenericResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.provinceService.remove(id, user.id);
  }
}
