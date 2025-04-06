import { StatusCode } from './api-response';

/**
 * 应用错误基类
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = StatusCode.INTERNAL_SERVER_ERROR,
    isOperational = true,
    details?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 错误类型 - 请求错误
 */
export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details?: Record<string, any>) {
    super(message, StatusCode.BAD_REQUEST, true, details);
  }
}

/**
 * 错误类型 - 未授权
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details?: Record<string, any>) {
    super(message, StatusCode.UNAUTHORIZED, true, details);
  }
}

/**
 * 错误类型 - 禁止访问
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details?: Record<string, any>) {
    super(message, StatusCode.FORBIDDEN, true, details);
  }
}

/**
 * 错误类型 - 资源未找到
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: Record<string, any>) {
    super(message, StatusCode.NOT_FOUND, true, details);
  }
}

/**
 * 错误类型 - 资源冲突
 */
export class ConflictError extends AppError {
  constructor(message = 'Resource already exists', details?: Record<string, any>) {
    super(message, StatusCode.CONFLICT, true, details);
  }
}

/**
 * 错误类型 - 验证错误
 */
export class ValidationError extends AppError {
  constructor(message = 'Validation error', details?: Record<string, any>) {
    super(message, StatusCode.UNPROCESSABLE_ENTITY, true, details);
  }
}

/**
 * 错误类型 - 数据库错误
 */
export class DatabaseError extends AppError {
  constructor(message = 'Database error', details?: Record<string, any>) {
    super(message, StatusCode.INTERNAL_SERVER_ERROR, true, details);
  }
}
