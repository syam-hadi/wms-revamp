import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryContract } from 'src/common/contracts/base-query.contract';

export class CommodityFilterContract extends BaseQueryContract {
  @ApiProperty({
    description: 'Filter by hazardous status',
    example: false,
    required: false,
  })
  isHazardous?: boolean;
}
