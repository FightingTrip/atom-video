import axios from 'axios';
import { setupInterceptors } from './interceptors';
import { handleApiError } from './errorHandler';
// 默认配置
const defaultConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
};
// 创建 Axios 实例
export const createApiClient = (config) => {
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
export const apiRequest = async (request) => {
    try {
        return await request;
    }
    catch (error) {
        throw handleApiError(error);
    }
};
//# sourceMappingURL=client.js.map