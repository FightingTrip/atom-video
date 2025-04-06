/**
 * 错误处理中间件模块
 *
 * 提供全局的错误处理中间件，统一处理应用中抛出的错误
 * @module common/middleware/error
 */

import { Request, Response, NextFunction } from 'express';
import { AppError, StatusCode } from '../utils/app-error';
import { ApiResponse } from '../utils/api-response';

/**
 * 全局错误处理中间件
 * 捕获并处理应用中抛出的所有错误，提供统一的错误响应格式
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`错误: ${err.message}`);
  console.error(err.stack);

  // 处理已知的应用错误
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.details);
  }

  // Prisma数据库错误
  if (err.name === 'PrismaClientKnownRequestError') {
    return ApiResponse.error(res, '数据库操作失败', StatusCode.INTERNAL_SERVER_ERROR, {
      originalError: err.message,
    });
  }

  // 验证错误
  if (err.name === 'ValidationError') {
    return ApiResponse.error(res, '数据验证失败', StatusCode.UNPROCESSABLE_ENTITY, {
      details: err.message,
    });
  }

  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, '无效的认证令牌', StatusCode.UNAUTHORIZED);
  }

  // 默认服务器错误
  return ApiResponse.error(res, '服务器内部错误', StatusCode.INTERNAL_SERVER_ERROR);
};
