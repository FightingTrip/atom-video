import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { setupInterceptors } from './interceptors';
import { handleApiError, checkAndEnableOfflineMode } from './errorHandler';

// 检查是否为离线模式
const isOfflineMode = (): boolean => {
  // 首先检查浏览器网络状态
  if (!navigator.onLine) {
    // 自动设置离线模式
    localStorage.setItem('offline_mode', 'true');
    return true;
  }

  // 然后检查localStorage中的标记
  return localStorage.getItem('offline_mode') === 'true';
};

// 默认配置
const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// 创建 Axios 实例
export const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
  const client = axios.create({
    ...defaultConfig,
    ...config,
  });

  // 设置拦截器
  setupInterceptors(client);

  return client;
};

// 创建默认 API 客户端
export const apiClient = createApiClient();

// API 请求包装器，统一处理错误
export const apiRequest = async <T>(request: Promise<T>): Promise<T> => {
  // 如果离线模式，抛出错误
  if (isOfflineMode()) {
    console.warn('[API] 当前处于离线模式，API请求被阻止');
    // 延迟再拒绝 promise，给错误显示增加一点延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    throw new Error('当前处于离线模式，网络请求不可用');
  }

  try {
    return await request;
  } catch (error) {
    // 检查是否需要进入离线模式
    const offline = checkAndEnableOfflineMode(error);
    if (offline) {
      console.warn('[API] 网络错误触发进入离线模式');
      throw new Error('网络连接问题，已切换到离线模式');
    }
    throw handleApiError(error);
  }
};
