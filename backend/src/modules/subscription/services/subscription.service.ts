/**
 * 订阅服务
 *
 * 处理用户与创作者之间的订阅关系
 * @module subscription/services/subscription.service
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
   * 创建订阅关系
   *
   * @param userId 用户ID
   * @param creatorId 创作者ID
   * @param notificationEnabled 是否启用通知
   * @returns 订阅记录
   */
  async subscribe(userId: string, creatorId: string, notificationEnabled = true) {
    // 验证用户ID与创作者ID不能相同
    if (userId === creatorId) {
      this.logger.warn(`用户 ${userId} 尝试订阅自己`);
      throw new BadRequestException('不能订阅自己');
    }

    // 检查创作者是否存在
    const creator = await this.prisma.user.findUnique({
      where: { id: creatorId },
    });

    if (!creator) {
      this.logger.warn(`创作者 ${creatorId} 不存在`);
      throw new NotFoundException(`创作者不存在`);
    }

    try {
      // 检查是否已订阅
      const existingSubscription = await this.prisma.subscription.findUnique({
        where: {
          userId_creatorId: {
            userId,
            creatorId,
          },
        },
      });

      if (existingSubscription) {
        this.logger.log(`用户 ${userId} 已订阅创作者 ${creatorId}`);
        return existingSubscription;
      }

      // 创建订阅
      const subscription = await this.prisma.subscription.create({
        data: {
          userId,
          creatorId,
          notificationEnabled,
          subscribedAt: new Date(),
        },
      });

      this.logger.log(`用户 ${userId} 成功订阅创作者 ${creatorId}`);
      return subscription;
    } catch (error) {
      this.logger.error(`订阅失败: ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException('订阅创建失败');
    }
  }

  /**
   * 取消订阅
   *
   * @param userId 用户ID
   * @param creatorId 创作者ID
   * @returns 取消的订阅记录
   */
  async unsubscribe(userId: string, creatorId: string) {
    try {
      // 检查是否已订阅
      const subscription = await this.prisma.subscription.findUnique({
        where: {
          userId_creatorId: {
            userId,
            creatorId,
          },
        },
      });

      if (!subscription) {
        this.logger.warn(`用户 ${userId} 未订阅创作者 ${creatorId}`);
        throw new NotFoundException('未找到订阅记录');
      }

      // 删除订阅
      const deletedSubscription = await this.prisma.subscription.delete({
        where: {
          userId_creatorId: {
            userId,
            creatorId,
          },
        },
      });

      this.logger.log(`用户 ${userId} 成功取消订阅创作者 ${creatorId}`);
      return deletedSubscription;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`取消订阅失败: ${error instanceof Error ? error.message : String(error)}`);
      throw new BadRequestException('取消订阅失败');
    }
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
          where: { userId },
          include: {
            creator: {
              select: {
                id: true,
                username: true,
                avatar: true,
                bio: true,
                createdAt: true,
                // 添加其他需要的创作者信息
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
          where: { userId },
        }),
      ]);

      return {
        data: subscriptions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(
        `获取用户订阅列表失败: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('获取订阅列表失败');
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

    try {
      const [subscribers, total] = await Promise.all([
        this.prisma.subscription.findMany({
          where: { creatorId },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                // 其他需要的用户信息
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
          where: { creatorId },
        }),
      ]);

      return {
        data: subscribers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(
        `获取创作者订阅者列表失败: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('获取订阅者列表失败');
    }
  }

  /**
   * 获取创作者的订阅者数量
   *
   * @param creatorId 创作者ID
   * @returns 订阅者数量
   */
  async getSubscriberCount(creatorId: string): Promise<number> {
    try {
      const count = await this.prisma.subscription.count({
        where: { creatorId },
      });

      return count;
    } catch (error) {
      this.logger.error(
        `获取创作者订阅者数量失败: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('获取订阅者数量失败');
    }
  }

  /**
   * 检查用户是否已订阅创作者
   *
   * @param userId 用户ID
   * @param creatorId 创作者ID
   * @returns 是否已订阅及订阅信息
   */
  async checkSubscriptionStatus(userId: string, creatorId: string) {
    try {
      const subscription = await this.prisma.subscription.findUnique({
        where: {
          userId_creatorId: {
            userId,
            creatorId,
          },
        },
      });

      return {
        isSubscribed: !!subscription,
        notificationEnabled: subscription?.notificationEnabled || false,
        subscribedAt: subscription?.subscribedAt || null,
      };
    } catch (error) {
      this.logger.error(
        `检查订阅状态失败: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('检查订阅状态失败');
    }
  }

  /**
   * 更新订阅通知设置
   *
   * @param userId 用户ID
   * @param creatorId 创作者ID
   * @param notificationEnabled 是否启用通知
   * @returns 更新后的订阅记录
   */
  async updateNotificationSettings(
    userId: string,
    creatorId: string,
    notificationEnabled: boolean
  ) {
    try {
      // 检查是否已订阅
      const subscription = await this.prisma.subscription.findUnique({
        where: {
          userId_creatorId: {
            userId,
            creatorId,
          },
        },
      });

      if (!subscription) {
        this.logger.warn(`用户 ${userId} 未订阅创作者 ${creatorId}, 无法更新通知设置`);
        throw new NotFoundException('未找到订阅记录');
      }

      // 更新通知设置
      const updatedSubscription = await this.prisma.subscription.update({
        where: {
          userId_creatorId: {
            userId,
            creatorId,
          },
        },
        data: {
          notificationEnabled,
        },
      });

      this.logger.log(
        `用户 ${userId} 成功更新对创作者 ${creatorId} 的通知设置为 ${notificationEnabled}`
      );
      return updatedSubscription;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `更新通知设置失败: ${error instanceof Error ? error.message : String(error)}`
      );
      throw new BadRequestException('更新通知设置失败');
    }
  }
}
