import { DifficultyLevel, VideoType, VideoVisibility } from '../models';

/**
 * 视频API请求/响应类型定义
 */

export interface VideoCreateRequest {
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

export interface VideoUpdateRequest {
  id: string;
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
  seriesId?: string;
  seriesOrder?: number;
  languageId?: string;
  tags?: string[];
  categoryIds?: string[];
}

export interface VideoSearchRequest {
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

export interface ChapterCreateRequest {
  title: string;
  description?: string;
  startTime: number;
  endTime?: number;
  videoId: string;
  order: number;
}

export interface ChapterUpdateRequest {
  id: string;
  title?: string;
  description?: string;
  startTime?: number;
  endTime?: number;
  order?: number;
}

export interface VideoProgressUpdateRequest {
  videoId: string;
  currentTime: number;
  isCompleted?: boolean;
}

export interface ResourceCreateRequest {
  title: string;
  description?: string;
  resourceType: string;
  url: string;
  videoId: string;
}

export interface CodeSnippetCreateRequest {
  title: string;
  code: string;
  language: string;
  description?: string;
  startTime?: number;
  endTime?: number;
  videoId: string;
}

export interface SeriesCreateRequest {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  difficultyLevel: DifficultyLevel;
  isComplete?: boolean;
  videos?: {
    id: string;
    order: number;
  }[];
}

export interface SeriesUpdateRequest {
  id: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  difficultyLevel?: DifficultyLevel;
  isComplete?: boolean;
}

export interface ReportVideoRequest {
  videoId: string;
  reason: string;
  description?: string;
}

export interface ContentAccuracyUpdateRequest {
  videoId: string;
  isUpToDate: boolean;
  versionInfo?: string;
  isDeprecated?: boolean;
  deprecationNote?: string;
}

export interface QuestionCreateRequest {
  title: string;
  content: string;
  videoId: string;
}

export interface AnswerCreateRequest {
  content: string;
  questionId: string;
}

export interface AnswerVoteRequest {
  answerId: string;
  isUpvote: boolean;
}
