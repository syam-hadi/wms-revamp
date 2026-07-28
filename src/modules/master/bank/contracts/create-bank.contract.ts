import { ApiProperty } from '@nestjs/swagger';

export class CreateBankContract {
  @ApiProperty({
    description: 'Bank Short Name',
    maxLength: 150,
    example: 'BCA',
  })
  shortName!: string;

  @ApiProperty({
    description: 'Bank Name',
    maxLength: 150,
    example: 'Bank Central Asia',
  })
  name!: string;
}
