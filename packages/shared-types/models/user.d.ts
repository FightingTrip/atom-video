/**
 * 用户相关类型定义
 */
import { ExperienceLevel } from './common';

/**
 * 用户角色枚举
 */
export enum UserRole {
  ADMIN = 'ADMIN', // 管理员
  CREATOR = 'CREATOR', // 创作者
  USER = 'USER', // 注册用户
  GUEST = 'GUEST', // 游客（未登录）
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'ACTIVE', // 正常活跃
  PENDING = 'PENDING', // 待激活(邮箱验证)
  SUSPENDED = 'SUSPENDED', // 临时封禁
  BANNED = 'BANNED', // 永久封禁
  DELETED = 'DELETED', // 已删除
  INACTIVE = 'INACTIVE', // 长期不活跃
}

/**
 * 用户认证方式枚举
 */
export enum AuthProvider {
  LOCAL = 'LOCAL', // 邮箱密码
  GOOGLE = 'GOOGLE', // Google
  GITHUB = 'GITHUB', // GitHub
  FACEBOOK = 'FACEBOOK', // Facebook
  TWITTER = 'TWITTER', // Twitter
  LINKEDIN = 'LINKEDIN', // LinkedIn
}

/**
 * 用户基本信息接口
 */
export interface IUser {
  id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  emailVerified: boolean;
  authProvider: AuthProvider;
  lastLoginAt?: string;

  // 开发者特有属性
  githubProfile?: string;
  stackOverflowProfile?: string;
  personalWebsite?: string;
  company?: string;
  position?: string;
  experienceLevel?: ExperienceLevel;

  // 内容创作相关
  isCreator: boolean;
  creatorVerified: boolean;
  channelDescription?: string;
  channelBannerUrl?: string;

  // 隐私设置
  privacySettings: {
    showEmail: boolean;
    showActivities: boolean;
    showWatchHistory: boolean;
    allowMessages: boolean;
  };

  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
}

/**
 * 用户会话接口
 */
export interface IUserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  ipAddress: string;
  userAgent: string;
  deviceInfo: {
    type: string;
    name: string;
    os: string;
    browser: string;
  };
  isActive: boolean;
  createdAt: string;
  lastActivityAt: string;
}

/**
 * 用户角色变更历史
 */
export interface IUserRoleHistory {
  id: string;
  userId: string;
  previousRole: UserRole;
  newRole: UserRole;
  changedBy: string; // 管理员ID
  reason: string;
  createdAt: string;
}

/**
 * 用户编程语言关联
 */
export interface IUserProgrammingLanguage {
  id: string;
  userId: string;
  languageId: string;
  proficiencyLevel: number;
}

/**
 * 用户技术关联
 */
export interface IUserTechnology {
  id: string;
  userId: string;
  technologyId: string;
  proficiencyLevel: number;
}

/**
 * 用户保存的视频
 */
export interface ISavedVideo {
  id: string;
  userId: string;
  videoId: string;
  createdAt: string;
}

/**
 * 用户活动类型
 */
export enum ActivityType {
  VIDEO_WATCH = 'VIDEO_WATCH',
  VIDEO_COMPLETE = 'VIDEO_COMPLETE',
  SERIES_COMPLETE = 'SERIES_COMPLETE',
  COMMENT = 'COMMENT',
  LIKE = 'LIKE',
  SUBSCRIBE = 'SUBSCRIBE',
  CERTIFICATE_EARNED = 'CERTIFICATE_EARNED',
  ROLE_CHANGED = 'ROLE_CHANGED',
}

/**
 * 用户活动记录
 */
export interface IUserActivity {
  id: string;
  userId: string;
  activityType: ActivityType;
  metadata: Record<string, any>;
  createdAt: string;
}

/**
 * 用户搜索历史
 */
export interface ISearchHistory {
  id: string;
  userId: string;
  query: string;
  createdAt: string;
}

/**
 * 用户成就类型
 */
export enum AchievementType {
  FIRST_VIDEO = 'first_video',
  VIDEO_MILESTONE = 'video_milestone',
  SUBSCRIBER_MILESTONE = 'subscriber_milestone',
  VIEW_MILESTONE = 'view_milestone',
  STREAK = 'streak',
  SERIES_COMPLETION = 'series_completion',
}

/**
 * 用户成就
 */
export interface IAchievement {
  id: string;
  userId: string;
  type: AchievementType;
  title: string;
  description: string;
  iconUrl: string;
  progress: number;
  goal: number;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户学习进度
 */
export interface IUserLearningProgress {
  id: string;
  userId: string;
  pathId: string;
  currentStepId?: string;
  completedSteps: number;
  totalSteps: number;
  startedAt: string;
  lastActivityAt: string;
  completedAt?: string;
}

/**
 * 用户证书
 */
export interface ICertificate {
  id: string;
  userId: string;
  seriesId: string;
  issueDate: string;
  certificateUrl: string;
}

/**
 * 用户违规记录
 */
export interface IUserViolation {
  id: string;
  userId: string;
  type: 'WARNING' | 'STRIKE' | 'SUSPENSION' | 'BAN';
  reason: string;
  details: string;
  issuedBy: string; // 管理员ID
  issuedAt: string;
  expiresAt?: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

/**
 * 用户认证信息
 */
export interface IUserAuthentication {
  id: string;
  userId: string;
  provider: AuthProvider;
  providerId?: string; // 第三方提供商的用户ID
  providerData?: string; // JSON格式的第三方数据
  passwordHash?: string;
  passwordSalt?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  emailVerificationToken?: string;
  emailVerificationExpires?: string;
  createdAt: string;
  updatedAt: string;
}
