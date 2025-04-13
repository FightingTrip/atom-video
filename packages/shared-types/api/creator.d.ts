/**
 * 创作者API请求/响应类型定义
 */
import { PaginationParams } from './index';
import { VideoVisibility } from '../models';

/**
 * 创作者统计数据响应
 */
export interface CreatorStatsResponse {
  views: {
    value: number;
    trend: number;
  };
  subscribers: {
    value: number;
    trend: number;
  };
  likes: {
    value: number;
    trend: number;
  };
  comments: {
    value: number;
    trend: number;
  };
  watchTime: {
    value: number;
    trend: number;
  };
  videos: {
    value: number;
    recentCount: number;
  };
}

/**
 * 创作者频道信息响应
 */
export interface CreatorChannelResponse {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  avatarUrl: string;
  themeColor: string;
  subscriberCount: number;
  totalViews: number;
  verified: boolean;
  createdAt: string;
}

/**
 * 创作者视频请求参数
 */
export interface CreatorVideosRequest extends PaginationParams {
  status?: 'published' | 'drafts' | 'scheduled';
  sort?: 'latest' | 'popular' | 'oldest';
}

/**
 * 创作者视频列表响应
 */
export interface CreatorVideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  visibility: VideoVisibility;
  publishedAt?: string;
  createdAt: string;
}

/**
 * 创作者最近评论响应
 */
export interface CreatorCommentItem {
  id: string;
  content: string;
  createdAt: string;
  status: string;
  video: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    nickname: string;
    avatar: string;
  };
}

/**
 * 频道设置请求
 */
export interface ChannelSettingsRequest {
  name: string;
  description: string;
  themeColor: string;
  avatar?: string | File;
  banner?: string | File;
}

/**
 * 频道设置响应
 */
export interface ChannelSettingsResponse {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  avatarUrl: string;
  themeColor: string;
  updatedAt: string;
}

/**
 * 视频品牌设置请求
 */
export interface BrandingSettingsRequest {
  watermark: {
    image: string;
    position: string;
    opacity: number;
    size: number;
  };
  intro: {
    video: string;
    autoAdd: boolean;
    transition: string;
  };
  outro: {
    video: string;
    autoAdd: boolean;
    transition: string;
    addSubscribeButton: boolean;
  };
  theme: {
    color: string;
  };
}

/**
 * 视频品牌设置响应
 */
export interface BrandingSettingsResponse {
  watermark: {
    url: string;
    position: string;
    opacity: number;
    size: number;
  };
  intro: {
    url: string;
    autoAdd: boolean;
    transition: string;
  };
  outro: {
    url: string;
    autoAdd: boolean;
    transition: string;
    addSubscribeButton: boolean;
  };
  theme: {
    color: string;
  };
  updatedAt: string;
}

/**
 * 视频分析请求参数
 */
export interface VideoAnalyticsRequest {
  videoId: string;
  period?: '7d' | '30d' | '90d' | '365d';
}

/**
 * 视频分析响应数据
 */
export interface VideoAnalyticsResponse {
  overview: {
    views: number;
    watchTime: number;
    avgWatchDuration: number;
    likes: number;
    comments: number;
    shares: number;
  };
  trends: {
    dates: string[];
    views: number[];
    watchTime: number[];
  };
  demographics: {
    age: Array<{ group: string; percentage: number }>;
    devices: Array<{ type: string; percentage: number }>;
  };
  retention: {
    points: Array<{ second: number; percentage: number }>;
  };
}
