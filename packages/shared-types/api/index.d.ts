// API 响应类型定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 分页响应
export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API 错误类型
export interface ApiError {
  code: number;
  message: string;
  details?: Record<string, any>;
}

// 导出更多API类型
export * from './video';
export * from './user';
export * from './comment';
