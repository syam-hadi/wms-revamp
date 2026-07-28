import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { BaseQueryContract } from 'src/common/contracts/base-query.contract';

export class RateFilterContract extends OmitType(BaseQueryContract, [
  'status',
] as const) {
  @ApiPropertyOptional({
    description: 'Filter by currency code (UUID)',
    format: 'uuid',
  })
  currencyCode?: string;
}
