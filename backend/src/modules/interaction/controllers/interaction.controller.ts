/**
 * 互动控制器模块
 *
 * 处理互动相关的HTTP请求
 * @module interaction/controllers/interaction
 */

import { Request, Response } from 'express';
import { InteractionService } from '../services/interaction.service';
import { ApiResponse } from '../../common/utils/api-response';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import { ValidationError } from '../../common/utils/app-error';
import { 
  CreateCommentDto, 
  UpdateCommentDto, 
  CommentQueryDto,
  UpdateVideoProgressDto,
  HistoryQueryDto 
} from '../models/interaction.model';
import { UserRole } from '../../common/middleware/auth.middleware';

interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

/**
 * 互动控制器类
 */
export class InteractionController {
  private interactionService: InteractionService;

  constructor() {
    this.interactionService = new InteractionService();
  }

  // ======================== 点赞相关 ========================
  
  /**
   * 点赞视频
   */
  async likeVideo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.unauthorized(res, '用户未认证');
        return;
      }
      
      const userId = req.user.id;
      const videoId = req.params.videoId;
      
      const like = await this.interactionService.likeVideo(userId, videoId);
      ApiResponse.success(res, like, '点赞成功');
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '点赞失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }

  /**
   * 取消点赞视频
   */
  async unlikeVideo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.unauthorized(res, '用户未认证');
        return;
      }
      
      const userId = req.user.id;
      const videoId = req.params.videoId;
      
      await this.interactionService.unlikeVideo(userId, videoId);
      ApiResponse.success(res, null, '取消点赞成功');
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '取消点赞失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }

  /**
   * 获取用户点赞的视频列表
   */
  async getLikedVideos(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.unauthorized(res, '用户未认证');
        return;
      }
      
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const { items, total } = await this.interactionService.getLikedVideos(userId, limit, offset);
      
      ApiResponse.paginated(
        res, 
        items, 
        total, 
        Math.floor(offset / limit) + 1, 
        limit
      );
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '获取点赞视频失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }

  /**
   * 检查用户是否已点赞视频
   */
  async hasLikedVideo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.unauthorized(res, '用户未认证');
        return;
      }
      
      const userId = req.user.id;
      const videoId = req.params.videoId;
      
      const hasLiked = await this.interactionService.hasLikedVideo(userId, videoId);
      ApiResponse.success(res, { hasLiked });
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '检查点赞状态失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }

  // ======================== 评论相关 ========================
  
  /**
   * 创建评论
   */
  async createComment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.unauthorized(res, '用户未认证');
        return;
      }
      
      const userId = req.user.id;
      const dto: CreateCommentDto = {
        ...req.body,
        userId
      };
      
      if (!dto.content || dto.content.trim() === '') {
        throw new ValidationError('评论内容不能为空');
      }
      
      const comment = await this.interactionService.createComment(userId, dto);
      ApiResponse.created(res, comment, '评论创建成功');
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '创建评论失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }

  /**
   * 获取视频评论
   */
  async getVideoComments(req: Request, res: Response): Promise<void> {
    try {
      const { videoId } = req.params;
      const queryDto: CommentQueryDto = {
        videoId,
        parentId: req.query.parentId as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
        sort: req.query.sort as 'newest' | 'oldest' | 'popular' || 'newest'
      };
      
      // 当前用户ID（可选）
      const userId = (req as AuthenticatedRequest).user?.id;
      
      const { comments, total } = await this.interactionService.getVideoComments(queryDto, userId);
      
      ApiResponse.paginated(
        res, 
        comments, 
        total, 
        Math.floor(queryDto.offset || 0 / (queryDto.limit || 20)) + 1, 
        queryDto.limit || 20
      );
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '获取评论失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }

  /**
   * 更新评论
   */
  async updateComment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.unauthorized(res, '用户未认证');
        return;
      }
      
      const userId = req.user.id;
      const { commentId } = req.params;
      const dto: UpdateCommentDto = req.body;
      
      if (!dto.content || dto.content.trim() === '') {
        throw new ValidationError('评论内容不能为空');
      }
      
      const comment = await this.interactionService.updateComment(commentId, userId, dto);
      ApiResponse.success(res, comment, '评论更新成功');
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '更新评论失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }

  /**
   * 删除评论
   */
  async deleteComment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.unauthorized(res, '用户未认证');
        return;
      }
      
      const userId = req.user.id;
      const { commentId } = req.params;
      const isAdmin = req.user.role === UserRole.ADMIN || req.user.role === UserRole.MODERATOR;
      
      await this.interactionService.deleteComment(commentId, userId, isAdmin);
      ApiResponse.success(res, null, '评论删除成功');
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '删除评论失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }

  /**
   * 点赞评论
   */
  async likeComment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.unauthorized(res, '用户未认证');
        return;
      }
      
      const userId = req.user.id;
      const { commentId } = req.params;
      
      const result = await this.interactionService.likeComment(userId, commentId);
      ApiResponse.success(res, result, '点赞评论成功');
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '点赞评论失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }

  /**
   * 取消点赞评论
   */
  async unlikeComment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.unauthorized(res, '用户未认证');
        return;
      }
      
      const userId = req.user.id;
      const { commentId } = req.params;
      
      const result = await this.interactionService.unlikeComment(userId, commentId);
      ApiResponse.success(res, result, '取消点赞评论成功');
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '取消点赞评论失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }

  // ======================== 收藏相关 ========================
  
  /**
   * 收藏视频
   */
  async saveVideo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.unauthorized(res, '用户未认证');
        return;
      }
      
      const userId = req.user.id;
      const videoId = req.params.videoId;
      
      const saved = await this.interactionService.saveVideo(userId, videoId);
      ApiResponse.success(res, saved, '收藏视频成功');
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '收藏视频失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }

  /**
   * 取消收藏视频
   */
  async unsaveVideo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.unauthorized(res, '用户未认证');
        return;
      }
      
      const userId = req.user.id;
      const videoId = req.params.videoId;
      
      const result = await this.interactionService.unsaveVideo(userId, videoId);
      ApiResponse.success(res, result, '取消收藏成功');
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '取消收藏失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }

  /**
   * 获取用户收藏的视频列表
   */
  async getSavedVideos(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.unauthorized(res, '用户未认证');
        return;
      }
      
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const { items, total } = await this.interactionService.getSavedVideos(userId, limit, offset);
      
      ApiResponse.paginated(
        res, 
        items, 
        total, 
        Math.floor(offset / limit) + 1, 
        limit
      );
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '获取收藏视频失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }

  /**
   * 检查用户是否已收藏视频
   */
  async hasSavedVideo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.unauthorized(res, '用户未认证');
        return;
      }
      
      const userId = req.user.id;
      const videoId = req.params.videoId;
      
      const hasSaved = await this.interactionService.hasSavedVideo(userId, videoId);
      ApiResponse.success(res, { hasSaved });
    } catch (error) {
      const appError = error as AppError;
      ApiResponse.error(
        res,
        appError.message || '检查收藏状态失败',
        appError.statusCode || 500,
        appError.details
      );
    }
  }
} 