import { ApiProperty } from '@nestjs/swagger';

export class CreateProvinceContract {
  @ApiProperty({
    description: 'The unique code for the province',
    maxLength: 5,
    example: 'JKT',
  })
  code!: string;

  @ApiProperty({
    description: 'The name of the province',
    maxLength: 150,
    example: 'Jakarta',
  })
  name!: string;

  @ApiProperty({
    description: 'The id of the country',
    format: 'uuid',
    example: '223e4567-e89b-12d3-a456-426614174001',
  })
  countryId!: string;
}
