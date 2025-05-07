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
      const userId = req.user!.id;
      const applicationData: CreatorApplicationDto = {
        userId,
        ...req.body,
      };

      const creatorApplication = await this.creatorService.applyForCreator(applicationData);
      ApiResponse.created(res, creatorApplication);
    } catch (error) {
      next(error);
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
      const queryParams: CreatorQueryDto = {
        search: req.query.search as string,
        status: req.query.status as any,
        creatorType: req.query.creatorType as any,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 10,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const { items, total } = await this.creatorService.getCreatorApplications(queryParams);
      ApiResponse.paginated(res, items, total, queryParams.page, queryParams.pageSize);
    } catch (error) {
      next(error);
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
      const applicationId = req.params.id;
      const application = await this.creatorService.getCreatorApplicationById(applicationId);
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
      const applicationId = req.params.id;
      const reviewerId = req.user!.id;
      const reviewData: ReviewCreatorApplicationDto = req.body;

      const updatedApplication = await this.creatorService.reviewCreatorApplication(
        applicationId,
        reviewData,
        reviewerId
      );
      ApiResponse.success(res, updatedApplication);
    } catch (error) {
      next(error);
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
      const userId = req.user!.id;
      const applications = await this.creatorService.getUserApplications(userId);
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
      const userId = req.user!.id;
      const profileData: UpdateCreatorProfileDto = req.body;

      const updatedProfile = await this.creatorService.updateCreatorProfile(userId, profileData);
      ApiResponse.success(res, updatedProfile);
    } catch (error) {
      next(error);
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
      const userId = req.params.id || req.user!.id;
      const stats = await this.creatorService.getCreatorStats(userId);
      ApiResponse.success(res, stats);
    } catch (error) {
      next(error);
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