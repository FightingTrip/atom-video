/**
 * 创作者模型模块
 *
 * 定义创作者相关的数据模型和DTO接口
 * @module creator/models/creator
 */

import { UserRole } from '../../common/middleware/auth.middleware';

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
  experienceDescription?: string; // 经验描述
  socialMediaLinks?: string[]; // 社交媒体链接
  creatorType?: CreatorType; // 创作者类型
  specializations?: string[]; // 专长领域
  programmingLanguages?: string[]; // 编程语言
  technologies?: string[]; // 技术栈
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
  creatorType?: CreatorType; // 创作者类型
  programmingLanguages?: string[]; // 编程语言
  technologies?: string[]; // 技术栈
  page?: number; // 页码
  pageSize?: number; // 每页数量
  sortBy?: 'createdAt' | 'updatedAt' | 'username'; // 排序字段
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
  specializations?: string[]; // 专长领域
  programmingLanguages?: string[]; // 编程语言
  technologies?: string[]; // 技术栈
  portfolioUrl?: string; // 作品集链接
  socialMediaLinks?: string[]; // 社交媒体链接
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
 */
export function buildCreatorApplicationWhereClause(params: CreatorQueryDto): any {
  const where: any = {};

  // 关键词搜索
  if (params.search) {
    where.OR = [
      {
        user: {
          OR: [
            { username: { contains: params.search, mode: 'insensitive' } },
            { name: { contains: params.search, mode: 'insensitive' } },
            { email: { contains: params.search, mode: 'insensitive' } },
          ],
        },
      },
      { motivation: { contains: params.search, mode: 'insensitive' } },
      { experienceDescription: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  // 状态筛选
  if (params.status) {
    where.status = params.status;
  }

  // 创作者类型筛选
  if (params.creatorType) {
    where.creatorType = params.creatorType;
  }

  // 编程语言筛选
  if (params.programmingLanguages && params.programmingLanguages.length > 0) {
    where.programmingLanguages = {
      hasSome: params.programmingLanguages,
    };
  }

  // 技术栈筛选
  if (params.technologies && params.technologies.length > 0) {
    where.technologies = {
      hasSome: params.technologies,
    };
  }

  return where;
} 