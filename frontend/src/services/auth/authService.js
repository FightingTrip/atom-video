import { apiClient, apiRequest } from '@/services/api/client';
export const authService = {
    // 用户登录
    async login(data) {
        return apiRequest(apiClient.post('/auth/login', data));
    },
    // 用户注册
    async register(data) {
        return apiRequest(apiClient.post('/auth/register', data));
    },
    // 用户登出
    async logout() {
        return apiRequest(apiClient.post('/auth/logout'));
    },
    // 刷新令牌
    async refreshToken(refreshToken) {
        return apiRequest(apiClient.post('/auth/refresh-token', { refreshToken }));
    },
    // 忘记密码
    async forgotPassword(email) {
        return apiRequest(apiClient.post('/auth/forgot-password', { email }));
    },
    // 重置密码
    async resetPassword(data) {
        return apiRequest(apiClient.post('/auth/reset-password', data));
    },
    // 修改密码
    async changePassword(data) {
        return apiRequest(apiClient.post('/auth/change-password', data));
    },
    // 验证邮箱
    async verifyEmail(token) {
        return apiRequest(apiClient.post('/auth/verify-email', { token }));
    },
    // 获取当前会话
    async getSession() {
        return apiRequest(apiClient.get('/auth/session'));
    },
};
//# sourceMappingURL=authService.js.map