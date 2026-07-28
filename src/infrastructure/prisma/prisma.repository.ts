import { BaseQueryContract } from 'src/common/contracts';
import { PageResult } from 'src/common/models';

export abstract class PrismaRepository {
  protected buildActiveWhere<T extends Record<string, any>>(
    where?: T,
  ): T & { deletedAt: null } {
    return {
      ...(where || {}),
      deletedAt: null,
    } as T & { deletedAt: null };
  }

  protected buildSoftDeleteData(deletedBy: string) {
    return {
      deletedAt: new Date(),
      deletedBy,
    };
  }
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
