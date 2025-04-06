import { PrismaClient, User } from '@prisma/client';
import { AppError } from '../utils/app-error';

/**
 * 用户服务 - 处理用户相关业务逻辑
 */
export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 获取所有用户
   */
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new AppError('获取用户列表失败', 500);
    }
  }

  /**
   * 根据ID获取用户
   */
  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new AppError('用户不存在', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('获取用户失败', 500);
    }
  }

  /**
   * 更新用户资料
   */
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      // 检查用户是否存在
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new AppError('用户不存在', 404);
      }

      // 不允许更新某些字段
      const { password, email, role, ...updateData } = userData;

      return await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('更新用户失败', 500);
    }
  }

  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<void> {
    try {
      // 检查用户是否存在
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new AppError('用户不存在', 404);
      }

      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('删除用户失败', 500);
    }
  }

  /**
   * 获取用户的视频列表
   */
  async getUserVideos(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError('用户不存在', 404);
      }

      return await this.prisma.video.findMany({
        where: { creatorId: userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('获取用户视频失败', 500);
    }
  }
}
