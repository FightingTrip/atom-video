import { Response } from 'express';

/**
 * API响应状态码
 */
export enum StatusCode {
  SUCCESS = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * API响应处理类
 */
export class ApiResponse {
  /**
   * 成功响应
   */
  static success<T>(
    res: Response,
    data: T,
    message = 'Operation successful',
    statusCode = StatusCode.SUCCESS
  ) {
    return res.status(statusCode).json({
      code: statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 创建成功响应
   */
  static created<T>(res: Response, data: T, message = 'Resource created successfully') {
    return this.success(res, data, message, StatusCode.CREATED);
  }

  /**
   * 分页响应
   */
  static paginated<T>(
    res: Response,
    items: T[],
    total: number,
    page: number,
    pageSize: number,
    message = 'Data retrieved successfully'
  ) {
    const totalPages = Math.ceil(total / pageSize);
    return this.success(
      res,
      {
        items,
        total,
        page,
        pageSize,
        totalPages,
      },
      message
    );
  }

  /**
   * 无内容响应
   */
  static noContent(res: Response) {
    return res.status(StatusCode.NO_CONTENT).end();
  }

  /**
   * 错误响应
   */
  static error(
    res: Response,
    message = 'An error occurred',
    statusCode = StatusCode.INTERNAL_SERVER_ERROR,
    details?: Record<string, any>
  ) {
    return res.status(statusCode).json({
      code: statusCode,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 错误请求响应
   */
  static badRequest(res: Response, message = 'Bad request', details?: Record<string, any>) {
    return this.error(res, message, StatusCode.BAD_REQUEST, details);
  }

  /**
   * 未授权响应
   */
  static unauthorized(res: Response, message = 'Unauthorized', details?: Record<string, any>) {
    return this.error(res, message, StatusCode.UNAUTHORIZED, details);
  }

  /**
   * 禁止访问响应
   */
  static forbidden(res: Response, message = 'Forbidden', details?: Record<string, any>) {
    return this.error(res, message, StatusCode.FORBIDDEN, details);
  }

  /**
   * 未找到响应
   */
  static notFound(res: Response, message = 'Resource not found', details?: Record<string, any>) {
    return this.error(res, message, StatusCode.NOT_FOUND, details);
  }

  /**
   * 冲突响应
   */
  static conflict(
    res: Response,
    message = 'Resource already exists',
    details?: Record<string, any>
  ) {
    return this.error(res, message, StatusCode.CONFLICT, details);
  }

  /**
   * 验证错误响应
   */
  static validationError(
    res: Response,
    message = 'Validation error',
    details?: Record<string, any>
  ) {
    return this.error(res, message, StatusCode.UNPROCESSABLE_ENTITY, details);
  }
}
