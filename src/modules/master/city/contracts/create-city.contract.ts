import { ApiProperty } from '@nestjs/swagger';

export class CreateCityContract {
  @ApiProperty({
    description: 'The id of the province',
    format: 'uuid',
    example: '223e4567-e89b-12d3-a456-426614174001',
  })
  provinceId!: string;

  @ApiProperty({
    description: 'The unique code for the city',
    maxLength: 20,
    example: 'JKT-SEL',
  })
  code!: string;

  @ApiProperty({
    description: 'The name of the city',
    maxLength: 150,
    example: 'Jakarta Selatan',
  })
  name!: string;
}
