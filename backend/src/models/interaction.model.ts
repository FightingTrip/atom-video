import { Prisma, ReportReason, ReportStatus, NotificationType, ActivityType } from '@prisma/client';
import { SafeUser } from './user.model';

/**
 * 互动模型相关类型
 */

/**
 * 评论详情
 */
export interface CommentDetail {
  id: string;
  content: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
  };
  likeCount: number;
  isLiked?: boolean;
  replies?: CommentDetail[];
}

/**
 * 问答详情
 */
export interface QuestionDetail {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
    experienceLevel?: string;
  };
  isSolved: boolean;
  answers: AnswerDetail[];
  video: {
    id: string;
    title: string;
    thumbnailUrl: string;
  };
}

/**
 * 答案详情
 */
export interface AnswerDetail {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
    experienceLevel?: string;
  };
  isAccepted: boolean;
  voteCount: number;
  userVote?: 'upvote' | 'downvote' | null;
}

/**
 * 播放列表详情
 */
export interface PlaylistDetail {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
  };
  videos: {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
    order: number;
    creator: {
      id: string;
      username: string;
      name?: string;
    };
  }[];
  totalVideos: number;
  totalDuration: number;
}

/**
 * 通知详情
 */
export interface NotificationDetail {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedVideo?: {
    id: string;
    title: string;
    thumbnailUrl: string;
  };
  relatedUser?: {
    id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
  };
  relatedSeries?: {
    id: string;
    title: string;
  };
}

/**
 * 报告详情
 */
export interface ReportDetail {
  id: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
  reporter: {
    id: string;
    username: string;
  };
  moderator?: {
    id: string;
    username: string;
  };
  resolution?: string;
  video?: {
    id: string;
    title: string;
  };
  comment?: {
    id: string;
    content: string;
  };
  user?: {
    id: string;
    username: string;
  };
}

/**
 * 评论创建请求
 */
export interface CreateCommentDto {
  content: string;
  videoId: string;
  parentId?: string;
}

/**
 * 问题创建请求
 */
export interface CreateQuestionDto {
  title: string;
  content: string;
  videoId: string;
}

/**
 * 答案创建请求
 */
export interface CreateAnswerDto {
  content: string;
  questionId: string;
}

/**
 * 报告创建请求
 */
export interface CreateReportDto {
  reason: ReportReason;
  description?: string;
  videoId?: string;
  commentId?: string;
  userId?: string;
}

/**
 * 活动日志
 */
export interface ActivityLog {
  id: string;
  activityType: ActivityType;
  createdAt: Date;
  user: {
    id: string;
    username: string;
  };
  metadata: Record<string, any>;
}
