import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/app-error';
import config from '../config/env';

/**
 * 认证服务 - 处理用户认证相关业务逻辑
 */
export class AuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 用户注册
   */
  async register(
    email: string,
    password: string,
    username: string
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    try {
      // 检查邮箱是否已被使用
      const existingUserByEmail = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUserByEmail) {
        throw new AppError('邮箱已被注册', 400);
      }

      // 检查用户名是否已被使用
      const existingUserByUsername = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUserByUsername) {
        throw new AppError('用户名已被使用', 400);
      }

      // 密码加密
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建用户
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          role: 'USER',
        },
      });

      // 生成JWT
      const token = this.generateToken(user);

      // 返回用户信息(排除密码)和token
      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('注册失败', 500);
    }
  }

  /**
   * 用户登录
   */
  async login(
    email: string,
    password: string
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    try {
      // 查找用户
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AppError('邮箱或密码不正确', 401);
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('邮箱或密码不正确', 401);
      }

      // 生成JWT
      const token = this.generateToken(user);

      // 返回用户信息(排除密码)和token
      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('登录失败', 500);
    }
  }

  /**
   * 验证Token
   */
  async verifyToken(token: string): Promise<{ id: string; email: string; role: string }> {
    try {
      // 验证token
      const decoded = jwt.verify(token, config.jwt.secret) as {
        id: string;
        email: string;
        role: string;
      };

      // 检查用户是否存在
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new AppError('无效的token', 401);
      }

      return { id: user.id, email: user.email, role: user.role };
    } catch (error) {
      throw new AppError('无效的token', 401);
    }
  }

  /**
   * 生成JWT
   */
  private generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }
}
