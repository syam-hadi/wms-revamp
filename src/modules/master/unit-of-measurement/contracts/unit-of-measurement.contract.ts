import { ApiProperty } from '@nestjs/swagger';

export class UnitOfMeasurementContract {
  @ApiProperty({
    description: 'Unique Unit of Measurement ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

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
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Created At',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Created By',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Updated At',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  updatedAt?: Date;

  @ApiProperty({
    description: 'Updated By',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    nullable: true,
  })
  updatedBy?: string;
}
