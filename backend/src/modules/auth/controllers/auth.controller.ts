/**
 * 认证控制器模块
 *
 * 处理与认证相关的HTTP请求
 * @module auth/controllers/auth
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../../common/utils/api-response';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
} from '../models/auth.model';

/**
 * 认证控制器类
 * 处理用户认证相关的请求
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * 用户登录
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginDto: LoginDto = req.body;
      const tokenResponse = await this.authService.login(loginDto);
      ApiResponse.success(res, tokenResponse);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 用户注册
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const registerDto: RegisterDto = req.body;
      const tokenResponse = await this.authService.register(registerDto);
      ApiResponse.created(res, tokenResponse);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 刷新令牌
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshTokenDto: RefreshTokenDto = req.body;
      const tokenResponse = await this.authService.refreshToken(refreshTokenDto);
      ApiResponse.success(res, tokenResponse);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 用户退出登录
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public logout = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) {
        ApiResponse.badRequest(res, '缺少刷新令牌');
        return;
      }

      await this.authService.logout(userId, refreshToken);
      ApiResponse.success(res, { message: '退出登录成功' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 用户从所有设备退出登录
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public logoutAll = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      await this.authService.logoutAll(userId);
      ApiResponse.success(res, { message: '已从所有设备退出登录' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 请求密码重置
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public requestPasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const requestDto: RequestPasswordResetDto = req.body;
      await this.authService.requestPasswordReset(requestDto);
      ApiResponse.success(res, { message: '密码重置链接已发送到您的邮箱' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 重置密码
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resetDto: ResetPasswordDto = req.body;
      await this.authService.resetPassword(resetDto);
      ApiResponse.success(res, { message: '密码重置成功' });
    } catch (error) {
      next(error);
    }
  };
}
