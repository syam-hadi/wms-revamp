import { ApiProperty } from '@nestjs/swagger';

export class CreateCityContract {
  @ApiProperty({ description: 'The id of the province', format: 'uuid' })
  provinceId!: string;

  @ApiProperty({
    description: 'The unique code for the city',
    maxLength: 15,
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
