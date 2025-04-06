import { Prisma, Video, VideoType, VideoVisibility, DifficultyLevel } from '@prisma/client';
import { SafeUser } from './user.model';

/**
 * 视频模型相关类型
 */

/**
 * 视频创建输入
 */
export type VideoCreateInput = Prisma.VideoCreateInput;

/**
 * 视频更新输入
 */
export type VideoUpdateInput = Prisma.VideoUpdateInput;

/**
 * 视频详情（包含创作者信息）
 */
export interface VideoDetail extends Video {
  creator: SafeUser;
  chapters?: {
    id: string;
    title: string;
    startTime: number;
    endTime?: number;
    order: number;
  }[];
  tags?: {
    id: string;
    name: string;
    slug: string;
  }[];
  technologies?: {
    id: string;
    name: string;
    slug: string;
    iconUrl?: string;
  }[];
  programmingLanguage?: {
    id: string;
    name: string;
    iconUrl?: string;
  } | null;
  series?: {
    id: string;
    title: string;
    videosCount: number;
  } | null;
  nextVideo?: {
    id: string;
    title: string;
    thumbnailUrl: string;
  } | null;
  contentAccuracy?: {
    isUpToDate: boolean;
    lastVerifiedAt: Date;
    isDeprecated: boolean;
    deprecationNote?: string;
  } | null;
  codeSnippets?: {
    id: string;
    title: string;
    language: string;
    startTime?: number;
    endTime?: number;
  }[];
  resources?: {
    id: string;
    title: string;
    resourceType: string;
    url: string;
  }[];
  isLiked?: boolean;
  isSaved?: boolean;
  progress?: {
    currentTime: number;
    isCompleted: boolean;
    completedAt?: Date;
  } | null;
}

/**
 * 视频创建请求
 */
export interface CreateVideoDto {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl: string;
  duration: number;
  visibility: VideoVisibility;
  difficultyLevel: DifficultyLevel;
  videoType: VideoType;
  sourceCodeUrl?: string;
  liveDemo?: string;
  prerequisites?: string;
  learningOutcomes?: string;
  seriesId?: string;
  seriesOrder?: number;
  languageId?: string;
  tags?: string[];
  categoryIds?: string[];
}

/**
 * 视频更新请求
 */
export interface UpdateVideoDto {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  visibility?: VideoVisibility;
  difficultyLevel?: DifficultyLevel;
  videoType?: VideoType;
  sourceCodeUrl?: string;
  liveDemo?: string;
  prerequisites?: string;
  learningOutcomes?: string;
  seriesId?: string | null;
  seriesOrder?: number | null;
  languageId?: string | null;
  tags?: string[];
  categoryIds?: string[];
}

/**
 * 视频列表项
 */
export interface VideoListItem {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  duration: number;
  difficultyLevel: DifficultyLevel;
  videoType: VideoType;
  viewCount: number;
  likeCount: number;
  publishedAt: Date;
  creator: {
    id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
  };
  programmingLanguage?: {
    id: string;
    name: string;
    iconUrl?: string;
  } | null;
  technologies?: {
    id: string;
    name: string;
    iconUrl?: string;
  }[];
  series?: {
    id: string;
    title: string;
  } | null;
}

/**
 * 视频搜索请求
 */
export interface VideoSearchDto {
  query?: string;
  categories?: string[];
  tags?: string[];
  difficultyLevels?: DifficultyLevel[];
  videoTypes?: VideoType[];
  programmingLanguages?: string[];
  technologies?: string[];
  creatorId?: string;
  duration?: {
    min?: number;
    max?: number;
  };
  sortBy?: 'newest' | 'oldest' | 'popular' | 'trending' | 'rating';
  page?: number;
  pageSize?: number;
}

/**
 * 章节创建请求
 */
export interface CreateChapterDto {
  title: string;
  description?: string;
  startTime: number;
  endTime?: number;
  videoId: string;
  order: number;
}

/**
 * 视频进度更新请求
 */
export interface UpdateVideoProgressDto {
  videoId: string;
  currentTime: number;
  isCompleted?: boolean;
}

/**
 * 代码片段创建请求
 */
export interface CreateCodeSnippetDto {
  title: string;
  code: string;
  language: string;
  description?: string;
  startTime?: number;
  endTime?: number;
  videoId: string;
}
