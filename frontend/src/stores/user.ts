import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, Video } from '@/types';
import api from '@/utils/api';
import { useAuthStore } from './auth';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  username: string;
  nickname: string;
}

interface UpdateProfilePayload {
  nickname?: string;
  bio?: string;
  avatar?: string;
  social?: {
    website?: string;
    github?: string;
    twitter?: string;
  };
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: state => !!state.user,
    username: state => state.user?.username || '',
    avatarUrl: state => state.user?.avatar || '',
    userId: state => state.user?.id || '',
    userRole: state => state.user?.role || '',
    isAdmin: state => state.user?.role === 'admin',
    isCreator: state => state.user?.role === 'creator' || state.user?.role === 'admin',
  },

  actions: {
    async fetchCurrentUser() {
      this.isLoading = true;
      this.error = null;

      try {
        this.user = await userService.getCurrentUser();
      } catch (error: any) {
        this.error = error;
        console.error('Failed to fetch current user:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfile(data: any) {
      this.isLoading = true;
      this.error = null;

      try {
        this.user = await userService.updateProfile(data);
      } catch (error: any) {
        this.error = error;
        console.error('Failed to update profile:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    setUser(user: User | null) {
      this.user = user;
    },

    clearUser() {
      this.user = null;
    },

    setError(error: Error | null) {
      this.error = error;
    },

    refreshToken() {
      const authStore = useAuthStore();
      return authStore.refreshToken();
    },

    async logout() {
      const authStore = useAuthStore();
      await authStore.logout();
      this.clearUser();
    },
  },
});
