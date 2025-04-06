import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';
import { ApiResponse, StatusCode } from '../utils/api-response';

/**
 * 全局错误处理中间件
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error] ${err.message}`, err);

  // 如果是自定义应用错误，使用其状态码和详情
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.details);
  }

  // 处理常见的Express和Node.js错误
  if (err.name === 'SyntaxError') {
    return ApiResponse.error(res, '无效的请求数据', StatusCode.BAD_REQUEST);
  }

  if (err.name === 'ValidationError') {
    return ApiResponse.error(res, '数据验证失败', StatusCode.UNPROCESSABLE_ENTITY);
  }

  if (err.name === 'UnauthorizedError') {
    return ApiResponse.error(res, '身份验证失败', StatusCode.UNAUTHORIZED);
  }

  if (err.name === 'ForbiddenError') {
    return ApiResponse.error(res, '访问被拒绝', StatusCode.FORBIDDEN);
  }

  // 处理未捕获的错误
  return ApiResponse.error(
    res,
    '服务器内部错误',
    StatusCode.INTERNAL_SERVER_ERROR,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined
  );
};
