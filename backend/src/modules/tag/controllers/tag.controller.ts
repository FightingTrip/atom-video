/**
 * 标签控制器模块
 *
 * 处理标签相关的HTTP请求
 * @module tag/controllers/tag
 */

import { Request, Response } from 'express';
import { TagService } from '../services/tag.service';
import { ApiResponse } from '../../common/utils/api-response';
import { CreateTagDto, UpdateTagDto, TagQueryParams } from '../models/tag.model';
import { ValidationError } from '../../common/utils/app-error';
import { AuthenticatedRequest } from '../../common/middleware/auth.middleware';

/**
 * 标签控制器类
 */
export class TagController {
  private tagService: TagService;

  constructor() {
    this.tagService = new TagService();
  }

  /**
   * 创建新标签
   */
  async createTag(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const dto = req.body as CreateTagDto;
      
      if (!dto.name || dto.name.trim() === '') {
        throw new ValidationError('标签名不能为空');
      }
      
      const tag = await this.tagService.createTag(dto);
      return ApiResponse.success(res, tag, '标签创建成功');
    } catch (error) {
      return ApiResponse.error(
        res,
        error.message,
        error.statusCode,
        error.details
      );
    }
  }

  /**
   * 获取标签列表
   */
  async getTags(req: Request, res: Response): Promise<Response> {
    try {
      const params: TagQueryParams = {
        search: req.query.search as string,
        sort: req.query.sort as 'name' | 'createdAt' | 'count',
        order: req.query.order as 'asc' | 'desc',
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0
      };
      
      const { tags, total } = await this.tagService.getTags(params);
      
      return ApiResponse.success(
        res,
        { tags, total, page: Math.floor(params.offset / params.limit) + 1, pageSize: params.limit },
        '标签查询成功'
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        error.message,
        error.statusCode,
        error.details
      );
    }
  }

  /**
   * 获取热门标签
   */
  async getPopularTags(req: Request, res: Response): Promise<Response> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const tags = await this.tagService.getPopularTags(limit);
      
      return ApiResponse.success(res, tags, '热门标签查询成功');
    } catch (error) {
      return ApiResponse.error(
        res,
        error.message,
        error.statusCode,
        error.details
      );
    }
  }

  /**
   * 根据ID获取标签
   */
  async getTagById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const tag = await this.tagService.getTagById(id);
      
      return ApiResponse.success(res, tag, '标签查询成功');
    } catch (error) {
      return ApiResponse.error(
        res,
        error.message,
        error.statusCode,
        error.details
      );
    }
  }

  /**
   * 根据slug获取标签
   */
  async getTagBySlug(req: Request, res: Response): Promise<Response> {
    try {
      const slug = req.params.slug;
      const tag = await this.tagService.getTagBySlug(slug);
      
      return ApiResponse.success(res, tag, '标签查询成功');
    } catch (error) {
      return ApiResponse.error(
        res,
        error.message,
        error.statusCode,
        error.details
      );
    }
  }

  /**
   * 更新标签
   */
  async updateTag(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const dto = req.body as UpdateTagDto;
      
      if (Object.keys(dto).length === 0) {
        throw new ValidationError('更新数据不能为空');
      }
      
      const tag = await this.tagService.updateTag(id, dto);
      return ApiResponse.success(res, tag, '标签更新成功');
    } catch (error) {
      return ApiResponse.error(
        res,
        error.message,
        error.statusCode,
        error.details
      );
    }
  }

  /**
   * 删除标签
   */
  async deleteTag(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const tag = await this.tagService.deleteTag(id);
      
      return ApiResponse.success(res, tag, '标签删除成功');
    } catch (error) {
      return ApiResponse.error(
        res,
        error.message,
        error.statusCode,
        error.details
      );
    }
  }

  /**
   * 获取视频的标签
   */
  async getTagsByVideoId(req: Request, res: Response): Promise<Response> {
    try {
      const videoId = req.params.videoId;
      const tags = await this.tagService.getTagsByVideoId(videoId);
      
      return ApiResponse.success(res, tags, '视频标签查询成功');
    } catch (error) {
      return ApiResponse.error(
        res,
        error.message,
        error.statusCode,
        error.details
      );
    }
  }
} 