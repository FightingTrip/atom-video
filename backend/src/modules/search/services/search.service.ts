/**
 * 搜索服务
 *
 * 提供全站搜索功能的业务逻辑
 * @module search/services/search
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SearchResultDto, SearchRequestDto } from '../dto/search.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 综合搜索
   * 搜索视频、用户、标签等内容
   *
   * @param query 搜索关键词
   * @param page 页码
   * @param limit 每页数量
   * @param filters 过滤条件
   * @returns 搜索结果
   */
  async search(searchRequest: SearchRequestDto): Promise<SearchResultDto> {
    try {
      const { query, page = 1, limit = 20, type, filters = {} } = searchRequest;
      const skip = (page - 1) * limit;

      // 根据搜索类型决定搜索内容
      if (type === 'video' || !type) {
        return this.searchVideos(query, page, limit, filters);
      } else if (type === 'user') {
        return this.searchUsers(query, page, limit, filters);
      } else if (type === 'tag') {
        return this.searchTags(query, page, limit, filters);
      } else {
        // 默认执行综合搜索
        return this.searchAll(query, page, limit, filters);
      }
    } catch (error) {
      this.logger.error(`搜索失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 执行综合搜索
   */
  private async searchAll(
    query: string,
    page: number,
    limit: number,
    filters: any
  ): Promise<SearchResultDto> {
    const skip = (page - 1) * limit;
    const where = this.buildVideoSearchCondition(query, filters);

    try {
      const [videos, users, tags, videosTotal, usersTotal, tagsTotal] = await Promise.all([
        this.prisma.video.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          skip,
          take: Math.floor(limit / 2),
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.user.findMany({
          where: {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { displayName: { contains: query, mode: 'insensitive' } },
              { bio: { contains: query, mode: 'insensitive' } },
            ],
            isDeleted: false,
          },
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            isCreator: true,
            _count: {
              select: {
                videos: true,
                subscribedBy: true,
              },
            },
          },
          skip,
          take: Math.floor(limit / 4),
        }),
        this.prisma.tag.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          include: {
            _count: {
              select: {
                videos: true,
              },
            },
          },
          skip,
          take: Math.floor(limit / 4),
        }),
        this.prisma.video.count({ where }),
        this.prisma.user.count({
          where: {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { displayName: { contains: query, mode: 'insensitive' } },
              { bio: { contains: query, mode: 'insensitive' } },
            ],
            isDeleted: false,
          },
        }),
        this.prisma.tag.count({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
        }),
      ]);

      const formattedVideos = videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        views: video.viewCount,
        likes: video.likeCount,
        createdAt: video.createdAt,
        creator: {
          id: video.user.id,
          username: video.user.username,
          avatarUrl: video.user.avatarUrl,
        },
        tags: video.tags.map(tag => ({
          id: tag.id,
          name: tag.name,
        })),
      }));

      const formattedUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        isCreator: user.isCreator,
        videosCount: user._count.videos,
        subscribersCount: user._count.subscribedBy,
      }));

      const formattedTags = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        videosCount: tag._count.videos,
      }));

      return {
        videos: {
          data: formattedVideos,
          pagination: {
            total: videosTotal,
            page,
            limit: Math.floor(limit / 2),
            totalPages: Math.ceil(videosTotal / Math.floor(limit / 2)),
          },
        },
        users: {
          data: formattedUsers,
          pagination: {
            total: usersTotal,
            page,
            limit: Math.floor(limit / 4),
            totalPages: Math.ceil(usersTotal / Math.floor(limit / 4)),
          },
        },
        tags: {
          data: formattedTags,
          pagination: {
            total: tagsTotal,
            page,
            limit: Math.floor(limit / 4),
            totalPages: Math.ceil(tagsTotal / Math.floor(limit / 4)),
          },
        },
      };
    } catch (error) {
      this.logger.error(`执行综合搜索失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 视频搜索
   */
  private async searchVideos(
    query: string,
    page: number,
    limit: number,
    filters: any
  ): Promise<SearchResultDto> {
    const skip = (page - 1) * limit;
    const where = this.buildVideoSearchCondition(query, filters);

    try {
      const [videos, total] = await Promise.all([
        this.prisma.video.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: this.getVideoOrderBy(filters.sort),
        }),
        this.prisma.video.count({ where }),
      ]);

      const formattedVideos = videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        views: video.viewCount,
        likes: video.likeCount,
        createdAt: video.createdAt,
        creator: {
          id: video.user.id,
          username: video.user.username,
          avatarUrl: video.user.avatarUrl,
        },
        tags: video.tags.map(tag => ({
          id: tag.id,
          name: tag.name,
        })),
      }));

      return {
        videos: {
          data: formattedVideos,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        users: { data: [], pagination: { total: 0, page, limit, totalPages: 0 } },
        tags: { data: [], pagination: { total: 0, page, limit, totalPages: 0 } },
      };
    } catch (error) {
      this.logger.error(`执行视频搜索失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 用户搜索
   */
  private async searchUsers(
    query: string,
    page: number,
    limit: number,
    filters: any
  ): Promise<SearchResultDto> {
    const skip = (page - 1) * limit;
    const userWhere = {
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { displayName: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
      ],
      isDeleted: false,
    };

    if (filters.isCreator === true) {
      userWhere['isCreator'] = true;
    }

    try {
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where: userWhere,
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            isCreator: true,
            _count: {
              select: {
                videos: true,
                subscribedBy: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy:
            filters.sort === 'subscribers'
              ? { subscribedBy: { _count: 'desc' } }
              : { createdAt: 'desc' },
        }),
        this.prisma.user.count({ where: userWhere }),
      ]);

      const formattedUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        isCreator: user.isCreator,
        videosCount: user._count.videos,
        subscribersCount: user._count.subscribedBy,
      }));

      return {
        videos: { data: [], pagination: { total: 0, page, limit, totalPages: 0 } },
        users: {
          data: formattedUsers,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        tags: { data: [], pagination: { total: 0, page, limit, totalPages: 0 } },
      };
    } catch (error) {
      this.logger.error(`执行用户搜索失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 标签搜索
   */
  private async searchTags(
    query: string,
    page: number,
    limit: number,
    filters: any
  ): Promise<SearchResultDto> {
    const skip = (page - 1) * limit;
    const where = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };

    try {
      const [tags, total] = await Promise.all([
        this.prisma.tag.findMany({
          where,
          include: {
            _count: {
              select: {
                videos: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: filters.sort === 'popular' ? { videos: { _count: 'desc' } } : { name: 'asc' },
        }),
        this.prisma.tag.count({ where }),
      ]);

      const formattedTags = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        videosCount: tag._count.videos,
      }));

      return {
        videos: { data: [], pagination: { total: 0, page, limit, totalPages: 0 } },
        users: { data: [], pagination: { total: 0, page, limit, totalPages: 0 } },
        tags: {
          data: formattedTags,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      this.logger.error(`执行标签搜索失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 构建视频搜索条件
   */
  private buildVideoSearchCondition(query: string, filters: any): Prisma.VideoWhereInput {
    // 基本搜索条件
    const where: Prisma.VideoWhereInput = {
      isPublished: true,
      visibility: 'PUBLIC',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { some: { name: { contains: query, mode: 'insensitive' } } } },
      ],
    };

    // 添加筛选条件
    if (filters) {
      // 按时长筛选
      if (filters.duration === 'short') {
        where.duration = { lt: 300 }; // 小于5分钟
      } else if (filters.duration === 'medium') {
        where.duration = { gte: 300, lt: 1200 }; // 5-20分钟
      } else if (filters.duration === 'long') {
        where.duration = { gte: 1200 }; // 大于20分钟
      }

      // 按上传时间筛选
      if (filters.uploadDate === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        where.createdAt = { gte: today };
      } else if (filters.uploadDate === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        where.createdAt = { gte: weekAgo };
      } else if (filters.uploadDate === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        where.createdAt = { gte: monthAgo };
      } else if (filters.uploadDate === 'year') {
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        where.createdAt = { gte: yearAgo };
      }

      // 按难度级别筛选
      if (
        filters.difficulty &&
        ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].includes(filters.difficulty)
      ) {
        where.difficultyLevel = filters.difficulty;
      }

      // 按视频类型筛选
      if (filters.videoType) {
        where.videoType = filters.videoType;
      }

      // 按标签筛选
      if (filters.tagId) {
        where.tags = {
          some: {
            id: filters.tagId,
          },
        };
      }
    }

    return where;
  }

  /**
   * 获取视频排序条件
   */
  private getVideoOrderBy(sort: string): any {
    switch (sort) {
      case 'views':
        return { viewCount: 'desc' };
      case 'likes':
        return { likeCount: 'desc' };
      case 'newest':
        return { createdAt: 'desc' };
      case 'oldest':
        return { createdAt: 'asc' };
      default:
        return { createdAt: 'desc' };
    }
  }

  /**
   * 记录搜索历史
   *
   * @param userId 用户ID
   * @param query 搜索关键词
   */
  async recordSearchHistory(userId: string, query: string): Promise<void> {
    if (!userId || !query.trim()) {
      return;
    }

    try {
      await this.prisma.searchHistory.create({
        data: {
          userId,
          query: query.trim(),
        },
      });
    } catch (error) {
      this.logger.error(`记录搜索历史失败: ${error.message}`, error.stack);
      // 不抛出异常，避免影响主流程
    }
  }

  /**
   * 获取用户搜索历史
   *
   * @param userId 用户ID
   * @param limit 限制数量
   */
  async getUserSearchHistory(userId: string, limit: number = 10): Promise<string[]> {
    try {
      const history = await this.prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return history.map(item => item.query);
    } catch (error) {
      this.logger.error(`获取用户搜索历史失败: ${error.message}`, error.stack);
      return [];
    }
  }

  /**
   * 获取热门搜索
   *
   * @param limit 限制数量
   */
  async getPopularSearches(limit: number = 10): Promise<{ query: string; count: number }[]> {
    try {
      // 聚合查询最近一周内的热门搜索
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // 这里使用原生SQL是因为Prisma ORM不直接支持复杂的分组聚合查询
      // 实际项目中可能需要根据数据库类型调整SQL语法
      const result = await this.prisma.$queryRaw`
        SELECT query, COUNT(*) as count 
        FROM "SearchHistory" 
        WHERE "createdAt" >= ${oneWeekAgo}
        GROUP BY query 
        ORDER BY count DESC 
        LIMIT ${limit}
      `;

      return result as { query: string; count: number }[];
    } catch (error) {
      this.logger.error(`获取热门搜索失败: ${error.message}`, error.stack);
      return [];
    }
  }
}
