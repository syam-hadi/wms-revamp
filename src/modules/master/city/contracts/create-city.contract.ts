import { ApiProperty } from '@nestjs/swagger';

export class CreateCityContract {
  @ApiProperty({ description: 'The id of the province' })
  provinceId!: string;

  @ApiProperty({ description: 'The unique code for the city' })
  code!: string;

  @ApiProperty({ description: 'The name of the city' })
  name!: string;
}
