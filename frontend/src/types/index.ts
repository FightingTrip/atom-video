// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  nickname: string;
  avatar: string;
  bio?: string;
  verified: boolean;
  subscribers?: number;
  subscribing?: number;
  totalViews?: number;
  joinedAt: string;
  role?: 'user' | 'creator' | 'admin';
  coverImage?: string;
  social?: {
    website?: string;
    github?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
  };
  preferences?: UserPreferences;
  notifications?: UserNotificationSettings;
  privacy?: UserPrivacySettings;
  isFollowed?: boolean;
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
  previewUrl?: string;
  author: {
    id: string;
    username: string;
    nickname: string;
    avatar: string;
    verified?: boolean;
  };
  tags: string[];
  sources: {
    url: string;
    type: string;
    size?: number;
    label?: string;
  }[];
  subtitles: {
    url: string;
    label: string;
    srclang: string;
    default?: boolean;
  }[];
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

/**
 * 视频互动状态接口
 */
export interface VideoInteraction {
  isLiked: boolean;
  isFavorited: boolean;
  isSubscribed: boolean;
}

/**
 * 视频章节类型
 */
export interface VideoChapter {
  id: string;
  title: string;
  time: number;
  duration: number;
}

/**
 * 视频片段类型
 */
export interface VideoClip {
  startTime: number;
  endTime: number;
  title?: string;
}

/**
 * 视频进度类型
 */
export interface VideoProgress {
  videoId: string;
  currentTime: number;
  duration: number;
  percentage: number;
  lastPlayedAt?: string;
}

// 添加用户设置相关类型定义
export interface UserPreferences {
  theme: 'system' | 'light' | 'dark';
  fontSize: number;
  language: string;
}

export interface UserNotificationSettings {
  likes: boolean;
  comments: boolean;
  replies: boolean;
  follows: boolean;
  videoProcessing: boolean;
  updates: boolean;
  emailNotification: boolean;
  browserNotification: boolean;
}

export interface UserPrivacySettings {
  showWatchHistory: boolean;
  showFavorites: boolean;
  showFollowing: boolean;
  showLikes: boolean;
  commentPermission: 'everyone' | 'followers' | 'following' | 'none';
}
