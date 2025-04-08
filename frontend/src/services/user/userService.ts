import { apiClient, apiRequest } from '@/services/api/client';
import { User, UserProfile } from '@/models/User';
import { PaginatedData } from '@/services/api/types';
import { UpdateUserProfileRequest, UserQueryParams } from './types';

export const userService = {
  // 获取当前用户信息
  async getCurrentUser(): Promise<User> {
    return apiRequest(apiClient.get<User>('/user/me'));
  },

  // 获取用户资料
  async getUserProfile(userId: string): Promise<UserProfile> {
    return apiRequest(apiClient.get<UserProfile>(`/users/${userId}/profile`));
  },

  // 更新用户资料
  async updateProfile(data: UpdateUserProfileRequest): Promise<User> {
    // 使用表单数据处理文件上传
    if (data.avatar) {
      const formData = new FormData();

      // 添加非文件字段
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'avatar' && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // 添加头像文件
      if (data.avatar) {
        formData.append('avatar', data.avatar);
      }

      return apiRequest(
        apiClient.put<User>('/user/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
    } else {
      // 没有文件，使用JSON
      return apiRequest(apiClient.put<User>('/user/profile', data));
    }
  },

  // 获取用户列表
  async getUsers(params?: UserQueryParams): Promise<PaginatedData<User>> {
    return apiRequest(apiClient.get<PaginatedData<User>>('/users', { params }));
  },

  // 关注用户
  async followUser(userId: string): Promise<void> {
    return apiRequest(apiClient.post(`/users/${userId}/follow`));
  },

  // 取消关注用户
  async unfollowUser(userId: string): Promise<void> {
    return apiRequest(apiClient.delete(`/users/${userId}/follow`));
  },

  // 获取关注列表
  async getFollowing(
    userId: string,
    params?: UserQueryParams
  ): Promise<PaginatedData<UserProfile>> {
    return apiRequest(
      apiClient.get<PaginatedData<UserProfile>>(`/users/${userId}/following`, { params })
    );
  },

  // 获取粉丝列表
  async getFollowers(
    userId: string,
    params?: UserQueryParams
  ): Promise<PaginatedData<UserProfile>> {
    return apiRequest(
      apiClient.get<PaginatedData<UserProfile>>(`/users/${userId}/followers`, { params })
    );
  },
};
