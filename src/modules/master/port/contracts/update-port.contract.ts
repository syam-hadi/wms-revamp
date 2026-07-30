import { ApiProperty } from '@nestjs/swagger';

export class UpdatePortContract {
  @ApiProperty({
    description: 'Port Name',
    maxLength: 150,
    example: 'Port of Tanjung Priok',
  })
  name: string;
}
