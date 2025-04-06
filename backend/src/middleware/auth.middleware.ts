import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../utils/app-error';
import { ApiResponse } from '../utils/api-response';

/**
 * 验证JWT令牌中间件
 */
export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头获取令牌
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('未提供认证令牌');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'default_secret_key';

    // 验证令牌
    try {
      const decoded = jwt.verify(token, secret) as any;
      req.user = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role,
      };
      next();
    } catch (error) {
      throw new UnauthorizedError('无效或过期的令牌');
    }
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return ApiResponse.unauthorized(res, error.message, error.details);
    }
    return ApiResponse.unauthorized(res, '认证失败');
  }
};

/**
 * 可选JWT认证中间件（如果提供了令牌则验证，否则继续）
 */
export const optionalAuthJwt = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头获取令牌
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // 没有提供令牌，继续
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'default_secret_key';

    // 验证令牌
    try {
      const decoded = jwt.verify(token, secret) as any;
      req.user = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role,
      };
    } catch (error) {
      // 令牌无效，但我们不阻止请求
      console.warn('无效的令牌，继续以匿名用户身份处理请求');
    }
    next();
  } catch (error) {
    next(); // 出错时，继续以匿名用户身份处理请求
  }
};

/**
 * 角色验证中间件
 * @param roles 允许的角色列表
 */
export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('需要登录才能访问此资源');
      }

      if (!roles.includes(req.user.role)) {
        throw new ForbiddenError('无权限访问此资源');
      }

      next();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return ApiResponse.unauthorized(res, error.message, error.details);
      }
      if (error instanceof ForbiddenError) {
        return ApiResponse.forbidden(res, error.message, error.details);
      }
      return ApiResponse.error(res, '权限验证失败');
    }
  };
};
