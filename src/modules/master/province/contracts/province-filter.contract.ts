import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { BaseQueryContract } from 'src/common/contracts';

export class ProvinceFilterContract extends OmitType(BaseQueryContract, [
  'status',
] as const) {
  @ApiPropertyOptional({ description: 'Filter by country id' })
  countryId?: string;
}
