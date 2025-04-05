import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types';

interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  code: string;
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

  // 邮箱登录
  const login = async (payload: LoginPayload) => {
    loading.value = true;
    try {
      // 这里应该调用实际的登录API
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟验证 (实际应由后端处理)
      if (payload.email !== 'demo@example.com' || payload.password !== 'password123') {
        throw new Error('邮箱或密码不正确');
      }

      // 模拟成功响应
      const response = {
        user: {
          id: '1',
          username: 'demouser',
          email: payload.email,
          avatar: 'https://i.pravatar.cc/150?img=1',
        },
        token: 'fake-jwt-token',
      };

      profile.value = response.user;
      token.value = response.token;

      if (payload.remember) {
        localStorage.setItem('token', response.token);
      } else {
        sessionStorage.setItem('token', response.token);
      }

      return response;
    } finally {
      loading.value = false;
    }
  };

  // 发送验证码
  const sendVerificationCode = async (email: string) => {
    // 这里应该调用实际的发送验证码API
    // 模拟API调用 (在实际应用中，这会向用户邮箱发送验证码)
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`模拟发送验证码到邮箱: ${email}，验证码: 123456`);

    // 模拟成功
    return { success: true, message: '验证码已发送到您的邮箱' };
  };

  // 邮箱注册
  const register = async (payload: RegisterPayload) => {
    loading.value = true;
    try {
      // 这里应该调用实际的注册API
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟验证 (实际应由后端处理)
      if (payload.code !== '123456') {
        throw new Error('验证码不正确');
      }

      // 检查邮箱是否已注册 (模拟)
      if (payload.email === 'demo@example.com') {
        throw new Error('该邮箱已被注册');
      }

      // 模拟成功响应
      const response = {
        success: true,
        message: '注册成功',
      };

      return response;
    } finally {
      loading.value = false;
    }
  };

  // 社交登录 (Google, GitHub)
  const socialLogin = async (provider: string) => {
    loading.value = true;
    try {
      // 在实际应用中，这里应使用OAuth流程:
      // 1. 重定向用户到OAuth提供商的登录页面
      // 2. 用户授权后，提供商会重定向回应用，带上授权码
      // 3. 后端用授权码换取用户信息和访问令牌

      // 模拟OAuth流程
      console.log(`模拟${provider}登录流程开始`);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 模拟成功登录
      const response = {
        user: {
          id: provider === 'google' ? 'g-123' : 'gh-456',
          username: `${provider}user`,
          email: `user@${provider}.com`,
          avatar: `https://i.pravatar.cc/150?img=${provider === 'google' ? 3 : 4}`,
        },
        token: `${provider}-token-xyz`,
      };

      profile.value = response.user;
      token.value = response.token;
      localStorage.setItem('token', response.token);

      return response;
    } finally {
      loading.value = false;
    }
  };

  // 忘记密码
  const forgotPassword = async (email: string) => {
    // 这里应该调用实际的重置密码API
    // 模拟API调用 (在实际应用中，这会向用户邮箱发送重置链接)
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`模拟发送密码重置链接到: ${email}`);

    // 模拟成功
    return { success: true, message: '重置链接已发送到您的邮箱' };
  };

  // 登出
  const logout = () => {
    profile.value = null;
    token.value = null;
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };

  const updateProfile = async (data: Partial<User>) => {
    loading.value = true;
    error.value = null;

    try {
      // 调用 API 更新用户资料
      // const response = await api.updateProfile(data);
      // profile.value = response.data;
      return true;
    } catch (err) {
      error.value = '更新失败';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const fetchProfile = async () => {
    loading.value = true;
    error.value = null;

    try {
      // 调用 API 获取用户资料
      // const response = await api.getProfile();
      // profile.value = response.data;
      return true;
    } catch (err) {
      error.value = '获取失败';
      return false;
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
    socialLogin,
    sendVerificationCode,
    forgotPassword,
    logout,
    updateProfile,
    fetchProfile,
  };
});
