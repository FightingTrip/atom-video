import { apiClient, apiRequest } from '@/services/api/client';
import { User } from '@/types';
import { PaginatedData } from '@/services/api/types';
import {
  UpdateUserProfileRequest,
  UserQueryParams,
  UserPreferences,
  UserStats,
  WatchHistory,
  UserVideo,
  UserActivity,
} from './types';
import { mockDelay } from '@/utils/mockData';

export const userService = {
  // 获取当前用户信息
  async getCurrentUser(): Promise<User> {
    // 真实环境使用API
    // return apiRequest(apiClient.get<User>('/user/me'));

    // 模拟环境，从localStorage获取用户
    await mockDelay(300);
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      return JSON.parse(userData);
    }
    throw new Error('未登录');
  },

  // 获取用户资料
  async getUserProfile(userId: string): Promise<User> {
    // 真实环境使用API
    // return apiRequest(apiClient.get<UserProfile>(`/users/${userId}/profile`));

    // 模拟环境
    await mockDelay(500);

    // 从localStorage获取用户列表
    const usersData = localStorage.getItem('users');
    let users: User[] = [];
    if (usersData) {
      users = JSON.parse(usersData);
    }

    // 查找指定用户
    const user = users.find(u => u.id === userId);
    if (user) {
      return user;
    }
    throw new Error('用户不存在');
  },

  // 更新用户资料
  async updateProfile(data: UpdateUserProfileRequest): Promise<User> {
    // 真实环境使用API
    // 使用表单数据处理文件上传
    // if (data.avatar instanceof File) {
    //   const formData = new FormData();
    //   Object.entries(data).forEach(([key, value]) => {
    //     if (key !== 'avatar' && value !== undefined) {
    //       formData.append(key, String(value));
    //     }
    //   });
    //   if (data.avatar) {
    //     formData.append('avatar', data.avatar);
    //   }
    //   return apiRequest(
    //     apiClient.put<User>('/user/profile', formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     })
    //   );
    // } else {
    //   return apiRequest(apiClient.put<User>('/user/profile', data));
    // }

    // 模拟环境
    await mockDelay(800);

    // 从localStorage获取当前用户
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      throw new Error('未登录');
    }

    const currentUser = JSON.parse(userData);

    // 更新用户信息
    const updatedUser = {
      ...currentUser,
      ...data,
      // 如果data.avatar是URL字符串而不是File对象，直接使用
      avatar: typeof data.avatar === 'string' ? data.avatar : currentUser.avatar,
    };

    // 保存到localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // 更新用户列表中的用户信息
    const usersData = localStorage.getItem('users');
    if (usersData) {
      const users = JSON.parse(usersData);
      const userIndex = users.findIndex((u: User) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }

    return updatedUser;
  },

  // 更新用户密码
  async updatePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    // 真实环境使用API
    // return apiRequest(apiClient.put('/user/password', { currentPassword, newPassword }));

    // 模拟环境
    await mockDelay(600);

    // 从localStorage获取当前用户
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      throw new Error('未登录');
    }

    // 模拟密码验证
    if (currentPassword === 'wrong_password') {
      throw new Error('当前密码不正确');
    }

    // 密码更新成功
    return true;
  },

  // 更新用户偏好设置
  async updatePreferences(preferences: UserPreferences): Promise<UserPreferences> {
    // 真实环境使用API
    // return apiRequest(apiClient.put<UserPreferences>('/user/preferences', preferences));

    // 模拟环境
    await mockDelay(400);

    // 从localStorage获取当前用户
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      throw new Error('未登录');
    }

    const currentUser = JSON.parse(userData);

    // 更新用户偏好
    const updatedUser = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        ...preferences,
      },
    };

    // 保存到localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    return updatedUser.preferences;
  },

  // 获取用户列表
  async getUsers(params?: UserQueryParams): Promise<PaginatedData<User>> {
    // 真实环境使用API
    // return apiRequest(apiClient.get<PaginatedData<User>>('/users', { params }));

    // 模拟环境
    await mockDelay(600);

    // 从localStorage获取用户列表
    const usersData = localStorage.getItem('users');
    let users: User[] = [];
    if (usersData) {
      users = JSON.parse(usersData);
    }

    // 应用过滤和分页
    let filteredUsers = [...users];

    // 过滤
    if (params?.query) {
      const query = params.query.toLowerCase();
      filteredUsers = filteredUsers.filter(
        user =>
          user.username.toLowerCase().includes(query) ||
          user.nickname.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    // 计算总数
    const total = filteredUsers.length;

    // 分页
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedUsers = filteredUsers.slice(start, end);

    return {
      data: paginatedUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // 获取用户统计数据
  async getUserStats(userId: string): Promise<UserStats> {
    // 真实环境使用API
    // return apiRequest(apiClient.get<UserStats>(`/users/${userId}/stats`));

    // 模拟环境
    await mockDelay(500);

    // 生成模拟统计数据
    return {
      videoCount: Math.floor(Math.random() * 50),
      totalViews: Math.floor(Math.random() * 500000),
      totalLikes: Math.floor(Math.random() * 50000),
      totalComments: Math.floor(Math.random() * 2000),
      followersCount: Math.floor(Math.random() * 10000),
      followingCount: Math.floor(Math.random() * 500),
      // 按月统计的视图数
      viewsByMonth: Array(12)
        .fill(0)
        .map(() => Math.floor(Math.random() * 50000)),
      // 按月统计的订阅数
      subscribersByMonth: Array(12)
        .fill(0)
        .map(() => Math.floor(Math.random() * 1000)),
      // 热门视频
      topVideos: Array(5)
        .fill(0)
        .map((_, i) => ({
          id: `v${i + 1}`,
          title: `热门视频 ${i + 1}`,
          views: Math.floor(Math.random() * 100000),
          likes: Math.floor(Math.random() * 10000),
          coverUrl: `https://picsum.photos/id/${i + 50}/300/200`,
        })),
    };
  },

  // 获取用户活动记录
  async getUserActivity(userId: string, limit: number = 10): Promise<UserActivity[]> {
    // 真实环境使用API
    // return apiRequest(apiClient.get<UserActivity[]>(`/users/${userId}/activity`, { params: { limit } }));

    // 模拟环境
    await mockDelay(700);

    // 生成模拟活动记录
    const activityTypes = ['video_upload', 'comment', 'like', 'subscribe', 'follow'];
    const activities: UserActivity[] = [];

    for (let i = 0; i < limit; i++) {
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const date = new Date();
      date.setDate(date.getDate() - i);

      let content = '';
      let target: any = null;

      switch (type) {
        case 'video_upload':
          content = '上传了新视频';
          target = {
            id: `v${i}`,
            title: `视频标题 ${i}`,
            coverUrl: `https://picsum.photos/id/${i + 100}/300/200`,
          };
          break;
        case 'comment':
          content = '评论了视频';
          target = {
            id: `v${i + 20}`,
            title: `视频标题 ${i + 20}`,
            coverUrl: `https://picsum.photos/id/${i + 120}/300/200`,
          };
          break;
        case 'like':
          content = '点赞了视频';
          target = {
            id: `v${i + 40}`,
            title: `视频标题 ${i + 40}`,
            coverUrl: `https://picsum.photos/id/${i + 140}/300/200`,
          };
          break;
        case 'subscribe':
          content = '订阅了频道';
          target = {
            id: `u${i}`,
            nickname: `用户 ${i}`,
            avatar: `https://i.pravatar.cc/150?u=${i + 10}`,
          };
          break;
        case 'follow':
          content = '关注了用户';
          target = {
            id: `u${i + 5}`,
            nickname: `用户 ${i + 5}`,
            avatar: `https://i.pravatar.cc/150?u=${i + 15}`,
          };
          break;
      }

      activities.push({
        id: `a${i}`,
        type,
        content,
        target,
        date: date.toISOString(),
      });
    }

    return activities;
  },

  // 获取用户视频
  async getUserVideos(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedData<UserVideo>> {
    // 真实环境使用API
    // return apiRequest(apiClient.get<PaginatedData<UserVideo>>(`/users/${userId}/videos`, { params: { page, limit } }));

    // 模拟环境
    await mockDelay(800);

    // 生成模拟视频数据
    const totalVideos = 25; // 总视频数
    const videos: UserVideo[] = [];

    // 确定此页显示的视频
    const start = (page - 1) * limit;
    const end = Math.min(start + limit, totalVideos);

    for (let i = start; i < end; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      videos.push({
        id: `v${i}`,
        title: `用户视频 ${i + 1}`,
        description: `这是用户上传的第 ${i + 1} 个视频描述`,
        coverUrl: `https://picsum.photos/id/${i + 200}/300/200`,
        duration: Math.floor(Math.random() * 600) + 60, // 60-660秒
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        createdAt: date.toISOString(),
        status: Math.random() > 0.1 ? 'published' : 'processing', // 10%概率处理中
      });
    }

    return {
      data: videos,
      pagination: {
        total: totalVideos,
        page,
        limit,
        totalPages: Math.ceil(totalVideos / limit),
      },
    };
  },

  // 获取观看历史
  async getWatchHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedData<WatchHistory>> {
    // 真实环境使用API
    // return apiRequest(apiClient.get<PaginatedData<WatchHistory>>('/user/history', { params: { page, limit } }));

    // 模拟环境
    await mockDelay(600);

    // 从localStorage获取观看历史
    const historyData = localStorage.getItem('watch_history');
    let historyItems: any[] = [];
    if (historyData) {
      historyItems = JSON.parse(historyData);
    }

    // 计算总数
    const total = historyItems.length;

    // 分页
    const start = (page - 1) * limit;
    const end = Math.min(start + limit, total);
    const paginatedHistory = historyItems.slice(start, end);

    // 补充一些附加信息
    const enrichedHistory: WatchHistory[] = paginatedHistory.map(item => ({
      ...item,
      watchedAt: item.timestamp || new Date().toISOString(),
      progress: Math.random(), // 随机进度
      duration: Math.floor(Math.random() * 600) + 60, // 60-660秒
    }));

    return {
      data: enrichedHistory,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // 清空观看历史
  async clearWatchHistory(): Promise<boolean> {
    // 真实环境使用API
    // return apiRequest(apiClient.delete('/user/history'));

    // 模拟环境
    await mockDelay(500);

    // 清空localStorage中的观看历史
    localStorage.removeItem('watch_history');

    return true;
  },

  // 关注用户
  async followUser(userId: string): Promise<void> {
    // 真实环境使用API
    // return apiRequest(apiClient.post(`/users/${userId}/follow`));

    // 模拟环境
    await mockDelay(400);

    // 从localStorage获取当前用户
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      throw new Error('未登录');
    }

    const currentUser = JSON.parse(userData);

    // 更新关注列表
    const following = currentUser.following || [];
    if (!following.includes(userId)) {
      following.push(userId);
    }

    // 保存到localStorage
    const updatedUser = {
      ...currentUser,
      following,
      followingCount: following.length,
    };

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  },

  // 取消关注用户
  async unfollowUser(userId: string): Promise<void> {
    // 真实环境使用API
    // return apiRequest(apiClient.delete(`/users/${userId}/follow`));

    // 模拟环境
    await mockDelay(400);

    // 从localStorage获取当前用户
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      throw new Error('未登录');
    }

    const currentUser = JSON.parse(userData);

    // 更新关注列表
    const following = currentUser.following || [];
    const updatedFollowing = following.filter((id: string) => id !== userId);

    // 保存到localStorage
    const updatedUser = {
      ...currentUser,
      following: updatedFollowing,
      followingCount: updatedFollowing.length,
    };

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  },

  // 获取关注列表
  async getFollowing(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedData<User>> {
    // 真实环境使用API
    // return apiRequest(apiClient.get<PaginatedData<User>>(`/users/${userId}/following`, { params: { page, limit } }));

    // 模拟环境
    await mockDelay(600);

    // 从localStorage获取指定用户
    const usersData = localStorage.getItem('users');
    let users: User[] = [];
    if (usersData) {
      users = JSON.parse(usersData);
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 获取关注的用户ID列表
    const following = user.following || [];

    // 获取关注的用户详情
    const followingUsers = users.filter(u => following.includes(u.id));

    // 计算总数
    const total = followingUsers.length;

    // 分页
    const start = (page - 1) * limit;
    const end = Math.min(start + limit, total);
    const paginatedUsers = followingUsers.slice(start, end);

    return {
      data: paginatedUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // 获取粉丝列表
  async getFollowers(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedData<User>> {
    // 真实环境使用API
    // return apiRequest(apiClient.get<PaginatedData<User>>(`/users/${userId}/followers`, { params: { page, limit } }));

    // 模拟环境
    await mockDelay(600);

    // 从localStorage获取所有用户
    const usersData = localStorage.getItem('users');
    let users: User[] = [];
    if (usersData) {
      users = JSON.parse(usersData);
    }

    // 获取粉丝用户(关注了指定用户的用户)
    const followers = users.filter(u => {
      const following = u.following || [];
      return following.includes(userId);
    });

    // 计算总数
    const total = followers.length;

    // 分页
    const start = (page - 1) * limit;
    const end = Math.min(start + limit, total);
    const paginatedUsers = followers.slice(start, end);

    return {
      data: paginatedUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
