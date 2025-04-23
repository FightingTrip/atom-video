/**
 * @file channel.ts
 * @description 频道相关的类型定义
 * @author Atom Video Team
 * @date 2025-04-08
 */

// 技术栈说明：
// - TypeScript: 强类型支持
// - Vue 3: 类型集成

import type { Video, VideoInfo } from './video';
import type { User } from './user';

/**
 * 频道完整信息
 */
export interface Channel {
  id: string;
  userId: string;
  name: string;
  handle: string;
  description: string;
  coverUrl: string;
  avatarUrl: string;
  subscriberCount: number;
  videoCount: number;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
  location?: string;
  verified?: boolean;
  socialLinks?: ChannelSocialLink[];
  customization?: ChannelCustomization;
  categories?: string[];
  playlists?: ChannelPlaylist[];
  isSubscribed?: boolean;
}

/**
 * 频道社交链接
 */
export interface ChannelSocialLink {
  platform: string;
  url: string;
}

/**
 * 频道自定义设置
 */
export interface ChannelCustomization {
  primaryColor?: string;
  layoutStyle?: 'grid' | 'list' | 'compact';
  featuredVideo?: string;
  featuredPlaylist?: string;
  showSubscriberCount?: boolean;
}

/**
 * 频道播放列表信息
 */
export interface ChannelPlaylist {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoCount: number;
  visibility: 'public' | 'private' | 'unlisted';
  createdAt: string;
  updatedAt: string;
}

/**
 * 频道视频信息
 */
export interface ChannelVideo extends VideoInfo {
  publishedAt: string;
  visibility: 'public' | 'private' | 'unlisted';
  status: 'published' | 'processing' | 'failed';
}

/**
 * 频道统计信息
 */
export interface ChannelStats {
  subscriberCount: number;
  videoCount: number;
  totalViews: number;
  subscriberGrowth: {
    day: number;
    week: number;
    month: number;
  };
  viewsGrowth: {
    day: number;
    week: number;
    month: number;
  };
}

/**
 * 频道订阅者
 */
export interface ChannelSubscriber {
  id: string;
  userId: string;
  channelId: string;
  subscribedAt: string;
  user: User;
}

/**
 * 频道查询参数
 */
export interface ChannelQueryParams {
  page?: number;
  limit?: number;
  sort?: 'name' | 'subscribers' | 'views' | 'videoCount' | 'createdAt';
  order?: 'asc' | 'desc';
  search?: string;
  categories?: string[];
}

/**
 * 频道视频查询参数
 */
export interface ChannelVideosQueryParams {
  channelId: string;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'popular' | 'views';
  search?: string;
  tags?: string[];
}

/**
 * 创建频道请求
 */
export interface CreateChannelRequest {
  name: string;
  handle: string;
  description?: string;
  coverFile?: File;
  avatarFile?: File;
  categories?: string[];
}

/**
 * 更新频道请求
 */
export interface UpdateChannelRequest {
  name?: string;
  handle?: string;
  description?: string;
  coverFile?: File;
  avatarFile?: File;
  location?: string;
  socialLinks?: ChannelSocialLink[];
  categories?: string[];
  customization?: ChannelCustomization;
}

/**
 * 频道播放列表创建请求
 */
export interface CreatePlaylistRequest {
  title: string;
  description?: string;
  visibility: 'public' | 'private' | 'unlisted';
  thumbnailFile?: File;
  videoIds?: string[];
}

/**
 * 频道列表响应
 */
export interface ChannelListResponse {
  channels: Channel[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * 频道视频列表响应
 */
export interface ChannelVideosResponse {
  videos: ChannelVideo[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * 频道播放列表响应
 */
export interface ChannelPlaylistsResponse {
  playlists: ChannelPlaylist[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
