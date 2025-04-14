/**
 * 推荐系统服务
 *
 * 提供基于用户行为和内容特性的视频推荐功能
 * @module recommendation/services/recommendation
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RecommendationReason } from '../../../models/enums';

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 获取首页推荐内容
   *
   * @param userId 用户ID（可选）
   * @param limit 数量限制
   * @returns 推荐内容列表
   */
  async getHomeRecommendations(userId?: string, limit: number = 20) {
    try {
      // 对于登录用户，提供个性化推荐
      if (userId) {
        return this.getPersonalizedRecommendations(userId, limit);
      }

      // 对于未登录用户，提供热门内容
      return this.getTrendingVideos(limit);
    } catch (error) {
      this.logger.error(`获取首页推荐失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取个性化推荐
   *
   * @param userId 用户ID
   * @param limit 数量限制
   * @returns 个性化推荐内容列表
   */
  async getPersonalizedRecommendations(userId: string, limit: number = 20) {
    try {
      // 检查用户是否存在
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!user) {
        throw new NotFoundException(`用户不存在: ${userId}`);
      }

      // 获取已有的推荐
      const existingRecommendations = await this.prisma.recommendation.findMany({
        where: { userId },
        include: {
          video: {
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
          },
        },
        orderBy: { score: 'desc' },
        take: limit,
      });

      // 如果有足够的推荐内容，直接返回
      if (existingRecommendations.length >= limit) {
        return this.formatRecommendations(existingRecommendations);
      }

      // 如果推荐不足，生成新的推荐
      const newRecommendationsNeeded = limit - existingRecommendations.length;
      const newRecommendations = await this.generateRecommendations(
        userId,
        newRecommendationsNeeded
      );

      // 合并已有推荐和新生成的推荐
      const allRecommendations = [...existingRecommendations, ...newRecommendations];
      return this.formatRecommendations(allRecommendations);
    } catch (error) {
      this.logger.error(`获取个性化推荐失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取热门视频
   *
   * @param limit 数量限制
   * @returns 热门视频列表
   */
  async getTrendingVideos(limit: number = 20) {
    try {
      // 获取近期（一周内）热门视频
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const videos = await this.prisma.video.findMany({
        where: {
          isPublished: true,
          visibility: 'PUBLIC',
          publishedAt: { gte: oneWeekAgo },
        },
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
        orderBy: [{ viewCount: 'desc' }, { likeCount: 'desc' }],
        take: limit,
      });

      return videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        views: video.viewCount,
        likes: video.likeCount,
        publishedAt: video.publishedAt,
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
        recommendationReason: RecommendationReason.TRENDING,
      }));
    } catch (error) {
      this.logger.error(`获取热门视频失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取基于特定视频的相关推荐
   *
   * @param videoId 视频ID
   * @param userId 用户ID（可选）
   * @param limit 数量限制
   * @returns 相关视频列表
   */
  async getRelatedVideos(videoId: string, userId?: string, limit: number = 12) {
    try {
      // 检查视频是否存在
      const video = await this.prisma.video.findUnique({
        where: { id: videoId },
        include: {
          tags: { select: { id: true } },
        },
      });

      if (!video) {
        throw new NotFoundException(`视频不存在: ${videoId}`);
      }

      // 获取视频的标签IDs
      const tagIds = video.tags.map(tag => tag.id);

      // 获取同一创作者的其他视频
      const creatorVideos = await this.prisma.video.findMany({
        where: {
          id: { not: videoId }, // 排除当前视频
          userId: video.userId, // 同一创作者
          isPublished: true,
          visibility: 'PUBLIC',
        },
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
        orderBy: { publishedAt: 'desc' },
        take: Math.floor(limit / 3), // 占总推荐的1/3
      });

      // 获取相同标签的视频
      const tagVideos = await this.prisma.video.findMany({
        where: {
          id: { not: videoId }, // 排除当前视频
          userId: { not: video.userId }, // 排除同一创作者
          isPublished: true,
          visibility: 'PUBLIC',
          tags: {
            some: {
              id: { in: tagIds }, // 包含相同标签
            },
          },
        },
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
        orderBy: [{ viewCount: 'desc' }, { createdAt: 'desc' }],
        take: Math.floor(limit / 3), // 占总推荐的1/3
      });

      // 获取热门视频（填补剩余空位）
      const remainingCount = limit - creatorVideos.length - tagVideos.length;
      const popularVideos =
        remainingCount > 0
          ? await this.prisma.video.findMany({
              where: {
                id: { not: videoId }, // 排除当前视频
                userId: { not: video.userId }, // 排除同一创作者
                isPublished: true,
                visibility: 'PUBLIC',
                tags: {
                  none: {
                    id: { in: tagIds }, // 排除已经通过标签获取的视频
                  },
                },
              },
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
              orderBy: [{ viewCount: 'desc' }],
              take: remainingCount,
            })
          : [];

      // 格式化并组合视频列表
      const formattedCreatorVideos = creatorVideos.map(v => ({
        ...this.formatVideoForRecommendation(v),
        recommendationReason: RecommendationReason.SAME_CREATOR,
      }));

      const formattedTagVideos = tagVideos.map(v => ({
        ...this.formatVideoForRecommendation(v),
        recommendationReason: RecommendationReason.SIMILAR_CONTENT,
      }));

      const formattedPopularVideos = popularVideos.map(v => ({
        ...this.formatVideoForRecommendation(v),
        recommendationReason: RecommendationReason.POPULAR,
      }));

      // 合并并随机排序结果
      const allVideos = [
        ...formattedCreatorVideos,
        ...formattedTagVideos,
        ...formattedPopularVideos,
      ];
      return this.shuffleArray(allVideos);
    } catch (error) {
      this.logger.error(`获取相关视频失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 标记推荐内容已点击
   *
   * @param userId 用户ID
   * @param videoId 视频ID
   * @returns 更新结果
   */
  async markRecommendationAsClicked(userId: string, videoId: string) {
    try {
      await this.prisma.recommendation.updateMany({
        where: {
          userId,
          videoId,
        },
        data: {
          isClicked: true,
        },
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`标记推荐点击失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 生成推荐内容并存储
   *
   * @param userId 用户ID
   * @param limit 数量限制
   * @returns 生成的推荐列表
   */
  private async generateRecommendations(userId: string, limit: number) {
    try {
      // 获取用户已经观看过的视频
      const watchedVideoIds = (
        await this.prisma.watchHistory.findMany({
          where: { userId },
          select: { videoId: true },
        })
      ).map(history => history.videoId);

      // 获取用户已经收到推荐的视频
      const recommendedVideoIds = (
        await this.prisma.recommendation.findMany({
          where: { userId },
          select: { videoId: true },
        })
      ).map(rec => rec.videoId);

      // 合并已观看和已推荐的视频ID，用于排除
      const excludedVideoIds = [...new Set([...watchedVideoIds, ...recommendedVideoIds])];

      // 获取用户观看历史中的标签
      const userTags = await this.getUserPreferredTags(userId);

      // 基于标签偏好推荐
      const tagBasedRecommendations =
        userTags.length > 0
          ? await this.getTagBasedRecommendations(
              userId,
              userTags,
              excludedVideoIds,
              Math.floor(limit * 0.6)
            )
          : [];

      // 获取还需要的推荐数量
      const remainingCount = limit - tagBasedRecommendations.length;

      // 如果基于标签的推荐不足，添加热门内容推荐
      const popularRecommendations =
        remainingCount > 0
          ? await this.getPopularRecommendations(userId, excludedVideoIds, remainingCount)
          : [];

      // 合并所有推荐
      return [...tagBasedRecommendations, ...popularRecommendations];
    } catch (error) {
      this.logger.error(`生成推荐失败: ${error.message}`, error.stack);
      return []; // 发生错误时返回空列表
    }
  }

  /**
   * 获取用户偏好的标签
   *
   * @param userId 用户ID
   * @returns 标签权重列表
   */
  private async getUserPreferredTags(userId: string) {
    try {
      // 获取用户最近一个月的观看历史
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const watchHistory = await this.prisma.watchHistory.findMany({
        where: {
          userId,
          createdAt: { gte: oneMonthAgo },
        },
        include: {
          video: {
            include: {
              tags: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // 统计标签频率
      const tagFrequency = new Map();
      watchHistory.forEach(history => {
        history.video.tags.forEach(tag => {
          const count = tagFrequency.get(tag.id) || 0;
          tagFrequency.set(tag.id, count + 1);
        });
      });

      // 转换为权重列表并排序
      const tagWeights = Array.from(tagFrequency.entries())
        .map(([id, count]) => ({
          id,
          weight: count as number,
        }))
        .sort((a, b) => b.weight - a.weight);

      return tagWeights;
    } catch (error) {
      this.logger.error(`获取用户标签偏好失败: ${error.message}`, error.stack);
      return [];
    }
  }

  /**
   * 获取基于标签的推荐
   *
   * @param userId 用户ID
   * @param tagWeights 标签权重列表
   * @param excludedVideoIds 排除的视频ID列表
   * @param limit 数量限制
   * @returns 推荐列表
   */
  private async getTagBasedRecommendations(
    userId: string,
    tagWeights: { id: string; weight: number }[],
    excludedVideoIds: string[],
    limit: number
  ) {
    try {
      // 获取标签ID列表
      const tagIds = tagWeights.map(tag => tag.id);

      // 查询包含这些标签的视频
      const videos = await this.prisma.video.findMany({
        where: {
          id: { notIn: excludedVideoIds },
          isPublished: true,
          visibility: 'PUBLIC',
          tags: {
            some: {
              id: { in: tagIds },
            },
          },
        },
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
        orderBy: { publishedAt: 'desc' },
        take: limit * 2, // 获取更多候选项，以便后续根据标签匹配度排序
      });

      // 计算每个视频的推荐分数（基于标签匹配度和其他因素）
      const scoredVideos = videos
        .map(video => {
          // 标签匹配分数
          let tagScore = 0;
          const videoTagIds = video.tags.map(tag => tag.id);

          tagWeights.forEach(({ id, weight }) => {
            if (videoTagIds.includes(id)) {
              tagScore += weight;
            }
          });

          // 热度分数（views + likes*2）
          const popularityScore = video.viewCount + video.likeCount * 2;

          // 新鲜度分数
          const daysOld =
            (new Date().getTime() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
          const freshnessScore = Math.max(30 - daysOld, 0); // 最多30天的新鲜度

          // 总分（可调整权重）
          const totalScore = tagScore * 3 + popularityScore * 0.01 + freshnessScore * 2;

          return {
            video,
            score: totalScore,
          };
        })
        .sort((a, b) => b.score - a.score); // 按分数降序排序

      // 截取前limit个视频
      const selectedVideos = scoredVideos.slice(0, limit);

      // 批量创建推荐记录
      const recommendations = await this.prisma.$transaction(
        selectedVideos.map(({ video, score }) =>
          this.prisma.recommendation.create({
            data: {
              userId,
              videoId: video.id,
              score,
              reason: RecommendationReason.WATCH_HISTORY,
              isClicked: false,
            },
            include: {
              video: {
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
              },
            },
          })
        )
      );

      return recommendations;
    } catch (error) {
      this.logger.error(`获取基于标签的推荐失败: ${error.message}`, error.stack);
      return [];
    }
  }

  /**
   * 获取热门内容推荐
   *
   * @param userId 用户ID
   * @param excludedVideoIds 排除的视频ID列表
   * @param limit 数量限制
   * @returns 推荐列表
   */
  private async getPopularRecommendations(
    userId: string,
    excludedVideoIds: string[],
    limit: number
  ) {
    try {
      // 获取近期热门视频
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const popularVideos = await this.prisma.video.findMany({
        where: {
          id: { notIn: excludedVideoIds },
          isPublished: true,
          visibility: 'PUBLIC',
          publishedAt: { gte: oneWeekAgo },
        },
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
        orderBy: [{ viewCount: 'desc' }, { likeCount: 'desc' }],
        take: limit,
      });

      // 批量创建推荐记录
      const recommendations = await this.prisma.$transaction(
        popularVideos.map(video =>
          this.prisma.recommendation.create({
            data: {
              userId,
              videoId: video.id,
              // 热门视频的分数计算
              score: video.viewCount * 0.01 + video.likeCount * 0.05,
              reason: RecommendationReason.POPULAR,
              isClicked: false,
            },
            include: {
              video: {
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
              },
            },
          })
        )
      );

      return recommendations;
    } catch (error) {
      this.logger.error(`获取热门推荐失败: ${error.message}`, error.stack);
      return [];
    }
  }

  /**
   * 格式化推荐结果
   */
  private formatRecommendations(recommendations: any[]) {
    return recommendations.map(rec => ({
      id: rec.video.id,
      title: rec.video.title,
      description: rec.video.description,
      thumbnailUrl: rec.video.thumbnailUrl,
      duration: rec.video.duration,
      views: rec.video.viewCount,
      likes: rec.video.likeCount,
      publishedAt: rec.video.publishedAt,
      createdAt: rec.video.createdAt,
      creator: {
        id: rec.video.user.id,
        username: rec.video.user.username,
        avatarUrl: rec.video.user.avatarUrl,
      },
      tags: rec.video.tags.map(tag => ({
        id: tag.id,
        name: tag.name,
      })),
      recommendationReason: rec.reason,
    }));
  }

  /**
   * 格式化视频对象为推荐结果格式
   */
  private formatVideoForRecommendation(video: any) {
    return {
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
      views: video.viewCount,
      likes: video.likeCount,
      publishedAt: video.publishedAt,
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
    };
  }

  /**
   * 数组随机排序
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
