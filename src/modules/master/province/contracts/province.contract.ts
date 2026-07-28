import { ApiProperty } from '@nestjs/swagger';

export class ProvinceContract {
  @ApiProperty({ description: 'Unique identifier', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Country Identifier', format: 'uuid' })
  countryId: string;

  @ApiProperty({
    description: 'Province Code',
    maxLength: 5,
    example: 'JKT',
  })
  code: string;

  @ApiProperty({
    description: 'Province Name',
    maxLength: 150,
    example: 'Jakarta',
  })
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: String, nullable: true, format: 'uuid' })
  createdBy: string | null;

  @ApiProperty({ type: Date, nullable: true })
  updatedAt: Date | null;

  @ApiProperty({ type: String, nullable: true, format: 'uuid' })
  updatedBy: string | null;
}
