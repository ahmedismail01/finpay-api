export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  path: string;
  timestamp: string;
}

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
