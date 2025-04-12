/**
 * 认证中间件模块
 *
 * 提供JWT认证和基于角色的授权控制中间件
 * @module common/middleware/auth
 */

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/api-response';
import { UnauthorizedError, ForbiddenError } from '../utils/app-error';
import config from '../config/env';

/**
 * 用户角色枚举类型
 */
export enum UserRole {
  ADMIN = 'ADMIN', // 管理员
  CREATOR = 'CREATOR', // 创作者
  USER = 'USER', // 普通用户
  GUEST = 'GUEST', // 游客（未登录用户）
}

// 扩展Express的命名空间来包含用户类型
declare global {
  namespace Express {
    interface User {
      id: string;
      role: UserRole;
      [key: string]: any;
    }
  }
}

/**
 * 扩展Request类型，添加认证用户信息
 */
export interface AuthenticatedRequest extends Request {
  user?: Express.User;
}

/**
 * JWT验证中间件
 * 验证用户提供的JWT令牌，提取用户信息
 */
export const authenticateJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头中获取令牌
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, '未提供认证令牌');
    }

    const token = authHeader.split(' ')[1];

    // 验证令牌
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        return ApiResponse.unauthorized(res, '无效的认证令牌');
      }

      // 将解码后的用户信息添加到请求对象中
      req.user = decoded as Express.User;
      next();
    });
  } catch (error) {
    return next(new UnauthorizedError('认证失败'));
  }
};

// 为向后兼容性添加authenticate作为authenticateJwt的别名
export const authenticate = authenticateJwt;

/**
 * 可选JWT验证中间件
 * 如果用户提供了JWT令牌，则验证和提取用户信息，但不阻止未认证的请求
 */
export const optionalAuthJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    // 无令牌则继续处理请求，不阻止
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    // 验证令牌，但不阻止请求
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (!err) {
        req.user = decoded as Express.User;
      }
      next();
    });
  } catch (error) {
    // 认证失败不阻止请求
    next();
  }
};

/**
 * 游客访问中间件
 * 允许未登录用户以游客身份访问公开资源
 */
export const allowGuest = (req: Request, res: Response, next: NextFunction) => {
  // 如果用户未登录，添加游客身份
  if (!req.user) {
    req.user = {
      id: 'guest',
      role: UserRole.GUEST,
    } as Express.User;
  }
  next();
};

/**
 * 角色授权中间件
 * 验证用户是否具有指定的角色权限
 * @param roles 允许的角色数组
 */
export const authorizeRoles = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 确保用户已通过认证
    if (!req.user) {
      return ApiResponse.unauthorized(res, '需要登录才能访问');
    }

    // 检查用户角色是否在允许的角色列表中
    if (!roles.includes(req.user.role as UserRole)) {
      return ApiResponse.forbidden(res, '无权访问该资源');
    }

    next();
  };
};

// 为向后兼容性添加authorize作为authorizeRoles的简化版本
export const authorize = (role: UserRole) => authorizeRoles([role]);

/**
 * 资源所有者授权中间件
 * 验证用户是否为资源所有者或管理员
 * @param getResourceOwnerId 获取资源所有者ID的函数
 */
export const authorizeResourceOwner = (
  getResourceOwnerId: (req: Request) => Promise<string | undefined>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 确保用户已通过认证
      if (!req.user) {
        return ApiResponse.unauthorized(res, '需要登录才能访问');
      }

      // 管理员可以访问所有资源
      if (req.user.role === UserRole.ADMIN) {
        return next();
      }

      // 获取资源所有者ID
      const ownerId = await getResourceOwnerId(req);

      // 如果找不到所有者ID，可能资源不存在
      if (!ownerId) {
        return ApiResponse.notFound(res, '资源不存在');
      }

      // 验证用户是否为资源所有者
      if (req.user.id !== ownerId) {
        return ApiResponse.forbidden(res, '无权访问该资源');
      }

      next();
    } catch (error) {
      next(new ForbiddenError('无法验证资源所有权'));
    }
  };
};

/**
 * 权限配置，用于定义不同角色的权限
 */
export const rolePermissions = {
  [UserRole.ADMIN]: [
    // 管理员拥有所有权限
    'all',
  ],
  [UserRole.CREATOR]: [
    // 创作者权限
    'creator:upload',
    'creator:manage',
    'creator:comment',
    'creator:analytics',
    'content:view',
  ],
  [UserRole.USER]: [
    // 普通用户权限
    'user:comment',
    'user:like',
    'user:favorite',
    'user:subscribe',
  ],
  [UserRole.GUEST]: [
    // 游客权限
    'content:view:public',
    'creator:view:profile',
  ],
};

/**
 * 检查用户是否具有特定权限
 * @param permission 权限标识符
 */
export const hasPermission = (req: Request, permission: string): boolean => {
  if (!req.user) return false;

  const role = req.user.role as UserRole;

  // 管理员拥有所有权限
  if (role === UserRole.ADMIN) return true;

  // 检查角色是否具有该权限
  return rolePermissions[role]?.includes(permission) || false;
};

/**
 * 权限授权中间件
 * 验证用户是否具有特定权限
 * @param permissions 所需的权限数组
 */
export const authorizePermissions = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 确保用户已通过认证
    if (!req.user) {
      return ApiResponse.unauthorized(res, '需要登录才能访问');
    }

    // 管理员始终具有所有权限
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }

    // 检查用户是否具有任一所需权限
    const hasAnyPermission = permissions.some(permission => hasPermission(req, permission));

    if (!hasAnyPermission) {
      return ApiResponse.forbidden(res, '无权访问该资源');
    }

    next();
  };
};
