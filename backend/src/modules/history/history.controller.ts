import { Request, Response } from 'express';
import { HistoryService } from './history.service';

export class HistoryController {
  private historyService: HistoryService;

  constructor() {
    this.historyService = new HistoryService();
  }

  // 获取观看历史
  getWatchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const history = await this.historyService.getWatchHistory(userId);
      res.status(200).json(history);
    } catch (error) {
      console.error('获取观看历史失败:', error);
      res.status(500).json({ message: '获取观看历史失败', error });
    }
  };

  // 添加视频到观看历史
  addToWatchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const { videoId } = req.params;
      await this.historyService.addToWatchHistory(userId, videoId);
      res.status(200).json({ message: '已添加到观看历史' });
    } catch (error) {
      console.error('添加观看历史失败:', error);
      res.status(500).json({ message: '添加观看历史失败', error });
    }
  };

  // 清空观看历史
  clearWatchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      await this.historyService.clearWatchHistory(userId);
      res.status(200).json({ message: '观看历史已清空' });
    } catch (error) {
      console.error('清空观看历史失败:', error);
      res.status(500).json({ message: '清空观看历史失败', error });
    }
  };

  // 从观看历史中移除视频
  removeFromWatchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const { videoId } = req.params;
      await this.historyService.removeFromWatchHistory(userId, videoId);
      res.status(200).json({ message: '已从观看历史中移除' });
    } catch (error) {
      console.error('移除观看历史失败:', error);
      res.status(500).json({ message: '移除观看历史失败', error });
    }
  };

  // 获取正在观看的视频（用于实时数据）
  getWatchingNow = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const watchingNow = await this.historyService.getWatchingNow(userId);
      res.status(200).json(watchingNow);
    } catch (error) {
      console.error('获取正在观看的视频失败:', error);
      res.status(500).json({ message: '获取正在观看的视频失败', error });
    }
  };

  // 获取搜索历史
  getSearchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const history = await this.historyService.getSearchHistory(userId);
      res.status(200).json(history);
    } catch (error) {
      console.error('获取搜索历史失败:', error);
      res.status(500).json({ message: '获取搜索历史失败', error });
    }
  };

  // 添加关键词到搜索历史
  addToSearchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const { keyword } = req.params;
      await this.historyService.addToSearchHistory(userId, keyword);
      res.status(200).json({ message: '已添加到搜索历史' });
    } catch (error) {
      console.error('添加搜索历史失败:', error);
      res.status(500).json({ message: '添加搜索历史失败', error });
    }
  };

  // 清空搜索历史
  clearSearchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      await this.historyService.clearSearchHistory(userId);
      res.status(200).json({ message: '搜索历史已清空' });
    } catch (error) {
      console.error('清空搜索历史失败:', error);
      res.status(500).json({ message: '清空搜索历史失败', error });
    }
  };

  // 从搜索历史中移除关键词
  removeFromSearchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id as string;
      const { keyword } = req.params;
      await this.historyService.removeFromSearchHistory(userId, keyword);
      res.status(200).json({ message: '已从搜索历史中移除' });
    } catch (error) {
      console.error('移除搜索历史失败:', error);
      res.status(500).json({ message: '移除搜索历史失败', error });
    }
  };
}
