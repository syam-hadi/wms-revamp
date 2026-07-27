import { ApiProperty } from '@nestjs/swagger';

export class PageResult<T> {
  public readonly items: T[];

  @ApiProperty()
  public readonly page: number;

  @ApiProperty()
  public readonly limit: number;

  @ApiProperty()
  public readonly totalItems: number;

  @ApiProperty()
  public readonly totalPages: number;

  @ApiProperty()
  public readonly hasPreviousPage: boolean;

  @ApiProperty()
  public readonly hasNextPage: boolean;

  private constructor(
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
