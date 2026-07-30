import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDepotContract {
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
