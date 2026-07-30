import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepotContract {
  @ApiProperty({
    description: 'Unique Depot Code',
    maxLength: 20,
    example: 'JKTDC',
  })
  code: string;

  @ApiProperty({
    description: 'Depot Name',
    maxLength: 150,
    example: 'Jakarta Distribution Center',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Depot Description',
    maxLength: 100,
    example: 'Main warehouse for western Indonesia',
  })
  description?: string;
}
