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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useStorage<User | null>('user', null),
    token: useStorage<string | null>('token', null),
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    isAdmin: state => state.user?.username === 'admin',
  },

  actions: {
    async login(email: string, password: string) {
      const toast = useToast();
      this.loading = true;
      this.error = null;
      
      console.log('Auth store login attempt:', { email, password }); // 添加调试日志
      
      try {
        const response = await mockLogin({ username: email, password });
        console.log('Auth store login response:', response); // 添加调试日志
        
        if (response.success && response.data) {
          this.setAuth(response.data);
          toast.success('登录成功');
          return true;
        } else {
          this.error = response.error || '登录失败';
          toast.error(this.error);
          return false;
        }
      } catch (error) {
        console.error('Auth store login error:', error); // 添加调试日志
        this.error = '登录过程中发生错误';
        toast.error(this.error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(username: string, password: string, nickname?: string) {
      const toast = useToast();
      this.loading = true;
      this.error = null;
      try {
        const response = await mockRegister({ username, password, nickname });
        if (response.success && response.data) {
          // 注册成功但不立即登录
          toast.success('注册成功');
          return true;
        } else {
          this.error = response.error || '注册失败';
          toast.error(this.error);
          return false;
        }
      } catch (error) {
        this.error = '注册过程中发生错误';
        toast.error(this.error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async checkAuth() {
      if (!this.token) return false;

      try {
        const response = await getUserByToken(this.token);
        if (response.success && response.data) {
          this.user = response.data;
          return true;
        } else {
          this.logout();
          return false;
        }
      } catch (error) {
        this.logout();
        return false;
      }
    },

    setAuth(auth: AuthResponse) {
      this.token = auth.token;
      this.user = auth.user;
    },

    logout() {
      const toast = useToast();
      this.token = null;
      this.user = null;
      this.error = null;
      toast.success('已退出登录');
    },

    clearError() {
      this.error = null;
    },
  },
});
