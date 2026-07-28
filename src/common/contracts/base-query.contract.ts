import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder, Status } from '../enums';

export class BaseQueryContract {
  @ApiPropertyOptional({
    description: 'Page number',
    default: 1,
    type: 'integer',
    format: 'int32',
    minimum: 1,
  })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 20,
    type: 'integer',
    format: 'int32',
    minimum: 1,
  })
  limit: number = 20;

  @ApiPropertyOptional({ description: 'Global text search' })
  search?: string;

  @ApiPropertyOptional({ description: 'Field to sort by' })
  sortBy?: string;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  sortOrder: SortOrder = SortOrder.ASC;

  @ApiPropertyOptional({ enum: Status, description: 'Filter by status' })
  status?: Status;
}
