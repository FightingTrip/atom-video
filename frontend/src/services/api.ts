import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';

// 判断是否为mock模式
const isMockMode = import.meta.env.VITE_USE_MOCK !== 'false';

// 创建axios实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  config => {
    // 不要在拦截器定义时调用useAuthStore，而是在每次请求时获取
    try {
      const authStore = useAuthStore();
      if (authStore && authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
      }
    } catch (error) {
      console.warn('获取认证信息失败，可能Pinia尚未初始化', error);
      // 如果获取失败，尝试从localStorage直接获取token
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    const toast = useToast();
    if (error.response) {
      // HTTP错误处理
      switch (error.response.status) {
        case 401:
          toast.error('身份验证失败，请重新登录');
          // 可以在这里自动跳转到登录页
          break;
        case 403:
          toast.error('禁止访问该资源');
          break;
        case 404:
          toast.error('请求的资源不存在');
          break;
        case 500:
          toast.error('服务器内部错误');
          break;
        default:
          toast.error(`请求失败 (${error.response.status})`);
      }
    } else if (error.request) {
      // 请求发送但没有收到响应
      toast.error('无法连接到服务器，请检查您的网络连接');
    } else {
      // 请求配置出错
      toast.error('请求配置错误');
    }
    return Promise.reject(error);
  }
);

// API服务类
class ApiService {
  // 通用请求方法
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosInstance(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Mock响应方法
  private mockResponse<T>(data: T): Promise<T> {
    return new Promise(resolve => {
      // 模拟网络延迟
      setTimeout(
        () => {
          resolve(data);
        },
        Math.random() * 300 + 100
      ); // 100-400ms随机延迟
    });
  }

  // 具体HTTP方法
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (isMockMode) {
      try {
        const matchingHandler = mockHandlers.find(
          handler =>
            handler.method === 'GET' &&
            ((typeof handler.url === 'string' && handler.url === url) ||
              (handler.url instanceof RegExp && handler.url.test(url)))
        );

        if (matchingHandler) {
          if (typeof matchingHandler.handler === 'function') {
            const result = await matchingHandler.handler(url, config?.params);
            return this.mockResponse(result);
          }
          return this.mockResponse(matchingHandler.handler);
        }

        console.warn(`No mock handler found for GET ${url}`);
        return this.mockResponse({} as T);
      } catch (error) {
        console.error(`Mock GET error for ${url}:`, error);
        throw error;
      }
    }

    return this.request<T>({ method: 'GET', url, ...config });
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (isMockMode) {
      try {
        const matchingHandler = mockHandlers.find(
          handler =>
            handler.method === 'POST' &&
            ((typeof handler.url === 'string' && handler.url === url) ||
              (handler.url instanceof RegExp && handler.url.test(url)))
        );

        if (matchingHandler) {
          if (typeof matchingHandler.handler === 'function') {
            const result = await matchingHandler.handler(url, data);
            return this.mockResponse(result);
          }
          return this.mockResponse(matchingHandler.handler);
        }

        console.warn(`No mock handler found for POST ${url}`);
        return this.mockResponse({} as T);
      } catch (error) {
        console.error(`Mock POST error for ${url}:`, error);
        throw error;
      }
    }

    return this.request<T>({ method: 'POST', url, data, ...config });
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (isMockMode) {
      try {
        const matchingHandler = mockHandlers.find(
          handler =>
            handler.method === 'PUT' &&
            ((typeof handler.url === 'string' && handler.url === url) ||
              (handler.url instanceof RegExp && handler.url.test(url)))
        );

        if (matchingHandler) {
          if (typeof matchingHandler.handler === 'function') {
            const result = await matchingHandler.handler(url, data);
            return this.mockResponse(result);
          }
          return this.mockResponse(matchingHandler.handler);
        }

        console.warn(`No mock handler found for PUT ${url}`);
        return this.mockResponse({} as T);
      } catch (error) {
        console.error(`Mock PUT error for ${url}:`, error);
        throw error;
      }
    }

    return this.request<T>({ method: 'PUT', url, data, ...config });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (isMockMode) {
      try {
        const matchingHandler = mockHandlers.find(
          handler =>
            handler.method === 'DELETE' &&
            ((typeof handler.url === 'string' && handler.url === url) ||
              (handler.url instanceof RegExp && handler.url.test(url)))
        );

        if (matchingHandler) {
          if (typeof matchingHandler.handler === 'function') {
            const result = await matchingHandler.handler(url, config?.params);
            return this.mockResponse(result);
          }
          return this.mockResponse(matchingHandler.handler);
        }

        console.warn(`No mock handler found for DELETE ${url}`);
        return this.mockResponse({} as T);
      } catch (error) {
        console.error(`Mock DELETE error for ${url}:`, error);
        throw error;
      }
    }

    return this.request<T>({ method: 'DELETE', url, ...config });
  }
}

// Mock处理器类型
interface MockHandler {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string | RegExp;
  handler: (url: string, data?: Record<string, any>) => any;
}

// Mock处理器定义
const mockHandlers: MockHandler[] = [];

// 注册mock处理器
export function registerMockHandler(handler: MockHandler): void {
  if (isMockMode) {
    const existingIndex = mockHandlers.findIndex(
      h => h.method === handler.method && h.url.toString() === handler.url.toString()
    );

    if (existingIndex >= 0) {
      mockHandlers[existingIndex] = handler;
    } else {
      mockHandlers.push(handler);
    }
  }
}

// 导出API服务实例
export default new ApiService();
