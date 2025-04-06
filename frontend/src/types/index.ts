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
  isFollowed?: boolean;
  social?: {
    website?: string;
    github?: string;
    twitter?: string;
  };
}

// 视频相关类型
export interface Video {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  favorites: number;
  comments: number;
  createdAt: string;
  author: Author;
  tags: string[];
  sources: Array<{
    url: string;
    type: string;
    size: number;
    label: string;
  }>;
  subtitles: Array<{
    url: string;
    label: string;
    srclang: string;
    default: boolean;
  }>;
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

// 作者相关类型
export interface Author {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  description?: string;
  verified: boolean;
  followersCount?: number;
  followingCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface VideoResponse {
  videos: Video[];
  total: number;
  hasMore: boolean;
}

// 弹幕相关类型
export interface Danmaku {
  id: string;
  content: string;
  time: number;
  color: string;
  type: 'top' | 'bottom' | 'scroll';
  userId: string;
}

// 导出其他类型
export * from './video';
export * from './tags';
export * from './comment';

export interface TrendingItem {
  id: string;
  title: string;
  views: number;
  likes: number;
  author: {
    id: string;
    nickname: string;
    avatar: string;
  };
}

export interface Category {
  id: string;
  name: string;
}
