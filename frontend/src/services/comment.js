import { http } from '@/utils/http';
class CommentServiceImpl {
    async getComments(videoId, page = 1, limit = 20) {
        const { data } = await http.get(`/api/videos/${videoId}/comments`, {
            params: { page, limit },
        });
        return data;
    }
    async getReplies(commentId, page = 1, limit = 20) {
        const { data } = await http.get(`/api/comments/${commentId}/replies`, {
            params: { page, limit },
        });
        return data;
    }
    async addComment(videoId, content) {
        const { data } = await http.post(`/api/videos/${videoId}/comments`, {
            content,
        });
        return data;
    }
    async addReply(commentId, content) {
        const { data } = await http.post(`/api/comments/${commentId}/replies`, {
            content,
        });
        return data;
    }
    async likeComment(commentId) {
        const { data } = await http.post(`/api/comments/${commentId}/like`);
        return data;
    }
    async likeReply(replyId) {
        const { data } = await http.post(`/api/replies/${replyId}/like`);
        return data;
    }
}
export const commentService = new CommentServiceImpl();
//# sourceMappingURL=comment.js.map