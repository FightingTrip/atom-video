// 技术栈说明：
// - Axios: HTTP 客户端
// - TypeScript: 强类型支持
// - Vue 3: 响应式集成

import axios from 'axios';
import { useToast } from '@/composables/useToast';

const toast = useToast();

// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
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
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除认证信息
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          toast.error('登录已过期，请重新登录');
          break;
        case 403:
          toast.error('没有权限执行此操作');
          break;
        case 404:
          toast.error('请求的资源不存在');
          break;
        case 500:
          toast.error('服务器错误，请稍后重试');
          break;
        default:
          toast.error(error.response.data?.message || '请求失败');
      }
    } else if (error.request) {
      toast.error('网络错误，请检查网络连接');
    } else {
      toast.error('请求配置错误');
    }
    return Promise.reject(error);
  }
);

export default api;
