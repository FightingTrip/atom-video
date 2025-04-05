import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, Video } from '@/types';
import api from '@/utils/api';

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

export const useUserStore = defineStore('user', () => {
  const profile = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 初始化用户状态
  const initUser = async () => {
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (savedToken) {
      token.value = savedToken;
      try {
        // 这里应该调用API验证token并获取用户信息
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500));
        profile.value = {
          id: '1',
          username: 'demouser',
          email: 'demo@example.com',
          avatar: 'https://i.pravatar.cc/150?img=1',
        };
      } catch (error) {
        console.error('Failed to initialize user:', error);
        logout();
      }
    }
  };

  // 登录
  const login = async (payload: LoginPayload) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post('/auth/login', payload);
      profile.value = response.data as User;
      return true;
    } catch (err) {
      error.value = '登录失败';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // 注册
  const register = async (payload: RegisterPayload) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post('/auth/register', payload);
      profile.value = response.data as User;
      return true;
    } catch (err) {
      error.value = '注册失败';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // 登出
  const logout = () => {
    profile.value = null;
    token.value = null;
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  // 更新资料
  const updateProfile = async (payload: UpdateProfilePayload) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.put('/user/profile', payload);
      profile.value = response.data as User;
      return true;
    } catch (err) {
      error.value = '更新失败';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // 获取用户信息
  const getUserInfo = async (userId: string): Promise<User> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取用户信息失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取用户视频列表
  const getUserVideos = async (userId: string, page: number) => {
    const response = await api.get(`/user/${userId}/videos`, {
      params: { page, pageSize: 12 },
    });
    return {
      videos: response.data.items as Video[],
      hasMore: response.data.hasMore,
    };
  };

  // 获取用户喜欢的视频
  const getUserLikedVideos = async (userId: string, page: number) => {
    const response = await api.get(`/user/${userId}/likes`, {
      params: { page, pageSize: 12 },
    });
    return {
      videos: response.data.items as Video[],
      hasMore: response.data.hasMore,
    };
  };

  // 关注/取消关注用户
  const toggleFollow = async (userId: string): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      await api.post(`/users/${userId}/follow`);
    } catch (err) {
      error.value = err instanceof Error ? err.message : '操作失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取当前用户资料
  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      profile.value = response.data as User;
    } catch (error) {
      profile.value = null;
      throw error;
    }
  };

  // 更新用户信息
  const updateUserInfo = async (data: Partial<User>): Promise<User> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.put('/users/profile', data);
      profile.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新用户信息失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 更新用户设置
  const updateUserSettings = async (data: Record<string, any>): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      await api.put('/users/settings', data);
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新用户设置失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取用户统计信息
  const getUserStats = async (userId: string): Promise<Record<string, number>> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.get(`/users/${userId}/stats`);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取用户统计信息失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取用户订阅列表
  const getSubscriptions = async (page = 1): Promise<{ users: User[]; hasMore: boolean }> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.get('/users/subscriptions', {
        params: { page },
      });
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取订阅列表失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取用户粉丝列表
  const getFollowers = async (
    userId: string,
    page = 1
  ): Promise<{ users: User[]; hasMore: boolean }> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.get(`/users/${userId}/followers`, {
        params: { page },
      });
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取粉丝列表失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    profile,
    token,
    loading,
    error,
    initUser,
    login,
    register,
    logout,
    updateProfile,
    getUserInfo,
    getUserVideos,
    getUserLikedVideos,
    toggleFollow,
    fetchProfile,
    updateUserInfo,
    updateUserSettings,
    getUserStats,
    getSubscriptions,
    getFollowers,
  };
});
