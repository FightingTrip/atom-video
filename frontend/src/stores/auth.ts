// 技术栈说明：
// - Vue 3: 使用 Composition API
// - TypeScript: 强类型支持
// - Pinia: 状态管理
// - JWT: 认证机制

import { defineStore } from 'pinia';
import type { User, AuthResponse } from '@/types';
import { login as mockLogin, register as mockRegister, getUserByToken } from '@/mock/users';
import { useStorage } from '@vueuse/core';
import { useToast } from '@/composables/useToast';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(null);
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const demoMode = useStorage<boolean>('demo-mode', true);

  // 计算属性
  const isAuthenticated = computed(() => !!token.value || demoMode.value);
  const isAdmin = computed(() => userRole.value === 'ADMIN');
  const username = computed(() => user.value?.username || '游客');
  const userRole = computed(() => {
    // 开发环境下，如果是demo模式，且用户名是admin，则作为管理员
    if (demoMode.value && user.value?.username === 'admin') {
      return 'ADMIN';
    }

    // 如果用户名是admin@atomvideo.com或username是admin，则作为管理员
    if (user.value?.email === 'admin@atomvideo.com' || user.value?.username === 'admin') {
      return 'ADMIN';
    }

    // 如果用户名是creator@atomvideo.com或username是creator，则作为创作者
    if (user.value?.email === 'creator@atomvideo.com' || user.value?.username === 'creator') {
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

      // 调用mockLogin处理登录，包括测试账号的处理
      try {
        const response = await mockLogin({ username: email, password });

        if (response && response.success && response.data) {
          setToken(response.data.token);
          setUser(response.data.user);
          demoMode.value = false;
          toast.success('登录成功');
          // 调试信息：记录当前用户角色
          console.log('[AuthStore] 登录成功，当前用户:', response.data.user);
          console.log('[AuthStore] 用户角色:', userRole.value);
          return true;
        } else {
          // 确保错误信息不为undefined
          const errorMsg =
            response && response.error ? response.error : '登录失败，请检查用户名和密码';
          error.value = errorMsg;
          toast.error(errorMsg);
          return false;
        }
      } catch (loginError: any) {
        console.error('登录过程中发生错误:', loginError);
        error.value = '登录服务暂时不可用，请稍后再试';
        toast.error(error.value);
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

  async function register(username: string, password: string, nickname?: string): Promise<boolean> {
    const toast = useToast();
    loading.value = true;
    error.value = null;
    try {
      try {
        const response = await mockRegister({ username, password, nickname });
        if (response && response.success && response.data) {
          // 注册成功但不立即登录
          toast.success('注册成功，请登录');
          return true;
        } else {
          // 确保错误信息不为undefined
          const errorMsg = response && response.error ? response.error : '注册失败，请稍后重试';
          error.value = errorMsg;
          toast.error(errorMsg);
          return false;
        }
      } catch (registerError: any) {
        console.error('注册过程中发生错误:', registerError);
        error.value = '注册服务暂时不可用，请稍后再试';
        toast.error(error.value);
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
      const response = await getUserByToken(token.value);
      if (response && response.success && response.data) {
        setUser(response.data);
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
    username,
    userRole,

    // 操作
    login,
    register,
    checkAuth,
    logout,
    enableDemoMode,
    disableDemoMode,
    clearError,
    setToken,
    setUser,
  };
});
