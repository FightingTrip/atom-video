import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const isAuthenticated = ref<boolean>(!!token.value);

  const setAuth = (newToken: string, newUser: User) => {
    token.value = newToken;
    user.value = newUser;
    isAuthenticated.value = true;
    localStorage.setItem('token', newToken);
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('token');
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: newUser } = response.data;
      setAuth(newToken, newUser);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || '登录失败，请重试',
      };
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const response = await api.post('/auth/register', { email, password, username });
      const { token: newToken, user: newUser } = response.data;
      setAuth(newToken, newUser);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || '注册失败，请重试',
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      clearAuth();
    }
  };

  const checkAuth = async () => {
    if (!token.value) return false;

    try {
      const response = await api.get('/auth/me');
      user.value = response.data;
      isAuthenticated.value = true;
      return true;
    } catch (error) {
      clearAuth();
      return false;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };
});
