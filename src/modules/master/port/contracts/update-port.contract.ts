import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePortContract } from './create-port.contract';

export class UpdatePortContract extends PartialType(
  OmitType(CreatePortContract, ['code'] as const),
) {}
