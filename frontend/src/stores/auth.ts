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
import { ref, computed, reactive } from 'vue';
import api from '@/utils/api';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem('token') || null);
  const user = reactive<User>({
    id: '',
    username: '',
    email: '',
    role: '',
    avatarUrl: '',
    isVerified: false,
  });
  const loading = ref(false);
  const error = ref<string | null>(null);
  const demoMode = useStorage<boolean>('demo-mode', true);

  // 计算属性
  const isAuthenticated = computed(() => !!token.value || demoMode.value);
  const isAdmin = computed(() => user.role === 'ADMIN');
  const isCreator = computed(() => user.role === 'CREATOR' || isAdmin.value);
  const username = computed(() => user.username || '游客');
  const userRole = computed(() => {
    // 开发环境下，如果是demo模式，且用户名是admin，则作为管理员
    if (demoMode.value && user.username === 'admin') {
      return 'ADMIN';
    }

    // 如果用户名是admin@atomvideo.com或username是admin，则作为管理员
    if (user.email === 'admin@atomvideo.com' || user.username === 'admin') {
      return 'ADMIN';
    }

    // 如果用户名是creator@atomvideo.com或username是creator，则作为创作者
    if (user.email === 'creator@atomvideo.com' || user.username === 'creator') {
      return 'CREATOR';
    }

    // 默认为普通用户
    return 'USER';
  });

  // 操作
  function setToken(newToken: string | null) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('token');
      api.defaults.headers.common['Authorization'] = '';
    }
  }

  function setUser(newUser: User | null) {
    Object.assign(
      user,
      newUser || {
        id: '',
        username: '',
        email: '',
        role: '',
        avatarUrl: '',
        isVerified: false,
      }
    );
  }

  // 异步操作
  async function login(email: string, password: string, rememberMe = false): Promise<boolean> {
    const toast = useToast();
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post('/api/auth/login', { email, password, rememberMe });
      setToken(response.data.access_token);
      await fetchUser();
      toast.success('登录成功');
      return true;
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

  async function register(userData: {
    username: string;
    email: string;
    password: string;
    name?: string;
  }): Promise<boolean> {
    const toast = useToast();
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/api/auth/register', userData);
      if (response && response.data) {
        setToken(response.data.access_token);
        toast.success('注册成功，请登录');
        return true;
      } else {
        // 确保错误信息不为undefined
        const errorMsg = response && response.error ? response.error : '注册失败，请稍后重试';
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

  async function fetchUser(): Promise<boolean> {
    if (!token.value) return false;

    loading.value = true;
    try {
      const response = await api.get('/api/user/me');
      setUser(response.data);
      return true;
    } catch (err: any) {
      console.error('获取用户信息失败:', err);
      logout();
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout(): void {
    const toast = useToast();
    setToken(null);
    setUser(null);
    error.value = null;
    demoMode.value = false;
    toast.success('已退出登录');

    // 如果在需要认证的路由，重定向到登录页
    if (router.currentRoute.value.meta.requiresAuth) {
      router.push('/auth/login');
    }
  }

  function enableDemoMode() {
    demoMode.value = true;
    const toast = useToast();
    toast.success('已启用演示模式');
  }

  function disableDemoMode() {
    demoMode.value = false;
    if (!token.value) {
      setUser(null);
    }
  }

  function clearError() {
    error.value = null;
  }

  // 请求密码重置验证码
  async function requestPasswordReset(email: string) {
    loading.value = true;
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Password reset request failed', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // 验证重置密码验证码
  async function verifyCode(email: string, code: string) {
    loading.value = true;
    try {
      const response = await api.post('/api/auth/verify-code', { email, code });
      return response.data.valid;
    } catch (error) {
      console.error('Code verification failed', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // 使用验证码重置密码
  async function resetPasswordWithCode(email: string, code: string, password: string) {
    loading.value = true;
    try {
      const response = await api.post('/api/auth/reset-password', { email, code, password });
      return response.data;
    } catch (error) {
      console.error('Password reset failed', error);
      throw error;
    } finally {
      loading.value = false;
    }
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
    login,
    register,
    fetchUser,
    logout,
    enableDemoMode,
    disableDemoMode,
    clearError,
    setToken,
    setUser,
    requestPasswordReset,
    verifyCode,
    resetPasswordWithCode,
  };
});
