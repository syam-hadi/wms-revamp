import { ApiProperty } from '@nestjs/swagger';

export class BankContract {
  @ApiProperty({
    description: 'Unique identifier',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Unique Bank Code',
    maxLength: 20,
    example: 'BNK000001',
  })
  code: string;

  @ApiProperty({
    description: 'Bank Short Name',
    maxLength: 150,
    example: 'BCA',
  })
  shortName: string;

  @ApiProperty({
    description: 'Bank Name',
    maxLength: 150,
    example: 'Bank Central Asia',
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
