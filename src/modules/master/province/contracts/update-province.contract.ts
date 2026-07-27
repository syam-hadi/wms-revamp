import { PartialType } from '@nestjs/swagger';
import { CreateProvinceContract } from './create-province.contract';

export class UpdateProvinceContract extends PartialType(
  CreateProvinceContract,
) {}
