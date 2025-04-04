import axios from 'axios';
import type { ApiResponse } from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response?.status === 401) {
      // 处理未授权错误
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API 请求方法
export const apiClient = {
  async get<T>(url: string, params?: object): Promise<ApiResponse<T>> {
    return api.get(url, { params });
  },

  async post<T>(url: string, data?: object): Promise<ApiResponse<T>> {
    return api.post(url, data);
  },

  async put<T>(url: string, data?: object): Promise<ApiResponse<T>> {
    return api.put(url, data);
  },

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return api.delete(url);
  },
};

export default api;
