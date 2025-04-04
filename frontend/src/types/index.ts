// 用户相关类型
export interface User {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  bio?: string;
  github?: string;
  website?: string;
  location?: string;
  createdAt: string;
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
  tags: Tag[];
  user: User;
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
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 主题相关类型
export type ThemeMode = 'light' | 'dark' | 'system';

// 语言相关类型
export type Language = 'zh-CN' | 'en-US';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
