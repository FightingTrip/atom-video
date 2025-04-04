import { faker } from '@faker-js/faker/locale/zh_CN';
import type { Video, Comment, VideoResponse } from '@/types';

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

// 生成随机观看次数
const generateViews = () => {
  const num = Math.floor(Math.random() * 1000);
  return num > 100 ? `${(num / 100).toFixed(1)}K` : `${num}`;
};

// 生成随机时长
const generateDuration = () => {
  const minutes = Math.floor(Math.random() * 120);
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// 生成随机发布时间
const generatePublishTime = () => {
  const times = ['天前', '周前', '个月前', '年前'];
  const num = Math.floor(Math.random() * 12) + 1;
  const timeUnit = times[Math.floor(Math.random() * times.length)];
  return `${num}${timeUnit}`;
};

// 生成模拟视频数据
const generateMockVideos = (): Video[] => {
  const categories = ['全部', 'JavaScript', 'TypeScript', 'Vue', 'React', 'Node.js', 'Python']
  const videos: Video[] = []

  for (let i = 1; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * (categories.length - 1)) + 1]
    videos.push({
      id: i.toString(),
      title: `${category} 实战教程 ${i} - 专业技能提升课程`,
      description: `这是一个关于 ${category} 的实战教程，帮助你提升开发技能`,
      thumbnail: `https://picsum.photos/seed/video${i}/640/360`,
      duration: `${Math.floor(Math.random() * 60)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      views: `${(Math.random() * 1000).toFixed(1)}K`,
      publishTime: `${Math.floor(Math.random() * 12)}个月前`,
      author: {
        id: `author${Math.floor(Math.random() * 10) + 1}`,
        name: `讲师${Math.floor(Math.random() * 10) + 1}`,
        avatar: `https://i.pravatar.cc/150?img=${i}`,
        verified: Math.random() > 0.5
      },
      tags: [category, '编程教程', '实战'],
      category
    })
  }
  return videos
}

const mockVideos = generateMockVideos()

// Mock API 函数
export const mockVideosApi = {
  getVideos: async ({ page = 1, pageSize = 12, category = '全部' }): Promise<VideoResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟延迟
    
    let filteredVideos = mockVideos
    if (category !== '全部') {
      filteredVideos = mockVideos.filter(video => video.category === category)
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      videos: filteredVideos.slice(start, end),
      total: filteredVideos.length,
      hasMore: end < filteredVideos.length
    }
  },

  // 获取单个视频
  async getVideoById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockVideos.find(video => video.id === id);
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
  videos: mockVideos.slice(0, 5),
};
