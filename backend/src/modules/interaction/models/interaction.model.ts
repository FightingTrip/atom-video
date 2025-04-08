/**
 * 互动模型模块
 *
 * 定义互动相关的数据模型和DTO接口
 * @module interaction/models/interaction
 */

/**
 * 点赞DTO
 */
export interface LikeDto {
  id: string;
  userId: string;
  videoId: string;
  createdAt: Date;
}

/**
 * 收藏DTO
 */
export interface SavedVideoDto {
  id: string;
  userId: string;
  videoId: string;
  createdAt: Date;
}

/**
 * 评论DTO
 */
export interface CommentDto {
  id: string;
  content: string;
  isEdited: boolean;
  authorId: string;
  author?: {
    id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
  videoId: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  isLiked?: boolean;  // 当前用户是否已点赞
  replies?: CommentDto[];
}

/**
 * 创建评论DTO
 */
export interface CreateCommentDto {
  content: string;
  videoId: string;
  parentId?: string;
}

/**
 * 更新评论DTO
 */
export interface UpdateCommentDto {
  content: string;
}

/**
 * 评论点赞DTO
 */
export interface CommentLikeDto {
  id: string;
  userId: string;
  commentId: string;
  createdAt: Date;
}

/**
 * 订阅DTO
 */
export interface SubscriptionDto {
  id: string;
  subscriberId: string;
  creatorId: string;
  creatorInfo?: {
    username: string;
    name?: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
  notificationsEnabled: boolean;
  createdAt: Date;
}

/**
 * 观看记录DTO
 */
export interface WatchHistoryDto {
  id: string;
  userId: string;
  videoId: string;
  video?: {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
    createdAt: Date;
    creator: {
      id: string;
      username: string;
      name?: string;
      avatarUrl?: string;
    };
  };
  lastWatchedAt: Date;
}

/**
 * 视频进度DTO
 */
export interface VideoProgressDto {
  id: string;
  userId: string;
  videoId: string;
  currentTime: number;
  isCompleted: boolean;
  completedAt?: Date;
  lastUpdated: Date;
}

/**
 * 更新视频进度DTO
 */
export interface UpdateVideoProgressDto {
  currentTime: number;
  isCompleted?: boolean;
}

/**
 * 历史记录查询DTO
 */
export interface HistoryQueryDto {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * 评论查询DTO
 */
export interface CommentQueryDto {
  videoId: string;
  parentId?: string;
  limit?: number;
  offset?: number;
  sort?: 'newest' | 'oldest' | 'popular';
} 