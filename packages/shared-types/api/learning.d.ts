/**
 * 学习相关API类型定义
 */
import { PaginationParams, PaginationResult } from './index';
import { DifficultyLevel } from '../models';

/**
 * 学习路径项目
 */
export interface LearningPathItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  difficultyLevel: DifficultyLevel;
  estimatedHours: number;
  stepCount: number;
  enrolledCount: number;
  completionRate: number;
  creator: {
    id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
  };
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 获取学习路径列表请求
 */
export interface GetLearningPathsRequest extends PaginationParams {
  difficulty?: DifficultyLevel;
  query?: string;
  sort?: 'newest' | 'popular' | 'recommended';
}

/**
 * 获取学习路径列表响应
 */
export interface GetLearningPathsResponse extends PaginationResult<LearningPathItem> {}

/**
 * 学习路径步骤类型
 */
export enum LearningPathStepType {
  VIDEO = 'video',
  SERIES = 'series',
  EXTERNAL_RESOURCE = 'external_resource',
  QUIZ = 'quiz',
  PRACTICE = 'practice',
}

/**
 * 学习路径步骤项目
 */
export interface LearningPathStepItem {
  id: string;
  pathId: string;
  title: string;
  description?: string;
  type: LearningPathStepType;
  videoId?: string;
  seriesId?: string;
  externalResourceUrl?: string;
  order: number;
  isOptional: boolean;
  estimatedMinutes: number;
  isCompleted?: boolean;
  completedAt?: string;
  videoThumbnail?: string;
  seriesThumbnail?: string;
}

/**
 * 获取学习路径详情响应
 */
export interface GetLearningPathDetailResponse {
  path: LearningPathItem;
  steps: LearningPathStepItem[];
  userProgress?: {
    isEnrolled: boolean;
    currentStepId?: string;
    completedSteps: number;
    totalSteps: number;
    progressPercentage: number;
    startedAt?: string;
    lastActivityAt?: string;
    completedAt?: string;
  };
}

/**
 * 创建学习路径请求
 */
export interface CreateLearningPathRequest {
  title: string;
  description: string;
  thumbnailUrl?: string;
  difficultyLevel: DifficultyLevel;
  estimatedHours: number;
  prerequisites?: string;
  learningOutcomes?: string;
  isPublished?: boolean;
}

/**
 * 更新学习路径请求
 */
export interface UpdateLearningPathRequest {
  id: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  difficultyLevel?: DifficultyLevel;
  estimatedHours?: number;
  prerequisites?: string;
  learningOutcomes?: string;
  isPublished?: boolean;
}

/**
 * 添加学习路径步骤请求
 */
export interface AddLearningPathStepRequest {
  pathId: string;
  title: string;
  description?: string;
  type: LearningPathStepType;
  videoId?: string;
  seriesId?: string;
  externalResourceUrl?: string;
  order?: number;
  isOptional?: boolean;
  estimatedMinutes: number;
}

/**
 * 更新学习路径步骤顺序请求
 */
export interface UpdateStepOrderRequest {
  pathId: string;
  stepOrders: Array<{
    stepId: string;
    order: number;
  }>;
}

/**
 * 注册学习路径请求
 */
export interface EnrollLearningPathRequest {
  pathId: string;
}

/**
 * 更新学习进度请求
 */
export interface UpdateLearningProgressRequest {
  pathId: string;
  stepId: string;
  isCompleted: boolean;
}

/**
 * 推荐学习路径响应
 */
export interface RecommendedLearningPathsResponse {
  forBeginners: LearningPathItem[];
  popular: LearningPathItem[];
  trending: LearningPathItem[];
  basedOnHistory: LearningPathItem[];
}
