import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUnitOfMeasurementContract } from './create-unit-of-measurement.contract';

export class UpdateUnitOfMeasurementContract extends PartialType(
  OmitType(CreateUnitOfMeasurementContract, ['code'] as const),
) {}
