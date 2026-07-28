import { ApiProperty } from '@nestjs/swagger';
import { OptionType, Status } from 'src/common/enums';

export class ConfigContract {
  @ApiProperty({
    description: 'Unique identifier',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Config Code',
    maxLength: 50,
    example: 'CFG-001',
  })
  code: string;

  @ApiProperty({
    description: 'Config Name',
    maxLength: 255,
    example: 'Max Login Retry',
  })
  name: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Config Description',
    example: 'Maximum login retry limit before locking account',
  })
  description: string | null;

  @ApiProperty({
    description: 'Config Group',
    maxLength: 100,
    example: 'SECURITY',
  })
  configGroup: string;

  @ApiProperty({
    enum: OptionType,
    enumName: 'OptionType',
    description: 'Type of Option',
    example: OptionType.SELECT,
  })
  optionType: OptionType;

  @ApiProperty({
    enum: Status,
    enumName: 'Status',
    description: 'Status of Config',
    example: Status.ACTIVE,
  })
  status: Status;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({
    type: String,
    nullable: true,
    format: 'uuid',
    example: '323e4567-e89b-12d3-a456-426614174002',
  })
  createdBy: string | null;

  @ApiProperty({
    type: Date,
    nullable: true,
    example: '2026-01-01T00:00:00.000Z',
  })
  updatedAt: Date | null;

  @ApiProperty({
    type: String,
    nullable: true,
    format: 'uuid',
    example: '323e4567-e89b-12d3-a456-426614174002',
  })
  updatedBy: string | null;
}
