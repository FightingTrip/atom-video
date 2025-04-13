/**
 * 评论API类型定义
 */
import { PaginationParams, PaginationResult } from './index';

/**
 * 获取视频评论请求
 */
export interface GetVideoCommentsRequest extends PaginationParams {
  videoId: string;
  sort?: 'newest' | 'oldest' | 'popular';
}

/**
 * 评论作者信息
 */
export interface CommentAuthor {
  id: string;
  username: string;
  name?: string;
  avatarUrl?: string;
  isCreator: boolean;
}

/**
 * 评论项目
 */
export interface CommentItem {
  id: string;
  content: string;
  author: CommentAuthor;
  videoId: string;
  parentId?: string;
  likeCount: number;
  isLiked?: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: CommentItem[];
  replyCount: number;
}

/**
 * 获取视频评论响应
 */
export interface GetVideoCommentsResponse extends PaginationResult<CommentItem> {}

/**
 * 添加评论请求
 */
export interface AddCommentRequest {
  videoId: string;
  content: string;
  parentId?: string;
}

/**
 * 添加评论响应
 */
export interface AddCommentResponse {
  id: string;
  content: string;
  author: CommentAuthor;
  videoId: string;
  parentId?: string;
  likeCount: number;
  isLiked: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 删除评论请求
 */
export interface DeleteCommentRequest {
  commentId: string;
}

/**
 * 编辑评论请求
 */
export interface EditCommentRequest {
  commentId: string;
  content: string;
}

/**
 * 编辑评论响应
 */
export interface EditCommentResponse {
  id: string;
  content: string;
  isEdited: boolean;
  updatedAt: string;
}

/**
 * 点赞评论请求
 */
export interface LikeCommentRequest {
  commentId: string;
}

/**
 * 点赞评论响应
 */
export interface LikeCommentResponse {
  commentId: string;
  likeCount: number;
  isLiked: boolean;
}

/**
 * 获取评论回复请求
 */
export interface GetCommentRepliesRequest extends PaginationParams {
  commentId: string;
  sort?: 'newest' | 'oldest' | 'popular';
}

/**
 * 获取评论回复响应
 */
export interface GetCommentRepliesResponse extends PaginationResult<CommentItem> {}

/**
 * 评论举报请求
 */
export interface ReportCommentRequest {
  commentId: string;
  reason: string;
  description?: string;
}
