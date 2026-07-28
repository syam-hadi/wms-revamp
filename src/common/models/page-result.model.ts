import { ApiProperty } from '@nestjs/swagger';

export class PageResult<T> {
  public readonly items: T[];

  @ApiProperty({ type: 'integer', format: 'int32' })
  public readonly page: number;

  @ApiProperty({ type: 'integer', format: 'int32' })
  public readonly limit: number;

  @ApiProperty({ type: 'integer', format: 'int32' })
  public readonly totalItems: number;

  @ApiProperty({ type: 'integer', format: 'int32' })
  public readonly totalPages: number;

  @ApiProperty()
  public readonly hasPreviousPage: boolean;

  @ApiProperty()
  public readonly hasNextPage: boolean;

  constructor(
    items: T[],
    page: number,
    limit: number,
    totalItems: number,
    totalPages: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean,
  ) {
    this.items = items;
    this.page = page;
    this.limit = limit;
    this.totalItems = totalItems;
    this.totalPages = totalPages;
    this.hasPreviousPage = hasPreviousPage;
    this.hasNextPage = hasNextPage;
  }

  static of<T>(
    items: T[],
    page: number,
    limit: number,
    totalItems: number,
  ): PageResult<T> {
    const totalPages = Math.ceil(totalItems / limit);

    return new PageResult(
      items,
      page,
      limit,
      totalItems,
      totalPages,
      page > 1,
      page < totalPages,
    );
  }

  static empty<T>(page = 1, limit = 10): PageResult<T> {
    return new PageResult([], page, limit, 0, 0, false, false);
  }
}
