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
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
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
      const user = await this.authService.validateOAuthUser({
        provider: 'GOOGLE',
        providerId: profile.id,
        email,
        username,
        displayName: profile.displayName || username,
        avatarUrl,
      });

      done(null, user);
    } catch (error) {
      this.logger.error(`Google认证失败: ${error.message}`, error.stack);
      done(new UnauthorizedException('Google认证失败'), null);
    }
  }
}
