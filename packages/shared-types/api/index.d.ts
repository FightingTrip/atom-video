/**
 * API响应基础类型
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * 分页结果
 */
export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * API错误
 */
export interface ApiError {
  code: number;
  message: string;
  details?: Record<string, any>;
}

/**
 * 导出所有API模块类型
 */
export * from './video';
export * from './user';
export * from './interaction';
