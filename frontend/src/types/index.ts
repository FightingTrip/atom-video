import type { User, AuthResponse, ApiResponse } from '@/types';
import { faker } from '@faker-js/faker';
import { zh_CN } from '@faker-js/faker/locale/zh_CN';
import type { Channel, Playlist } from '@/types';

// 设置中文语言
faker.setDefaultLocale(zh_CN);

// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  nickname: string;
  avatar: string;
  bio: string;
  verified: boolean;
  subscribers: number;
  subscribing: number;
  totalViews: number;
  joinedAt: string;
  social: {
    website?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
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
  dislikes: number;
  createdAt: string;
  tags: string[];
  user: {
    id: string;
    nickname: string;
    avatar: string;
    verified: boolean;
  };
}

// 频道相关类型
export interface Channel {
  id: string;
  userId: string;
  name: string;
  description: string;
  banner: string;
  playlists: Playlist[];
}

// 播放列表类型
export interface Playlist {
  id: string;
  name: string;
  description: string;
  videoCount: number;
  visibility: 'public' | 'private' | 'unlisted';
  createdAt: string;
  updatedAt: string;
}

// 通知类型
export interface Notification {
  id: string;
  userId: string;
  type: 'video_upload' | 'comment' | 'reply' | 'like' | 'subscribe' | 'mention';
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  relatedUserId?: string;
  relatedVideoId?: string;
}

// 评论类型
export interface Comment {
  id: string;
  videoId: string;
  content: string;
  likes: number;
  createdAt: string;
  user: {
    id: string;
    nickname: string;
    avatar: string;
    verified: boolean;
  };
  replies?: Comment[];
}

// 标签相关类型
export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
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

// 视频服务类型
export interface VideoService {
  getVideos(
    page: number,
    limit: number,
    tag?: string
  ): Promise<{
    videos: Video[];
    hasMore: boolean;
  }>;
  getVideoById(id: string): Promise<Video>;
  getVideosByUser(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<{
    videos: Video[];
    hasMore: boolean;
  }>;
}
