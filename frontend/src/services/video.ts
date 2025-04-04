import { faker } from '@faker-js/faker/locale/zh_CN';
import type { Video } from '@/types';

// 创建视频服务
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  views: number;
  createdAt: string;
  tags: string[];
  user: {
    id: string;
    nickname: string;
    avatar: string;
    verified: boolean;
  };
}

// 生成模拟视频数据
const generateMockVideos = (count: number): Video[] => {
  return Array.from({ length: count }, () => ({
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
    tags: faker.helpers.arrayElements(
      ['javascript', 'typescript', 'vue', 'react', 'nodejs'],
      faker.number.int({ min: 1, max: 3 })
    ),
    user: {
      id: faker.string.uuid(),
      nickname: faker.person.fullName(),
      avatar: faker.image.avatar(),
      verified: faker.datatype.boolean(0.2),
    },
  }));
};

// 创建视频服务
export const videoService = {
  // 获取视频列表
  async getVideos(page = 1, limit = 12, tag?: string) {
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
  },

  // 获取单个视频
  async getVideoById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockVideos(1)[0];
  },
};
