/**
 * 用户服务模块
 *
 * 提供用户相关的业务逻辑实现
 * @module user/services/user
 */

import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@atom/shared-types/models';

/**
 * 创建用户DTO
 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  name?: string;
  role?: string;
  isVerified?: boolean;
  isCreator?: boolean;
}

/**
 * 用户服务类
 * 管理用户相关的业务逻辑
 */
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 创建用户
   * @param createUserDto 创建用户数据
   * @returns 创建的用户信息
   */
  async createUser(createUserDto: CreateUserDto) {
    // 检查用户名和电子邮件是否已存在
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: createUserDto.username }, { email: createUserDto.email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('用户名已被使用');
      }
      throw new ConflictException('电子邮件已被注册');
    }

    // 哈希密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // 创建用户
    const user = await this.prismaService.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        role: createUserDto.role || UserRole.USER,
        isVerified: createUserDto.isVerified || false,
        isCreator: createUserDto.isCreator || false,
      },
    });

    // 不返回密码
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * 根据ID查找用户
   * @param id 用户ID
   * @returns 用户信息
   */
  async findById(id: string) {
    this.logger.log(`正在查找用户ID: ${id}`);

    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        isCreator: true,
        experienceLevel: true,
        // 不返回密码和其他敏感信息
      },
    });

    if (!user) {
      this.logger.warn(`未找到用户ID: ${id}`);
      throw new NotFoundException(`未找到ID为 ${id} 的用户`);
    }

    return user;
  }

  /**
   * 根据用户名查找用户
   * @param username 用户名
   * @returns 用户信息
   */
  async findByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  /**
   * 根据邮箱查找用户
   * @param email 邮箱
   * @returns 用户信息
   */
  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }
}
