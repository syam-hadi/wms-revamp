import { PartialType } from '@nestjs/swagger';
import { CreateTaxContract } from './create-tax.contract';

export class UpdateTaxContract extends PartialType(CreateTaxContract) {}
