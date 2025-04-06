import { generateUsers, generateVideos } from './data';
// 生成初始数据
const users = generateUsers(50);
const videos = generateVideos(users, 100);
// 模拟 API 延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// 用户相关 API
export const userApi = {
    async getUsers(page = 1, limit = 20) {
        await delay(500);
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            users: users.slice(start, end),
            total: users.length,
            hasMore: end < users.length,
        };
    },
    async getUserById(id) {
        await delay(300);
        return users.find(user => user.id === id);
    },
};
// 视频相关 API
export const videoApi = {
    async getVideos(page = 1, limit = 12, tag) {
        await delay(800);
        let filteredVideos = videos;
        if (tag && tag !== 'all') {
            filteredVideos = videos.filter(video => video.tags.includes(tag));
        }
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            videos: filteredVideos.slice(start, end),
            total: filteredVideos.length,
            hasMore: end < filteredVideos.length,
        };
    },
    async getVideoById(id) {
        await delay(300);
        return videos.find(video => video.id === id);
    },
    async getVideosByUser(userId, page = 1, limit = 12) {
        await delay(500);
        const userVideos = videos.filter(video => video.user.id === userId);
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            videos: userVideos.slice(start, end),
            total: userVideos.length,
            hasMore: end < userVideos.length,
        };
    },
};
//# sourceMappingURL=api.js.map