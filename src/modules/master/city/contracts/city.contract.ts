import { ApiProperty } from '@nestjs/swagger';

export class CityContract {
  @ApiProperty({ description: 'Unique identifier', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Province Identifier', format: 'uuid' })
  provinceId: string;

  @ApiProperty({
    description: 'City Code',
    maxLength: 15,
    example: 'JKT-SEL',
  })
  code: string;

  @ApiProperty({
    description: 'City Name',
    maxLength: 150,
    example: 'Jakarta Selatan',
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
