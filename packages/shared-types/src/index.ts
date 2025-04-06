// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'user',
  CREATOR = 'creator',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

// 视频相关类型
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  status: VideoStatus;
  visibility: VideoVisibility;
  views: number;
  likes: number;
  comments: number;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  userId: string;
  user?: User;
}

export enum VideoStatus {
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed'
}

export enum VideoVisibility {
  PUBLIC = 'public',
  UNLISTED = 'unlisted',
  PRIVATE = 'private'
}

// 标签相关类型
export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// 交互相关类型
export interface Comment {
  id: string;
  content: string;
  likes: number;
  userId: string;
  user?: User;
  videoId: string;
  video?: Video;
  parentId?: string;
  parent?: Comment;
  replies?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoLike {
  id: string;
  userId: string;
  videoId: string;
  createdAt: Date;
}

export interface CommentLike {
  id: string;
  userId: string;
  commentId: string;
  createdAt: Date;
}

export interface SavedVideo {
  id: string;
  userId: string;
  videoId: string;
  createdAt: Date;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode: number;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
} 