// 技术栈说明：
// - Vue 3: 使用 Composition API
// - TypeScript: 强类型支持
// - Pinia: 状态管理
// - JWT: 认证机制

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import { useToast } from '@/composables/useToast';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export const useAuthStore = defineStore('auth', () => {
  const toast = useToast();
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  const setAuth = (userData: User, authToken: string) => {
    user.value = userData;
    token.value = authToken;
    localStorage.setItem('token', authToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      setAuth(response.data.user, response.data.token);
      toast.success('登录成功');
      return { success: true };
    } catch (err: any) {
      error.value = err.response?.data?.message || '登录失败';
      toast.error(error.value);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.post<LoginResponse>('/auth/register', {
        email,
        password,
        username,
      });

      setAuth(response.data.user, response.data.token);
      toast.success('注册成功');
      return { success: true };
    } catch (err: any) {
      error.value = err.response?.data?.message || '注册失败';
      toast.error(error.value);
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    clearAuth();
    toast.success('已退出登录');
  };

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;

    try {
      const response = await api.get<User>('/auth/me');
      setAuth(response.data, storedToken);
    } catch (err) {
      clearAuth();
    }
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };
});
