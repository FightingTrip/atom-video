/**
 * 视频模型模块
 *
 * 定义视频相关的数据模型和DTO接口
 * @module video/models/video
 */

import { Prisma } from '@prisma/client';

/**
 * 视频列表项DTO
 */
export interface VideoListItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
  likesCount: number;
  commentsCount: number;
  visibility: string;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  isLiked?: boolean;
  isSaved?: boolean;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
  programmingLanguage?: {
    id: string;
    name: string;
    iconUrl: string;
  };
  technologies: {
    id: string;
    name: string;
    slug: string;
    iconUrl: string;
  }[];
  difficulty: string;
  series?: {
    id: string;
    title: string;
  };
}

/**
 * 视频详情DTO
 */
export interface VideoDetail extends VideoListItem {
  videoUrl: string;
  watchProgress?: {
    currentTime: number;
    isCompleted: boolean;
    watchedAt: Date;
  };
  chapters: {
    id: string;
    title: string;
    startTime: number;
    endTime: number;
    order: number;
  }[];
  codeSnippets: {
    id: string;
    title: string;
    language: string;
    startTime: number;
    endTime: number;
  }[];
  resources: {
    id: string;
    title: string;
    resourceType: string;
    url: string;
  }[];
  contentAccuracy?: {
    isVerified: boolean;
    score: number;
    verifiedAt?: Date;
    verifiedBy?: string;
  };
  seriesData?: {
    series: {
      id: string;
      title: string;
      videosCount: number;
    };
    nextVideo?: {
      id: string;
      title: string;
      thumbnailUrl: string;
    };
  };
  similarVideos?: VideoListItem[];
}

/**
 * 视频搜索DTO
 */
export interface VideoSearchDto {
  query?: string;
  categories?: string[];
  tags?: string[];
  difficultyLevels?: string[];
  videoTypes?: string[];
  programmingLanguages?: string[];
  technologies?: string[];
  creatorId?: string;
  duration?: {
    min?: number;
    max?: number;
  };
  sortBy?: 'createdAt' | 'views' | 'likesCount' | 'trending';
  page?: number;
  pageSize?: number;
}

/**
 * 创建视频DTO
 */
export interface CreateVideoDto {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl: string;
  duration: number;
  visibility?: 'PUBLIC' | 'UNLISTED' | 'PRIVATE' | 'MEMBERS_ONLY';
  tags?: string[];
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  seriesId?: string;
  seriesOrder?: number;
  programmingLanguageId?: string;
  technologies?: string[];
  chapters?: {
    title: string;
    startTime: number;
    endTime: number;
    order: number;
  }[];
  resources?: {
    title: string;
    resourceType: string;
    url: string;
  }[];
}

/**
 * 更新视频DTO
 */
export interface UpdateVideoDto extends Partial<CreateVideoDto> {
  // 继承CreateVideoDto，但所有字段都是可选的
}

/**
 * 视频观看进度DTO
 */
export interface VideoProgressDto {
  currentTime: number;
  isCompleted?: boolean;
}

/**
 * 构建视频查询条件
 */
export function buildVideoWhereClause(params: VideoSearchDto): Prisma.VideoWhereInput {
  const where: Prisma.VideoWhereInput = {
    visibility: 'PUBLIC', // 默认只返回公开视频
  };

  // 关键词搜索
  if (params.query) {
    where.OR = [
      { title: { contains: params.query, mode: 'insensitive' } },
      { description: { contains: params.query, mode: 'insensitive' } },
    ];
  }

  // 筛选条件
  if (params.categories?.length) {
    where.categoryId = { in: params.categories };
  }

  if (params.tags?.length) {
    where.videoTags = {
      some: {
        tag: {
          name: { in: params.tags },
        },
      },
    };
  }

  if (params.difficultyLevels?.length) {
    where.difficulty = { in: params.difficultyLevels as any[] };
  }

  if (params.videoTypes?.length) {
    where.videoType = { in: params.videoTypes as any[] };
  }

  if (params.programmingLanguages?.length) {
    where.programmingLanguageId = { in: params.programmingLanguages };
  }

  if (params.technologies?.length) {
    where.videoTechnologies = {
      some: {
        technology: {
          id: { in: params.technologies },
        },
      },
    };
  }

  if (params.creatorId) {
    where.creatorId = params.creatorId;
  }

  // 视频时长范围
  if (params.duration) {
    if (params.duration.min !== undefined) {
      where.duration = { ...where.duration, gte: params.duration.min };
    }
    if (params.duration.max !== undefined) {
      where.duration = { ...where.duration, lte: params.duration.max };
    }
  }

  return where;
}
