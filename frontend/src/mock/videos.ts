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

// 生成模拟视频数据
const generateMockVideos = (): Video[] => {
  const videos: Video[] = [];

  for (let i = 1; i <= 50; i++) {
    const category = videoCategories[Math.floor(Math.random() * videoCategories.length)].id;
    videos.push({
      id: i.toString(),
      title: `${category} 实战教程 ${i} - 专业技能提升课程`,
      description: `这是一个关于 ${category} 的实战教程，帮助你提升开发技能`,
      thumbnail: `https://picsum.photos/seed/video${i}/640/360`,
      duration: Math.floor(Math.random() * 3600).toString(), // 转换为字符串
      views: Math.floor(Math.random() * 100000).toString(), // 转换为字符串
      publishTime: faker.date.past().toISOString(),
      author: {
        id: `author${Math.floor(Math.random() * 10) + 1}`,
        name: faker.person.fullName(),
        avatar: `https://i.pravatar.cc/150?img=${i}`,
        verified: Math.random() > 0.5,
      },
      tags: [category, '编程教程', '实战'],
      category: category,
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
