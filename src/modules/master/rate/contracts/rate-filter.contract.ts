import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryContract } from 'src/common/contracts/base-query.contract';

export class RateFilterContract extends BaseQueryContract {
  @ApiPropertyOptional({
    description: 'Filter by currency code (UUID)',
    format: 'uuid',
  })
  currencyCode?: string;
}
