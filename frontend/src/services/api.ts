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
    const { showError } = useToast();
    if (error.response) {
      // HTTP错误处理
      switch (error.response.status) {
        case 401:
          showError('身份验证失败，请重新登录');
          // 可以在这里自动跳转到登录页
          break;
        case 403:
          showError('禁止访问该资源');
          break;
        case 404:
          showError('请求的资源不存在');
          break;
        case 500:
          showError('服务器内部错误');
          break;
        default:
          showError(`请求失败 (${error.response.status})`);
      }
    } else if (error.request) {
      // 请求发送但没有收到响应
      showError('无法连接到服务器，请检查您的网络连接');
    } else {
      // 请求配置出错
      showError('请求配置错误');
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
        // 返回一个安全的默认响应格式，避免undefined错误
        return this.mockResponse({
          success: true,
          data: url.includes('stats')
            ? {
                totalVideos: 15,
                publishedVideos: 12,
                draftVideos: 3,
                videosTrend: 12.5,
                publishedVideosTrend: 8.3,
                draftVideosTrend: 25.0,
                totalViews: 2500,
                totalMinutesWatched: 12500,
                averageViewDuration: 5.1,
                viewsTrend: 18.2,
                minutesWatchedTrend: 22.4,
                viewDurationTrend: 3.7,
                totalLikes: 320,
                totalComments: 85,
                totalShares: 45,
                likesTrend: 15.3,
                commentsTrend: 8.9,
                sharesTrend: 21.6,
                totalRevenue: 1250,
                monthlyRevenue: 350,
                pendingRevenue: 125,
                revenueTrend: 12.8,
                monthlyRevenueTrend: 9.4,
                subscribersCount: 650,
                subscribersGrowth: 25,
                subscribersTrend: 5.2,
                lastUpdated: new Date().toISOString(),
              }
            : url.includes('trends')
              ? url.includes('content')
                ? {
                    data: [
                      1, 2, 1, 0, 3, 2, 1, 2, 1, 0, 3, 5, 2, 1, 0, 2, 3, 1, 0, 2, 1, 3, 2, 1, 0, 2,
                      1, 3, 0, 1,
                    ],
                    labels: Array.from({ length: 30 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (29 - i));
                      return date.toISOString().split('T')[0];
                    }),
                    trend: 12.5,
                  }
                : url.includes('views')
                  ? {
                      data: [
                        120, 150, 135, 180, 220, 195, 230, 210, 250, 270, 240, 260, 280, 300, 320,
                        290, 310, 330, 350, 370, 340, 360, 380, 400, 420, 390, 410, 430, 450, 470,
                      ],
                      labels: Array.from({ length: 30 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (29 - i));
                        return date.toISOString().split('T')[0];
                      }),
                      trend: 18.2,
                    }
                  : url.includes('engagement')
                    ? {
                        data: [
                          {
                            name: '点赞',
                            data: [
                              30, 25, 35, 40, 32, 38, 45, 42, 48, 52, 47, 50, 55, 58, 53, 56, 60,
                              62, 58, 61, 65, 68, 63, 66, 70, 72, 68, 71, 75, 78,
                            ],
                          },
                          {
                            name: '评论',
                            data: [
                              12, 10, 14, 16, 13, 15, 18, 17, 19, 21, 19, 20, 22, 23, 21, 22, 24,
                              25, 23, 24, 26, 27, 25, 26, 28, 29, 27, 28, 30, 31,
                            ],
                          },
                          {
                            name: '分享',
                            data: [
                              6, 5, 7, 8, 6, 7, 9, 8, 9, 10, 9, 10, 11, 11, 10, 11, 12, 12, 11, 12,
                              13, 13, 12, 13, 14, 14, 13, 14, 15, 15,
                            ],
                          },
                        ],
                        labels: Array.from({ length: 30 }, (_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() - (29 - i));
                          return date.toISOString().split('T')[0];
                        }),
                        trend: 15.3,
                      }
                    : url.includes('revenue')
                      ? {
                          data: [
                            25, 30, 27, 35, 40, 38, 42, 45, 50, 48, 52, 55, 60, 58, 62, 65, 70, 68,
                            72, 75, 80, 78, 82, 85, 90, 88, 92, 95, 100, 98,
                          ],
                          labels: Array.from({ length: 30 }, (_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() - (29 - i));
                            return date.toISOString().split('T')[0];
                          }),
                          trend: 12.8,
                        }
                      : { data: [], labels: [], trend: 0 }
              : url.includes('videos')
                ? url.includes('top-videos')
                  ? Array.from({ length: 5 }, (_, i) => ({
                      id: `video-${i + 1}`,
                      title: `测试视频 ${i + 1}`,
                      thumbnailUrl: `https://picsum.photos/300/180?random=${i}`,
                      views: 1000 - i * 100,
                      likes: 100 - i * 10,
                      comments: 50 - i * 5,
                      revenue: 200 - i * 20,
                      publishDate: new Date(Date.now() - i * 86400000 * 3).toISOString(),
                      duration: 300 + i * 60,
                    }))
                  : {
                      data: Array.from({ length: 10 }, (_, i) => ({
                        id: `video-${i + 1}`,
                        title: `测试视频 ${i + 1}`,
                        description: `这是测试视频 ${i + 1} 的描述`,
                        thumbnail: `https://picsum.photos/300/180?random=${i}`,
                        status: i < 8 ? 'published' : 'draft',
                        visibility: i % 3 === 0 ? 'public' : i % 3 === 1 ? 'unlisted' : 'private',
                        duration: 300 + i * 60,
                        uploadDate: new Date(Date.now() - i * 86400000 * 3).toISOString(),
                        views: 1000 - i * 100,
                        likes: 100 - i * 10,
                        comments: 50 - i * 5,
                      })),
                      total: 10,
                      page: parseInt(url.split('page=')[1]?.split('&')[0] || '1'),
                      pageSize: parseInt(url.split('pageSize=')[1]?.split('&')[0] || '10'),
                      totalPages: 1,
                    }
                : url.includes('comments')
                  ? {
                      data: Array.from({ length: 5 }, (_, i) => ({
                        id: `comment-${i + 1}`,
                        content: `这是第 ${i + 1} 条评论内容`,
                        videoId: `video-${(i % 3) + 1}`,
                        videoTitle: `测试视频 ${(i % 3) + 1}`,
                        videoThumbnail: `https://picsum.photos/300/180?random=${i % 3}`,
                        userId: `user-${i + 1}`,
                        username: `用户 ${i + 1}`,
                        userAvatar: `https://i.pravatar.cc/150?u=user${i + 1}`,
                        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
                        likes: 20 - i * 2,
                      })),
                      total: 5,
                      page: parseInt(url.split('page=')[1]?.split('&')[0] || '1'),
                      pageSize: parseInt(url.split('pageSize=')[1]?.split('&')[0] || '10'),
                      totalPages: 1,
                    }
                  : url.includes('channel')
                    ? {
                        id: '1',
                        name: '测试频道',
                        description: '这是一个测试频道描述',
                        themeColor: '#3fb950',
                        bannerImage: 'https://picsum.photos/1200/300?random=1',
                        avatar: 'https://i.pravatar.cc/150?u=creator',
                        subscriberCount: 650,
                        videoCount: 15,
                        totalViews: 2500,
                        createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
                      }
                    : {},
          message: 'Mock data not available',
        } as T);
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
        // 返回一个安全的默认响应格式
        return this.mockResponse({
          success: true,
          data: {},
          message: 'Mock data not available',
        } as T);
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
        // 返回一个安全的默认响应格式
        return this.mockResponse({
          success: true,
          data: {},
          message: 'Mock data not available',
        } as T);
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
        // 返回一个安全的默认响应格式
        return this.mockResponse({
          success: true,
          message: 'Mock deletion successful',
        } as T);
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
