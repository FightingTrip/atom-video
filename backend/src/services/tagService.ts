import { PrismaClient, TechTag } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { TagTrend, TagStats } from '../types/tag';

class TagService {
  private prisma: PrismaClient;
  private static instance: TagService;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): TagService {
    if (!TagService.instance) {
      TagService.instance = new TagService();
    }
    return TagService.instance;
  }

  async getPopularTags(limit: number = 20) {
    try {
      // 获取所有视频的标签使用情况
      const videos = await this.prisma.video.findMany({
        where: {
          status: 'PUBLISHED',
        },
        select: {
          tags: true,
        },
      });

      // 统计标签使用频率
      const tagCounts = new Map<TechTag, number>();
      videos.forEach(video => {
        video.tags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });

      // 转换为数组并排序
      const sortedTags = Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([tag, count]) => ({
          tag,
          count,
        }));

      return sortedTags;
    } catch (error) {
      logger.error('Error getting popular tags:', error);
      throw new AppError('获取热门标签时发生错误', 500);
    }
  }

  async getTagVideos(tag: TechTag, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [videos, total] = await Promise.all([
        this.prisma.video.findMany({
          where: {
            tags: {
              has: tag,
            },
            status: 'PUBLISHED',
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
              },
            },
          },
        }),
        this.prisma.video.count({
          where: {
            tags: {
              has: tag,
            },
            status: 'PUBLISHED',
          },
        }),
      ]);

      return {
        videos,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('Error getting tag videos:', error);
      throw new AppError('获取标签视频时发生错误', 500);
    }
  }

  async getTagStats() {
    try {
      const videos = await this.prisma.video.findMany({
        where: {
          status: 'PUBLISHED',
        },
        select: {
          tags: true,
        },
      });

      const tagStats = new Map<TechTag, number>();
      videos.forEach(video => {
        video.tags.forEach(tag => {
          tagStats.set(tag, (tagStats.get(tag) || 0) + 1);
        });
      });

      return Array.from(tagStats.entries()).map(([tag, count]) => ({
        tag,
        count,
      }));
    } catch (error) {
      logger.error('Error getting tag stats:', error);
      throw new AppError('获取标签统计时发生错误', 500);
    }
  }

  async getTagTrends(days: number = 7): Promise<TagTrend[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const trends = await this.prisma.$queryRaw<
        {
          date: Date;
          tag: TechTag;
          count: string;
        }[]
      >`
        WITH RECURSIVE dates AS (
          SELECT ${startDate}::date as date
          UNION ALL
          SELECT date + interval '1 day'
          FROM dates
          WHERE date < ${endDate}::date
        ),
        tag_counts AS (
          SELECT 
            v.tag,
            DATE(v.created_at) as date,
            COUNT(*) as count
          FROM "Video" v
          WHERE v.created_at >= ${startDate}
          AND v.created_at <= ${endDate}
          GROUP BY v.tag, DATE(v.created_at)
        )
        SELECT 
          d.date,
          tc.tag,
          COALESCE(tc.count, 0) as count
        FROM dates d
        CROSS JOIN (SELECT DISTINCT tag FROM "Video") tags
        LEFT JOIN tag_counts tc ON d.date = tc.date AND tags.tag = tc.tag
        ORDER BY d.date, tags.tag
      `;

      // 转换数据格式
      const result: Record<string, TagTrend> = {};
      trends.forEach(row => {
        if (!result[row.tag]) {
          result[row.tag] = {
            tag: row.tag,
            counts: [],
          };
        }
        result[row.tag].counts.push({
          date: row.date.toISOString().split('T')[0],
          count: parseInt(row.count),
        });
      });

      return Object.values(result);
    } catch (error) {
      logger.error('获取标签趋势失败:', error);
      throw new AppError('获取标签趋势失败', 500);
    }
  }
}

export const tagService = TagService.getInstance();
