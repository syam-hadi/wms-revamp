import { PageResult } from 'src/common/models';

export class PageResultFactory {
  static create<T>(
    items: T[],
    page: number,
    limit: number,
    totalItems: number,
  ): PageResult<T> {
    return PageResult.of(items, page, limit, totalItems);
  }
}
