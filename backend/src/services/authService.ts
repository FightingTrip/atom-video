/**
 * @deprecated 此文件已废弃，请使用 auth.service.ts
 * 此文件将在后续版本中移除
 */

import { PrismaClient, User } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { sendVerificationEmail } from '../utils/email';
import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  // 用户注册
  static async register(username: string, email: string, password: string): Promise<User> {
    try {
      // 检查用户名和邮箱是否已存在
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        throw new AppError(400, '用户名或邮箱已存在');
      }

      // 加密密码
      const hashedPassword = await hash(password, 10);

      // 创建用户
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          verificationToken: uuidv4(),
        },
      });

      // 发送验证邮件
      await sendVerificationEmail(user.email, user.verificationToken);

      return user;
    } catch (error) {
      logger.error('用户注册失败:', error);
      throw error;
    }
  }

  // 用户登录
  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // 查找用户
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AppError(401, '邮箱或密码错误');
      }

      // 验证密码
      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) {
        throw new AppError(401, '邮箱或密码错误');
      }

      // 检查邮箱是否已验证
      if (!user.isVerified) {
        throw new AppError(403, '请先验证邮箱');
      }

      // 生成 JWT token
      const token = sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      return { user, token };
    } catch (error) {
      logger.error('用户登录失败:', error);
      throw error;
    }
  }

  // 验证邮箱
  static async verifyEmail(token: string): Promise<void> {
    try {
      const user = await prisma.user.findFirst({
        where: { verificationToken: token },
      });

      if (!user) {
        throw new AppError(400, '无效的验证令牌');
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationToken: null,
        },
      });
    } catch (error) {
      logger.error('邮箱验证失败:', error);
      throw error;
    }
  }

  // 重置密码请求
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AppError(404, '用户不存在');
      }

      const resetToken = uuidv4();
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpires: new Date(Date.now() + 3600000), // 1小时后过期
        },
      });

      // 发送重置密码邮件
      await sendVerificationEmail(user.email, resetToken, 'reset');
    } catch (error) {
      logger.error('重置密码请求失败:', error);
      throw error;
    }
  }

  // 重置密码
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        throw new AppError(400, '无效或过期的重置令牌');
      }

      const hashedPassword = await hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpires: null,
        },
      });
    } catch (error) {
      logger.error('重置密码失败:', error);
      throw error;
    }
  }

  // 验证 JWT token
  static async verifyToken(token: string): Promise<User> {
    try {
      const decoded = verify(token, JWT_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new AppError(401, '无效的令牌');
      }

      return user;
    } catch (error) {
      logger.error('令牌验证失败:', error);
      throw error;
    }
  }
}
