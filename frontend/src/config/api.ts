/**
 * @file api.ts
 * @description API 配置文件
 * @author Atom Video Team
 * @date 2025-04-06
 */

import { http } from '@/utils/http';

// API 基础配置
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API 实例
export const api = http.create(API_CONFIG);

// API 接口定义
export const API_ENDPOINTS = {
  // 视频相关
  video: {
    list: '/videos',
    detail: (id: string) => `/videos/${id}`,
    upload: '/videos/upload',
    delete: (id: string) => `/videos/${id}`,
    like: (id: string) => `/videos/${id}/like`,
    favorite: (id: string) => `/videos/${id}/favorite`,
    comment: (id: string) => `/videos/${id}/comments`,
  },
  // 用户相关
  user: {
    profile: '/users/profile',
    settings: '/users/settings',
    subscriptions: '/users/subscriptions',
    history: '/users/history',
  },
  // 标签相关
  tag: {
    list: '/tags',
    detail: (id: string) => `/tags/${id}`,
    popular: '/tags/popular',
    trending: '/tags/trending',
  },
  // 认证相关
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
};
