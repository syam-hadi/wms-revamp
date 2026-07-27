import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryContract {
  @ApiProperty({ description: 'The unique code for the country' })
  code!: string;

  @ApiProperty({ description: 'The name of the country' })
  name!: string;
}
