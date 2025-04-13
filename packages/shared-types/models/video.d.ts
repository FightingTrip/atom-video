/**
 * 视频相关类型定义
 */
import { DifficultyLevel, ContentResourceType } from './common';
import { IContentAccuracy, IContentVersion } from './content';

/**
 * 视频可见性枚举
 */
export enum VideoVisibility {
  PUBLIC = 'PUBLIC',
  UNLISTED = 'UNLISTED',
  PRIVATE = 'PRIVATE',
  MEMBERS_ONLY = 'MEMBERS_ONLY',
}

/**
 * 视频类型枚举
 */
export enum VideoType {
  TUTORIAL = 'TUTORIAL',
  CODE_REVIEW = 'CODE_REVIEW',
  LIVE_CODING = 'LIVE_CODING',
  TECH_TALK = 'TECH_TALK',
  INTERVIEW = 'INTERVIEW',
  COURSE_MATERIAL = 'COURSE_MATERIAL',
  CONFERENCE_TALK = 'CONFERENCE_TALK',
  PRODUCT_DEMO = 'PRODUCT_DEMO',
}

/**
 * 视频基本信息接口
 */
export interface IVideo {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  visibility: VideoVisibility;

  // 开发者特有属性
  difficultyLevel: DifficultyLevel;
  sourceCodeUrl?: string;
  liveDemo?: string;

  // 视频类型
  videoType: VideoType;

  // 内容元数据
  prerequisites?: string;
  learningOutcomes?: string;

  // 统计数据
  viewCount: number;
  likeCount: number;
  commentCount: number;

  // 关联
  creatorId: string;
  seriesId?: string;
  seriesOrder?: number;
  languageId?: string;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/**
 * 视频章节
 */
export interface IChapter {
  id: string;
  title: string;
  description?: string;
  startTime: number;
  endTime?: number;
  videoId: string;
  order: number;
}

/**
 * 视频系列
 */
export interface ISeries {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  difficultyLevel: DifficultyLevel;
  isComplete: boolean;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 视频播放历史
 */
export interface IWatchHistory {
  id: string;
  userId: string;
  videoId: string;
  lastWatchedAt: string;
}

/**
 * 视频观看进度
 */
export interface IVideoProgress {
  id: string;
  userId: string;
  videoId: string;
  currentTime: number;
  isCompleted: boolean;
  completedAt?: string;
  lastUpdated: string;
}

/**
 * 视频点赞
 */
export interface ILike {
  id: string;
  videoId: string;
  userId: string;
  createdAt: string;
}

/**
 * 视频代码片段
 */
export interface ICodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string;
  startTime?: number;
  endTime?: number;
  videoId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 视频相关资源
 */
export interface IResource {
  id: string;
  title: string;
  description?: string;
  resourceType: ContentResourceType;
  url: string;
  videoId: string;
  createdAt: string;
  updatedAt: string;
}
