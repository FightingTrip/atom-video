// 技术栈说明：
// - TypeScript: 强类型支持
// - Vue 3: 类型集成

import { User } from './index';
import { Tag } from './tags';

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
  likes: number;
  dislikes: number;
  status: 'processing' | 'published' | 'failed';
  visibility: 'public' | 'private' | 'unlisted';
  tags: Tag[];
  user: User;
  createdAt: string;
  updatedAt: string;
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
  status?: Video['status'];
  visibility?: Video['visibility'];
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
