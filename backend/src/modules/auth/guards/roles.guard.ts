/**
 * 角色守卫
 *
 * 用于检查用户是否具有访问特定路由所需的角色
 * @module auth/guards/roles.guard
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../models/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取路由所需角色
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果没有设置角色要求，则允许访问
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // 确保用户存在且有角色
    if (!user || !user.role) {
      this.logger.warn('尝试访问受保护资源，但用户对象或角色缺失');
      throw new ForbiddenException('您没有权限访问此资源');
    }

    // 检查角色层级权限
    // ADMIN > CREATOR > USER > GUEST
    const roleHierarchy = {
      ADMIN: 3,
      CREATOR: 2,
      USER: 1,
      GUEST: 0,
    };

    // 获取用户角色等级
    const userRoleLevel = roleHierarchy[user.role] || 0;

    // 检查是否满足任一所需角色
    const hasRequiredRole = requiredRoles.some(role => {
      const requiredRoleLevel = roleHierarchy[role] || 0;
      return userRoleLevel >= requiredRoleLevel;
    });

    if (!hasRequiredRole) {
      this.logger.warn(`用户角色 ${user.role} 尝试访问需要 ${requiredRoles} 角色的资源`);
      throw new ForbiddenException('您没有权限访问此资源');
    }

    return true;
  }
}
