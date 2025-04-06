import { faker } from '@faker-js/faker/locale/zh_CN';
import { mockVideoApi } from './videos';
import { mockUserApi } from './users';
// Mock API 函数
export const mockSearchApi = {
    // 获取搜索建议
    async getSearchSuggestions(query) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return Array.from({ length: 5 }, () => ({
            id: faker.string.uuid(),
            text: faker.helpers.arrayElement([
                `${query} 教程`,
                `${query} 实战`,
                `${query} 入门`,
                `${query} 高级`,
                `${query} 项目`,
            ]),
            type: faker.helpers.arrayElement(['video', 'channel']),
        }));
    },
    // 搜索
    async search(query, type = 'all', page = 1, limit = 20) {
        await new Promise(resolve => setTimeout(resolve, 800));
        let results = [];
        if (type === 'all' || type === 'video') {
            const { videos } = await mockVideoApi.getVideos(page, limit);
            results.push(...videos.filter(video => video.title.toLowerCase().includes(query.toLowerCase()) ||
                video.description.toLowerCase().includes(query.toLowerCase())));
        }
        if (type === 'all' || type === 'channel') {
            const { users } = await mockUserApi.getUsers(page, limit);
            results.push(...users.filter(user => user.nickname.toLowerCase().includes(query.toLowerCase()) ||
                user.bio.toLowerCase().includes(query.toLowerCase())));
        }
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            results: results.slice(start, end),
            total: results.length,
            hasMore: end < results.length,
        };
    },
};
//# sourceMappingURL=search.js.map