import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OptionType, Status } from 'src/common/enums';

export class CreateConfigContract {
  @ApiProperty({
    description: 'The unique code for the config',
    maxLength: 50,
    example: 'CFG-001',
  })
  code!: string;

  @ApiProperty({
    description: 'The name of the config',
    maxLength: 150,
    example: 'Max Login Retry',
  })
  name!: string;

  @ApiPropertyOptional({ description: 'The description of the config' })
  description?: string;

  @ApiProperty({
    description: 'The group this config belongs to',
    maxLength: 50,
    example: 'SECURITY',
  })
  configGroup!: string;

  @ApiProperty({
    enum: OptionType,
    enumName: 'OptionType',
    description: 'The type of option',
  })
  optionType!: OptionType;

  @ApiProperty({
    enum: Status,
    enumName: 'Status',
    description: 'The status of the config',
  })
  status!: Status;
}
