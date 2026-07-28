import { OmitType } from '@nestjs/swagger';
import { BaseQueryContract } from 'src/common/contracts';

export class BankFilterContract extends OmitType(BaseQueryContract, [
  'status',
] as const) {}
