export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  items: T;
  meta: PaginationMeta;
}

export function createPaginatedResponse<T>(
  items: T,
  total: number,
  page: number = 1,
  limit: number = 10,
): PaginatedResponse<T> {
  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      offset: (page - 1) * limit,
    },
  };
}
