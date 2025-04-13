/**
 * 角色装饰器
 *
 * 用于标记访问特定路由所需的角色
 * @module auth/decorators/roles.decorator
 */
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@atom/shared-types/models';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
