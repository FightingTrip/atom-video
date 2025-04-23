/**
 * 管理后台API服务
 *
 * 提供管理后台所需的所有API调用
 */

import api from './api';

// 仪表盘统计数据类型
export interface DashboardStats {
  userCount: number;
  videoCount: number;
  commentCount: number;
  interactionCount: number;
  newUserCount: number;
  newVideoCount: number;
  activeUserCount: number;
  reportCount: number;
  lastUpdated: string;
}

// 活动数据类型
export interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  userId?: string;
  videoId?: string;
  reportId?: string;
  commentId?: string;
  adminId?: string;
  avatar: string;
}

// 视频数据类型
export interface AdminVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  author: string;
  authorId: string;
  category: string;
  duration: string;
  status: string;
  tags: string[];
  createdAt: string;
  publishedAt: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

// 用户数据类型
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  nickname: string;
  avatar: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string | null;
  videoCount: number;
  subscriberCount: number;
  bio: string;
  verified: boolean;
}

// 评论数据类型
export interface AdminComment {
  id: string;
  content: string;
  videoId: string;
  videoTitle: string;
  userId: string;
  username: string;
  avatar: string;
  createdAt: string;
  status: string;
  likes: number;
  replies: number;
}

// 举报数据类型
export interface AdminReport {
  id: string;
  type: string;
  reasonCode: string;
  targetId: string;
  reporterId: string;
  reporterName: string;
  description: string;
  createdAt: string;
  status: string;
  resolvedAt: string | null;
  resolvedById: string | null;
  severity: string;
}

// 分页结果类型
interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 管理后台API服务
const adminService = {
  // 仪表盘统计
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<{ success: boolean; data: DashboardStats }>(
      '/api/admin/dashboard/stats'
    );
    return response.data;
  },

  // 仪表盘活动
  async getRecentActivities(): Promise<Activity[]> {
    const response = await api.get<{ success: boolean; data: Activity[] }>(
      '/api/admin/dashboard/activities'
    );
    return response.data;
  },

  // 视频列表
  async getVideos(
    params: {
      page?: number;
      pageSize?: number;
      status?: string;
      category?: string;
      query?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<PaginatedResult<AdminVideo>> {
    const response = await api.get<{ success: boolean; data: PaginatedResult<AdminVideo> }>(
      '/api/admin/videos',
      { params }
    );
    return response.data;
  },

  // 视频详情
  async getVideoById(id: string): Promise<AdminVideo> {
    const response = await api.get<{ success: boolean; data: AdminVideo }>(
      `/api/admin/videos/${id}`
    );
    return response.data;
  },

  // 更新视频
  async updateVideo(id: string, data: Partial<AdminVideo>): Promise<AdminVideo> {
    const response = await api.put<{ success: boolean; data: AdminVideo }>(
      `/api/admin/videos/${id}`,
      data
    );
    return response.data;
  },

  // 删除视频
  async deleteVideo(id: string): Promise<{ success: boolean; message: string }> {
    return await api.delete(`/api/admin/videos/${id}`);
  },

  // 用户列表
  async getUsers(
    params: {
      page?: number;
      pageSize?: number;
      role?: string;
      status?: string;
      query?: string;
    } = {}
  ): Promise<PaginatedResult<AdminUser>> {
    const response = await api.get<{ success: boolean; data: PaginatedResult<AdminUser> }>(
      '/api/admin/users',
      { params }
    );
    return response.data;
  },

  // 用户详情
  async getUserById(id: string): Promise<AdminUser> {
    const response = await api.get<{ success: boolean; data: AdminUser }>(`/api/admin/users/${id}`);
    return response.data;
  },

  // 更新用户
  async updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
    const response = await api.put<{ success: boolean; data: AdminUser }>(
      `/api/admin/users/${id}`,
      data
    );
    return response.data;
  },

  // 删除用户
  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    return await api.delete(`/api/admin/users/${id}`);
  },

  // 更多API...可以根据需要继续添加
};

export default adminService;
