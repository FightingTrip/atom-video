/**
 * 用户模型模块
 *
 * 定义用户相关的数据模型和DTO接口
 * @module user/models/user
 */

import { UserRole } from '../../common/middleware/auth.middleware';
import { Prisma } from '@prisma/client';

/**
 * 用户基本信息DTO
 */
export interface UserBasicInfo {
  id: string;
  username: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  isVerified: boolean;
  isCreator: boolean;
  githubUrl?: string;
  websiteUrl?: string;
  createdAt: Date;
}

/**
 * 用户详情DTO
 */
export interface UserDetail extends UserBasicInfo {
  channelDescription?: string;
  channelBannerUrl?: string;
  location?: string;
  experienceLevel?: string;
  company?: string;
  followers: number;
  following: number;
  videosCount: number;
  seriesCount: number;
  favoriteTechnologies?: {
    id: string;
    name: string;
    iconUrl?: string;
  }[];
  programmingLanguages?: {
    id: string;
    name: string;
    iconUrl?: string;
  }[];
}

/**
 * 创建用户DTO
 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  role?: UserRole;
  isVerified?: boolean;
  isCreator?: boolean;
  githubUrl?: string;
  websiteUrl?: string;
}

/**
 * 更新用户DTO
 */
export interface UpdateUserDto {
  name?: string;
  avatarUrl?: string;
  bio?: string;
  role?: UserRole;
  isVerified?: boolean;
  isCreator?: boolean;
  githubUrl?: string;
  websiteUrl?: string;
  channelDescription?: string;
  channelBannerUrl?: string;
  location?: string;
  experienceLevel?: string;
  company?: string;
  favoriteTechnologies?: string[];
  programmingLanguages?: string[];
}

/**
 * 更新密码DTO
 */
export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 用户查询DTO
 */
export interface UserQueryDto {
  search?: string;
  role?: UserRole;
  isVerified?: boolean;
  isCreator?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'username' | 'createdAt' | 'videosCount' | 'followers';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 构建用户查询条件
 * @param params 用户查询参数
 * @returns Prisma用户查询条件
 */
export function buildUserWhereClause(params: UserQueryDto): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  // 关键词搜索
  if (params.search) {
    where.OR = [
      { username: { contains: params.search, mode: 'insensitive' } },
      { name: { contains: params.search, mode: 'insensitive' } },
      { email: { contains: params.search, mode: 'insensitive' } },
      { bio: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  // 按角色筛选
  if (params.role) {
    where.role = params.role;
  }

  // 按验证状态筛选
  if (params.isVerified !== undefined) {
    where.isVerified = params.isVerified;
  }

  // 按创作者状态筛选
  if (params.isCreator !== undefined) {
    where.isCreator = params.isCreator;
  }

  return where;
}
