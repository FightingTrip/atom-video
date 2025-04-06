import { Prisma, Series, DifficultyLevel } from '@prisma/client';
import { SafeUser } from './user.model';

/**
 * 系列模型相关类型
 */

/**
 * 系列创建输入
 */
export type SeriesCreateInput = Prisma.SeriesCreateInput;

/**
 * 系列更新输入
 */
export type SeriesUpdateInput = Prisma.SeriesUpdateInput;

/**
 * 系列详情
 */
export interface SeriesDetail extends Series {
  creator: SafeUser;
  videos: {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
    order: number;
    viewCount: number;
  }[];
  programmingLanguages?: {
    id: string;
    name: string;
    iconUrl?: string;
  }[];
  technologies?: {
    id: string;
    name: string;
    iconUrl?: string;
  }[];
  totalDuration: number;
  totalVideos: number;
  completedVideos?: number;
  isCertified?: boolean;
}

/**
 * 系列列表项
 */
export interface SeriesListItem {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  difficultyLevel: DifficultyLevel;
  isComplete: boolean;
  creator: {
    id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
  };
  totalVideos: number;
  totalDuration: number;
  completedPercentage?: number;
}

/**
 * 系列创建请求
 */
export interface CreateSeriesDto {
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

/**
 * 系列更新请求
 */
export interface UpdateSeriesDto {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  difficultyLevel?: DifficultyLevel;
  isComplete?: boolean;
}

/**
 * 系列添加视频请求
 */
export interface AddVideoToSeriesDto {
  videoId: string;
  order: number;
}

/**
 * 系列完成状态
 */
export interface SeriesCompletionStatus {
  seriesId: string;
  totalVideos: number;
  completedVideos: number;
  isCompleted: boolean;
}

/**
 * 证书信息
 */
export interface CertificateInfo {
  id: string;
  seriesId: string;
  seriesTitle: string;
  issueDate: Date;
  certificateUrl: string;
  creator: {
    id: string;
    username: string;
    name?: string;
  };
}
