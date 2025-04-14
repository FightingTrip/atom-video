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
import { UserRole } from '../../../models/enums';

import {
  LoginDto,
  RegisterDto,
  TokenResponse,
  RequestPasswordResetDto,
  ResetPasswordDto,
  RefreshTokenDto,
  VerifyCodeDto,
  ResetPasswordWithCodeDto,
} from '../models/auth.model';
import { UserService } from '../../user/services/user.service';
import { CreateUserDto } from '../../user/services/user.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { MailService } from '../../../shared/services/mail.service';

// 定义错误类型接口
interface AppError {
  message: string;
  name?: string;
  statusCode?: number;
}

/**
 * OAuth用户验证数据
 */
interface OAuthUserData {
  provider: string;
  providerId: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
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
   * @param mailService 邮件服务
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService
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
        role: UserRole.VIEWER,
        isVerified: false, // 默认未验证
        isCreator: false, // 默认不是创作者
      };

      // 创建用户
      const user = await this.userService.createUser(createUserDto);

      // 发送欢迎邮件
      try {
        await this.mailService.sendWelcomeEmail(user.email, user.username);
      } catch (emailError) {
        console.error('发送欢迎邮件失败', emailError);
        // 不阻止注册流程继续
      }

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

      // 生成6位数字验证码
      const verificationCode = this.generateVerificationCode(6);

      // 设置验证码有效期为30分钟
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);

      // 存储验证码
      await this.prismaService.verificationCode.create({
        data: {
          email: user.email,
          code: verificationCode,
          type: 'PASSWORD_RESET',
          expiresAt,
        },
      });

      // 发送验证码邮件
      await this.mailService.sendVerificationCode(user.email, verificationCode);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const appError = error as AppError;
      throw new BadRequestException('请求密码重置失败: ' + (appError.message || '未知错误'));
    }
  }

  /**
   * 验证验证码
   * @param verifyDto 验证数据
   * @returns 是否验证成功
   */
  async verifyCode(verifyDto: VerifyCodeDto): Promise<boolean> {
    const { email, code } = verifyDto;

    // 查找验证码记录
    const verificationRecord = await this.prismaService.verificationCode.findFirst({
      where: {
        email,
        code,
        type: 'PASSWORD_RESET',
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verificationRecord) {
      throw new BadRequestException('验证码无效或已过期');
    }

    return true;
  }

  /**
   * 使用验证码重置密码
   * @param resetDto 重置数据
   */
  async resetPasswordWithCode(resetDto: ResetPasswordWithCodeDto): Promise<void> {
    try {
      // 验证验证码
      const verificationRecord = await this.prismaService.verificationCode.findFirst({
        where: {
          email: resetDto.email,
          code: resetDto.code,
          type: 'PASSWORD_RESET',
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (!verificationRecord) {
        throw new BadRequestException('验证码无效或已过期');
      }

      // 查找用户
      const user = await this.prismaService.user.findFirst({
        where: { email: resetDto.email },
      });

      if (!user) {
        throw new NotFoundException('用户不存在');
      }

      // 哈希新密码
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(resetDto.password, salt);

      // 更新用户密码
      await this.prismaService.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      // 将验证码标记为已使用
      await this.prismaService.verificationCode.update({
        where: { id: verificationRecord.id },
        data: { isUsed: true },
      });

      // 删除该用户所有的密码重置记录
      await this.prismaService.passwordReset.deleteMany({
        where: { userId: user.id },
      });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      const appError = error as AppError;
      throw new BadRequestException('重置密码失败: ' + (appError.message || '未知错误'));
    }
  }

  /**
   * 验证OAuth用户
   * 如果用户存在则登录，不存在则创建新用户
   *
   * @param userData OAuth用户数据
   * @returns 用户信息和token
   */
  async validateOAuthUser(userData: OAuthUserData) {
    try {
      // 先检查是否有使用该第三方账号登录过的用户
      let user = await this.prismaService.user.findFirst({
        where: {
          OR: [
            {
              oauthAccounts: {
                some: {
                  provider: userData.provider,
                  providerId: userData.providerId,
                },
              },
            },
            // 如果邮箱重复，关联到现有用户
            { email: userData.email },
          ],
        },
        include: {
          oauthAccounts: true,
        },
      });

      // 如果用户不存在，创建新用户
      if (!user) {
        // 为用户名添加随机后缀以确保唯一性
        let uniqueUsername = userData.username;
        let isUnique = false;
        let attempt = 0;

        while (!isUnique) {
          const existingUser = await this.prismaService.user.findUnique({
            where: { username: uniqueUsername },
          });

          if (existingUser) {
            attempt++;
            uniqueUsername = `${userData.username}_${attempt}`;
          } else {
            isUnique = true;
          }
        }

        // 创建用户
        user = await this.prismaService.user.create({
          data: {
            email: userData.email,
            username: uniqueUsername,
            displayName: userData.displayName,
            name: userData.displayName,
            password: this.generateRandomString(16), // 生成随机密码
            avatarUrl: userData.avatarUrl,
            isVerified: true, // OAuth用户视为已验证
            role: UserRole.VIEWER,
            oauthAccounts: {
              create: {
                provider: userData.provider,
                providerId: userData.providerId,
              },
            },
          },
          include: {
            oauthAccounts: true,
          },
        });

        console.log(`创建新OAuth用户: ${user.username}, 提供商: ${userData.provider}`);
      }
      // 如果用户存在但没有关联此OAuth账号，则添加关联
      else if (
        !user.oauthAccounts.some(
          account =>
            account.provider === userData.provider && account.providerId === userData.providerId
        )
      ) {
        await this.prismaService.oAuthAccount.create({
          data: {
            userId: user.id,
            provider: userData.provider,
            providerId: userData.providerId,
          },
        });

        console.log(`为用户 ${user.username} 添加新的OAuth关联: ${userData.provider}`);
      }

      // 生成token
      const token = await this.generateTokens(user.id, user.role);

      return {
        user,
        token,
      };
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`OAuth用户验证失败: ${err.message}`, err.stack);
      throw new Error(`OAuth认证失败: ${err.message}`);
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
   * 生成验证码
   * @param length 验证码长度
   * @returns 生成的验证码
   */
  private generateVerificationCode(length: number): string {
    const digits = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return result;
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
