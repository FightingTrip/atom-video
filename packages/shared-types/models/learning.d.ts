/**
 * 学习路径相关类型定义
 */
import { DifficultyLevel } from './common';

/**
 * 学习路径接口
 */
export interface ILearningPath {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  difficultyLevel: DifficultyLevel;
  estimatedHours: number;
  creatorId: string;
  isPublished: boolean;
  isFeatured: boolean;
  prerequisites?: string;
  learningOutcomes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 学习路径步骤接口
 */
export interface ILearningPathStep {
  id: string;
  pathId: string;
  title: string;
  description?: string;
  videoId?: string;
  seriesId?: string;
  externalResourceUrl?: string;
  order: number;
  isOptional: boolean;
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
}
