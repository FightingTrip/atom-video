// 技术栈说明：
// - Vue 3: 使用 Composition API
// - TypeScript: 强类型支持
// - Pinia: 状态管理
// - JWT: 认证机制

import { defineStore } from 'pinia';
import type { User, AuthResponse } from '@/types';
import { useStorage } from '@vueuse/core';
import { useToast } from '@/composables/useToast';
import { ref, computed, watch } from 'vue';
// 导入模拟数据库
import mockDb from '@/mock/mockDb';
import { mockDelay } from '@/utils/mockInitializer';
import { mapDbUserToFrontend } from '@/utils/mockMapper';

/**
 * 认证状态存储
 */
export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const demoMode = useStorage<boolean>('demo-mode', true);

  // 计算属性
  const isAuthenticated = computed(() => !!token.value || demoMode.value);
  const isAdmin = computed(() => userRole.value === 'ADMIN');
  const isCreator = computed(() => userRole.value === 'CREATOR' || isAdmin.value);
  const username = computed(() => user.value?.username || '游客');
  const userRole = computed(() => {
    // 检查邮箱是否包含admin
    if (user.value?.email?.toLowerCase().includes('admin')) {
      return 'ADMIN';
    }

    // 开发环境下，如果是demo模式，且用户名是admin或者包含admin，则作为管理员
    if (
      demoMode.value &&
      (user.value?.username === 'admin' ||
        user.value?.username?.toLowerCase().includes('admin') ||
        user.value?.email?.toLowerCase().includes('admin'))
    ) {
      return 'ADMIN';
    }

    // 基于用户角色判断，支持不同大小写
    if (user.value?.role?.toLowerCase() === 'admin') {
      return 'ADMIN';
    }

    if (user.value?.role?.toLowerCase() === 'creator') {
      return 'CREATOR';
    }

    // 默认为普通用户
    return 'USER';
  });

  // 操作
  function setToken(newToken: string | null) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('auth_token', newToken);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  function setUser(newUser: User | null) {
    user.value = newUser;
  }

  // 设置认证状态（用于OAuth登录）
  async function setAuth(authData: { token: string; user: User }): Promise<void> {
    setToken(authData.token);
    setUser(authData.user);
    demoMode.value = false;
  }

  // 异步操作
  async function login(email: string, password: string): Promise<boolean> {
    const toast = useToast();
    loading.value = true;
    error.value = null;

    try {
      // 开发环境下支持快速登录任意账号
      if (import.meta.env.DEV && (email === 'demo' || password === 'demo')) {
        setToken('demo-token');
        setUser({
          id: 'demo-user',
          username: email || 'demo',
          email: `${email || 'demo'}@example.com`,
          avatar: `https://i.pravatar.cc/150?img=1`,
          verified: true,
          nickname: email || 'Demo User',
          bio: '',
          subscribers: 0,
          subscribing: 0,
          totalViews: 0,
          joinedAt: new Date().toISOString(),
        });
        demoMode.value = true;
        toast.success('演示模式登录成功');
        return true;
      }

      // 使用模拟数据库登录
      await mockDelay();
      const response = mockDb.login(email, password);

      if (response.success && response.token && response.user) {
        // 使用映射器处理用户数据
        const mappedUser = mapDbUserToFrontend(response.user);
        setToken(response.token);
        setUser(mappedUser);
        demoMode.value = false;
        toast.success('登录成功');
        // 调试信息：记录当前用户角色
        console.log('[AuthStore] 登录成功，当前用户:', mappedUser);
        console.log('[AuthStore] 用户角色:', userRole.value);
        console.log('[AuthStore] 用户信息详情:', {
          email: mappedUser?.email || 'unknown',
          username: mappedUser?.username || 'unknown',
          role: mappedUser?.role || 'unknown',
          isAdmin: isAdmin.value,
          demoMode: demoMode.value,
        });
        return true;
      } else {
        // 确保错误信息不为undefined
        const errorMsg = response.error || '登录失败，请检查用户名和密码';
        error.value = errorMsg;
        toast.error(errorMsg);
        return false;
      }
    } catch (err: any) {
      // 处理其他错误
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? err.message || '登录过程中发生错误'
          : '登录过程中发生未知错误';
      error.value = errorMsg;
      toast.error(errorMsg);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function register(
    username: string,
    password: string,
    nickname?: string,
    email?: string
  ): Promise<boolean> {
    const toast = useToast();
    loading.value = true;
    error.value = null;
    try {
      // 使用模拟数据库注册
      await mockDelay();
      const response = mockDb.register({
        username,
        email: email || `${username}@example.com`,
        password,
        nickname,
      });

      if (response.success) {
        toast.success('注册成功，请登录');
        return true;
      } else {
        const errorMsg = response.error || '注册失败，请稍后重试';
        error.value = errorMsg;
        toast.error(errorMsg);
        return false;
      }
    } catch (err: any) {
      // 处理其他错误
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? err.message || '注册过程中发生错误'
          : '注册过程中发生未知错误';
      error.value = errorMsg;
      toast.error(errorMsg);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function checkAuth(): Promise<boolean> {
    if (demoMode.value) return true;
    if (!token.value) return false;

    try {
      // 这里可以实现查询token的逻辑
      // 暂时简化为随机模拟已登录用户
      const tokenUserId = token.value.includes('u-') ? token.value.split('-')[1] : null;

      if (tokenUserId) {
        // 可以在这里添加根据ID获取用户的逻辑
        setUser({
          id: `u-${tokenUserId}`,
          username: 'verified_user',
          email: `user-${tokenUserId}@example.com`,
          nickname: '已验证用户',
          avatar: `https://i.pravatar.cc/150?u=${tokenUserId}`,
          verified: true,
          bio: '这是一个通过token验证的用户账号',
          subscribers: 0,
          subscribing: 0,
          totalViews: 0,
          joinedAt: new Date().toISOString(),
        });
        return true;
      } else {
        logout();
        return false;
      }
    } catch (err: any) {
      logout();
      return false;
    }
  }

  function logout(): void {
    const toast = useToast();
    setToken(null);
    setUser(null);
    error.value = null;
    demoMode.value = false;
    toast.success('已退出登录');
  }

  function enableDemoMode() {
    demoMode.value = true;
    const toast = useToast();
    toast.success('已启用演示模式');
  }

  function disableDemoMode() {
    demoMode.value = false;
    if (!token.value) {
      user.value = null;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    // 状态
    token,
    user,
    loading,
    error,
    demoMode,

    // 计算属性
    isAuthenticated,
    isAdmin,
    isCreator,
    username,
    userRole,

    // 操作
    setToken,
    setUser,
    setAuth,
    login,
    register,
    logout,
    checkAuth,
    enableDemoMode,
    disableDemoMode,
    clearError,
  };
});

// 导出一个setupAuthWatch函数，在应用初始化后调用
export function setupAuthWatch() {
  if (typeof window !== 'undefined') {
    try {
      // 尝试获取auth store
      const authStore = useAuthStore();

      // 监听token变化
      watch(
        () => authStore.token,
        (newToken: string | null) => {
          if (newToken) {
            localStorage.setItem('auth_token', newToken);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      );

      // 监听demoMode变化
      watch(
        () => authStore.demoMode,
        (newDemoMode: boolean) => {
          localStorage.setItem('demo-mode', newDemoMode ? 'true' : 'false');
        }
      );
    } catch (error) {
      console.error('设置Auth监听器失败，可能Pinia尚未初始化:', error);
    }
  }
}
