// 技术栈说明：
// - TypeScript: 强类型支持
// - Vue 3: 类型集成

import type { User, Author } from './index';
import type { Tag } from './tags';

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
  videos: Video[];
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

export interface VideoComment {
  id: string;
  content: string;
  user: User;
  likes: number;
  dislikes: number;
  replies: VideoComment[];
  createdAt: string;
  updatedAt: string;
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
  videos: Video[];
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
  videos: Video[];
  hasMore: boolean;
}

// 导出其他类型
export * from './index';
