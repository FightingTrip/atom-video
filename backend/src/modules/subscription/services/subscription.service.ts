/**
 * 订阅服务
 *
 * 处理用户与创作者之间的订阅关系
 * @module subscription/services/subscription.service
 */

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  SubscriptionDto,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  CheckSubscriptionDto,
  BulkCheckSubscriptionDto,
} from '../dto';
import {
  SubscriptionResponseDto,
  SubscriberItemDto,
  CreatorSubscriptionDto,
  CreatorDetailDto,
} from '../dto/subscription-response.dto';
import { SubscriberStats } from '../models';

/**
 * 订阅服务类
 *
 * 提供订阅相关的业务逻辑功能
 */
@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 订阅创作者
   *
   * @param userId 用户ID
   * @param dto 订阅创建DTO
   * @returns 订阅响应DTO
   */
  async subscribe(userId: string, dto: CreateSubscriptionDto): Promise<SubscriptionResponseDto> {
    // 检查创作者是否存在
    const creator = await this.prisma.user.findUnique({
      where: { id: dto.creatorId },
      select: { id: true, isCreator: true },
    });

    if (!creator) {
      throw new NotFoundException('创作者不存在');
    }

    if (!creator.isCreator) {
      throw new BadRequestException('该用户不是创作者');
    }

    // 检查是否已经订阅
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: {
        subscriberId_creatorId: {
          subscriberId: userId,
          creatorId: dto.creatorId,
        },
      },
    });

    if (existingSubscription) {
      throw new ConflictException('您已经订阅了该创作者');
    }

    // 创建订阅记录
    const subscription = await this.prisma.subscription.create({
      data: {
        subscriberId: userId,
        creatorId: dto.creatorId,
        notificationsEnabled: dto.notificationsEnabled ?? true,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true,
          },
        },
      },
    });

    return {
      id: subscription.id,
      creatorId: subscription.creatorId,
      subscribedAt: subscription.createdAt.toISOString(),
      notificationsEnabled: subscription.notificationsEnabled,
      creator: {
        id: subscription.creator.id,
        username: subscription.creator.username,
        avatarUrl: subscription.creator.avatarUrl,
        bio: subscription.creator.bio,
      },
    };
  }

  /**
   * 取消订阅
   *
   * @param userId 用户ID
   * @param creatorId 创作者ID
   * @returns 操作成功消息
   */
  async unsubscribe(userId: string, creatorId: string): Promise<{ message: string }> {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        subscriberId_creatorId: {
          subscriberId: userId,
          creatorId,
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('您没有订阅该创作者');
    }

    await this.prisma.subscription.delete({
      where: {
        id: subscription.id,
      },
    });

    return { message: '已成功取消订阅' };
  }

  /**
   * 更新订阅通知设置
   *
   * @param userId 用户ID
   * @param creatorId 创作者ID
   * @param dto 更新订阅DTO
   * @returns 订阅响应DTO
   */
  async updateSubscription(
    userId: string,
    creatorId: string,
    dto: UpdateSubscriptionDto
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        subscriberId_creatorId: {
          subscriberId: userId,
          creatorId,
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('您没有订阅该创作者');
    }

    const updatedSubscription = await this.prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        notificationsEnabled: dto.notificationsEnabled,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true,
          },
        },
      },
    });

    return {
      id: updatedSubscription.id,
      creatorId: updatedSubscription.creatorId,
      subscribedAt: updatedSubscription.createdAt.toISOString(),
      notificationsEnabled: updatedSubscription.notificationsEnabled,
      creator: {
        id: updatedSubscription.creator.id,
        username: updatedSubscription.creator.username,
        avatarUrl: updatedSubscription.creator.avatarUrl,
        bio: updatedSubscription.creator.bio,
      },
    };
  }

  /**
   * 获取用户的订阅列表
   *
   * @param userId 用户ID
   * @param page 页码
   * @param limit 每页数量
   * @returns 订阅列表及分页信息
   */
  async getUserSubscriptions(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    try {
      const [subscriptions, total] = await Promise.all([
        this.prisma.subscription.findMany({
          where: { subscriberId: userId },
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
                bio: true,
                _count: {
                  select: {
                    videos: true,
                    subscribedBy: true,
                  },
                },
              },
            },
          },
          skip,
          take: limit,
          orderBy: {
            subscribedAt: 'desc',
          },
        }),
        this.prisma.subscription.count({
          where: { subscriberId: userId },
        }),
      ]);

      return {
        data: subscriptions.map(sub => ({
          id: sub.id,
          creatorId: sub.creatorId,
          subscribedAt: sub.createdAt.toISOString(),
          notificationsEnabled: sub.notificationsEnabled,
          creator: {
            id: sub.creator.id,
            username: sub.creator.username,
            avatarUrl: sub.creator.avatarUrl,
            bio: sub.creator.bio,
            videosCount: sub.creator._count.videos,
            subscribersCount: sub.creator._count.subscribedBy,
          },
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`获取用户订阅列表失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取创作者的订阅者列表
   *
   * @param creatorId 创作者ID
   * @param page 页码
   * @param limit 每页数量
   * @returns 订阅者列表及分页信息
   */
  async getCreatorSubscribers(creatorId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // 检查创作者是否存在
    const creator = await this.prisma.user.findUnique({
      where: { id: creatorId },
      select: { id: true, isCreator: true },
    });

    if (!creator) {
      throw new NotFoundException('创作者不存在');
    }

    try {
      const [subscribers, total] = await Promise.all([
        this.prisma.subscription.findMany({
          where: { creatorId },
          include: {
            subscriber: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.subscription.count({
          where: { creatorId },
        }),
      ]);

      const subscriberItems: SubscriberItemDto[] = subscribers.map(sub => ({
        id: sub.id,
        subscriberId: sub.subscriberId,
        createdAt: sub.createdAt.toISOString(),
        subscriber: {
          id: sub.subscriber.id,
          username: sub.subscriber.username,
          avatarUrl: sub.subscriber.avatarUrl,
        },
      }));

      return {
        data: subscriberItems,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`获取创作者订阅者列表失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取创作者统计数据
   *
   * @param creatorId 创作者ID
   * @returns 创作者统计数据
   */
  async getCreatorStats(creatorId: string): Promise<SubscriberStats> {
    // 检查创作者是否存在
    const creator = await this.prisma.user.findUnique({
      where: { id: creatorId },
      select: { id: true, isCreator: true },
    });

    if (!creator) {
      throw new NotFoundException('创作者不存在');
    }

    if (!creator.isCreator) {
      throw new BadRequestException('该用户不是创作者');
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    try {
      // 获取总订阅者数
      const total = await this.prisma.subscription.count({
        where: { creatorId },
      });

      // 获取一个月内新增的订阅者数
      const newThisMonth = await this.prisma.subscription.count({
        where: {
          creatorId,
          createdAt: { gte: oneMonthAgo },
        },
      });

      // 获取两个月前的订阅者数量，用于计算增长率
      const twoMonthsAgo = new Date(oneMonthAgo);
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 1);

      const lastMonthCount = await this.prisma.subscription.count({
        where: {
          creatorId,
          createdAt: {
            gte: twoMonthsAgo,
            lt: oneMonthAgo,
          },
        },
      });

      // 计算增长率
      let growthRate = 0;
      if (lastMonthCount > 0) {
        growthRate = ((newThisMonth - lastMonthCount) / lastMonthCount) * 100;
      } else if (newThisMonth > 0) {
        growthRate = 100; // 如果上月没有但本月有，则增长率为100%
      }

      // 获取启用通知的订阅者百分比
      const enabledNotifications = await this.prisma.subscription.count({
        where: {
          creatorId,
          notificationsEnabled: true,
        },
      });

      const notificationEnabledPercentage = total > 0 ? (enabledNotifications / total) * 100 : 0;

      return {
        total,
        newThisMonth,
        growthRate,
        notificationEnabledPercentage,
      };
    } catch (error) {
      this.logger.error(`获取创作者统计数据失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 检查是否已订阅创作者
   *
   * @param userId 用户ID
   * @param creatorId 创作者ID
   * @returns 订阅状态
   */
  async checkSubscription(userId: string, creatorId: string): Promise<{ isSubscribed: boolean }> {
    try {
      const subscription = await this.prisma.subscription.findUnique({
        where: {
          subscriberId_creatorId: {
            subscriberId: userId,
            creatorId,
          },
        },
      });

      return {
        isSubscribed: !!subscription,
      };
    } catch (error) {
      this.logger.error(`检查订阅状态失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 批量检查订阅状态
   *
   * @param userId 用户ID
   * @param creatorIds 创作者ID列表
   * @returns 订阅状态映射
   */
  async bulkCheckSubscription(
    userId: string,
    creatorIds: string[]
  ): Promise<{ [key: string]: boolean }> {
    try {
      const subscriptions = await this.prisma.subscription.findMany({
        where: {
          subscriberId: userId,
          creatorId: { in: creatorIds },
        },
        select: {
          creatorId: true,
        },
      });

      const subscriptionMap = subscriptions.reduce(
        (acc, { creatorId }) => {
          acc[creatorId] = true;
          return acc;
        },
        {} as { [key: string]: boolean }
      );

      return creatorIds.reduce(
        (acc, creatorId) => {
          acc[creatorId] = !!subscriptionMap[creatorId];
          return acc;
        },
        {} as { [key: string]: boolean }
      );
    } catch (error) {
      this.logger.error(`批量检查订阅状态失败: ${error.message}`, error.stack);
      throw error;
    }
  }
}
