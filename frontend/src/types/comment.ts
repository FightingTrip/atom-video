import type { Author } from './index';

/**
 * 用户类型
 */
export interface User {
  nickname: string;
  avatar: string;
}

/**
 * 评论类型
 */
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  // UI相关字段
  videoTitle: string;
  status?: string;
  user: User;
  // 可选字段，用于后端存储
  likes?: number;
  author?: Author;
  isLiked?: boolean;
  replyCount?: number;
  replies?: Reply[];
}

/**
 * 回复类型
 */
export interface Reply {
  id: string;
  content: string;
  likes: number;
  createdAt: string;
  author: Author;
  isLiked: boolean;
  parentId: string;
}

/**
 * 评论服务接口
 */
export interface CommentService {
  /**
   * 获取视频评论
   * @param videoId 视频ID
   * @param page 页码
   * @param limit 每页数量
   */
  getComments(
    videoId: string,
    page?: number,
    limit?: number
  ): Promise<{
    comments: Comment[];
    hasMore: boolean;
  }>;

  /**
   * 获取评论回复
   * @param commentId 评论ID
   * @param page 页码
   * @param limit 每页数量
   */
  getReplies(
    commentId: string,
    page?: number,
    limit?: number
  ): Promise<{
    replies: Reply[];
    hasMore: boolean;
  }>;

  /**
   * 发表评论
   * @param videoId 视频ID
   * @param content 评论内容
   */
  addComment(videoId: string, content: string): Promise<Comment>;

  /**
   * 回复评论
   * @param commentId 评论ID
   * @param content 回复内容
   */
  addReply(commentId: string, content: string): Promise<Reply>;

  /**
   * 点赞评论
   * @param commentId 评论ID
   */
  likeComment(commentId: string): Promise<boolean>;

  /**
   * 点赞回复
   * @param replyId 回复ID
   */
  likeReply(replyId: string): Promise<boolean>;
}
