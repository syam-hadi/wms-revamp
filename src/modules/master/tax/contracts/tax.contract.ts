import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaxContract {
  @ApiProperty({
    description: 'Tax ID (UUID)',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Tax Code',
    maxLength: 20,
    example: 'TAX000001',
  })
  code: string;

  @ApiProperty({
    description: 'Tax Name',
    maxLength: 150,
    example: 'PPN 11%',
  })
  name: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Tax Description',
    maxLength: 100,
    example: 'Pajak Pertambahan Nilai 11%',
  })
  description: string | null;

  @ApiProperty({
    description: 'Tax Value',
    example: 11.0,
  })
  value: number;

  @ApiProperty({
    description: 'Tax Flag Type (true = Addition, false = Subtraction)',
    example: true,
  })
  flagType: boolean;

  @ApiPropertyOptional({
    type: String,
    description: 'Chart of Account (COA)',
    maxLength: 20,
    example: '411211',
  })
  coa: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Tax Code Reference',
    maxLength: 100,
    example: 'REF-TAX-001',
  })
  taxCode: string | null;

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
