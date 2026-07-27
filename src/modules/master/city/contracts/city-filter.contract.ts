import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { BaseQueryContract } from 'src/common/contracts';

export class CityFilterContract extends OmitType(BaseQueryContract, [
  'status',
] as const) {
  @ApiPropertyOptional({ description: 'Filter by province id' })
  provinceId?: string;
}
