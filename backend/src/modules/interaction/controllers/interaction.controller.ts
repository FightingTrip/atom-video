/**
 * 互动控制器模块
 *
 * 处理互动相关的HTTP请求
 * @module interaction/controllers/interaction
 */

import { Request, Response, NextFunction } from 'express';
import { InteractionService } from '../services/interaction.service';
import { ApiResponse } from '../../common/utils/api-response';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import { AppError, ValidationError } from '../../common/utils/app-error';
import {
  CreateCommentDto,
  UpdateCommentDto,
  CommentQueryDto,
  UpdateVideoProgressDto,
  HistoryQueryDto,
} from '../models/interaction.model';
import { UserRole } from '../../common/middleware/auth.middleware';

/**
 * 互动控制器类
 */
export class InteractionController {
  private interactionService: InteractionService;

  constructor() {
    this.interactionService = new InteractionService();
  }

  /**
   * 创建评论
   */
  async createComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('用户未认证', 401);
      }

      const userId = req.user.id;
      const dto: CreateCommentDto = {
        ...req.body,
        userId,
      };

      if (!dto.content || dto.content.trim() === '') {
        throw new ValidationError('评论内容不能为空');
      }

      const comment = await this.interactionService.createComment(userId, dto);
      ApiResponse.created(res, comment, '评论创建成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取视频评论
   */
  async getVideoComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const videoId = req.params.videoId;
      const queryDto: CommentQueryDto = {
        videoId,
        parentId: req.query.parentId as string,
        sort: req.query.sort as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const { comments, total } = await this.interactionService.getVideoComments(queryDto);
      ApiResponse.paginated(
        res,
        comments,
        total,
        Math.floor((queryDto.offset || 0) / (queryDto.limit || 20)) + 1,
        queryDto.limit || 20
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新评论
   */
  async updateComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('用户未认证', 401);
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
      next(error);
    }
  }

  /**
   * 删除评论
   */
  async deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('用户未认证', 401);
      }

      const userId = req.user.id;
      const { commentId } = req.params;
      const isAdmin = req.user.role === UserRole.ADMIN;

      await this.interactionService.deleteComment(commentId, userId, isAdmin);
      ApiResponse.success(res, null, '评论删除成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 点赞评论
   */
  async likeComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('用户未认证', 401);
      }

      const userId = req.user.id;
      const { commentId } = req.params;

      const result = await this.interactionService.likeComment(userId, commentId);
      ApiResponse.success(res, result, '点赞评论成功');
    } catch (error) {
      next(error);
    }
  }

  /**
   * 取消点赞评论
   */
  async unlikeComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('用户未认证', 401);
      }

      const userId = req.user.id;
      const { commentId } = req.params;

      const result = await this.interactionService.unlikeComment(userId, commentId);
      ApiResponse.success(res, result, '取消点赞评论成功');
    } catch (error) {
      next(error);
    }
  }
}
