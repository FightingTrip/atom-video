/**
 * 用户控制器模块
 *
 * 处理与用户相关的HTTP请求
 * @module user/controllers/user
 */

import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../../common/utils/api-response';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdatePasswordDto,
  UserQueryDto,
} from '../models/user.model';

/**
 * 用户控制器类
 * 处理与用户相关的请求
 */
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * 获取单个用户详情
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);
      ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取用户列表
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryParams: UserQueryDto = {
        search: req.query.search as string,
        role: req.query.role as string,
        isVerified: req.query.isVerified === 'true',
        isCreator: req.query.isCreator === 'true',
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const { items, total } = await this.userService.getUsers(queryParams);
      ApiResponse.paginated(res, items, total, queryParams.page, queryParams.pageSize);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 创建新用户
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public createUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 检查权限（只有管理员可以直接创建用户）
      if (req.user?.role !== 'ADMIN') {
        return ApiResponse.forbidden(res, '无权创建用户');
      }

      const userData: CreateUserDto = req.body;
      const user = await this.userService.createUser(userData);
      ApiResponse.created(res, user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新用户信息
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public updateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      const userData: UpdateUserDto = req.body;
      const currentUserId = req.user!.id;

      const updatedUser = await this.userService.updateUser(userId, userData, currentUserId);
      ApiResponse.success(res, updatedUser);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新用户密码
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public updatePassword = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      const passwordData: UpdatePasswordDto = req.body;
      const currentUserId = req.user!.id;

      await this.userService.updatePassword(userId, passwordData, currentUserId);
      ApiResponse.success(res, { message: '密码更新成功' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 删除用户
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public deleteUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      const currentUserId = req.user!.id;

      await this.userService.deleteUser(userId, currentUserId);
      ApiResponse.success(res, { message: '用户删除成功' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 关注用户
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public followUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const followingId = req.params.id;
      const followerId = req.user!.id;

      await this.userService.followUser(followerId, followingId);
      ApiResponse.success(res, { message: '成功关注用户' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 取消关注用户
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public unfollowUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const followingId = req.params.id;
      const followerId = req.user!.id;

      await this.userService.unfollowUser(followerId, followingId);
      ApiResponse.success(res, { message: '成功取消关注' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取用户关注的人列表
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public getUserFollowing = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;

      const { items, total } = await this.userService.getUserFollowing(userId, page, pageSize);
      ApiResponse.paginated(res, items, total, page, pageSize);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取用户的粉丝列表
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public getUserFollowers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;

      const { items, total } = await this.userService.getUserFollowers(userId, page, pageSize);
      ApiResponse.paginated(res, items, total, page, pageSize);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取当前登录用户信息
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public getCurrentUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const user = await this.userService.getUserById(userId);
      ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  };
}
