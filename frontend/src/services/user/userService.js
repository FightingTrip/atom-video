import { apiClient, apiRequest } from '@/services/api/client';
export const userService = {
    // 获取当前用户信息
    async getCurrentUser() {
        return apiRequest(apiClient.get('/user/me'));
    },
    // 获取用户资料
    async getUserProfile(userId) {
        return apiRequest(apiClient.get(`/users/${userId}/profile`));
    },
    // 更新用户资料
    async updateProfile(data) {
        // 使用表单数据处理文件上传
        if (data.avatar) {
            const formData = new FormData();
            // 添加非文件字段
            Object.entries(data).forEach(([key, value]) => {
                if (key !== 'avatar' && value !== undefined) {
                    formData.append(key, String(value));
                }
            });
            // 添加头像文件
            if (data.avatar) {
                formData.append('avatar', data.avatar);
            }
            return apiRequest(apiClient.put('/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }));
        }
        else {
            // 没有文件，使用JSON
            return apiRequest(apiClient.put('/user/profile', data));
        }
    },
    // 获取用户列表
    async getUsers(params) {
        return apiRequest(apiClient.get('/users', { params }));
    },
    // 关注用户
    async followUser(userId) {
        return apiRequest(apiClient.post(`/users/${userId}/follow`));
    },
    // 取消关注用户
    async unfollowUser(userId) {
        return apiRequest(apiClient.delete(`/users/${userId}/follow`));
    },
    // 获取关注列表
    async getFollowing(userId, params) {
        return apiRequest(apiClient.get(`/users/${userId}/following`, { params }));
    },
    // 获取粉丝列表
    async getFollowers(userId, params) {
        return apiRequest(apiClient.get(`/users/${userId}/followers`, { params }));
    },
};
//# sourceMappingURL=userService.js.map