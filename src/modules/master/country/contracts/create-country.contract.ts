import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryContract {
  @ApiProperty({
    description: 'Unique ISO Country Code',
    maxLength: 5,
    example: 'ID',
  })
  code!: string;

  @ApiProperty({
    description: 'Country Name',
    maxLength: 150,
    example: 'Indonesia',
  })
  name!: string;
}
