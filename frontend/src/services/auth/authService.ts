import { apiClient, apiRequest } from '@/services/api/client';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from './types';

export const authService = {
  // 用户登录
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiRequest(apiClient.post<AuthResponse>('/auth/login', data));
  },

  // 用户注册
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiRequest(apiClient.post<AuthResponse>('/auth/register', data));
  },

  // 用户登出
  async logout(): Promise<void> {
    return apiRequest(apiClient.post('/auth/logout'));
  },

  // 刷新令牌
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiRequest(apiClient.post<AuthResponse>('/auth/refresh-token', { refreshToken }));
  },

  // 忘记密码
  async forgotPassword(email: string): Promise<void> {
    return apiRequest(apiClient.post('/auth/forgot-password', { email }));
  },

  // 重置密码
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    return apiRequest(apiClient.post('/auth/reset-password', data));
  },

  // 修改密码
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    return apiRequest(apiClient.post('/auth/change-password', data));
  },

  // 验证邮箱
  async verifyEmail(token: string): Promise<void> {
    return apiRequest(apiClient.post('/auth/verify-email', { token }));
  },

  // 获取当前会话
  async getSession(): Promise<AuthResponse> {
    return apiRequest(apiClient.get<AuthResponse>('/auth/session'));
  },
};
