import { PrismaClient } from '@prisma/client';
import { VideoService } from '../video/video.service';

export class HistoryService {
  private prisma: PrismaClient;
  private videoService: VideoService;

  constructor() {
    this.prisma = new PrismaClient();
    this.videoService = new VideoService();
  }

  // 获取用户观看历史
  async getWatchHistory(userId: string) {
    try {
      // 获取用户观看历史记录
      const watchHistory = await this.prisma.watchHistory.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: { video: true },
      });

      // 将记录转换为需要的格式
      return Promise.all(
        watchHistory.map(async record => {
          const video = record.video;
          return {
            id: video.id,
            title: video.title,
            description: video.description,
            duration: video.duration,
            coverUrl: video.coverUrl,
            views: video.views,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            progress: record.progress,
            creator: await this.prisma.user.findUnique({
              where: { id: video.creatorId },
              select: {
                id: true,
                username: true,
                nickname: true,
                avatarUrl: true,
              },
            }),
          };
        })
      );
    } catch (error) {
      console.error('获取观看历史失败:', error);
      throw error;
    }
  }

  // 添加视频到观看历史
  async addToWatchHistory(userId: string, videoId: string, progress = 0) {
    try {
      // 检查视频是否存在
      const video = await this.prisma.video.findUnique({
        where: { id: videoId },
      });

      if (!video) {
        throw new Error('视频不存在');
      }

      // 更新或创建观看记录
      await this.prisma.watchHistory.upsert({
        where: {
          userId_videoId: {
            userId,
            videoId,
          },
        },
        update: {
          progress,
          updatedAt: new Date(),
        },
        create: {
          userId,
          videoId,
          progress,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('添加观看历史失败:', error);
      throw error;
    }
  }

  // 清空观看历史
  async clearWatchHistory(userId: string) {
    try {
      await this.prisma.watchHistory.deleteMany({
        where: { userId },
      });
      return { success: true };
    } catch (error) {
      console.error('清空观看历史失败:', error);
      throw error;
    }
  }

  // 从观看历史中移除视频
  async removeFromWatchHistory(userId: string, videoId: string) {
    try {
      await this.prisma.watchHistory.delete({
        where: {
          userId_videoId: {
            userId,
            videoId,
          },
        },
      });
      return { success: true };
    } catch (error) {
      console.error('移除观看历史失败:', error);
      throw error;
    }
  }

  // 获取用户当前正在观看的视频
  async getWatchingNow(userId: string) {
    try {
      // 这里可以实现获取用户当前正在观看的视频逻辑
      // 可以基于最近观看记录和观看进度来判断
      const recentHistory = await this.prisma.watchHistory.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 1,
        include: { video: true },
      });

      if (recentHistory.length === 0) {
        return null;
      }

      const record = recentHistory[0];
      const video = record.video;

      // 如果最近30分钟内有观看记录且进度未到90%，视为正在观看
      const thirtyMinutesAgo = new Date();
      thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

      if (record.updatedAt > thirtyMinutesAgo && record.progress / video.duration < 0.9) {
        return {
          id: video.id,
          title: video.title,
          description: video.description,
          duration: video.duration,
          coverUrl: video.coverUrl,
          progress: record.progress,
          creator: await this.prisma.user.findUnique({
            where: { id: video.creatorId },
            select: {
              id: true,
              username: true,
              nickname: true,
              avatarUrl: true,
            },
          }),
        };
      }

      return null;
    } catch (error) {
      console.error('获取正在观看视频失败:', error);
      throw error;
    }
  }

  // 获取用户搜索历史
  async getSearchHistory(userId: string) {
    try {
      const searchHistory = await this.prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      });

      return searchHistory.map(record => record.keyword);
    } catch (error) {
      console.error('获取搜索历史失败:', error);
      throw error;
    }
  }

  // 添加关键词到搜索历史
  async addToSearchHistory(userId: string, keyword: string) {
    try {
      // 清理关键词
      keyword = keyword.trim();
      if (!keyword) {
        return { success: false, message: '关键词不能为空' };
      }

      // 更新或创建搜索记录
      await this.prisma.searchHistory.upsert({
        where: {
          userId_keyword: {
            userId,
            keyword,
          },
        },
        update: {
          updatedAt: new Date(),
        },
        create: {
          userId,
          keyword,
        },
      });

      // 限制每个用户最多保留20条搜索记录
      const records = await this.prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      });

      if (records.length > 20) {
        const idsToDelete = records.slice(20).map(record => record.id);
        await this.prisma.searchHistory.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }

      return { success: true };
    } catch (error) {
      console.error('添加搜索历史失败:', error);
      throw error;
    }
  }

  // 清空搜索历史
  async clearSearchHistory(userId: string) {
    try {
      await this.prisma.searchHistory.deleteMany({
        where: { userId },
      });
      return { success: true };
    } catch (error) {
      console.error('清空搜索历史失败:', error);
      throw error;
    }
  }

  // 从搜索历史中移除关键词
  async removeFromSearchHistory(userId: string, keyword: string) {
    try {
      await this.prisma.searchHistory.delete({
        where: {
          userId_keyword: {
            userId,
            keyword,
          },
        },
      });
      return { success: true };
    } catch (error) {
      console.error('移除搜索历史失败:', error);
      throw error;
    }
  }
}
