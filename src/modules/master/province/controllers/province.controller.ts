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
import { ProvinceService } from '../services/province.service';
import { ProvinceEntity } from '../entities/province.entity';
import { PageResult } from 'src/common/models';

import {
  ProvinceFilterValidation,
  CreateProvinceValidation,
  UpdateProvinceValidation,
} from '../validations';
import { JoiValidationPipe } from 'src/common/validation/pipes/joi-validation.pipe';
import { ProvinceFilterContract } from '../contracts/province-filter.contract';
import { CreateProvinceContract } from '../contracts/create-province.contract';
import { CurrentUserModel } from 'src/common/models/current-user.model';
import { UpdateProvinceContract } from '../contracts/update-province.contract';

@ApiTags('Provinces')
@Controller('provinces')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  @ApiOperation({ summary: 'Get many provinces' })
  @ApiPaginatedResponse(ProvinceEntity)
  findMany(
    @Query(new JoiValidationPipe(ProvinceFilterValidation))
    filter: ProvinceFilterContract,
  ): Promise<PageResult<ProvinceEntity>> {
    return this.provinceService.findMany(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get province by id' })
  @ApiOkResponse({ type: ProvinceEntity })
  findById(
    @Param('id')
    id: string,
  ): Promise<ProvinceEntity> {
    return this.provinceService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(Messages.PROVINCE.CREATED)
  @ApiOperation({ summary: 'Create a new province' })
  @ApiCreatedResponse({ type: ProvinceEntity })
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
  @ApiOperation({ summary: 'Update a province' })
  @ApiOkResponse({ type: ProvinceEntity })
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
  @ApiOperation({ summary: 'Delete a province' })
  @ApiOkResponse()
  remove(
    @Param('id')
    id: string,

    @CurrentUser()
    user: CurrentUserModel,
  ): Promise<void> {
    return this.provinceService.remove(id, user.id);
  }
}
