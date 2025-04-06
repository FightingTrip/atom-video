import { apiClient, apiRequest } from '@/services/api/client';
// 缓存生成的视频数据
let cachedVideos = null;
// 生成视频数据
const generateMockVideos = (count) => {
    if (cachedVideos) {
        return cachedVideos;
    }
    try {
        const videos = Array.from({ length: count }, () => ({
            id: faker.string.uuid(),
            title: faker.helpers.arrayElement([
                'Vue 3 完整教程 2024',
                'React 实战项目开发',
                'TypeScript 高级特性详解',
                'Node.js 服务端开发实践',
                'Python 数据分析入门',
            ]),
            description: faker.lorem.paragraphs(2),
            thumbnail: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/480/270`,
            duration: faker.number.int({ min: 300, max: 7200 }),
            views: faker.number.int({ min: 1000, max: 1000000 }),
            likes: faker.number.int({ min: 100, max: 50000 }),
            dislikes: faker.number.int({ min: 0, max: 1000 }),
            createdAt: faker.date.past({ years: 1 }).toISOString(),
            tags: faker.helpers.arrayElements(['javascript', 'typescript', 'vue', 'react', 'nodejs'], faker.number.int({ min: 1, max: 3 })),
            user: {
                id: faker.string.uuid(),
                nickname: faker.person.fullName(),
                avatar: faker.image.avatar(),
                verified: faker.datatype.boolean(0.2),
            },
        }));
        cachedVideos = videos;
        return videos;
    }
    catch (error) {
        console.error('Error generating mock videos:', error);
        return [];
    }
};
// 创建视频服务
export const videoService = {
    // 获取视频列表
    async getVideos(params) {
        return apiRequest(apiClient.get('/videos', { params }));
    },
    // 获取单个视频详情
    async getVideoById(id) {
        return apiRequest(apiClient.get(`/videos/${id}`));
    },
    // 上传视频
    async uploadVideo(data) {
        const formData = new FormData();
        // 添加视频元数据
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category.toString());
        // 添加标签
        data.tags.forEach((tag, index) => {
            formData.append(`tags[${index}]`, tag);
        });
        // 添加视频文件
        formData.append('videoFile', data.videoFile);
        // 添加缩略图文件（如果有）
        if (data.thumbnailFile) {
            formData.append('thumbnailFile', data.thumbnailFile);
        }
        // 添加发布状态
        if (data.isPublished !== undefined) {
            formData.append('isPublished', String(data.isPublished));
        }
        return apiRequest(apiClient.post('/videos', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }));
    },
    // 更新视频
    async updateVideo(id, data) {
        // 使用FormData处理包含文件的更新
        if (data.thumbnailFile) {
            const formData = new FormData();
            // 添加文本字段
            Object.entries(data).forEach(([key, value]) => {
                if (key !== 'thumbnailFile' && key !== 'tags' && value !== undefined) {
                    formData.append(key, String(value));
                }
            });
            // 添加标签
            if (data.tags) {
                data.tags.forEach((tag, index) => {
                    formData.append(`tags[${index}]`, tag);
                });
            }
            // 添加缩略图文件
            formData.append('thumbnailFile', data.thumbnailFile);
            return apiRequest(apiClient.put(`/videos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }));
        }
        // 不包含文件的更新使用JSON
        else {
            return apiRequest(apiClient.put(`/videos/${id}`, data));
        }
    },
    // 删除视频
    async deleteVideo(id) {
        return apiRequest(apiClient.delete(`/videos/${id}`));
    },
    // 点赞/取消点赞视频
    async toggleLike(id) {
        return apiRequest(apiClient.post(`/videos/${id}/like`));
    },
    // 收藏/取消收藏视频
    async toggleFavorite(id) {
        return apiRequest(apiClient.post(`/videos/${id}/favorite`));
    },
    // 获取相关视频
    async getRelatedVideos(id, limit = 10) {
        return apiRequest(apiClient.get(`/videos/${id}/related`, {
            params: { limit },
        }));
    },
    // 增加视频观看次数
    async incrementViews(id) {
        return apiRequest(apiClient.post(`/videos/${id}/view`));
    },
    // 获取用户上传的视频
    async getUserVideos(userId, params) {
        return apiRequest(apiClient.get(`/users/${userId}/videos`, {
            params,
        }));
    },
    // 获取用户喜欢的视频
    async getUserLikedVideos(userId, params) {
        return apiRequest(apiClient.get(`/users/${userId}/liked-videos`, {
            params,
        }));
    },
};
//# sourceMappingURL=videoService.js.map