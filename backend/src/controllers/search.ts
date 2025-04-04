import { Request, Response } from 'express';
import { searchService } from '../services/searchService';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

export const searchController = {
  // 搜索视频
  async searchVideos(req: Request, res: Response) {
    try {
      const { q, page = '1', limit = '10' } = req.query;

      if (!q || typeof q !== 'string') {
        throw new AppError('搜索关键词不能为空', 400);
      }

      const result = await searchService.searchVideos(
        q,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json(result);
    } catch (error) {
      logger.error('搜索视频失败:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: '搜索视频失败' });
      }
    }
  },

  // 搜索用户
  async searchUsers(req: Request, res: Response) {
    try {
      const { q, page = '1', limit = '10' } = req.query;

      if (!q || typeof q !== 'string') {
        throw new AppError('搜索关键词不能为空', 400);
      }

      const result = await searchService.searchUsers(
        q,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.json(result);
    } catch (error) {
      logger.error('搜索用户失败:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: '搜索用户失败' });
      }
    }
  },

  // 获取热门搜索
  async getHotSearches(req: Request, res: Response) {
    try {
      const { limit = '10' } = req.query;
      const result = await searchService.getHotSearches(parseInt(limit as string));
      res.json(result);
    } catch (error) {
      logger.error('获取热门搜索失败:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: '获取热门搜索失败' });
      }
    }
  },

  // 获取搜索建议
  async getSearchSuggestions(req: Request, res: Response) {
    try {
      const { q, limit = '5' } = req.query;

      if (!q || typeof q !== 'string') {
        throw new AppError('搜索关键词不能为空', 400);
      }

      const result = await searchService.getSearchSuggestions(q, parseInt(limit as string));

      res.json(result);
    } catch (error) {
      logger.error('获取搜索建议失败:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: '获取搜索建议失败' });
      }
    }
  },
};
