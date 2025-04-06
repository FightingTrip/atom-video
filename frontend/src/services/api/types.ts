// 通用 API 响应格式
export interface ApiResponse<T> {
  data: T;
  message: string;
  code: string;
  success: boolean;
}

// 分页数据
export interface PaginatedData<T> {
  items: T[];
  pagination: Pagination;
}

// 分页信息
export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// 分页请求参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 搜索过滤参数
export interface FilterParams {
  keyword?: string;
  [key: string]: any;
}

// 合并分页和过滤参数
export type QueryParams = PaginationParams & FilterParams;

// API 错误类
export class ApiError extends Error {
  public status: number;
  public code: string;
  public data: any;

  constructor(message: string, status: number, code: string = '', data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}
