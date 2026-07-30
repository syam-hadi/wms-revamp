import { PartialType } from '@nestjs/swagger';
import { CreateCommodityContract } from './create-commodity.contract';

export class UpdateCommodityContract extends PartialType(
  CreateCommodityContract,
) {}
