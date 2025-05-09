/**
 * 创作者控制器模块
 *
 * 处理与创作者相关的HTTP请求
 * @module creator/controllers/creator
 */

import { Request, Response, NextFunction } from 'express';
import { CreatorService } from '../services/creator.service';
import { ApiResponse } from '../../common/utils/api-response';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware';
import {
  CreatorApplicationDto,
  CreatorQueryDto,
  ReviewCreatorApplicationDto,
  UpdateCreatorProfileDto,
} from '../models/creator.model';
import { HttpException } from '../../../common/exceptions/http.exception';

/**
 * 创作者控制器类
 * 处理与创作者相关的请求
 */
export class CreatorController {
  private creatorService: CreatorService;

  constructor() {
    this.creatorService = new CreatorService();
  }

  /**
   * 提交创作者申请
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public applyForCreator = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const applicationData: CreatorApplicationDto = req.body;
      const application = await this.creatorService.submitCreatorApplication(
        req.user!.id,
        applicationData
      );
      ApiResponse.success(res, application, '创作者申请提交成功');
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        next(new HttpException(500, '提交创作者申请失败'));
      }
    }
  };

  /**
   * 获取创作者申请列表
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public getCreatorApplications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query: CreatorQueryDto = req.query as any;
      const result = await this.creatorService.getCreatorApplications(query);
      ApiResponse.success(res, result);
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        next(new HttpException(500, '获取创作者申请列表失败'));
      }
    }
  };

  /**
   * 获取创作者申请详情
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public getCreatorApplicationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const application = await this.creatorService.getCreatorApplicationById(req.params.id);
      ApiResponse.success(res, application);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 审核创作者申请
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public reviewCreatorApplication = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const reviewData: ReviewCreatorApplicationDto = req.body;
      const application = await this.creatorService.reviewCreatorApplication(
        req.params.id,
        reviewData,
        req.user!.id
      );
      ApiResponse.success(res, application, '创作者申请审核成功');
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        next(new HttpException(500, '审核创作者申请失败'));
      }
    }
  };

  /**
   * 获取用户的创作者申请
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public getUserApplications = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const applications = await this.creatorService.getUserApplications(req.user!.id);
      ApiResponse.success(res, applications);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新创作者资料
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public updateCreatorProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const profileData: UpdateCreatorProfileDto = req.body;
      const updatedUser = await this.creatorService.updateCreatorProfile(
        req.user!.id,
        profileData
      );
      ApiResponse.success(res, updatedUser, '创作者资料更新成功');
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        next(new HttpException(500, '更新创作者资料失败'));
      }
    }
  };

  /**
   * 获取创作者统计数据
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public getCreatorStats = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const stats = await this.creatorService.getCreatorStats(req.user!.id);
      ApiResponse.success(res, stats);
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        next(new HttpException(500, '获取创作者统计数据失败'));
      }
    }
  };

  /**
   * 获取优秀创作者列表
   * @param req 请求对象
   * @param res 响应对象
   * @param next 下一个中间件
   */
  public getTopCreators = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const creators = await this.creatorService.getTopCreators(limit);
      ApiResponse.success(res, creators);
    } catch (error) {
      next(error);
    }
  };
} 