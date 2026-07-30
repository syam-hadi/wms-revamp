import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VesselContract {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'MSC Gülsün' })
  name!: string;

  @ApiProperty({ example: '9839430' })
  imoNumber!: string;

  @ApiPropertyOptional({ example: '9HA4567' })
  callSign!: string | null;

  @ApiPropertyOptional({ example: 232618 })
  grossTonnage!: number | null;

  @ApiPropertyOptional({ example: 23756 })
  teuCapacity!: number | null;

  @ApiPropertyOptional({ example: 399.9 })
  loaMeters!: number | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ format: 'uuid', nullable: true })
  createdBy!: string | null;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  updatedAt!: Date | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  updatedBy!: string | null;
}
