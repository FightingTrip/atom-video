/**
 * 应用错误处理模块
 *
 * 定义了应用中使用的各种错误类型，用于统一错误处理
 * @module common/utils/app-error
 */

/**
 * HTTP状态码枚举
 */
export enum StatusCode {
  OK = 200,
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
 * 应用错误基类
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: Record<string, any>;

  /**
   * 创建一个应用错误
   * @param message 错误信息
   * @param statusCode HTTP状态码
   * @param isOperational 是否为可操作的错误(而非编程错误)
   * @param details 错误详情
   */
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
  constructor(message = '请求参数错误', details?: Record<string, any>) {
    super(message, StatusCode.BAD_REQUEST, true, details);
  }
}

/**
 * 错误类型 - 未授权
 */
export class UnauthorizedError extends AppError {
  constructor(message = '未授权访问', details?: Record<string, any>) {
    super(message, StatusCode.UNAUTHORIZED, true, details);
  }
}

/**
 * 错误类型 - 禁止访问
 */
export class ForbiddenError extends AppError {
  constructor(message = '禁止访问该资源', details?: Record<string, any>) {
    super(message, StatusCode.FORBIDDEN, true, details);
  }
}

/**
 * 错误类型 - 资源未找到
 */
export class NotFoundError extends AppError {
  constructor(message = '资源不存在', details?: Record<string, any>) {
    super(message, StatusCode.NOT_FOUND, true, details);
  }
}

/**
 * 错误类型 - 资源冲突
 */
export class ConflictError extends AppError {
  constructor(message = '资源已存在', details?: Record<string, any>) {
    super(message, StatusCode.CONFLICT, true, details);
  }
}

/**
 * 错误类型 - 验证错误
 */
export class ValidationError extends AppError {
  constructor(message = '数据验证失败', details?: Record<string, any>) {
    super(message, StatusCode.UNPROCESSABLE_ENTITY, true, details);
  }
}

/**
 * 错误类型 - 数据库错误
 */
export class DatabaseError extends AppError {
  constructor(message = '数据库操作失败', details?: Record<string, any>) {
    super(message, StatusCode.INTERNAL_SERVER_ERROR, true, details);
  }
}
