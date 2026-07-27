import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryContract } from 'src/common/contracts';

export class ConfigFilterContract extends BaseQueryContract {
  @ApiPropertyOptional({ description: 'Filter by config group' })
  configGroup?: string;
}
