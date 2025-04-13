/**
 * GitHub认证策略
 *
 * 实现GitHub OAuth认证流程
 * @module auth/strategies/github
 */
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly logger = new Logger(GitHubStrategy.name);

  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    try {
      this.logger.log(`GitHub登录验证: ${profile.username}`);

      // 提取GitHub用户信息
      const { id, username, emails, photos } = profile;
      const email = emails && emails.length > 0 ? emails[0].value : null;
      const avatarUrl = photos && photos.length > 0 ? photos[0].value : null;

      if (!email) {
        throw new UnauthorizedException('GitHub账号必须有公开邮箱');
      }

      // 通过authService处理第三方登录
      const user = await this.authService.validateOAuthUser({
        provider: 'GITHUB',
        providerId: id.toString(),
        email,
        username,
        displayName: profile.displayName || username,
        avatarUrl,
      });

      return user;
    } catch (error) {
      this.logger.error(`GitHub认证失败: ${error.message}`, error.stack);
      throw new UnauthorizedException('GitHub认证失败');
    }
  }
}
