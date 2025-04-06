import { faker } from '@faker-js/faker/locale/zh_CN';
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
    async getVideos(page = 1, limit = 12, tag) {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const allVideos = generateMockVideos(100);
            let filteredVideos = allVideos;
            if (tag && tag !== 'all') {
                filteredVideos = allVideos.filter(video => video.tags.includes(tag));
            }
            const start = (page - 1) * limit;
            const end = start + limit;
            return {
                videos: filteredVideos.slice(start, end),
                hasMore: end < filteredVideos.length,
            };
        }
        catch (error) {
            console.error('Error fetching videos:', error);
            return {
                videos: [],
                hasMore: false,
            };
        }
    },
    // 获取单个视频
    async getVideoById(id) {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            const videos = generateMockVideos(100);
            return videos.find(v => v.id === id) || videos[0];
        }
        catch (error) {
            console.error('Error fetching video:', error);
            throw new Error('Failed to fetch video');
        }
    },
};
//# sourceMappingURL=video.js.map