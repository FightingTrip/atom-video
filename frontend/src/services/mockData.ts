/**
 * 模拟数据服务
 *
 * 这个文件提供模拟数据，用于在开发环境中测试UI组件，不依赖于后端API
 * 在使用 pnpm dev:mock 命令启动时会自动使用这些模拟数据
 */

import type { Video, Comment, User, VideoInteraction } from '@/types';

/**
 * 获取模拟视频数据
 */
export const getMockVideo = (videoId: string): Video => {
  return {
    id: videoId,
    title: '测试视频 - ' + videoId,
    description:
      '这是一个模拟视频，用于测试视频播放界面效果。实际项目中，这里将显示从后端获取的真实视频数据。这个视频包含了各种测试场景，用于确保视频播放器的功能正常工作，比如全屏播放、音量控制、播放速度调整等。',
    thumbnail: `https://picsum.photos/seed/${videoId}/480/270`,
    duration: 60,
    views: 1000,
    likes: 100,
    favorites: 50,
    comments: 10,
    createdAt: new Date().toISOString(),
    tags: ['测试', '开发', 'UI设计'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    coverUrl: `https://picsum.photos/seed/${videoId}/480/270`,
    author: {
      id: 'author-1',
      nickname: '测试用户',
      avatar: 'https://i.pravatar.cc/150',
      verified: true,
      followersCount: 1200,
      followingCount: 45,
      description:
        '这是一个测试用户账号，用于展示视频详情页的作者信息区域。这位创作者专注于技术教程和编程视频。',
    },
    sources: [
      {
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: 'video/mp4',
        label: '720p',
        size: 720,
      },
    ],
  };
};

/**
 * 获取模拟评论数据
 */
export const getMockComments = (videoId: string): Comment[] => {
  return Array(5)
    .fill(0)
    .map((_, i) => ({
      id: `comment-${i}`,
      content: `这是测试评论 ${i + 1}，用于展示评论区域的样式和布局效果。评论可以包含用户反馈、问题和讨论。`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      likes: Math.floor(Math.random() * 50),
      author: {
        id: `user-${i}`,
        nickname: `评论用户 ${i + 1}`,
        avatar: `https://i.pravatar.cc/150?u=${i}`,
      },
    }));
};

/**
 * 获取模拟视频互动状态
 */
export const getMockVideoInteraction = (videoId: string): VideoInteraction => {
  // 随机生成互动状态
  return {
    isLiked: Math.random() > 0.5,
    isFavorited: Math.random() > 0.7,
    isSubscribed: Math.random() > 0.3,
  };
};

/**
 * 获取模拟用户数据
 */
export const getMockUser = (): User => {
  return {
    id: 'current-user',
    nickname: '当前用户',
    avatar: 'https://i.pravatar.cc/150?u=current',
    email: 'user@example.com',
    isVerified: true,
  };
};

/**
 * 获取模拟推荐视频列表
 */
export const getMockRecommendedVideos = (videoId: string, count: number = 5): Video[] => {
  return Array(count)
    .fill(0)
    .map((_, i) => ({
      id: `rec-${i}`,
      title: `推荐视频 ${i + 1}`,
      description: '这是一个推荐视频示例。',
      thumbnail: `https://picsum.photos/seed/rec${i}/480/270`,
      duration: 30 + Math.floor(Math.random() * 300),
      views: 100 + Math.floor(Math.random() * 10000),
      likes: 10 + Math.floor(Math.random() * 1000),
      favorites: 5 + Math.floor(Math.random() * 500),
      comments: 2 + Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
      tags: ['推荐', '相关视频'],
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      coverUrl: `https://picsum.photos/seed/rec${i}/480/270`,
      author: {
        id: `author-rec-${i}`,
        nickname: `创作者 ${i + 1}`,
        avatar: `https://i.pravatar.cc/150?u=auth${i}`,
        verified: Math.random() > 0.7,
      },
    }));
};

/**
 * 生成模拟响应
 */
export const createMockResponse = <T>(data: T, success: boolean = true, message: string = '') => {
  return {
    success,
    data,
    message,
  };
};

/**
 * 添加模拟延迟
 */
export const mockDelay = async (ms: number = Math.floor(Math.random() * 300) + 100) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
