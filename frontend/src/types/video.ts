// 技术栈说明：
// - TypeScript: 强类型支持
// - Vue 3: 类型集成

import type { User } from './index';
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
  totalViews: number;
  totalLikes: number;
  totalDislikes: number;
  commentsCount: number;
  sharesCount: number;
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
  controls: boolean;
  loop: boolean;
  muted: boolean;
  playbackRate: number;
  volume: number;
  quality: 'auto' | '1080p' | '720p' | '480p' | '360p';
  subtitles: boolean;
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
