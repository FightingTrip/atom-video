/**
 * 创作者模型模块
 *
 * 定义创作者相关的数据模型和DTO接口
 * @module creator/models/creator
 */

import { UserRole } from '../../common/middleware/auth.middleware';
import { Prisma } from '@prisma/client';

/**
 * 创作者申请状态枚举
 */
export enum CreatorApplicationStatus {
  PENDING = 'PENDING', // 待审核
  APPROVED = 'APPROVED', // 已批准
  REJECTED = 'REJECTED', // 已拒绝
}

/**
 * 创作者类型枚举
 */
export enum CreatorType {
  INDIVIDUAL = 'INDIVIDUAL', // 个人创作者
  TEAM = 'TEAM', // 团队创作者
  ORGANIZATION = 'ORGANIZATION', // 组织创作者
}

/**
 * 创作者申请DTO
 */
export interface CreatorApplicationDto {
  userId: string;
  motivation: string; // 申请动机
  portfolioUrl?: string; // 作品集链接
  experienceDescription: string; // 经验描述
  socialMediaLinks?: string[]; // 社交媒体链接
  creatorType: string; // 创作者类型
  specializations: string[]; // 专长领域
  programmingLanguages: string[]; // 编程语言
  technologies: string[]; // 技术栈
}

/**
 * 创作者申请详情DTO
 */
export interface CreatorApplicationDetailDto extends CreatorApplicationDto {
  id: string;
  status: CreatorApplicationStatus;
  reviewerId?: string; // 审核人ID
  reviewerComment?: string; // 审核意见
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date; // 审核时间
}

/**
 * 创作者查询参数DTO
 */
export interface CreatorQueryDto {
  search?: string; // 搜索关键词
  status?: CreatorApplicationStatus; // 申请状态
  creatorType?: string; // 创作者类型
  programmingLanguages?: string[]; // 编程语言
  technologies?: string[]; // 技术栈
  page?: number; // 页码
  pageSize?: number; // 每页数量
  sortBy?: string; // 排序字段
  sortOrder?: 'asc' | 'desc'; // 排序方向
}

/**
 * 审核创作者申请DTO
 */
export interface ReviewCreatorApplicationDto {
  status: CreatorApplicationStatus;
  reviewerComment?: string;
}

/**
 * 更新创作者资料DTO
 */
export interface UpdateCreatorProfileDto {
  channelDescription?: string; // 频道描述
  channelBannerUrl?: string; // 频道横幅URL
  programmingLanguages?: string[]; // 编程语言
  technologies?: string[]; // 技术栈
}

/**
 * 创作者统计数据DTO
 */
export interface CreatorStatsDto {
  totalVideos: number; // 视频总数
  totalViews: number; // 观看总数
  totalLikes: number; // 点赞总数
  totalSubscribers: number; // 订阅者总数
  totalComments: number; // 评论总数
  averageVideoRating: number; // 平均视频评分
}

/**
 * 构建创作者申请查询条件
 * @param filters 过滤条件
 * @returns Prisma查询条件
 */
export function buildCreatorApplicationWhereClause(filters: Partial<CreatorQueryDto>): Prisma.CreatorApplicationWhereInput {
  const where: Prisma.CreatorApplicationWhereInput = {};

  if (filters.search) {
    where.OR = [
      { user: { username: { contains: filters.search, mode: 'insensitive' } } },
      { user: { name: { contains: filters.search, mode: 'insensitive' } } },
      { motivation: { contains: filters.search, mode: 'insensitive' } },
      { experienceDescription: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.creatorType) {
    where.creatorType = filters.creatorType;
  }

  if (filters.programmingLanguages?.length) {
    where.programmingLanguages = {
      hasSome: filters.programmingLanguages,
    };
  }

  if (filters.technologies?.length) {
    where.technologies = {
      hasSome: filters.technologies,
    };
  }

  return where;
} 