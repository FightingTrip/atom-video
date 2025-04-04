import { faker } from '@faker-js/faker/locale/zh_CN';
import type { Video, Comment } from '@/types';

// 视频分类数据
export const videoCategories = [
  { id: 'all', name: '全部', icon: 'fa-th-large' },
  { id: 'javascript', name: 'JavaScript', icon: 'fa-js' },
  { id: 'typescript', name: 'TypeScript', icon: 'fa-code' },
  { id: 'vue', name: 'Vue', icon: 'fa-vuejs' },
  { id: 'react', name: 'React', icon: 'fa-react' },
  { id: 'angular', name: 'Angular', icon: 'fa-angular' },
  { id: 'nodejs', name: 'Node.js', icon: 'fa-node' },
  { id: 'python', name: 'Python', icon: 'fa-python' },
  { id: 'java', name: 'Java', icon: 'fa-java' },
];

// 生成模拟视频数据
const generateMockVideos = (count: number): Video[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.helpers.arrayElement([
      'Vue 3 完整教程 2024 - 从入门到精通',
      'React 实战项目开发教程',
      'TypeScript 高级特性详解',
      'Node.js 服务端开发实践',
      'Python 数据分析入门指南',
    ]),
    description: faker.lorem.paragraphs(2),
    thumbnail: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/480/270`,
    duration: faker.number.int({ min: 300, max: 7200 }),
    views: faker.number.int({ min: 1000, max: 1000000 }),
    likes: faker.number.int({ min: 100, max: 50000 }),
    dislikes: faker.number.int({ min: 0, max: 1000 }),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    tags: faker.helpers.arrayElements(
      videoCategories.filter(c => c.id !== 'all').map(c => c.id),
      faker.number.int({ min: 1, max: 3 })
    ),
    user: {
      id: faker.string.uuid(),
      nickname: faker.internet.userName(),
      avatar: faker.image.avatar(),
      verified: faker.datatype.boolean(0.3),
    },
  }));
};

// 生成初始数据
const mockVideoList = generateMockVideos(100);

// Mock API 函数
export const mockVideoApi = {
  // 获取视频列表
  async getVideos(page = 1, limit = 12, category?: string) {
    await new Promise(resolve => setTimeout(resolve, 800));

    let filteredVideos = [...mockVideoList];
    if (category && category !== 'all') {
      filteredVideos = filteredVideos.filter(video => video.tags.includes(category));
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      videos: filteredVideos.slice(start, end),
      total: filteredVideos.length,
      hasMore: end < filteredVideos.length,
    };
  },

  // 获取单个视频
  async getVideoById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockVideoList.find(video => video.id === id);
  },

  // 获取视频评论
  async getVideoComments(videoId: string, page = 1, limit = 20) {
    await new Promise(resolve => setTimeout(resolve, 600));

    const comments = Array.from(
      { length: 50 },
      (): Comment => ({
        id: faker.string.uuid(),
        videoId,
        content: faker.lorem.paragraph(),
        likes: faker.number.int({ min: 0, max: 1000 }),
        createdAt: faker.date.past({ years: 1 }).toISOString(),
        user: {
          id: faker.string.uuid(),
          nickname: faker.internet.userName(),
          avatar: faker.image.avatar(),
          verified: faker.datatype.boolean(0.1),
        },
        replies: Array.from(
          { length: faker.number.int({ min: 0, max: 5 }) },
          (): Comment => ({
            id: faker.string.uuid(),
            videoId,
            content: faker.lorem.sentence(),
            likes: faker.number.int({ min: 0, max: 100 }),
            createdAt: faker.date.recent({ days: 30 }).toISOString(),
            user: {
              id: faker.string.uuid(),
              nickname: faker.internet.userName(),
              avatar: faker.image.avatar(),
              verified: faker.datatype.boolean(0.1),
            },
          })
        ),
      })
    );

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      comments: comments.slice(start, end),
      total: comments.length,
      hasMore: end < comments.length,
    };
  },
};

// 导出测试数据
export const testVideoData = {
  videos: mockVideoList.slice(0, 5),
};
