// 技术栈说明：
// - Vue 3: 使用 Composition API
// - TypeScript: 强类型支持
// - Vue Router: 路由管理
// - Pinia: 状态管理

import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';

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
  const { showError, showInfo } = useToast();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.guest);

  try {
    // 检查认证状态
    await authStore.checkAuth();
    const isAuthenticated = authStore.isAuthenticated;

    if (requiresAuth && !isAuthenticated) {
      // 需要认证但未登录，重定向到登录页
      showError('请先登录');
      next({ path: '/auth/login', query: { redirect: to.fullPath } });
    } else if (requiresGuest && isAuthenticated) {
      // 已登录用户访问登录/注册页，重定向到首页
      showInfo('您已登录');
      next({ path: '/' });
    } else {
      // 其他情况正常放行
      next();
    }
  } catch (error) {
    // 处理认证检查过程中的错误
    console.error('认证检查失败:', error);
    next({ path: '/auth/login' });
  }
};
