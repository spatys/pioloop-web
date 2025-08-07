export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  fieldErrors?: Record<string, string>;
  globalErrors?: string[];
}

export interface ApiErrorResponse {
  success: false;
  message?: string;
  fieldErrors?: Record<string, string>;
  globalErrors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} 