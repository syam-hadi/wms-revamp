import { BaseQueryContract } from 'src/common/contracts';
import { PageResult } from 'src/common/models';

export abstract class PrismaRepository {
  protected paginate(query: BaseQueryContract) {
    return {
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    };
  }

  protected pageResult<T>(
    items: T[],
    query: BaseQueryContract,
    totalItems: number,
  ): PageResult<T> {
    return PageResult.of(items, query.page, query.limit, totalItems);
  }
}
