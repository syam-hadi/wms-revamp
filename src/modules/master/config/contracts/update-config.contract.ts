import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateConfigContract } from './create-config.contract';

export class UpdateConfigContract extends PartialType(
  OmitType(CreateConfigContract, ['code', 'configGroup'] as const),
) {}
