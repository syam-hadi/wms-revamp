import { ApiProperty } from '@nestjs/swagger';
import { OptionType, Status } from 'src/common/enums';

export class ConfigContract {
  @ApiProperty({ description: 'Unique identifier', format: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'Config Code',
    maxLength: 50,
    example: 'CFG-001',
  })
  code: string;

  @ApiProperty({
    description: 'Config Name',
    maxLength: 150,
    example: 'Max Login Retry',
  })
  name: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Config Description',
  })
  description: string | null;

  @ApiProperty({
    description: 'Config Group',
    maxLength: 50,
    example: 'SECURITY',
  })
  configGroup: string;

  @ApiProperty({
    enum: OptionType,
    enumName: 'OptionType',
    description: 'Type of Option',
  })
  optionType: OptionType;

  @ApiProperty({
    enum: Status,
    enumName: 'Status',
    description: 'Status of Config',
  })
  status: Status;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: String, nullable: true, format: 'uuid' })
  createdBy: string | null;

  @ApiProperty({ type: Date, nullable: true })
  updatedAt: Date | null;

  @ApiProperty({ type: String, nullable: true, format: 'uuid' })
  updatedBy: string | null;
}
