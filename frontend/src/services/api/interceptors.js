import { useUserStore } from '@/stores/user';
export function setupInterceptors(client) {
    // 请求拦截器
    client.interceptors.request.use((config) => {
        // 获取用户 token
        const userStore = useUserStore();
        const token = userStore.token;
        // 如果有 token，添加到请求头
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
    // 响应拦截器
    client.interceptors.response.use((response) => {
        // 直接返回响应数据
        return response.data;
    }, async (error) => {
        // 获取响应状态码
        const status = error.response?.status;
        // 处理 401 未授权错误（token 过期等）
        if (status === 401) {
            const userStore = useUserStore();
            // 尝试刷新 token
            try {
                await userStore.refreshToken();
                // 刷新成功，重试请求
                const originalRequest = error.config;
                return client(originalRequest);
            }
            catch (refreshError) {
                // 刷新失败，登出用户
                userStore.logout();
                // 重定向到登录页
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    });
}
//# sourceMappingURL=interceptors.js.map