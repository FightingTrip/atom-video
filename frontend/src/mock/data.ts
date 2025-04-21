import { faker } from '@faker-js/faker';
import type { User, Video } from '@/types';
import { generateId } from '@/utils/format';

// 生成用户数据
export const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, () => ({
    id: generateId(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    nickname: faker.person.fullName(),
    avatar: faker.image.avatar(),
    bio: faker.lorem.paragraph(),
    verified: faker.datatype.boolean(0.2),
    subscribers: faker.number.int({ min: 100, max: 1000000 }),
    subscribing: faker.number.int({ min: 10, max: 500 }),
    totalViews: faker.number.int({ min: 1000, max: 10000000 }),
    joinedAt: faker.date.past({ years: 3 }).toISOString(),
    social: {
      website: faker.helpers.maybe(() => faker.internet.url()),
      twitter: faker.helpers.maybe(() => faker.internet.userName()),
      github: faker.helpers.maybe(() => faker.internet.userName()),
      instagram: faker.helpers.maybe(() => faker.internet.userName()),
    },
  }));
};

// 生成视频数据
export const generateVideos = (users: User[], count: number): Video[] => {
  return Array.from({ length: count }, () => {
    const user = faker.helpers.arrayElement(users);
    return {
      id: generateId(),
      title: faker.helpers.arrayElement([
        'Vue 3 完整教程 2024 - 从入门到精通',
        'React 实战项目开发教程',
        'TypeScript 高级特性详解',
        'Node.js 服务端开发实践',
        'Python 数据分析入门指南',
      ]),
      description: faker.lorem.paragraphs(2),
      thumbnail: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/480/270`,
      coverUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/640/360`,
      videoUrl: `https://example.com/videos/${faker.string.alphanumeric(12)}`,
      duration: faker.number.int({ min: 300, max: 7200 }),
      views: faker.number.int({ min: 1000, max: 1000000 }),
      likes: faker.number.int({ min: 100, max: 50000 }),
      favorites: faker.number.int({ min: 0, max: 10000 }),
      comments: faker.number.int({ min: 0, max: 1000 }),
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      tags: faker.helpers.arrayElements(
        ['javascript', 'typescript', 'vue', 'react', 'nodejs'],
        faker.number.int({ min: 1, max: 3 })
      ),
      author: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        verified: user.verified,
      },
      sources: [
        {
          url: `https://example.com/videos/${faker.string.alphanumeric(12)}/1080p.mp4`,
          type: 'video/mp4',
          size: 1080,
          label: '1080p',
        },
        {
          url: `https://example.com/videos/${faker.string.alphanumeric(12)}/720p.mp4`,
          type: 'video/mp4',
          size: 720,
          label: '720p',
        },
        {
          url: `https://example.com/videos/${faker.string.alphanumeric(12)}/480p.mp4`,
          type: 'video/mp4',
          size: 480,
          label: '480p',
        },
      ],
      subtitles: [
        {
          url: `https://example.com/videos/${faker.string.alphanumeric(12)}/subtitles/zh.vtt`,
          label: '中文',
          srclang: 'zh',
          default: true,
        },
        {
          url: `https://example.com/videos/${faker.string.alphanumeric(12)}/subtitles/en.vtt`,
          label: 'English',
          srclang: 'en',
        },
      ],
    };
  });
};

// 确保已存在 generateRandomId 函数，如果不存在则添加
export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
