/**
 * 互动相关类型定义
 * 简化版本，保留基本功能
 */

/**
 * 评论接口
 */
export interface IComment {
  id: string;
  content: string;
  isEdited: boolean;
  authorId: string;
  videoId: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 评论点赞
 */
export interface ICommentLike {
  id: string;
  commentId: string;
  userId: string;
  createdAt: string;
}

/**
 * 视频订阅
 */
export interface ISubscription {
  id: string;
  subscriberId: string;
  creatorId: string;
  notificationsEnabled: boolean;
  createdAt: string;
}

/**
 * 通知类型枚举
 */
export enum NotificationType {
  NEW_VIDEO = 'NEW_VIDEO',
  COMMENT_REPLY = 'COMMENT_REPLY',
  SUBSCRIPTION = 'SUBSCRIPTION',
  ACHIEVEMENT = 'ACHIEVEMENT',
}

/**
 * 通知接口
 */
export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  relatedVideoId?: string;
  relatedUserId?: string;
  createdAt: string;
}

/**
 * 推荐原因枚举
 */
export enum RecommendationReason {
  WATCH_HISTORY = 'WATCH_HISTORY',
  TECHNOLOGY_INTEREST = 'TECHNOLOGY_INTEREST',
  POPULAR = 'POPULAR',
  TRENDING = 'TRENDING',
}

/**
 * 内容推荐接口
 */
export interface IRecommendation {
  id: string;
  userId: string;
  videoId: string;
  reason: RecommendationReason;
  isClicked: boolean;
  createdAt: string;
}

/**
 * 举报原因枚举
 */
export enum ReportReason {
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  OUTDATED_CONTENT = 'OUTDATED_CONTENT',
  COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION',
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
}

/**
 * 举报状态枚举
 */
export enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

/**
 * 内容举报接口
 */
export interface IReport {
  id: string;
  reporterId: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  videoId?: string;
  commentId?: string;
  userId?: string;
  moderatorId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 问题接口
 */
export interface IQuestion {
  id: string;
  title: string;
  content: string;
  videoId: string;
  authorId: string;
  isSolved: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 回答接口
 */
export interface IAnswer {
  id: string;
  content: string;
  questionId: string;
  authorId: string;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}
