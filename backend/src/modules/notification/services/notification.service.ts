/**
 * 通知服务
 *
 * 处理通知的创建、查询、标记已读等功能
 * @module notification/services/notification
 */

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { NotificationType } from '../../../models/enums';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建通知
   *
   * @param dto 创建通知DTO
   * @returns 创建的通知
   */
  async create(dto: CreateNotificationDto) {
    try {
      // 验证接收者是否存在
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });

      if (!user) {
        throw new NotFoundException(`接收通知的用户不存在: ${dto.userId}`);
      }

      // 创建通知
      const notification = await this.prisma.notification.create({
        data: {
          userId: dto.userId,
          type: dto.type,
          title: dto.title,
          message: dto.message,
          metadata: dto.metadata || {},
          isRead: false,
          relatedUserId: dto.relatedUserId,
          relatedVideoId: dto.relatedVideoId,
          relatedCommentId: dto.relatedCommentId,
        },
      });

      return notification;
    } catch (error) {
      this.logger.error(`创建通知失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 批量创建通知
   * 适用于需要给多个用户发送相同通知的场景
   *
   * @param dtos 通知数据列表
   */
  async createMany(dtos: CreateNotificationDto[]) {
    try {
      // 批量创建通知
      const result = await this.prisma.notification.createMany({
        data: dtos.map(dto => ({
          userId: dto.userId,
          type: dto.type,
          title: dto.title,
          message: dto.message,
          metadata: dto.metadata || {},
          isRead: false,
          relatedUserId: dto.relatedUserId,
          relatedVideoId: dto.relatedVideoId,
          relatedCommentId: dto.relatedCommentId,
        })),
      });

      return {
        count: result.count,
        success: true,
        message: `已创建 ${result.count} 条通知`,
      };
    } catch (error) {
      this.logger.error(`批量创建通知失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取用户的通知列表
   *
   * @param userId 用户ID
   * @param page 页码
   * @param limit 每页数量
   * @param isRead 是否已读（可选）
   */
  async findAllForUser(userId: string, page = 1, limit = 20, isRead?: boolean) {
    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = { userId };
    if (isRead !== undefined) {
      where.isRead = isRead;
    }

    try {
      const [notifications, total] = await Promise.all([
        this.prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: {
            relatedUser: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
            relatedVideo: {
              select: {
                id: true,
                title: true,
                thumbnailUrl: true,
              },
            },
            relatedComment: {
              select: {
                id: true,
                content: true,
              },
            },
          },
        }),
        this.prisma.notification.count({ where }),
      ]);

      return {
        data: notifications,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`获取用户通知列表失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取用户未读通知数量
   *
   * @param userId 用户ID
   */
  async getUnreadCount(userId: string) {
    try {
      const count = await this.prisma.notification.count({
        where: { userId, isRead: false },
      });

      return { count };
    } catch (error) {
      this.logger.error(`获取未读通知数量失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 标记通知为已读
   *
   * @param id 通知ID
   * @param userId 用户ID (用于验证)
   */
  async markAsRead(id: string, userId: string) {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        throw new NotFoundException(`通知不存在: ${id}`);
      }

      if (notification.userId !== userId) {
        throw new NotFoundException(`没有权限操作此通知`);
      }

      await this.prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });

      return { success: true, message: '通知已标记为已读' };
    } catch (error) {
      this.logger.error(`标记通知已读失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 标记所有通知为已读
   *
   * @param userId 用户ID
   */
  async markAllAsRead(userId: string) {
    try {
      const { count } = await this.prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      return { success: true, message: `已将 ${count} 条通知标记为已读` };
    } catch (error) {
      this.logger.error(`标记所有通知已读失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 删除通知
   *
   * @param id 通知ID
   * @param userId 用户ID (用于验证)
   */
  async remove(id: string, userId: string) {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        throw new NotFoundException(`通知不存在: ${id}`);
      }

      if (notification.userId !== userId) {
        throw new NotFoundException(`没有权限操作此通知`);
      }

      await this.prisma.notification.delete({
        where: { id },
      });

      return { success: true, message: '通知已删除' };
    } catch (error) {
      this.logger.error(`删除通知失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 清除所有已读通知
   *
   * @param userId 用户ID
   */
  async clearReadNotifications(userId: string) {
    try {
      const { count } = await this.prisma.notification.deleteMany({
        where: { userId, isRead: true },
      });

      return { success: true, message: `已清除 ${count} 条已读通知` };
    } catch (error) {
      this.logger.error(`清除已读通知失败: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 发送订阅通知
   * 当创作者上传新视频时，向所有订阅者发送通知
   *
   * @param creatorId 创作者ID
   * @param videoId 视频ID
   * @param videoTitle 视频标题
   */
  async sendSubscriptionNotifications(creatorId: string, videoId: string, videoTitle: string) {
    try {
      // 获取creator信息
      const creator = await this.prisma.user.findUnique({
        where: { id: creatorId },
        select: { id: true, username: true },
      });

      if (!creator) {
        throw new NotFoundException(`创作者不存在: ${creatorId}`);
      }

      // 获取所有启用了通知的订阅者
      const subscribers = await this.prisma.subscription.findMany({
        where: {
          creatorId,
          notificationsEnabled: true,
        },
        select: {
          subscriberId: true,
        },
      });

      if (subscribers.length === 0) {
        return { success: true, message: '没有订阅者需要接收通知', count: 0 };
      }

      // 批量创建通知
      const notificationsData = subscribers.map(sub => ({
        userId: sub.subscriberId,
        type: NotificationType.NEW_VIDEO,
        title: '订阅更新',
        message: `${creator.username} 发布了新视频: ${videoTitle}`,
        relatedUserId: creatorId,
        relatedVideoId: videoId,
        metadata: {
          creatorName: creator.username,
        },
      }));

      const result = await this.prisma.notification.createMany({
        data: notificationsData,
      });

      return {
        success: true,
        message: `已发送 ${result.count} 条订阅通知`,
        count: result.count,
      };
    } catch (error) {
      this.logger.error(`发送订阅通知失败: ${error.message}`, error.stack);
      throw error;
    }
  }
}
