// 用户相关类型
export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// 视频相关类型
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  category?: string;
  tags?: string[];
  visibility: 'public' | 'private' | 'unlisted';
}

// 标签相关类型
export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}

// 评论相关类型
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  replies?: Comment[];
}

// 分页相关类型
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// 主题相关类型
export type ThemeMode = 'light' | 'dark' | 'system';

// 语言相关类型
export type Language = 'zh-CN' | 'en-US';

// 认证相关类型
export interface AuthResponse {
  token: string;
  user: User;
}

// API 错误类型
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// 导出其他类型
export * from './video';
export * from './tags';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
