/**
 * OAuth认证控制器
 *
 * 处理第三方登录流程
 * @module auth/controllers/oauth
 */
import { Controller, Get, Req, Res, UseGuards, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('认证')
@Controller('auth')
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(private configService: ConfigService) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub登录' })
  @ApiResponse({ status: HttpStatus.FOUND, description: '重定向到GitHub授权页面' })
  githubLogin() {
    // 处理GitHub登录请求，重定向到GitHub授权页面
    // 实际的逻辑由Passport策略处理
    return { message: '重定向到GitHub...' };
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub登录回调' })
  @ApiResponse({ status: HttpStatus.FOUND, description: '登录成功后重定向' })
  githubCallback(@Req() req, @Res() res: Response) {
    // 获取前端URL
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const user = req.user;

    if (user && user.token) {
      this.logger.log(`GitHub登录成功，用户: ${user.user.username}`);
      // 重定向到前端，带上token
      return res.redirect(`${frontendUrl}/auth/oauth-success?token=${user.token}`);
    } else {
      this.logger.error('GitHub登录失败，无用户数据或token');
      return res.redirect(`${frontendUrl}/auth/oauth-error`);
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google登录' })
  @ApiResponse({ status: HttpStatus.FOUND, description: '重定向到Google授权页面' })
  googleLogin() {
    // 处理Google登录请求，重定向到Google授权页面
    // 实际的逻辑由Passport策略处理
    return { message: '重定向到Google...' };
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google登录回调' })
  @ApiResponse({ status: HttpStatus.FOUND, description: '登录成功后重定向' })
  googleCallback(@Req() req, @Res() res: Response) {
    // 获取前端URL
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const user = req.user;

    if (user && user.token) {
      this.logger.log(`Google登录成功，用户: ${user.user.username}`);
      // 重定向到前端，带上token
      return res.redirect(`${frontendUrl}/auth/oauth-success?token=${user.token}`);
    } else {
      this.logger.error('Google登录失败，无用户数据或token');
      return res.redirect(`${frontendUrl}/auth/oauth-error`);
    }
  }
}
