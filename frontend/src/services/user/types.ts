import { User } from '@/types';

// 用户查询参数
export interface UserQueryParams {
  query?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 更新用户资料请求
export interface UpdateUserProfileRequest {
  nickname?: string;
  bio?: string;
  avatar?: string | File;
  coverImage?: string | File;
  social?: {
    youtube?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
    [key: string]: string | undefined;
  };
}

// 用户偏好设置
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  autoplay?: boolean;
  quality?: 'auto' | '240p' | '360p' | '480p' | '720p' | '1080p' | '2k' | '4k';
  notifications?: {
    email?: boolean;
    push?: boolean;
    comments?: boolean;
    likes?: boolean;
    subscriptions?: boolean;
    mentions?: boolean;
  };
  privacy?: {
    showSubscriptions?: boolean;
    showHistory?: boolean;
    showLikedVideos?: boolean;
  };
}

// 用户统计数据
export interface UserStats {
  videoCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  followersCount: number;
  followingCount: number;
  viewsByMonth: number[];
  subscribersByMonth: number[];
  topVideos: {
    id: string;
    title: string;
    views: number;
    likes: number;
    coverUrl: string;
  }[];
}

// 观看历史记录
export interface WatchHistory {
  videoId: string;
  title: string;
  coverUrl: string;
  author: {
    id: string;
    nickname: string;
    avatar: string;
  };
  watchedAt: string;
  progress: number;
  duration: number;
}

// 用户视频
export interface UserVideo {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  duration: number;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  status: 'published' | 'private' | 'processing' | 'failed';
}

// 用户活动记录
export interface UserActivity {
  id: string;
  type: 'video_upload' | 'comment' | 'like' | 'subscribe' | 'follow';
  content: string;
  target: any; // 视频或用户对象
  date: string;
}

// 分页数据结构
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 用户通知
export interface UserNotification {
  id: string;
  type: 'comment' | 'like' | 'subscription' | 'mention' | 'system';
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    nickname: string;
    avatar: string;
  };
  target?: {
    id: string;
    type: 'video' | 'comment' | 'channel';
    title?: string;
    coverUrl?: string;
  };
}
