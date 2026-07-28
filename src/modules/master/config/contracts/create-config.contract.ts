import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OptionType, Status } from 'src/common/enums';

export class CreateConfigContract {
  @ApiProperty({
    description: 'The name of the config',
    maxLength: 255,
    example: 'Max Login Retry',
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'The description of the config',
    example: 'Maximum login retry limit before locking account',
  })
  description?: string;

  @ApiProperty({
    description: 'The group this config belongs to',
    maxLength: 100,
    example: 'SECURITY',
  })
  configGroup!: string;

  @ApiProperty({
    enum: OptionType,
    enumName: 'OptionType',
    description: 'The type of option',
    example: OptionType.SELECT,
  })
  optionType!: OptionType;

  @ApiProperty({
    enum: Status,
    enumName: 'Status',
    description: 'The status of the config',
    example: Status.ACTIVE,
  })
  status!: Status;
}
