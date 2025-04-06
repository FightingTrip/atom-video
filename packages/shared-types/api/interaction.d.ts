/**
 * 互动相关API请求/响应类型定义
 */

export interface CommentCreateRequest {
  content: string;
  videoId: string;
  parentId?: string;
}

export interface CommentUpdateRequest {
  id: string;
  content: string;
}

export interface CommentLikeRequest {
  commentId: string;
}

export interface VideoLikeRequest {
  videoId: string;
}

export interface SaveVideoRequest {
  videoId: string;
}

export interface ReportContentRequest {
  reason: string;
  description?: string;
  videoId?: string;
  commentId?: string;
  userId?: string;
}

export interface NotificationFetchRequest {
  isRead?: boolean;
  limit?: number;
  offset?: number;
}

export interface SearchRequest {
  query: string;
  filters?: {
    contentType?: ('video' | 'series' | 'creator' | 'tag' | 'language' | 'technology')[];
    difficultyLevel?: string[];
    videoType?: string[];
    duration?: {
      min?: number;
      max?: number;
    };
    dateRange?: {
      from?: string;
      to?: string;
    };
  };
  page?: number;
  pageSize?: number;
}

export interface WatchProgressUpdateRequest {
  videoId: string;
  currentTime: number;
  isCompleted?: boolean;
}

export interface QuestionVoteRequest {
  questionId: string;
  isUpvote: boolean;
}

export interface MarkQuestionSolvedRequest {
  questionId: string;
  answerId: string;
}

export interface SubscriptionNotificationToggleRequest {
  subscriptionId: string;
  notificationsEnabled: boolean;
}
