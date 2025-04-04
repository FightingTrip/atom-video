import { Request, Response } from 'express';
import { tagService } from '../services/tagService';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export const getPopularTags = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const tags = await tagService.getPopularTags(limit);
    res.json({ success: true, data: tags });
  } catch (error) {
    logger.error('Error in getPopularTags controller:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: '获取热门标签时发生错误' });
    }
  }
};

export const getTagVideos = async (req: Request, res: Response) => {
  try {
    const { tag } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!tag) {
      throw new AppError('标签不能为空', 400);
    }

    const result = await tagService.getTagVideos(tag as any, page, limit);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error in getTagVideos controller:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: '获取标签视频时发生错误' });
    }
  }
};

export const getTagStats = async (req: Request, res: Response) => {
  try {
    const stats = await tagService.getTagStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Error in getTagStats controller:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: '获取标签统计时发生错误' });
    }
  }
};
