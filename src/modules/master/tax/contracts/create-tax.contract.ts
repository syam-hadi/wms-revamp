import { OmitType } from '@nestjs/swagger';
import { TaxContract } from './tax.contract';

export class CreateTaxContract extends OmitType(TaxContract, [
  'id',
  'code',
  'createdAt',
  'createdBy',
  'updatedAt',
  'updatedBy',
] as const) {}
