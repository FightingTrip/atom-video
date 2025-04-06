import { Prisma, User, UserRole, ExperienceLevel } from '@prisma/client';

/**
 * 用户模型相关类型
 */

/**
 * 用户创建输入
 */
export type UserCreateInput = Prisma.UserCreateInput;

/**
 * 用户更新输入
 */
export type UserUpdateInput = Prisma.UserUpdateInput;

/**
 * 安全的用户信息（不包含密码等敏感字段）
 */
export type SafeUser = Omit<User, 'password' | 'refreshToken'>;

/**
 * 用户配置文件（包含更多详细信息）
 */
export interface UserProfile extends SafeUser {
  programmingLanguages?: {
    id: string;
    name: string;
    proficiencyLevel: number;
  }[];
  technologies?: {
    id: string;
    name: string;
    category: string;
    proficiencyLevel: number;
  }[];
  subscriptionCount?: number;
  videoCount?: number;
  isSubscribed?: boolean;
}

/**
 * 创作者简介
 */
export interface CreatorProfile extends SafeUser {
  subscriberCount: number;
  videoCount: number;
  totalViews: number;
  featuredVideos?: {
    id: string;
    title: string;
    thumbnailUrl: string;
    viewCount: number;
  }[];
  latestVideos?: {
    id: string;
    title: string;
    thumbnailUrl: string;
    publishedAt: Date;
  }[];
}

/**
 * 用户注册请求
 */
export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
  name?: string;
  isCreator?: boolean;
}

/**
 * 用户登录请求
 */
export interface LoginUserDto {
  email: string;
  password: string;
}

/**
 * 用户认证响应
 */
export interface AuthResponse {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

/**
 * 用户信息更新请求
 */
export interface UpdateUserDto {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  githubProfile?: string;
  stackOverflowProfile?: string;
  personalWebsite?: string;
  company?: string;
  position?: string;
  experienceLevel?: ExperienceLevel;
  channelDescription?: string;
  channelBannerUrl?: string;
}
