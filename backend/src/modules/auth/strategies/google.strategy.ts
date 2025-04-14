/**
 * Google认证策略
 *
 * 实现Google OAuth认证流程
 * @module auth/strategies/google
 */
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    // 确保配置值存在，否则提供默认值防止undefined
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID') || '';
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET') || '';
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL') || '';

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      this.logger.log(`Google登录验证: ${profile.emails[0].value}`);

      // 提取Google用户信息
      const email = profile.emails[0].value;
      const username = email.split('@')[0]; // 使用邮箱前缀作为用户名
      const avatarUrl =
        profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

      // 通过authService处理第三方登录
      const result = await this.authService.validateOAuthUser({
        provider: 'GOOGLE',
        providerId: profile.id,
        email,
        username,
        displayName: profile.displayName || username,
        avatarUrl,
      });

      // 只返回用户对象，不返回token信息
      done(null, result.user);
    } catch (error: unknown) {
      // 正确处理unknown类型的error
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`Google认证失败: ${errorMessage}`, errorStack);
      done(new UnauthorizedException('Google认证失败'), false);
    }
  }
}
