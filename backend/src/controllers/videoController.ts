import { Request, Response } from 'express';
import { VideoService } from '../services/videoService';
import logger from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

// 上传视频
export const uploadVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError(400, '请上传视频文件');
    }

    const { title, description } = req.body;
    const userId = req.user.id; // 从认证中间件获取当前用户ID

    const video = await VideoService.createVideo(userId, title, description, req.file);

    res.status(201).json(video);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error('上传视频失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
};

// 获取视频详情
export const getVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const video = await VideoService.getVideoById(id);
    res.json(video);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error('获取视频详情失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
};

// 更新视频信息
export const updateVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // 从认证中间件获取当前用户ID
    const videoData = req.body;

    const video = await VideoService.updateVideo(id, userId, videoData);
    res.json(video);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error('更新视频信息失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
};

// 删除视频
export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // 从认证中间件获取当前用户ID

    await VideoService.deleteVideo(id, userId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error('删除视频失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
};

// 获取视频列表
export const getVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.query.userId as string;

    const result = await VideoService.getVideos(page, limit, userId);
    res.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error('获取视频列表失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
};

// 点赞/取消点赞视频
export const toggleVideoLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: videoId } = req.params;
    const userId = req.user.id; // 从认证中间件获取当前用户ID

    const isLiked = await VideoService.toggleLike(videoId, userId);
    res.json({ isLiked });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      logger.error('点赞操作失败:', error);
      res.status(500).json({ error: '服务器内部错误' });
    }
  }
};
