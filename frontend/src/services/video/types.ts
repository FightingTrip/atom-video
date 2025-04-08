import { QueryParams } from '@/services/api/types';
import { Video, VideoCategory } from '@/models/Video';

export interface VideoUploadRequest {
  title: string;
  description: string;
  category: VideoCategory | string;
  tags: string[];
  videoFile: File;
  thumbnailFile?: File;
  isPublished?: boolean;
}

export interface VideoUpdateRequest {
  title?: string;
  description?: string;
  category?: VideoCategory | string;
  tags?: string[];
  thumbnailFile?: File;
  isPublished?: boolean;
}

export interface VideoQueryParams extends QueryParams {
  category?: string;
  tag?: string;
  userId?: string;
  trending?: boolean;
  featured?: boolean;
}

/**
 * 视频评论接口
 */
export interface VideoComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies: number;
  isLiked?: boolean;
  author: {
    id: string;
    nickname: string;
    avatar: string;
    verified: boolean;
  };
  // 评论的回复
  children?: VideoComment[];
}

/**
 * 视频互动状态接口
 */
export interface VideoInteraction {
  isLiked: boolean;
  isDisliked: boolean;
  isFavorited: boolean;
  isSubscribed: boolean;
  isReported: boolean;
}

/**
 * 视频源接口
 */
export interface VideoSource {
  url: string;
  type: string;
  size: number;
  label: string;
  default?: boolean;
}

/**
 * 视频字幕接口
 */
export interface VideoSubtitle {
  url: string;
  label: string;
  srclang: string;
  default?: boolean;
}
