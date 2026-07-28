import { PickType } from '@nestjs/swagger';
import { RateContract } from './rate.contract';

export class CreateRateContract extends PickType(RateContract, [
  'currencyCode',
  'description',
  'value',
  'validFrom',
]) {}
