/**
 * @file video.ts
 * @description 视频相关的类型定义
 * @author Atom Video Team
 * @date 2025-04-06
 */

// 技术栈说明：
// - TypeScript: 强类型支持
// - Vue 3: 类型集成

import type { User, Author, Video } from './index';
import type { Tag } from './tags';

// 视频状态
export enum VideoStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  PUBLISHED = 'published',
  PRIVATE = 'private',
  DELETED = 'deleted',
}

// 视频分类
export enum VideoCategory {
  ENTERTAINMENT = 'entertainment',
  EDUCATION = 'education',
  GAMING = 'gaming',
  MUSIC = 'music',
  SPORTS = 'sports',
  TECH = 'tech',
  OTHER = 'other',
}

// 视频信息
export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  views: number;
  likes: number;
  favorites: number;
  comments: number;
  status: VideoStatus;
  category: VideoCategory;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// 视频列表查询参数
export interface VideoQueryParams {
  page?: number;
  pageSize?: number;
  category?: VideoCategory;
  tags?: string[];
  userId?: string;
  status?: VideoStatus;
  sortBy?: 'views' | 'likes' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// 视频上传参数
export interface VideoUploadParams {
  title: string;
  description: string;
  category: VideoCategory;
  tags: string[];
  file: File;
  thumbnail?: File;
}

// 视频评论
export interface VideoComment {
  id: string;
  content: string;
  userId: string;
  videoId: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies: VideoComment[];
}

export interface VideoUploadResponse {
  id: string;
  uploadUrl: string;
  thumbnailUploadUrl: string;
}

export interface VideoStats {
  views: number;
  likes: number;
  favorites: number;
  comments: number;
  duration: number;
}

export interface VideoFilter {
  tags?: string[];
  userId?: string;
  status?: 'processing' | 'published' | 'failed';
  visibility?: 'public' | 'private' | 'unlisted';
  sortBy: 'views' | 'likes' | 'date';
  order: 'asc' | 'desc';
}

export interface VideoSearchResult {
  videos: VideoInfo[];
  total: number;
  page: number;
  pageSize: number;
}

export interface VideoPlayerConfig {
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  volume: number;
  quality: '1080p' | '720p' | '480p' | '360p';
  playbackRate: number;
  danmakuEnabled: boolean;
}

// 视频质量选项
export type VideoQuality = '1080p' | '720p' | '480p' | '360p';

// 视频来源
export interface VideoSource {
  quality: VideoQuality;
  url: string;
  type: string;
}

// 视频表单数据
export interface VideoFormData {
  title: string;
  description: string;
  tags: string[];
  visibility: 'public' | 'private' | 'unlisted';
  coverUrl?: string;
  videoUrl?: string;
}

// 视频播放记录
export interface VideoProgress {
  videoId: string;
  currentTime: number;
  duration: number;
  lastPlayedAt: string;
}

// 视频搜索参数
export interface VideoSearchParams {
  keyword?: string;
  tags?: string[];
  sort?: 'latest' | 'popular' | 'relevant';
  page?: number;
  limit?: number;
}

// 视频列表响应
export interface VideoListResponse {
  videos: VideoInfo[];
  total: number;
  hasMore: boolean;
}

// 视频评论响应
export interface VideoCommentsResponse {
  comments: Comment[];
  total: number;
  hasMore: boolean;
}

// 视频推荐响应
export interface VideoRecommendationsResponse {
  videos: VideoInfo[];
  hasMore: boolean;
}

// 导出其他类型
export * from './index';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface VideoService {
  getVideos(
    page: number,
    limit: number,
    tag?: string
  ): Promise<{
    videos: VideoInfo[];
    hasMore: boolean;
  }>;

  getVideoById(id: string): Promise<VideoInfo>;

  getVideosByUser(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<{
    videos: VideoInfo[];
    hasMore: boolean;
  }>;
}
