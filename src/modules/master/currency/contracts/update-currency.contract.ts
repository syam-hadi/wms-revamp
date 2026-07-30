import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCurrencyContract } from './create-currency.contract';

export class UpdateCurrencyContract extends PartialType(
  OmitType(CreateCurrencyContract, ['code'] as const),
) {}
