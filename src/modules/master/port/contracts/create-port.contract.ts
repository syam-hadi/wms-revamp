import { ApiProperty } from '@nestjs/swagger';

export class CreatePortContract {
  @ApiProperty({
    description: 'Unique Port Code',
    maxLength: 20,
    example: 'IDJKT',
  })
  code: string;

  @ApiProperty({
    description: 'Port Name',
    maxLength: 150,
    example: 'Port of Tanjung Priok',
  })
  name: string;
}
