import { Request, Response } from 'express';
import { TagService } from '../services/tagService';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

const tagService = new TagService();

export const getTagTrends = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const trends = await tagService.getTagTrends(days);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    logger.error('获取标签趋势失败:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: '获取标签趋势失败',
      });
    }
  }
};
