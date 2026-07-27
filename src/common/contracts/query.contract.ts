import { SortOrder } from '../enums';

export class QueryContract {
  page = 1;
  limit = 20;
  search?: string;
  sortBy?: string;
  sortOrder: SortOrder = SortOrder.ASC;
}
