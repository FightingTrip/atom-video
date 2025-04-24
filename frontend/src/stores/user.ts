/**
 * 用户状态管理
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types';
import mockDb from '@/mock/mockDb';

// 获取模拟数据库实例
// const mockDb = new MockDb();

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
      // 从本地存储中获取用户信息（如果有的话）
      const savedUserJSON = localStorage.getItem('user');
      let userId = 'u-user'; // 默认使用普通用户

      if (savedUserJSON) {
        try {
          const savedUser = JSON.parse(savedUserJSON);
          userId = savedUser.id || userId;
        } catch (e) {
          console.error('解析保存的用户数据时出错:', e);
          localStorage.removeItem('user');
        }
      }

      // 从模拟数据库获取用户数据
      let user = mockDb.getUserById(userId);

      if (user) {
        currentUser.value = user;
        console.log('用户数据已初始化:', user.nickname);
      } else {
        // 如果找不到用户，尝试获取默认用户
        console.warn('无法找到指定的用户，尝试使用默认用户');
        user = mockDb.getUserById('u-user');

        if (user) {
          currentUser.value = user;
          console.log('已使用默认用户初始化:', user.nickname);
        } else {
          // 如果默认用户也找不到，创建一个临时用户对象
          console.error('无法加载任何用户数据，使用临时用户');
          currentUser.value = {
            id: 'temp-user',
            username: 'guest',
            email: 'guest@example.com',
            nickname: '临时访客',
            avatar: 'https://i.pravatar.cc/150?u=guest',
            bio: '',
            verified: false,
            joinedAt: new Date().toISOString(),
            role: 'user',
          };
        }
      }
    } catch (err: any) {
      console.error('初始化用户状态时出错:', err);
      error.value = '无法加载用户信息';

      // 即使发生错误，也提供一个默认的用户对象，确保应用可以继续运行
      currentUser.value = {
        id: 'temp-user',
        username: 'guest',
        email: 'guest@example.com',
        nickname: '临时访客',
        avatar: 'https://i.pravatar.cc/150?u=guest',
        bio: '',
        verified: false,
        joinedAt: new Date().toISOString(),
        role: 'user',
      };
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

  // 更新用户资料
  async function updateProfile(payload: UpdateProfilePayload) {
    if (!currentUser.value) return null;

    loading.value = true;
    try {
      const result = mockDb.updateUser(currentUser.value.id, payload);

      if (result.success && result.user) {
        // 更新当前用户状态
        currentUser.value = result.user;
        // 更新本地存储
        localStorage.setItem('user', JSON.stringify(result.user));
        return result.user;
      }

      return null;
    } catch (err) {
      console.error('更新用户资料失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // 清除用户状态
  function clearUser() {
    currentUser.value = null;
    localStorage.removeItem('user');
  }

  // 获取用户通知设置
  async function getUserNotificationSettings() {
    if (!currentUser.value) return null;

    try {
      const userSettings = await import('@/services/user/settings').then(module =>
        module.getUserNotificationSettings(currentUser.value!.id)
      );
      return userSettings;
    } catch (error) {
      console.error('获取通知设置失败:', error);
      return null;
    }
  }

  // 更新用户通知设置
  async function updateNotificationSettings(settings: any) {
    if (!currentUser.value) return false;

    try {
      await import('@/services/user/settings').then(module =>
        module.updateUserNotificationSettings(currentUser.value!.id, settings)
      );
      return true;
    } catch (error) {
      console.error('更新通知设置失败:', error);
      return false;
    }
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
    updateProfile,
    clearUser,
    getUserNotificationSettings,
    updateNotificationSettings,
  };
});
