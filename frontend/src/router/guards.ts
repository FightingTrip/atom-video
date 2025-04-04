import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// 需要认证的路由
const authRoutes = ['/profile', '/settings', '/upload'];

// 已认证用户不能访问的路由
const guestRoutes = ['/auth/login', '/auth/register'];

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();
  const requiresAuth = authRoutes.some(route => to.path.startsWith(route));
  const requiresGuest = guestRoutes.some(route => to.path.startsWith(route));

  // 检查认证状态
  const isAuthenticated = await authStore.checkAuth();

  if (requiresAuth && !isAuthenticated) {
    // 需要认证但未登录，重定向到登录页
    next({ path: '/auth/login', query: { redirect: to.fullPath } });
  } else if (requiresGuest && isAuthenticated) {
    // 已登录用户访问登录/注册页，重定向到首页
    next({ path: '/' });
  } else {
    // 其他情况正常放行
    next();
  }
};
