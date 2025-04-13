/**
 * 认证控制器模块
 *
 * 处理与认证相关的HTTP请求
 * @module auth/controllers/auth
 */

import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  LoginDto,
  RegisterDto,
  TokenResponse,
  RefreshTokenDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
} from '../models/auth.model';

// 定义接口来处理错误类型
interface AppError extends Error {
  message: string;
}

/**
 * 认证控制器类
 * 处理用户认证相关的请求
 */
@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  /**
   * 构造函数，注入认证服务
   * @param authService 认证服务
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   * @param loginDto 登录数据
   * @returns 令牌信息
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录', description: '使用邮箱和密码登录系统' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: '登录成功，返回令牌信息', type: TokenResponse })
  @ApiResponse({ status: 401, description: '登录失败，凭据无效' })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      this.logger.error(`登录失败: ${(error as AppError).message}`);
      throw new UnauthorizedException((error as AppError).message || '登录失败');
    }
  }

  /**
   * 用户注册
   * @param registerDto 注册数据
   * @returns 令牌信息
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '用户注册', description: '创建新用户账号' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: '注册成功，返回令牌信息', type: TokenResponse })
  @ApiResponse({ status: 400, description: '注册失败，请求数据无效' })
  @ApiResponse({ status: 409, description: '注册失败，用户名或邮箱已存在' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      this.logger.error(`注册失败: ${(error as AppError).message}`);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException((error as AppError).message || '注册失败');
    }
  }

  /**
   * 刷新令牌
   * @param refreshTokenDto 刷新令牌DTO
   * @returns 新的令牌信息
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新令牌', description: '使用刷新令牌获取新的访问令牌' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: '令牌刷新成功，返回新的令牌信息', type: TokenResponse })
  @ApiResponse({ status: 401, description: '令牌刷新失败，刷新令牌无效或已过期' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      return await this.authService.refreshToken(refreshTokenDto);
    } catch (error) {
      this.logger.error(`刷新令牌失败: ${(error as AppError).message}`);
      throw new UnauthorizedException((error as AppError).message || '刷新令牌失败');
    }
  }

  /**
   * 用户退出登录
   * @param req 请求对象
   * @param refreshToken 刷新令牌
   * @returns 成功消息
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '退出登录', description: '使当前设备的令牌失效' })
  @ApiBody({ schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: '退出登录成功' })
  @ApiResponse({ status: 401, description: '未授权，访问令牌无效' })
  @ApiResponse({ status: 400, description: '请求失败，缺少刷新令牌' })
  async logout(
    @Req() req: Request & { user: { id: string } },
    @Body('refreshToken') refreshToken: string
  ) {
    if (!refreshToken) {
      throw new BadRequestException('缺少刷新令牌');
    }

    try {
      await this.authService.logout(req.user.id, refreshToken);
      return { message: '退出登录成功' };
    } catch (error) {
      this.logger.error(`退出登录失败: ${(error as AppError).message}`);
      throw new BadRequestException('退出登录失败');
    }
  }

  /**
   * 用户从所有设备退出登录
   * @param req 请求对象
   * @returns 成功消息
   */
  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '从所有设备退出登录', description: '使所有设备的令牌失效' })
  @ApiResponse({ status: 200, description: '从所有设备退出登录成功' })
  @ApiResponse({ status: 401, description: '未授权，访问令牌无效' })
  async logoutAll(@Req() req: Request & { user: { id: string } }) {
    try {
      await this.authService.logoutAll(req.user.id);
      return { message: '已从所有设备退出登录' };
    } catch (error) {
      this.logger.error(`从所有设备退出登录失败: ${(error as AppError).message}`);
      throw new BadRequestException('从所有设备退出登录失败');
    }
  }

  /**
   * 请求密码重置
   * @param requestDto 请求数据
   * @returns 成功消息
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '请求密码重置', description: '发送密码重置链接到用户邮箱' })
  @ApiBody({ type: RequestPasswordResetDto })
  @ApiResponse({ status: 200, description: '密码重置链接已发送' })
  @ApiResponse({ status: 404, description: '邮箱地址未注册' })
  async requestPasswordReset(@Body() requestDto: RequestPasswordResetDto) {
    try {
      await this.authService.requestPasswordReset(requestDto);
      return { message: '密码重置链接已发送到您的邮箱' };
    } catch (error) {
      this.logger.error(`请求密码重置失败: ${(error as AppError).message}`);
      throw error;
    }
  }

  /**
   * 重置密码
   * @param resetDto 重置数据
   * @returns 成功消息
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '重置密码', description: '使用重置令牌设置新密码' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: '密码重置成功' })
  @ApiResponse({ status: 400, description: '请求失败，密码验证错误' })
  @ApiResponse({ status: 404, description: '重置令牌无效或已过期' })
  async resetPassword(@Body() resetDto: ResetPasswordDto) {
    try {
      await this.authService.resetPassword(resetDto);
      return { message: '密码重置成功' };
    } catch (error) {
      this.logger.error(`重置密码失败: ${(error as AppError).message}`);
      throw error;
    }
  }
}
