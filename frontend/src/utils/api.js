import axios from 'axios';
import { env } from './env';
// 创建 axios 实例
const api = axios.create({
    baseURL: env.apiUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// 请求拦截器
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});
// 响应拦截器
api.interceptors.response.use(response => {
    return response.data;
}, error => {
    if (error.response) {
        const apiError = {
            message: error.response.data.message || '请求失败',
            code: error.response.data.code || 'UNKNOWN_ERROR',
            status: error.response.status,
        };
        return Promise.reject(apiError);
    }
    return Promise.reject({
        message: '网络错误',
        code: 'NETWORK_ERROR',
        status: 0,
    });
});
export default api;
//# sourceMappingURL=api.js.map