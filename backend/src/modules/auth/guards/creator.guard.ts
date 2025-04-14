/**
 * 创作者守卫
 *
 * 用于检查用户是否具有创作者权限
 * @module auth/guards/creator.guard
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../../../models/enums';

@Injectable()
export class CreatorGuard implements CanActivate {
  private readonly logger = new Logger(CreatorGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    // 确保用户存在
    if (!user) {
      this.logger.warn('尝试访问创作者资源，但用户对象缺失');
      throw new ForbiddenException('您没有权限访问此资源');
    }

    // 检查用户是否是创作者
    // 管理员自动具有创作者权限
    const hasCreatorPermission =
      user.isCreator === true || user.role === UserRole.ADMIN || user.role === UserRole.CREATOR;

    if (!hasCreatorPermission) {
      this.logger.warn(`用户 ${user.username} 尝试访问创作者资源，但没有创作者权限`);
      throw new ForbiddenException('只有创作者才能访问此资源');
    }

    return true;
  }
}
