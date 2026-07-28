import { PartialType } from '@nestjs/swagger';
import { CreateRateContract } from './create-rate.contract';

export class UpdateRateContract extends PartialType(CreateRateContract) {}
