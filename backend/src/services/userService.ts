/**
 * @deprecated 此文件已废弃，请使用 user.service.ts
 * 此文件将在后续版本中移除
 */

import { PrismaClient, User } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export class UserService {
  // 获取用户信息
  static async getUserById(id: string): Promise<User> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          videos: true,
          subscriptions: true,
          subscribers: true,
        },
      });

      if (!user) {
        throw new AppError(404, '用户不存在');
      }

      return user;
    } catch (error) {
      logger.error('获取用户信息失败:', error);
      throw error;
    }
  }

  // 更新用户信息
  static async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return user;
    } catch (error) {
      logger.error('更新用户信息失败:', error);
      throw error;
    }
  }

  // 删除用户
  static async deleteUser(id: string): Promise<void> {
    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('删除用户失败:', error);
      throw error;
    }
  }

  // 获取用户订阅列表
  static async getUserSubscriptions(userId: string) {
    try {
      const subscriptions = await prisma.subscription.findMany({
        where: { subscriberId: userId },
        include: {
          subscribedTo: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      return subscriptions;
    } catch (error) {
      logger.error('获取用户订阅列表失败:', error);
      throw error;
    }
  }

  // 获取用户粉丝列表
  static async getUserSubscribers(userId: string) {
    try {
      const subscribers = await prisma.subscription.findMany({
        where: { subscribedToId: userId },
        include: {
          subscriber: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      return subscribers;
    } catch (error) {
      logger.error('获取用户粉丝列表失败:', error);
      throw error;
    }
  }

  // 订阅/取消订阅用户
  static async toggleSubscription(subscriberId: string, subscribedToId: string): Promise<boolean> {
    try {
      const existingSubscription = await prisma.subscription.findUnique({
        where: {
          subscriberId_subscribedToId: {
            subscriberId,
            subscribedToId,
          },
        },
      });

      if (existingSubscription) {
        // 取消订阅
        await prisma.subscription.delete({
          where: {
            subscriberId_subscribedToId: {
              subscriberId,
              subscribedToId,
            },
          },
        });
        return false;
      } else {
        // 添加订阅
        await prisma.subscription.create({
          data: {
            subscriberId,
            subscribedToId,
          },
        });
        return true;
      }
    } catch (error) {
      logger.error('订阅操作失败:', error);
      throw error;
    }
  }
}
