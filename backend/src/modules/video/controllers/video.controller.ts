/**
 * 视频控制器模块
 *
 * 处理视频相关的HTTP请求和响应
 * @module video/controllers/video
 */

import { Request, Response, NextFunction } from 'express';
import { VideoService } from '../services/video.service';
import { ApiResponse } from '../../common/utils/api-response';
import { VideoSearchDto, CreateVideoDto, UpdateVideoDto } from '../models/video.model';
import { AppError } from '../../common/utils/app-error';
import { removeNullUndefined } from '../../common/utils/helpers';
import { ValidationError } from '../../common/utils/validation-error';
import { AuthenticatedRequest } from '../../common/types/authenticated-request';

/**
 * 视频控制器
 * 处理视频相关的HTTP请求
 */
export class VideoController {
  private videoService: VideoService;

  /**
   * 构造函数
   * 初始化视频服务
   */
  constructor() {
    this.videoService = new VideoService();
  }

  /**
   * 获取视频详情
   * @param req Express请求对象
   * @param res Express响应对象
   */
  getVideoById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const video = await this.videoService.getVideoById(id, userId);
      return ApiResponse.success(res, video, '视频详情获取成功');
    } catch (error) {
      if (error instanceof AppError) {
        return ApiResponse.error(res, error.message, error.statusCode, error.details);
      }
      return ApiResponse.error(res, '获取视频详情失败');
    }
  };

  /**
   * 获取视频列表
   * @param req Express请求对象
   * @param res Express响应对象
   */
  getVideos = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      // 从查询参数构建搜索条件
      const searchParams: VideoSearchDto = {
        query: req.query.query as string,
        categories: req.query.categories ? (req.query.categories as string).split(',') : undefined,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        difficultyLevels: req.query.difficultyLevels
          ? ((req.query.difficultyLevels as string).split(',') as any[])
          : undefined,
        videoTypes: req.query.videoTypes
          ? ((req.query.videoTypes as string).split(',') as any[])
          : undefined,
        programmingLanguages: req.query.programmingLanguages
          ? (req.query.programmingLanguages as string).split(',')
          : undefined,
        technologies: req.query.technologies
          ? (req.query.technologies as string).split(',')
          : undefined,
        creatorId: req.query.creatorId as string,
        duration:
          req.query.minDuration || req.query.maxDuration
            ? {
                min: req.query.minDuration
                  ? parseInt(req.query.minDuration as string, 10)
                  : undefined,
                max: req.query.maxDuration
                  ? parseInt(req.query.maxDuration as string, 10)
                  : undefined,
              }
            : undefined,
        sortBy: req.query.sortBy as any,
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
      };

      // 移除空值
      const cleanedParams = removeNullUndefined(searchParams);

      // 获取视频列表
      const { items, total } = await this.videoService.getVideos(cleanedParams, userId);

      // 返回分页响应
      return ApiResponse.paginated(
        res,
        items,
        total,
        cleanedParams.page || 1,
        cleanedParams.pageSize || 10,
        '视频列表获取成功'
      );
    } catch (error) {
      if (error instanceof AppError) {
        return ApiResponse.error(res, error.message, error.statusCode, error.details);
      }
      return ApiResponse.error(res, '获取视频列表失败');
    }
  };

  /**
   * 创建视频
   * @param req Express请求对象
   * @param res Express响应对象
   */
  createVideo = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ApiResponse.unauthorized(res, '需要登录才能创建视频');
      }

      const videoData: CreateVideoDto = req.body;
      const video = await this.videoService.createVideo(videoData, userId);

      return ApiResponse.created(res, video, '视频创建成功');
    } catch (error) {
      if (error instanceof AppError) {
        return ApiResponse.error(res, error.message, error.statusCode, error.details);
      }
      return ApiResponse.error(res, '创建视频失败');
    }
  };

  /**
   * 更新视频
   * @param req Express请求对象
   * @param res Express响应对象
   */
  updateVideo = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return ApiResponse.unauthorized(res, '需要登录才能更新视频');
      }

      const videoData: UpdateVideoDto = req.body;
      const video = await this.videoService.updateVideo(id, videoData, userId);

      return ApiResponse.success(res, video, '视频更新成功');
    } catch (error) {
      if (error instanceof AppError) {
        return ApiResponse.error(res, error.message, error.statusCode, error.details);
      }
      return ApiResponse.error(res, '更新视频失败');
    }
  };

  /**
   * 删除视频
   * @param req Express请求对象
   * @param res Express响应对象
   */
  deleteVideo = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return ApiResponse.unauthorized(res, '需要登录才能删除视频');
      }

      await this.videoService.deleteVideo(id, userId);

      return ApiResponse.success(res, { success: true }, '视频删除成功');
    } catch (error) {
      if (error instanceof AppError) {
        return ApiResponse.error(res, error.message, error.statusCode, error.details);
      }
      return ApiResponse.error(res, '删除视频失败');
    }
  };

  /**
   * 更新视频观看进度
   * @param req Express请求对象
   * @param res Express响应对象
   * @param next Express下一步函数
   */
  updateVideoProgress = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('用户未认证', 401);
      }

      const userId = req.user.id;
      const videoId = req.params.videoId;

      if (!videoId) {
        throw new ValidationError('视频ID不能为空');
      }

      const { currentTime, isCompleted } = req.body;

      if (typeof currentTime !== 'number') {
        throw new ValidationError('当前播放时间必须是数字');
      }

      const progress = await this.videoService.updateVideoProgress(
        videoId,
        userId,
        currentTime,
        isCompleted
      );

      ApiResponse.success(res, progress, '视频进度更新成功');
    } catch (error) {
      next(error);
    }
  };
}
