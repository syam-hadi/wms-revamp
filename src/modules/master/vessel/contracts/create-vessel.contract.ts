import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVesselContract {
  @ApiProperty({
    example: 'Ever Given',
    description: 'Vessel Name',
    maxLength: 100,
  })
  name!: string;

  @ApiProperty({
    example: '9811000',
    description: 'IMO Number (Unique 7 digits)',
  })
  imoNumber!: string;

  @ApiPropertyOptional({
    example: 'H3RC',
    description: 'Radio Call Sign',
    maxLength: 10,
  })
  callSign?: string;

  @ApiPropertyOptional({
    example: 220940,
    description: 'Gross Tonnage',
    minimum: 0,
  })
  grossTonnage?: number;

  @ApiPropertyOptional({
    example: 20124,
    description: 'TEU Capacity',
    minimum: 0,
  })
  teuCapacity?: number;

  @ApiPropertyOptional({
    example: 399.94,
    description: 'Length Overall in Meters',
  })
  loaMeters?: number;
}
