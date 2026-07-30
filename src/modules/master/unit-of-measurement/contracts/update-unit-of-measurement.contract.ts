import { ApiProperty } from '@nestjs/swagger';

export class UpdateUnitOfMeasurementContract {
  @ApiProperty({
    description: 'Unit of Measurement Name',
    maxLength: 150,
    example: 'Kilogram',
  })
  name: string;

  @ApiProperty({
    description: 'Unit Symbol',
    maxLength: 100,
    example: 'kg',
  })
  unit: string;

  @ApiProperty({
    description: 'Description',
    maxLength: 100,
    example: 'Metric weight unit',
    required: false,
  })
  description?: string;
}
