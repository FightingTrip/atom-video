import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

class SearchService {
  private prisma: PrismaClient;
  private static instance: SearchService;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  // 搜索视频
  async searchVideos(query: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const videos = await this.prisma.video.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ],
          status: 'PUBLISHED',
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });

      const total = await this.prisma.video.count({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ],
          status: 'PUBLISHED',
        },
      });

      return {
        videos,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('搜索视频失败:', error);
      throw new AppError('搜索视频失败', 500);
    }
  }

  // 搜索用户
  async searchUsers(query: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const users = await this.prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { nickname: { contains: query, mode: 'insensitive' } },
          ],
          status: 'ACTIVE',
        },
        select: {
          id: true,
          username: true,
          nickname: true,
          avatar: true,
          bio: true,
          _count: {
            select: {
              videos: true,
              subscribers: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });

      const total = await this.prisma.user.count({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { nickname: { contains: query, mode: 'insensitive' } },
          ],
          status: 'ACTIVE',
        },
      });

      return {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('搜索用户失败:', error);
      throw new AppError('搜索用户失败', 500);
    }
  }

  // 获取热门搜索
  async getHotSearches(limit: number = 10) {
    try {
      // TODO: 实现热门搜索逻辑，可以从 Redis 中获取
      return ['热门视频', '搞笑视频', '游戏视频', '音乐视频', '美食视频'].slice(0, limit);
    } catch (error) {
      logger.error('获取热门搜索失败:', error);
      throw new AppError('获取热门搜索失败', 500);
    }
  }

  // 获取搜索建议
  async getSearchSuggestions(query: string, limit: number = 5) {
    try {
      const videoSuggestions = await this.prisma.video.findMany({
        where: {
          OR: [{ title: { contains: query, mode: 'insensitive' } }, { tags: { has: query } }],
          status: 'PUBLISHED',
        },
        select: {
          title: true,
        },
        take: limit,
      });

      const userSuggestions = await this.prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { nickname: { contains: query, mode: 'insensitive' } },
          ],
          status: 'ACTIVE',
        },
        select: {
          username: true,
          nickname: true,
        },
        take: limit,
      });

      return {
        videoSuggestions: videoSuggestions.map(v => v.title),
        userSuggestions: userSuggestions.map(u => u.nickname || u.username),
      };
    } catch (error) {
      logger.error('获取搜索建议失败:', error);
      throw new AppError('获取搜索建议失败', 500);
    }
  }
}

export const searchService = SearchService.getInstance();
