import { ApiProperty, OmitType } from '@nestjs/swagger';
import { BaseQueryContract } from 'src/common/contracts/base-query.contract';

export class CommodityFilterContract extends OmitType(BaseQueryContract, [
  'status',
] as const) {
  @ApiProperty({
    description: 'Filter by hazardous status',
    example: false,
    required: false,
  })
  isHazardous?: boolean;
}
