import { ApiProperty } from '@nestjs/swagger';

export class UpdateCurrencyContract {
  @ApiProperty({
    description: 'Currency Name',
    maxLength: 150,
    example: 'United States Dollar',
  })
  name: string;
}
