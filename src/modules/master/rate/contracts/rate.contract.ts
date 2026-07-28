import { ApiProperty } from '@nestjs/swagger';

export class RateContract {
  @ApiProperty({
    description: 'Unique identifier',
    format: 'uuid',
    example: 'd9b2d63d-a233-4123-8478-6543169e5781',
  })
  id: string;

  @ApiProperty({
    description: 'Currency Code reference ID',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  currencyCode: string;

  @ApiProperty({
    description: 'Description for the rate',
    example: 'USD exchange rate effective July 2025',
    maxLength: 100,
    nullable: true,
    required: false,
  })
  description: string | null;

  @ApiProperty({
    description: 'Rate value',
    example: 16525.75,
    type: Number,
  })
  value: number;

  @ApiProperty({
    description: 'Date the rate becomes valid',
    example: '2025-07-01T00:00:00.000Z',
    type: Date,
  })
  validFrom: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', type: Date })
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
    example: '2025-01-01T00:00:00.000Z',
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
