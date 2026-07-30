import { ApiProperty } from '@nestjs/swagger';

export class CreateUnitOfMeasurementContract {
  @ApiProperty({
    description: 'Unique Unit of Measurement Code',
    maxLength: 20,
    example: 'KG',
  })
  code: string;

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
