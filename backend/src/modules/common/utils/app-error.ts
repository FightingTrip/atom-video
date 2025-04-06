/**
 * 应用错误模块
 *
 * 定义应用中使用的自定义错误类型
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
  SERVICE_UNAVAILABLE = 503,
}

/**
 * 基础应用错误类
 */
export class AppError extends Error {
  statusCode: number;
  details?: any;

  /**
   * 构造函数
   * @param message 错误消息
   * @param statusCode HTTP状态码
   * @param details 错误详情（可选）
   */
  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request
 * 表示请求参数有误
 */
export class BadRequestError extends AppError {
  constructor(message: string = '请求格式不正确', details?: any) {
    super(message, StatusCode.BAD_REQUEST, details);
  }
}

/**
 * 401 Unauthorized
 * 表示未认证或认证失败
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = '未授权访问', details?: any) {
    super(message, StatusCode.UNAUTHORIZED, details);
  }
}

/**
 * 403 Forbidden
 * 表示无权访问资源
 */
export class ForbiddenError extends AppError {
  constructor(message: string = '禁止访问', details?: any) {
    super(message, StatusCode.FORBIDDEN, details);
  }
}

/**
 * 404 Not Found
 * 表示请求的资源不存在
 */
export class NotFoundError extends AppError {
  constructor(message: string = '资源不存在', details?: any) {
    super(message, StatusCode.NOT_FOUND, details);
  }
}

/**
 * 409 Conflict
 * 表示资源冲突
 */
export class ConflictError extends AppError {
  constructor(message: string = '资源冲突', details?: any) {
    super(message, StatusCode.CONFLICT, details);
  }
}

/**
 * 422 Unprocessable Entity
 * 表示数据验证失败
 */
export class ValidationError extends AppError {
  constructor(message: string = '数据验证失败', details?: any) {
    super(message, StatusCode.UNPROCESSABLE_ENTITY, details);
  }
}

/**
 * 500 Internal Server Error
 * 表示服务器内部错误
 */
export class InternalServerError extends AppError {
  constructor(message: string = '服务器内部错误', details?: any) {
    super(message, StatusCode.INTERNAL_SERVER_ERROR, details);
  }
}

/**
 * 数据库操作错误
 */
export class DatabaseError extends AppError {
  constructor(message: string = '数据库操作失败', details?: any) {
    super(message, StatusCode.INTERNAL_SERVER_ERROR, details);
  }
}

/**
 * 第三方服务错误
 */
export class ExternalServiceError extends AppError {
  constructor(message: string = '第三方服务错误', details?: any) {
    super(message, StatusCode.SERVICE_UNAVAILABLE, details);
  }
}

/**
 * 文件操作错误
 */
export class FileError extends AppError {
  constructor(message: string = '文件操作失败', details?: any) {
    super(message, StatusCode.INTERNAL_SERVER_ERROR, details);
  }
}
