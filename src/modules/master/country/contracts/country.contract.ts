import { ApiProperty } from '@nestjs/swagger';

export class CountryContract {
  @ApiProperty({ description: 'Unique identifier', format: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'Unique ISO Country Code',
    maxLength: 5,
    example: 'ID',
  })
  code: string;

  @ApiProperty({
    description: 'Country Name',
    maxLength: 150,
    example: 'Indonesia',
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
