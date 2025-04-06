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
  const isAdmin = computed(() => user.value?.username === 'admin');
  const username = computed(() => user.value?.username || '游客');

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
          isVerified: true,
        });
        demoMode.value = true;
        toast.success('演示模式登录成功');
        return true;
      }

      const response = await mockLogin({ username: email, password });

      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
        demoMode.value = false;
        toast.success('登录成功');
        return true;
      } else {
        error.value = response.error || '登录失败';
        toast.error(error.value);
        return false;
      }
    } catch (err: any) {
      error.value = err.message || '登录过程中发生错误';
      toast.error(error.value);
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
      const response = await mockRegister({ username, password, nickname });
      if (response.success && response.data) {
        // 注册成功但不立即登录
        toast.success('注册成功，请登录');
        return true;
      } else {
        error.value = response.error || '注册失败';
        toast.error(error.value);
        return false;
      }
    } catch (err: any) {
      error.value = err.message || '注册过程中发生错误';
      toast.error(error.value);
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
      if (response.success && response.data) {
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
