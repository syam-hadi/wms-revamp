import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDepotContract } from './create-depot.contract';

export class UpdateDepotContract extends PartialType(
  OmitType(CreateDepotContract, ['code'] as const),
) {}
