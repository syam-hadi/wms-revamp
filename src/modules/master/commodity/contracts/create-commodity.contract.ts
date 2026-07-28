import { ApiProperty } from '@nestjs/swagger';

export class CreateCommodityContract {
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
  hsCode?: string | null;

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
  imdgClass?: string | null;

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
  minTemperature?: number | null;

  @ApiProperty({
    description:
      'Maximum temperature required in Celsius (required if requiresReefer is true)',
    example: -5.0,
    nullable: true,
    required: false,
  })
  maxTemperature?: number | null;

  @ApiProperty({
    description: 'Additional remarks or special handling instructions',
    example:
      'Stow away from living quarters. Continuous temperature monitoring mandatory.',
    nullable: true,
    required: false,
    maxLength: 255,
  })
  remarks?: string | null;
}
