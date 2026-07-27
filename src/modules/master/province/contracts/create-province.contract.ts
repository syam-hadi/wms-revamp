import { ApiProperty } from '@nestjs/swagger';

export class CreateProvinceContract {
  @ApiProperty({ description: 'The unique code for the province' })
  code!: string;

  @ApiProperty({ description: 'The name of the province' })
  name!: string;

  @ApiProperty({ description: 'The id of the country' })
  countryId!: string;
}
