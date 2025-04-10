import axios from 'axios';
import type { ApiResponse } from '@/types';

// 获取当前API模式
// 确保在dev:mock模式下始终为true
const getIsMockMode = () => {
  // 检查环境变量
  const envMode = import.meta.env.VITE_API_MODE;
  if (envMode === 'mock') return true;

  // 检查URL参数，允许通过URL强制启用mock模式
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mock') === 'true') return true;

  // 检查本地存储，允许在开发过程中手动启用mock模式
  if (localStorage.getItem('use_mock_data') === 'true') return true;

  return false;
};

const isMockMode = getIsMockMode();
console.log(`当前API模式: ${isMockMode ? '模拟数据' : '真实API'}`);

// 开发用：设置全局函数让开发者可以打开/关闭mock模式
if (import.meta.env.DEV) {
  (window as any).enableMockMode = () => {
    localStorage.setItem('use_mock_data', 'true');
    window.location.reload();
  };

  (window as any).disableMockMode = () => {
    localStorage.removeItem('use_mock_data');
    window.location.reload();
  };
}

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

  async post<T>(url: string, data?: object, config?: object): Promise<ApiResponse<T>> {
    return api.post(url, data, config);
  },

  async put<T>(url: string, data?: object): Promise<ApiResponse<T>> {
    return api.put(url, data);
  },

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return api.delete(url);
  },
};

export { isMockMode };
export default api;
