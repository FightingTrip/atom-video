/**
 * 用户状态管理
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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

interface UserPreferences {
  categories?: string[];
  tags?: string[];
  lastWatched?: string[];
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const currentUser = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 计算属性
  const isLoggedIn = computed(() => !!currentUser.value);
  const userName = computed(() => currentUser.value?.nickname || '游客');

  // 初始化用户状态
  async function initUser() {
    // 在实际应用中，这里应该从localStorage或cookie检查是否有保存的会话
    // 然后从API获取用户信息

    // 模拟用户初始化过程
    loading.value = true;

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));

      // 从本地存储中获取用户信息（如果有的话）
      const savedUserJSON = localStorage.getItem('user');
      if (savedUserJSON) {
        try {
          currentUser.value = JSON.parse(savedUserJSON);
          console.log('用户数据已从本地存储恢复');
        } catch (e) {
          console.error('解析保存的用户数据时出错:', e);
          localStorage.removeItem('user');
        }
      }
    } catch (err: any) {
      console.error('初始化用户状态时出错:', err);
      error.value = '无法加载用户信息';
    } finally {
      loading.value = false;
    }
  }

  // 设置用户
  function setUser(user: User | null) {
    currentUser.value = user;

    // 保存到本地存储
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  // 更新用户偏好
  function updatePreferences(preferences: Partial<UserPreferences>) {
    if (currentUser.value) {
      currentUser.value.preferences = {
        ...currentUser.value.preferences,
        ...preferences,
      };

      // 更新本地存储
      localStorage.setItem('user', JSON.stringify(currentUser.value));
    }
  }

  // 清除用户状态
  function clearUser() {
    currentUser.value = null;
    localStorage.removeItem('user');
  }

  return {
    // 状态
    currentUser,
    loading,
    error,

    // 计算属性
    isLoggedIn,
    userName,

    // 操作
    initUser,
    setUser,
    updatePreferences,
    clearUser,
  };
});
