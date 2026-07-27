import { ApiPropertyOptional } from '@nestjs/swagger';
import { OptionType, Status } from 'src/common/enums';

export class UpdateConfigContract {
  @ApiPropertyOptional({ description: 'The name of the config' })
  name?: string;

  @ApiPropertyOptional({ description: 'The description of the config' })
  description?: string;

  @ApiPropertyOptional({ enum: OptionType, description: 'The type of option' })
  optionType?: OptionType;

  @ApiPropertyOptional({
    enum: Status,
    description: 'The status of the config',
  })
  status?: Status;
}
