/**
 * JWT策略模块
 *
 * 实现基于JWT的Passport认证策略
 * @module auth/strategies/jwt
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * JWT载荷接口
 */
interface JwtPayload {
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * JWT认证策略实现
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * 构造函数，注入依赖并配置策略
   * @param configService 配置服务
   * @param prismaService Prisma服务
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'super-secret'),
    });
  }

  /**
   * 验证JWT载荷并返回用户信息
   * @param payload JWT载荷
   * @returns 用户信息
   */
  async validate(payload: JwtPayload) {
    // 从数据库查找用户，验证用户是否存在
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isVerified: true,
        isCreator: true,
      },
    });

    if (!user) {
      return null; // 用户不存在，将触发401未授权响应
    }

    // 返回用户信息，将被添加到请求对象中
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isVerified: user.isVerified,
      isCreator: user.isCreator,
    };
  }
}
