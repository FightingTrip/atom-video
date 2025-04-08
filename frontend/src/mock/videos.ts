import { faker } from '@faker-js/faker/locale/zh_CN';
import type { Video, VideoResponse, VideoComment } from '@/types';

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

// 技术视频标题和描述
const techVideoTitles = [
  {
    category: 'javascript',
    title: 'JavaScript高级编程技巧',
    desc: '学习JavaScript高级特性和函数式编程模式，提升代码质量',
  },
  {
    category: 'javascript',
    title: 'ES6+新特性详解',
    desc: '深入探讨ES6+带来的箭头函数、Promise、async/await等新特性',
  },
  {
    category: 'typescript',
    title: 'TypeScript高级类型系统',
    desc: '掌握TypeScript的高级类型和类型操作，增强类型安全',
  },
  {
    category: 'typescript',
    title: '从零开始搭建TypeScript项目',
    desc: '完整教程：配置、工具链和最佳实践',
  },
  {
    category: 'vue',
    title: 'Vue3组合式API指南',
    desc: '深入学习Vue3组合式API的使用方法和实践技巧',
  },
  {
    category: 'vue',
    title: 'Pinia状态管理完全指南',
    desc: '从基础到高级，全面掌握Vue生态系统的新一代状态管理',
  },
  {
    category: 'react',
    title: 'React Hooks深度剖析',
    desc: '掌握React Hooks的工作原理和高级使用技巧',
  },
  {
    category: 'react',
    title: 'Next.js服务端渲染实战',
    desc: '使用Next.js构建高性能React应用的完整指南',
  },
  {
    category: 'angular',
    title: 'Angular信号机制详解',
    desc: '学习Angular的新一代状态管理和变更检测机制',
  },
  {
    category: 'angular',
    title: 'Angular模块化架构实践',
    desc: '大型Angular应用的模块化设计和架构策略',
  },
  { category: 'nodejs', title: 'Node.js微服务架构', desc: '使用Node.js构建可扩展的微服务系统' },
  {
    category: 'nodejs',
    title: 'Express与NestJS框架对比',
    desc: '两大Node.js后端框架的深度对比与实践',
  },
  {
    category: 'python',
    title: 'FastAPI高性能后端开发',
    desc: '使用Python FastAPI构建现代、高性能的后端服务',
  },
  {
    category: 'python',
    title: 'Python数据分析与可视化',
    desc: '使用Pandas、NumPy和Matplotlib进行数据分析与可视化',
  },
  {
    category: 'java',
    title: 'Spring Boot微服务开发',
    desc: '使用Spring Boot构建微服务架构的完整指南',
  },
  { category: 'java', title: 'Java 17新特性解析', desc: '深入了解Java最新版本的新特性和改进' },
];

// 生成模拟视频数据
export const generateMockVideos = (): Video[] => {
  const videos: Video[] = [];

  for (let i = 1; i <= 50; i++) {
    const randomTechVideo = techVideoTitles[Math.floor(Math.random() * techVideoTitles.length)];
    const category = randomTechVideo.category;
    const tags = [category];

    // 添加更多相关标签
    if (category === 'javascript') {
      tags.push('前端开发', 'Web开发');
    } else if (category === 'typescript') {
      tags.push('静态类型', '前端开发');
    } else if (category === 'vue' || category === 'react' || category === 'angular') {
      tags.push('前端框架', 'UI开发');
    } else if (category === 'nodejs') {
      tags.push('后端开发', 'API开发');
    } else if (category === 'python') {
      tags.push('数据分析', '后端开发');
    } else if (category === 'java') {
      tags.push('企业级开发', '后端开发');
    }

    videos.push({
      id: i.toString(),
      title: randomTechVideo.title,
      description: randomTechVideo.desc,
      coverUrl: `https://picsum.photos/seed/tech${i}/640/360`,
      duration: Math.floor(Math.random() * 3600), // 直接使用数字
      views: Math.floor(Math.random() * 100000), // 直接使用数字
      likes: Math.floor(Math.random() * 10000),
      favorites: Math.floor(Math.random() * 5000),
      createdAt: faker.date.past().toISOString(),
      author: {
        id: `author${Math.floor(Math.random() * 10) + 1}`,
        nickname: faker.person.fullName(),
        avatar: `https://i.pravatar.cc/150?img=${i}`,
        verified: Math.random() > 0.5,
      },
      tags: tags,
      category: category,
      isLiked: Math.random() > 0.5,
      isFavorited: Math.random() > 0.5,
    });
  }
  return videos;
};

const mockVideos = generateMockVideos();

// 存储视频评论的 Map
const videoComments = new Map<string, VideoComment[]>();

// 生成模拟评论数据
const generateMockComments = (videoId: string, count: number = 5): VideoComment[] => {
  const comments: VideoComment[] = [];
  for (let i = 1; i <= count; i++) {
    comments.push({
      id: `${videoId}-comment-${i}`,
      content: faker.lorem.paragraph(),
      user: {
        id: `user-${Math.floor(Math.random() * 100)}`,
        nickname: faker.person.fullName(),
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        verified: Math.random() > 0.8,
      },
      likes: Math.floor(Math.random() * 1000),
      createdAt: faker.date.recent().toISOString(),
      replies: [],
    });
  }
  return comments;
};

// Mock API 函数
export const mockVideosApi = {
  getVideos: async ({ page = 1, pageSize = 12, category = 'all' }): Promise<VideoResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟延迟

    let filteredVideos = mockVideos;
    if (category !== 'all') {
      filteredVideos = mockVideos.filter(video => video.tags.includes(category));
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      videos: filteredVideos.slice(start, end),
      total: filteredVideos.length,
      hasMore: end < filteredVideos.length,
    };
  },

  // 获取单个视频
  async getVideoById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockVideos.find(video => video.id === id);
  },

  // 获取视频评论
  async getVideoComments(videoId: string): Promise<VideoComment[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!videoComments.has(videoId)) {
      videoComments.set(videoId, generateMockComments(videoId));
    }
    return videoComments.get(videoId) || [];
  },

  // 添加视频评论
  async addVideoComment(videoId: string, content: string, userId: string): Promise<VideoComment> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newComment: VideoComment = {
      id: `${videoId}-comment-${Date.now()}`,
      content,
      user: {
        id: userId,
        nickname: faker.person.fullName(),
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        verified: false,
      },
      likes: 0,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    const comments = videoComments.get(videoId) || [];
    comments.unshift(newComment);
    videoComments.set(videoId, comments);
    return newComment;
  },

  // 删除视频评论
  async deleteVideoComment(videoId: string, commentId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const comments = videoComments.get(videoId);
    if (!comments) return false;

    const index = comments.findIndex(c => c.id === commentId);
    if (index === -1) return false;

    comments.splice(index, 1);
    return true;
  },
};

// 导出测试数据
export const testVideoData = {
  videos: mockVideos.slice(0, 5),
};

// 生成视频列表
export const generateVideoList = (count: number = 50): Video[] => {
  return generateMockVideos().slice(0, count);
};

// 历史记录管理
const historyVideos = new Map<string, Video[]>();

export const historyApi = {
  // 获取历史记录
  getHistory: async (userId: string): Promise<Video[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return historyVideos.get(userId) || [];
  },

  // 添加历史记录
  addHistory: async (userId: string, video: Video): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const history = historyVideos.get(userId) || [];
    // 移除已存在的相同视频
    const filteredHistory = history.filter(v => v.id !== video.id);
    // 添加到开头
    historyVideos.set(userId, [video, ...filteredHistory]);
  },

  // 清空历史记录
  clearHistory: async (userId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    historyVideos.set(userId, []);
  },

  // 删除单个历史记录
  removeHistory: async (userId: string, videoId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const history = historyVideos.get(userId) || [];
    historyVideos.set(
      userId,
      history.filter(v => v.id !== videoId)
    );
  },
};
