import { ApiProperty } from '@nestjs/swagger';

export class CreateProvinceContract {
  @ApiProperty({
    description: 'The unique code for the province',
    maxLength: 5,
  })
  code!: string;

  @ApiProperty({ description: 'The name of the province', maxLength: 150 })
  name!: string;

  @ApiProperty({ description: 'The id of the country', format: 'uuid' })
  countryId!: string;
}
