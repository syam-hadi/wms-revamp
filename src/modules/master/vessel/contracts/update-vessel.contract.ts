import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateVesselContract } from './create-vessel.contract';

export class UpdateVesselContract extends PartialType(
  OmitType(CreateVesselContract, ['imoNumber'] as const),
) {}
