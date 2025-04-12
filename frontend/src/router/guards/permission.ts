/**
 * 路由权限守卫
 * 检查用户是否有权限访问特定路由
 */
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';

/**
 * 权限路由守卫
 * @param to 目标路由
 * @param from 来源路由
 * @param next 导航函数
 */
export const permissionGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();
  const toast = useToast();

  // 检查路由是否需要特定角色
  const requiredRoles = to.meta.roles as string[] | undefined;

  // 如果没有定义角色要求，直接通过
  if (!requiredRoles || requiredRoles.length === 0) {
    return next();
  }

  // 如果需要角色但用户未登录，重定向到登录页
  if (!authStore.isAuthenticated) {
    toast.warning('需要登录才能访问该页面');
    return next({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    });
  }

  // 检查用户角色是否满足要求
  const userRole = authStore.userRole;
  const hasRequiredRole = requiredRoles.includes(userRole);

  if (hasRequiredRole) {
    // 有所需角色，允许访问
    return next();
  } else {
    // 没有所需角色，拒绝访问并提示
    toast.error('您没有权限访问此页面');

    // 对于无权访问的管理员页面，重定向到首页
    if (to.path.startsWith('/admin')) {
      return next({ path: '/' });
    }

    // 其他情况返回上一页，如果没有上一页则回到首页
    if (from.name) {
      return next(false);
    } else {
      return next({ path: '/' });
    }
  }
};
