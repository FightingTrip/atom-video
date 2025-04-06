/**
 * API响应模块
 *
 * 提供统一的API响应格式处理工具
 * @module common/utils/api-response
 */

import { Response } from 'express';
import { StatusCode } from './app-error';

/**
 * API响应类型
 */
export interface ApiResponseType<T = any> {
  code: number;
  message: string;
  data: T | null;
  timestamp: string;
}

/**
 * 分页响应类型
 */
export interface PaginationResponseType<T = any> extends ApiResponseType<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * API响应工具类
 * 提供统一格式的响应方法
 */
export class ApiResponse {
  /**
   * 创建成功响应
   * @param res Express响应对象
   * @param data 响应数据
   * @param message 响应消息
   * @returns Express响应对象
   */
  static success<T>(res: Response, data: T, message = '操作成功'): Response {
    return res.status(StatusCode.OK).json({
      code: StatusCode.OK,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 创建资源创建成功响应
   * @param res Express响应对象
   * @param data 响应数据
   * @param message 响应消息
   * @returns Express响应对象
   */
  static created<T>(res: Response, data: T, message = '资源创建成功'): Response {
    return res.status(StatusCode.CREATED).json({
      code: StatusCode.CREATED,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 创建无内容响应
   * @param res Express响应对象
   * @returns Express响应对象
   */
  static noContent(res: Response): Response {
    return res.status(StatusCode.NO_CONTENT).send();
  }

  /**
   * 创建错误响应
   * @param res Express响应对象
   * @param message 错误消息
   * @param statusCode HTTP状态码
   * @param details 错误详情
   * @returns Express响应对象
   */
  static error(
    res: Response,
    message = '服务器错误',
    statusCode = StatusCode.INTERNAL_SERVER_ERROR,
    details?: Record<string, any>
  ): Response {
    return res.status(statusCode).json({
      code: statusCode,
      message,
      data: null,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 创建错误请求响应
   * @param res Express响应对象
   * @param message 错误消息
   * @param details 错误详情
   * @returns Express响应对象
   */
  static badRequest(
    res: Response,
    message = '请求参数错误',
    details?: Record<string, any>
  ): Response {
    return this.error(res, message, StatusCode.BAD_REQUEST, details);
  }

  /**
   * 创建未授权响应
   * @param res Express响应对象
   * @param message 错误消息
   * @param details 错误详情
   * @returns Express响应对象
   */
  static unauthorized(
    res: Response,
    message = '未授权访问',
    details?: Record<string, any>
  ): Response {
    return this.error(res, message, StatusCode.UNAUTHORIZED, details);
  }

  /**
   * 创建禁止访问响应
   * @param res Express响应对象
   * @param message 错误消息
   * @param details 错误详情
   * @returns Express响应对象
   */
  static forbidden(res: Response, message = '禁止访问', details?: Record<string, any>): Response {
    return this.error(res, message, StatusCode.FORBIDDEN, details);
  }

  /**
   * 创建资源不存在响应
   * @param res Express响应对象
   * @param message 错误消息
   * @param details 错误详情
   * @returns Express响应对象
   */
  static notFound(res: Response, message = '资源不存在', details?: Record<string, any>): Response {
    return this.error(res, message, StatusCode.NOT_FOUND, details);
  }

  /**
   * 创建资源冲突响应
   * @param res Express响应对象
   * @param message 错误消息
   * @param details 错误详情
   * @returns Express响应对象
   */
  static conflict(res: Response, message = '资源已存在', details?: Record<string, any>): Response {
    return this.error(res, message, StatusCode.CONFLICT, details);
  }

  /**
   * 创建分页响应
   * @param res Express响应对象
   * @param items 分页项目列表
   * @param total 总数
   * @param page 当前页码
   * @param pageSize 页大小
   * @param message 响应消息
   * @returns Express响应对象
   */
  static paginated<T>(
    res: Response,
    items: T[],
    total: number,
    page: number,
    pageSize: number,
    message = '获取成功'
  ): Response {
    const totalPages = Math.ceil(total / pageSize);

    return res.status(StatusCode.OK).json({
      code: StatusCode.OK,
      message,
      data: items,
      total,
      page,
      pageSize,
      totalPages,
      timestamp: new Date().toISOString(),
    });
  }
}
