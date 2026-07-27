import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OptionType, Status } from 'src/common/enums';

export class CreateConfigContract {
  @ApiProperty({ description: 'The unique code for the config' })
  code!: string;

  @ApiProperty({ description: 'The name of the config' })
  name!: string;

  @ApiPropertyOptional({ description: 'The description of the config' })
  description?: string;

  @ApiProperty({ description: 'The group this config belongs to' })
  configGroup!: string;

  @ApiProperty({ enum: OptionType, description: 'The type of option' })
  optionType!: OptionType;

  @ApiProperty({ enum: Status, description: 'The status of the config' })
  status!: Status;
}
