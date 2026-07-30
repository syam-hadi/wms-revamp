import { ApiProperty } from '@nestjs/swagger';

export class CreateCurrencyContract {
  @ApiProperty({
    description: 'Unique ISO Currency Code',
    maxLength: 20,
    example: 'USD',
  })
  code: string;

  @ApiProperty({
    description: 'Currency Name',
    maxLength: 150,
    example: 'United States Dollar',
  })
  name: string;
}
