/**
 * @file api.ts
 * @description API 配置文件
 * @author Atom Video Team
 * @date 2025-04-06
 */
import { http } from '@/utils/http';
// API 基础配置
export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL,
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
        detail: (id) => `/videos/${id}`,
        upload: '/videos/upload',
        delete: (id) => `/videos/${id}`,
        like: (id) => `/videos/${id}/like`,
        favorite: (id) => `/videos/${id}/favorite`,
        comment: (id) => `/videos/${id}/comments`,
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
        detail: (id) => `/tags/${id}`,
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
//# sourceMappingURL=api.js.map