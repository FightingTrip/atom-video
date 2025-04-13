/**
 * 认证服务模块
 *
 * 提供认证相关的业务逻辑实现
 * @module auth/services/auth
 */

import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@atom/shared-types/models';

import {
  LoginDto,
  RegisterDto,
  TokenResponse,
  RequestPasswordResetDto,
  ResetPasswordDto,
  RefreshTokenDto,
} from '../models/auth.model';
import { UserService } from '../../user/services/user.service';
import { CreateUserDto } from '../../user/services/user.service';
import { PrismaService } from '../../../prisma/prisma.service';

// 定义错误类型接口
interface AppError {
  message: string;
  name?: string;
  statusCode?: number;
}

/**
 * 认证服务类
 * 管理用户认证相关的业务逻辑
 */
@Injectable()
export class AuthService {
  /**
   * 构造函数，注入依赖
   * @param userService 用户服务
   * @param jwtService JWT服务
   * @param configService 配置服务
   * @param prismaService Prisma服务
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {}

  /**
   * 处理用户登录
   * @param loginDto 登录数据
   * @returns 令牌信息
   * @throws UnauthorizedError 凭据无效
   */
  async login(loginDto: LoginDto): Promise<TokenResponse> {
    try {
      // 根据邮箱查找用户
      const user = await this.prismaService.user.findFirst({
        where: { email: loginDto.email },
      });

      if (!user) {
        throw new UnauthorizedException('无效的邮箱或密码');
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('无效的邮箱或密码');
      }

      // 创建令牌并返回
      return this.generateTokens(user.id, user.role);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('登录失败');
    }
  }

  /**
   * 处理用户注册
   * @param registerDto 注册数据
   * @returns 令牌信息
   * @throws BadRequestException 验证失败
   * @throws ConflictException 用户已存在
   */
  async register(registerDto: RegisterDto): Promise<TokenResponse> {
    try {
      // 将注册DTO转换为创建用户DTO
      const createUserDto: CreateUserDto = {
        username: registerDto.username,
        email: registerDto.email,
        password: registerDto.password,
        name: registerDto.name,
        role: UserRole.USER,
        isVerified: false, // 默认未验证
        isCreator: false, // 默认不是创作者
      };

      // 创建用户
      const user = await this.userService.createUser(createUserDto);

      // 生成令牌
      return this.generateTokens(user.id, user.role);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const appError = error as AppError;
      throw new BadRequestException('注册失败: ' + (appError.message || '未知错误'));
    }
  }

  /**
   * 刷新访问令牌
   * @param refreshTokenDto 刷新令牌DTO
   * @returns 新的令牌信息
   * @throws UnauthorizedException 刷新令牌无效
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokenResponse> {
    try {
      // 根据刷新令牌查找对应记录
      const refreshTokenRecord = await this.prismaService.refreshToken.findUnique({
        where: { token: refreshTokenDto.refresh_token },
        include: { user: true },
      });

      if (!refreshTokenRecord) {
        throw new UnauthorizedException('刷新令牌无效');
      }

      // 检查令牌是否已过期
      if (new Date() > refreshTokenRecord.expiresAt) {
        // 删除过期令牌
        await this.prismaService.refreshToken.delete({
          where: { id: refreshTokenRecord.id },
        });

        throw new UnauthorizedException('刷新令牌已过期');
      }

      // 删除旧的刷新令牌
      await this.prismaService.refreshToken.delete({
        where: { id: refreshTokenRecord.id },
      });

      // 生成新的令牌
      return this.generateTokens(refreshTokenRecord.userId, refreshTokenRecord.user.role);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('刷新令牌处理失败');
    }
  }

  /**
   * 退出登录
   * @param userId 用户ID
   * @param refreshToken 刷新令牌
   */
  async logout(userId: string, refreshToken: string): Promise<void> {
    // 删除用户的刷新令牌
    await this.prismaService.refreshToken.deleteMany({
      where: {
        userId,
        token: refreshToken,
      },
    });
  }

  /**
   * 退出所有设备登录
   * @param userId 用户ID
   */
  async logoutAll(userId: string): Promise<void> {
    // 删除用户的所有刷新令牌
    await this.prismaService.refreshToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * 请求密码重置
   * @param requestDto 请求数据
   * @throws NotFoundException 邮箱不存在
   */
  async requestPasswordReset(requestDto: RequestPasswordResetDto): Promise<void> {
    try {
      // 根据邮箱查找用户
      const user = await this.prismaService.user.findFirst({
        where: { email: requestDto.email },
      });

      if (!user) {
        throw new NotFoundException('该邮箱地址未注册');
      }

      // 生成重置令牌
      const token = this.generateRandomString(32);
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); // 令牌1小时有效

      // 存储重置令牌
      await this.prismaService.passwordReset.create({
        data: {
          userId: user.id,
          token,
          expiresAt: expires,
        },
      });

      // 在实际应用中，这里应该发送邮件，包含重置链接
      // 为演示需要，这里只打印出令牌
      console.log(`Password reset token for ${user.email}: ${token}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const appError = error as AppError;
      throw new BadRequestException('请求密码重置失败: ' + (appError.message || '未知错误'));
    }
  }

  /**
   * 重置密码
   * @param resetDto 重置数据
   * @throws BadRequestException 密码无效
   * @throws NotFoundException 令牌无效
   */
  async resetPassword(resetDto: ResetPasswordDto): Promise<void> {
    try {
      // 查找重置令牌
      const resetRecord = await this.prismaService.passwordReset.findFirst({
        where: {
          token: resetDto.token,
          expiresAt: { gt: new Date() }, // 确保令牌未过期
        },
      });

      if (!resetRecord) {
        throw new NotFoundException('重置令牌无效或已过期');
      }

      // 哈希新密码
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(resetDto.password, salt);

      // 更新用户密码
      await this.prismaService.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      });

      // 删除所有重置令牌
      await this.prismaService.passwordReset.deleteMany({
        where: { userId: resetRecord.userId },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const appError = error as AppError;
      throw new BadRequestException('重置密码失败: ' + (appError.message || '未知错误'));
    }
  }

  /**
   * 生成访问令牌和刷新令牌
   * @param userId 用户ID
   * @param role 用户角色
   * @returns 令牌信息
   */
  private async generateTokens(userId: string, role: string): Promise<TokenResponse> {
    // 确定过期时间
    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1h');
    const refreshTokenExpiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN', '7d');

    // 创建JWT载荷
    const payload = {
      sub: userId,
      role: role,
    };

    // 签发访问令牌
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: jwtExpiresIn,
    });

    // 创建刷新令牌
    const refreshToken = uuidv4();
    const refreshTokenExpires = new Date();
    refreshTokenExpires.setSeconds(
      refreshTokenExpires.getSeconds() + this.parseTimeString(refreshTokenExpiresIn)
    );

    // 存储刷新令牌到数据库
    await this.storeRefreshToken(userId, refreshToken, refreshTokenExpires);

    // 返回令牌信息
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: this.parseTimeString(jwtExpiresIn),
    };
  }

  /**
   * 存储刷新令牌到数据库
   * @param userId 用户ID
   * @param token 刷新令牌
   * @param expiresAt 过期时间
   */
  private async storeRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await this.prismaService.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  /**
   * 解析时间字符串为秒数
   * @param timeString 时间字符串，如 '1d', '2h', '30m'
   * @returns 秒数
   */
  private parseTimeString(timeString: string): number {
    const match = timeString.match(/^(\d+)([smhdwy])$/);
    if (!match) {
      return 3600; // 默认1小时
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      case 'w':
        return value * 7 * 24 * 60 * 60;
      case 'y':
        return value * 365 * 24 * 60 * 60;
      default:
        return 3600;
    }
  }

  /**
   * 生成随机字符串
   * @param length 字符串长度
   * @returns 随机字符串
   */
  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
