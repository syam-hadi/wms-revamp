import { ApiProperty } from '@nestjs/swagger';

export class PortContract {
  @ApiProperty({
    description: 'Unique identifier',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Unique Port Code',
    maxLength: 20,
    example: 'IDJKT',
  })
  code: string;

  @ApiProperty({
    description: 'Port Name',
    maxLength: 150,
    example: 'Port of Tanjung Priok',
  })
  name: string;

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
