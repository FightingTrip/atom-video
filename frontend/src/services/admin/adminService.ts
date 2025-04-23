/**
 * @file adminService.ts
 * @description 管理后台API服务
 */

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { mockDelay } from '@/utils/mockInitializer';

// 管理员仪表盘统计
export interface DashboardStats {
  totalUsers: number;
  newUsersToday: number;
  totalVideos: number;
  newVideosToday: number;
  totalViews: number;
  viewsToday: number;
  pendingVideos: number;
  pendingReports: number;
  totalRevenue: number;
  revenueToday: number;
  userGrowthRate: number;
  contentGrowthRate: number;
  viewsGrowthRate: number;
  revenueGrowthRate: number;
}

// 管理员活动记录
export interface Activity {
  id: string;
  type: 'video' | 'user' | 'comment' | 'report' | 'system';
  title: string;
  description: string;
  time: string;
  userId: string;
  avatar: string;
  videoId?: string;
  reportId?: string;
  commentId?: string;
  adminId?: string;
}

// 管理员视频类型
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

// 管理员用户类型
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

// 管理员评论类型
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

// 管理员举报类型
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

// 分页结果接口
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 响应结构
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 实现管理员服务
export const adminService = {
  /**
   * 获取仪表盘统计数据
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response: AxiosResponse<ApiResponse<DashboardStats>> = await axios.get(
        '/api/admin/dashboard/stats'
      );
      return response.data.data;
    } catch (error) {
      console.error('获取仪表盘统计数据失败:', error);
      throw error;
    }
  },

  /**
   * 获取最近活动
   * @param limit 限制数量
   */
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    try {
      const response: AxiosResponse<ApiResponse<Activity[]>> = await axios.get(
        '/api/admin/dashboard/activities',
        {
          params: { limit },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('获取最近活动失败:', error);
      throw error;
    }
  },

  /**
   * 获取视频列表
   * @param params 查询参数
   */
  async getVideos(
    params: {
      page?: number;
      pageSize?: number;
      status?: string;
      category?: string;
      query?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<PaginatedResult<AdminVideo>> {
    try {
      const response: AxiosResponse<ApiResponse<PaginatedResult<AdminVideo>>> = await axios.get(
        '/api/admin/videos',
        {
          params,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('获取视频列表失败:', error);
      throw error;
    }
  },

  /**
   * 获取视频详情
   * @param id 视频ID
   */
  async getVideoById(id: string): Promise<AdminVideo> {
    try {
      const response: AxiosResponse<ApiResponse<AdminVideo>> = await axios.get(
        `/api/admin/videos/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`获取视频详情失败(ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 更新视频
   * @param id 视频ID
   * @param data 更新数据
   */
  async updateVideo(
    id: string,
    data: Partial<AdminVideo>
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<ApiResponse<{ success: boolean; message: string }>> =
        await axios.put(`/api/admin/videos/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error(`更新视频失败(ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 删除视频
   * @param id 视频ID
   */
  async deleteVideo(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<ApiResponse<{ success: boolean; message: string }>> =
        await axios.delete(`/api/admin/videos/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`删除视频失败(ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 获取用户列表
   * @param params 查询参数
   */
  async getUsers(
    params: {
      page?: number;
      pageSize?: number;
      role?: string;
      status?: string;
      query?: string;
    } = {}
  ): Promise<PaginatedResult<AdminUser>> {
    try {
      const response: AxiosResponse<ApiResponse<PaginatedResult<AdminUser>>> = await axios.get(
        '/api/admin/users',
        {
          params,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('获取用户列表失败:', error);
      throw error;
    }
  },

  /**
   * 获取用户详情
   * @param id 用户ID
   */
  async getUserById(id: string): Promise<AdminUser> {
    try {
      const response: AxiosResponse<ApiResponse<AdminUser>> = await axios.get(
        `/api/admin/users/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`获取用户详情失败(ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 更新用户
   * @param id 用户ID
   * @param data 更新数据
   */
  async updateUser(
    id: string,
    data: Partial<AdminUser>
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<ApiResponse<{ success: boolean; message: string }>> =
        await axios.put(`/api/admin/users/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error(`更新用户失败(ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 删除用户
   * @param id 用户ID
   */
  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<ApiResponse<{ success: boolean; message: string }>> =
        await axios.delete(`/api/admin/users/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`删除用户失败(ID: ${id}):`, error);
      throw error;
    }
  },

  /**
   * 获取评论列表
   * @param params 查询参数
   */
  async getComments(
    params: {
      page?: number;
      pageSize?: number;
      status?: string;
      videoId?: string;
      userId?: string;
      query?: string;
    } = {}
  ): Promise<PaginatedResult<AdminComment>> {
    try {
      const response: AxiosResponse<ApiResponse<PaginatedResult<AdminComment>>> = await axios.get(
        '/api/admin/comments',
        {
          params,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('获取评论列表失败:', error);
      throw error;
    }
  },

  /**
   * 获取举报列表
   * @param params 查询参数
   */
  async getReports(
    params: {
      page?: number;
      pageSize?: number;
      status?: string;
      type?: string;
      severity?: string;
    } = {}
  ): Promise<PaginatedResult<AdminReport>> {
    try {
      const response: AxiosResponse<ApiResponse<PaginatedResult<AdminReport>>> = await axios.get(
        '/api/admin/reports',
        {
          params,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('获取举报列表失败:', error);
      throw error;
    }
  },

  /**
   * 处理举报
   * @param id 举报ID
   * @param data 处理数据
   */
  async handleReport(
    id: string,
    data: {
      status: 'resolved' | 'ignored';
      resolution?: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response: AxiosResponse<ApiResponse<{ success: boolean; message: string }>> =
        await axios.put(`/api/admin/reports/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error(`处理举报失败(ID: ${id}):`, error);
      throw error;
    }
  },
};

export default adminService;
