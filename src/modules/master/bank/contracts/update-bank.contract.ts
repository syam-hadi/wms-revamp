import { PartialType } from '@nestjs/swagger';
import { CreateBankContract } from './create-bank.contract';

export class UpdateBankContract extends PartialType(CreateBankContract) {}
