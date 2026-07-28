import { ApiProperty } from '@nestjs/swagger';

export class CommodityContract {
  @ApiProperty({
    description: 'Unique identifier',
    format: 'uuid',
    example: 'd9b2d63d-a233-4123-8478-6543169e5781',
  })
  id: string;

  @ApiProperty({
    description: 'System generated unique code for the commodity',
    example: 'CMD-0001',
  })
  code: string;

  @ApiProperty({
    description: 'Name of the commodity',
    example: 'Organic Peroxide Type F, Solid',
    maxLength: 100,
  })
  name: string;

  @ApiProperty({
    description: 'Harmonized System Code (HS Code)',
    type: String,
    example: '29239000',
    nullable: true,
    required: false,
    maxLength: 12,
  })
  hsCode: string | null;

  @ApiProperty({
    description: 'Category of the commodity',
    example: 'Chemicals',
    maxLength: 50,
  })
  category: string;

  @ApiProperty({
    description:
      'Indicates whether the commodity is Dangerous Goods (Hazardous)',
    example: true,
  })
  isHazardous: boolean;

  @ApiProperty({
    description:
      'IMDG class code for hazardous materials. Required if isHazardous is true.',
    type: String,
    example: 'Class 5.2',
    nullable: true,
    required: false,
    maxLength: 10,
  })
  imdgClass: string | null;

  @ApiProperty({
    description:
      'Indicates whether the commodity requires a reefer container (temperature control)',
    example: true,
  })
  requiresReefer: boolean;

  @ApiProperty({
    description:
      'Minimum temperature required in Celsius (required if requiresReefer is true)',
    example: -10.0,
    nullable: true,
    required: false,
  })
  minTemperature: number | null;

  @ApiProperty({
    description:
      'Maximum temperature required in Celsius (required if requiresReefer is true)',
    example: -5.0,
    nullable: true,
    required: false,
  })
  maxTemperature: number | null;

  @ApiProperty({
    description: 'Additional remarks or special handling instructions',
    example:
      'Stow away from living quarters. Continuous temperature monitoring mandatory.',
    nullable: true,
    required: false,
    maxLength: 255,
  })
  remarks: string | null;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({
    type: String,
    nullable: true,
    format: 'uuid',
    example: '323e4567-e89b-12d3-a456-426614174002',
  })
  createdBy: string | null;

  @ApiProperty({
    type: Date,
    nullable: true,
    example: '2026-01-01T00:00:00.000Z',
  })
  updatedAt: Date | null;

  @ApiProperty({
    type: String,
    nullable: true,
    format: 'uuid',
    example: '323e4567-e89b-12d3-a456-426614174002',
  })
  updatedBy: string | null;
}
