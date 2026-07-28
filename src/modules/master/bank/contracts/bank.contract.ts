import { ApiProperty } from '@nestjs/swagger';

export class BankContract {
  @ApiProperty({ description: 'Unique identifier', format: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'Unique Bank Code',
    maxLength: 20,
    example: 'BNK-001',
  })
  code: string;

  @ApiProperty({
    description: 'Bank Short Name',
    maxLength: 150,
    example: 'BCA',
  })
  shortName: string;

  @ApiProperty({
    description: 'Bank Name',
    maxLength: 150,
    example: 'Bank Central Asia',
  })
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: String, nullable: true, format: 'uuid' })
  createdBy: string | null;

  @ApiProperty({ type: Date, nullable: true })
  updatedAt: Date | null;

  @ApiProperty({ type: String, nullable: true, format: 'uuid' })
  updatedBy: string | null;
}
