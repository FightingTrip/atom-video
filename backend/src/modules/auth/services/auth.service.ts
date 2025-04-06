/**
 * 认证服务模块
 * 
 * 提供认证相关的业务逻辑实现
 * @module auth/services/auth
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { 
  LoginDto, 
  RegisterDto, 
  TokenResponse, 
  RequestPasswordResetDto, 
  ResetPasswordDto, 
  RefreshTokenDto,
  AuthSession
} from '../models/auth.model';
import { UserService } from '../../user/services/user.service';
import { CreateUserDto } from '../../user/models/user.model';
import { 
  withDbClient, 
  performTransaction,
  getPrismaClient
} from '../../common/utils/db-helpers';
import { 
  NotFoundError, 
  ConflictError, 
  ValidationError, 
  UnauthorizedError, 
  ForbiddenError
} from '../../common/utils/app-error';
import { removeNullUndefined, generateRandomString } from '../../common/utils/helpers';

/**
 * 认证服务类
 * 管理用户认证相关的业务逻辑
 */
export class AuthService {
  private userService: UserService;
  private jwtSecret: string;
  private jwtExpiresIn: string;
  private refreshTokenExpiresIn: string;

  constructor() {
    this.userService = new UserService();
    this.jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
    this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
  }

  /**
   * 处理用户登录
   * @param loginDto 登录数据
   * @returns 令牌信息
   * @throws UnauthorizedError 凭据无效
   */
  async login(loginDto: LoginDto): Promise<TokenResponse> {
    return withDbClient(async prisma => {
      // 根据用户名或者邮箱查找用户
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: loginDto.username },
            { email: loginDto.username }
          ]
        }
      });

      if (!user) {
        throw new UnauthorizedError('无效的用户名或密码');
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedError('无效的用户名或密码');
      }

      // 创建令牌并返回
      return this.generateTokens(user.id, user.role);
    });
  }

  /**
   * 处理用户注册
   * @param registerDto 注册数据
   * @returns 令牌信息
   * @throws ValidationError 验证失败
   * @throws ConflictError 用户已存在
   */
  async register(registerDto: RegisterDto): Promise<TokenResponse> {
    // 校验密码和确认密码是否一致
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new ValidationError('密码和确认密码不匹配');
    }

    // 将注册DTO转换为创建用户DTO
    const createUserDto: CreateUserDto = {
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
      name: registerDto.name,
      role: 'USER', // 默认角色为普通用户
      isVerified: false, // 默认未验证
      isCreator: false // 默认不是创作者
    };

    // 创建用户
    const user = await this.userService.createUser(createUserDto);

    // 生成令牌
    return this.generateTokens(user.id, user.role);
  }

  /**
   * 刷新访问令牌
   * @param refreshTokenDto 刷新令牌DTO
   * @returns 新的令牌信息
   * @throws UnauthorizedError 刷新令牌无效
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokenResponse> {
    return withDbClient(async prisma => {
      try {
        // 根据刷新令牌查找对应记录
        const refreshTokenRecord = await prisma.refreshToken.findUnique({
          where: { token: refreshTokenDto.refreshToken },
          include: { user: true }
        });

        if (!refreshTokenRecord) {
          throw new UnauthorizedError('刷新令牌无效');
        }

        // 检查令牌是否已过期
        if (new Date() > refreshTokenRecord.expiresAt) {
          // 删除过期令牌
          await prisma.refreshToken.delete({
            where: { id: refreshTokenRecord.id }
          });
          
          throw new UnauthorizedError('刷新令牌已过期');
        }

        // 删除旧的刷新令牌
        await prisma.refreshToken.delete({
          where: { id: refreshTokenRecord.id }
        });

        // 生成新的令牌
        return this.generateTokens(refreshTokenRecord.userId, refreshTokenRecord.user.role);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          throw error;
        }
        throw new UnauthorizedError('刷新令牌处理失败');
      }
    });
  }

  /**
   * 退出登录
   * @param userId 用户ID
   * @param refreshToken 刷新令牌
   */
  async logout(userId: string, refreshToken: string): Promise<void> {
    return performTransaction(async prisma => {
      // 删除用户的刷新令牌
      await prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken
        }
      });
    });
  }

  /**
   * 退出所有设备登录
   * @param userId 用户ID
   */
  async logoutAll(userId: string): Promise<void> {
    return performTransaction(async prisma => {
      // 删除用户的所有刷新令牌
      await prisma.refreshToken.deleteMany({
        where: { userId }
      });
    });
  }

  /**
   * 请求密码重置
   * @param requestDto 请求数据
   * @throws NotFoundError 邮箱不存在
   */
  async requestPasswordReset(requestDto: RequestPasswordResetDto): Promise<void> {
    return performTransaction(async prisma => {
      // 根据邮箱查找用户
      const user = await prisma.user.findFirst({
        where: { email: requestDto.email }
      });

      if (!user) {
        throw new NotFoundError('该邮箱地址未注册');
      }

      // 生成重置令牌
      const token = generateRandomString(32);
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); // 令牌1小时有效

      // 存储重置令牌
      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token,
          expiresAt: expires
        }
      });

      // 在实际应用中，这里应该发送邮件，包含重置链接
      // 为演示需要，这里只打印出令牌
      console.log(`Password reset token for ${user.email}: ${token}`);
    });
  }

  /**
   * 重置密码
   * @param resetDto 重置数据
   * @throws ValidationError 密码不匹配
   * @throws NotFoundError 令牌无效
   */
  async resetPassword(resetDto: ResetPasswordDto): Promise<void> {
    // 校验密码和确认密码是否一致
    if (resetDto.password !== resetDto.confirmPassword) {
      throw new ValidationError('密码和确认密码不匹配');
    }

    return performTransaction(async prisma => {
      // 查找重置令牌
      const resetRecord = await prisma.passwordReset.findFirst({
        where: {
          token: resetDto.token,
          expiresAt: { gt: new Date() } // 确保令牌未过期
        }
      });

      if (!resetRecord) {
        throw new NotFoundError('重置令牌无效或已过期');
      }

      // 哈希新密码
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(resetDto.password, salt);

      // 更新用户密码
      await prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword }
      });

      // 删除重置令牌
      await prisma.passwordReset.delete({
        where: { id: resetRecord.id }
      });
    });
  }

  /**
   * 生成访问令牌和刷新令牌
   * @param userId 用户ID
   * @param role 用户角色
   * @returns 令牌响应
   */
  private async generateTokens(userId: string, role: string): Promise<TokenResponse> {
    // 生成访问令牌
    const accessToken = jwt.sign(
      { userId, role },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn }
    );

    // 计算访问令牌过期时间（秒）
    const decoded = jwt.decode(accessToken) as { exp: number };
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    // 生成刷新令牌
    const refreshToken = uuidv4();
    
    // 计算刷新令牌过期时间
    const refreshExpiresIn = this.parseTimeString(this.refreshTokenExpiresIn);
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setSeconds(refreshExpiresAt.getSeconds() + refreshExpiresIn);

    // 存储刷新令牌
    await this.storeRefreshToken(userId, refreshToken, refreshExpiresAt);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn
    };
  }

  /**
   * 存储刷新令牌
   * @param userId 用户ID
   * @param token 刷新令牌
   * @param expiresAt 过期时间
   */
  private async storeRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    const prisma = getPrismaClient();
    
    await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });
  }

  /**
   * 解析时间字符串为秒数
   * @param timeString 时间字符串 (例如 "1h", "7d")
   * @returns 秒数
   */
  private parseTimeString(timeString: string): number {
    const regex = /^(\d+)([smhd])$/;
    const match = timeString.match(regex);
    
    if (!match) {
      return 3600; // 默认1小时
    }
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 24 * 60 * 60;
 