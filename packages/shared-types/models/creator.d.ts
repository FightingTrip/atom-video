/**
 * 创作者相关类型定义
 * 简化版本，保留基本功能
 */
import { DeviceType } from './common';

/**
 * 创作者收益类型枚举
 */
export enum RevenueType {
  DONATION = 'donation',
  SPONSORSHIP = 'sponsorship',
  AFFILIATE = 'affiliate',
}

/**
 * 创作者资料接口
 */
export interface ICreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  profileImage: string;
  coverImage?: string;
  contactEmail?: string;
  socialLinks: {
    website?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  topicTags: string[];
  expertiseTags: string[];
  location?: string;
  isVerified: boolean;
  customUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创作者申请接口
 */
export interface ICreatorApplication {
  id: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  experience: string;
  sampleWorks: string[];
  expertise: string[];
  motivation: string;
  reviewedBy?: string;
  reviewNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  updatedAt: string;
}

/**
 * 创作者收益接口
 */
export interface ICreatorRevenue {
  id: string;
  creatorId: string;
  amount: number;
  currency: string;
  type: RevenueType;
  description?: string;
  sourceId?: string;
  userId?: string;
  transactionDate: string;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
}

/**
 * 分析指标枚举
 */
export enum AnalyticsMetric {
  VIEWS = 'views',
  WATCH_TIME = 'watchTime',
  LIKES = 'likes',
  COMMENTS = 'comments',
  SUBSCRIBERS = 'subscribers',
}

/**
 * 分析周期枚举
 */
export enum AnalyticsPeriod {
  DAY_7 = '7d',
  DAY_30 = '30d',
  DAY_90 = '90d',
}

/**
 * 分析数据点接口
 */
export interface IAnalyticsDataPoint {
  id: string;
  videoId?: string;
  creatorId: string;
  date: string;
  metric: AnalyticsMetric;
  value: number;
  deviceType?: DeviceType;
  countryCode?: string;
  referrerType?: string;
}

/**
 * 创作者品牌设置接口
 */
export interface ICreatorBranding {
  id: string;
  creatorId: string;
  watermarkImage?: string;
  watermarkPosition?: 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT';
  watermarkOpacity?: number;
  introVideo?: string;
  outroVideo?: string;
  themeColor?: string;
  channelTrailer?: string;
  featuredVideoId?: string;
  updatedAt: string;
}
