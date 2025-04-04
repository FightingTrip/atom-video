import { Request, Response } from 'express';
import { VideoService } from '../services/videoService';
import { upload } from '../utils/storage';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

export class VideoController {
  // 上传视频
  static uploadVideo = [
    upload.single('video'),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          throw new AppError(400, '请选择视频文件');
        }

        if (!req.user) {
          throw new AppError(401, '未登录');
        }

        const { title, description } = req.body;
        if (!title) {
          throw new AppError(400, '请输入视频标题');
        }

        const video = await VideoService.createVideo(
          req.user.id,
          title,
          description || '',
          req.file
        );

        res.status(201).json({
          success: true,
          data: video,
        });
      } catch (error) {
        logger.error('上传视频失败:', error);
        throw error;
      }
    },
  ];

  // 获取视频详情
  static getVideo = async (req: Request, res: Response) => {
    try {
      const video = await VideoService.getVideoById(req.params.id);
      res.json({
        success: true,
        data: video,
      });
    } catch (error) {
      logger.error('获取视频详情失败:', error);
      throw error;
    }
  };

  // 更新视频信息
  static updateVideo = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new AppError(401, '未登录');
      }

      const { title, description } = req.body;
      const video = await VideoService.updateVideo(req.params.id, req.user.id, {
        title,
        description,
      });

      res.json({
        success: true,
        data: video,
      });
    } catch (error) {
      logger.error('更新视频信息失败:', error);
      throw error;
    }
  };

  // 删除视频
  static deleteVideo = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new AppError(401, '未登录');
      }

      await VideoService.deleteVideo(req.params.id, req.user.id);

      res.json({
        success: true,
        message: '视频删除成功',
      });
    } catch (error) {
      logger.error('删除视频失败:', error);
      throw error;
    }
  };

  // 获取视频列表
  static getVideos = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = req.query.userId as string;

      const result = await VideoService.getVideos(page, limit, userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('获取视频列表失败:', error);
      throw error;
    }
  };

  // 点赞/取消点赞视频
  static toggleLike = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new AppError(401, '未登录');
      }

      const isLiked = await VideoService.toggleLike(req.params.id, req.user.id);

      res.json({
        success: true,
        data: { isLiked },
      });
    } catch (error) {
      logger.error('点赞操作失败:', error);
      throw error;
    }
  };
}
