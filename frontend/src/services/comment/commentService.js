import { apiClient, apiRequest } from '@/services/api/client';
export const commentService = {
    // 获取视频评论
    async getVideoComments(videoId, params) {
        return apiRequest(apiClient.get(`/videos/${videoId}/comments`, { params }));
    },
    // 获取评论回复
    async getCommentReplies(commentId, params) {
        return apiRequest(apiClient.get(`/comments/${commentId}/replies`, { params }));
    },
    // 创建评论
    async createComment(data) {
        return apiRequest(apiClient.post('/comments', data));
    },
    // 更新评论
    async updateComment(id, data) {
        return apiRequest(apiClient.put(`/comments/${id}`, data));
    },
    // 删除评论
    async deleteComment(id) {
        return apiRequest(apiClient.delete(`/comments/${id}`));
    },
    // 点赞/取消点赞评论
    async toggleLike(id) {
        return apiRequest(apiClient.post(`/comments/${id}/like`));
    },
    // 获取用户的评论
    async getUserComments(userId, params) {
        return apiRequest(apiClient.get(`/users/${userId}/comments`, { params }));
    },
};
//# sourceMappingURL=commentService.js.map