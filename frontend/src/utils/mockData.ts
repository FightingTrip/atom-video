/**
 * @file mockData.ts
 * @description 用于演示的模拟数据
 */

import type { User, Video, Comment, VideoInteraction, VideoProgress } from '@/types';

/**
 * 模拟用户数据
 */
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'demo_user',
    email: 'demo@example.com',
    nickname: '演示用户',
    avatar: 'https://i.pravatar.cc/150?u=1',
    bio: '这是一个用于演示的账号，您可以在这里测试各种功能。',
    verified: true,
    subscribers: 1024,
    subscribing: 42,
    totalViews: 30240,
    joinedAt: '2024-01-15T08:00:00Z',
    social: {
      website: 'https://example.com',
      github: 'https://github.com/demo-user',
      twitter: 'https://twitter.com/demo-user',
    },
  },
  {
    id: '2',
    username: 'admin_user',
    email: 'admin@example.com',
    nickname: '管理员',
    avatar: 'https://i.pravatar.cc/150?u=2',
    bio: '系统管理员账号，拥有所有权限。',
    verified: true,
    subscribers: 5000,
    subscribing: 10,
    totalViews: 100000,
    joinedAt: '2023-12-01T08:00:00Z',
    social: {
      github: 'https://github.com/admin-user',
    },
  },
  {
    id: '3',
    username: 'creator',
    email: 'creator@example.com',
    nickname: '内容创作者',
    avatar: 'https://i.pravatar.cc/150?u=3',
    bio: '专业视频创作者，分享有趣的科技内容和教程。',
    verified: true,
    subscribers: 25000,
    subscribing: 120,
    totalViews: 2500000,
    joinedAt: '2023-10-15T08:00:00Z',
    social: {
      website: 'https://creator-tech.com',
      github: 'https://github.com/tech-creator',
      twitter: 'https://twitter.com/tech-creator',
    },
  },
];

/**
 * 模拟视频数据
 */
export const mockVideos: Video[] = [
  {
    id: 'v1',
    title: '2025年最值得学习的编程语言',
    description:
      '本视频探讨了2025年最热门、最有前景的编程语言，包括就业前景、薪资水平和技术趋势分析。适合正在考虑学习编程或想要转换技术栈的观众。',
    coverUrl: 'https://picsum.photos/id/1/640/360',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 925, // 15:25
    views: 45280,
    likes: 3840,
    favorites: 1220,
    comments: 342,
    createdAt: '2025-01-10T08:30:00Z',
    author: {
      id: '3',
      username: 'creator',
      nickname: '内容创作者',
      avatar: 'https://i.pravatar.cc/150?u=3',
      verified: true,
    },
    tags: ['编程', '技术', '教育', '职业发展'],
    sources: [
      {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: 'video/mp4',
        size: 1080,
        label: '1080p',
      },
      {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: 'video/mp4',
        size: 720,
        label: '720p',
      },
      {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        type: 'video/mp4',
        size: 480,
        label: '480p',
      },
    ],
    subtitles: [
      {
        url: 'https://example.com/videos/v1/subtitles/zh.vtt',
        label: '中文',
        srclang: 'zh',
        default: true,
      },
      {
        url: 'https://example.com/videos/v1/subtitles/en.vtt',
        label: 'English',
        srclang: 'en',
      },
    ],
  },
  {
    id: 'v2',
    title: '人工智能初学者完全指南',
    description:
      '这是一个为初学者设计的人工智能入门教程，从基础概念到实际应用，循序渐进地介绍AI领域的核心知识和技能。',
    coverUrl: 'https://picsum.photos/id/2/640/360',
    videoUrl: 'https://example.com/videos/ai-beginners-guide',
    duration: 1845, // 30:45
    views: 32150,
    likes: 2870,
    favorites: 1560,
    comments: 286,
    createdAt: '2025-01-05T10:15:00Z',
    author: {
      id: '3',
      username: 'creator',
      nickname: '内容创作者',
      avatar: 'https://i.pravatar.cc/150?u=3',
      verified: true,
    },
    tags: ['人工智能', 'AI', '技术', '教育', '入门教程'],
    sources: [
      {
        url: 'https://example.com/videos/v2/1080p.mp4',
        type: 'video/mp4',
        size: 1080,
        label: '1080p',
      },
      {
        url: 'https://example.com/videos/v2/720p.mp4',
        type: 'video/mp4',
        size: 720,
        label: '720p',
      },
    ],
    subtitles: [
      {
        url: 'https://example.com/videos/v2/subtitles/zh.vtt',
        label: '中文',
        srclang: 'zh',
        default: true,
      },
    ],
  },
  {
    id: 'v3',
    title: '5分钟学会Vue 3核心概念',
    description:
      '这个简短的教程让你快速掌握Vue 3的核心概念，包括组合式API、响应式系统和生命周期钩子。',
    coverUrl: 'https://picsum.photos/id/3/640/360',
    videoUrl: 'https://example.com/videos/vue3-core-concepts',
    duration: 312, // 5:12
    views: 18720,
    likes: 1530,
    favorites: 875,
    comments: 124,
    createdAt: '2025-01-15T14:20:00Z',
    author: {
      id: '3',
      username: 'creator',
      nickname: '内容创作者',
      avatar: 'https://i.pravatar.cc/150?u=3',
      verified: true,
    },
    tags: ['Vue', '前端开发', 'JavaScript', '框架', '教程'],
    sources: [
      {
        url: 'https://example.com/videos/v3/1080p.mp4',
        type: 'video/mp4',
        size: 1080,
        label: '1080p',
      },
      {
        url: 'https://example.com/videos/v3/720p.mp4',
        type: 'video/mp4',
        size: 720,
        label: '720p',
      },
      {
        url: 'https://example.com/videos/v3/480p.mp4',
        type: 'video/mp4',
        size: 480,
        label: '480p',
      },
    ],
    subtitles: [],
  },
  {
    id: 'v4',
    title: '健康生活方式：30天挑战',
    description:
      '加入我们的30天健康生活挑战，每天学习一个简单的健康习惯，包括饮食、运动和心理健康的实用建议。',
    coverUrl: 'https://picsum.photos/id/4/640/360',
    videoUrl: 'https://example.com/videos/30-day-health-challenge',
    duration: 1250, // 20:50
    views: 28450,
    likes: 2350,
    favorites: 1820,
    comments: 320,
    createdAt: '2024-12-20T09:00:00Z',
    author: {
      id: '1',
      username: 'demo_user',
      nickname: '演示用户',
      avatar: 'https://i.pravatar.cc/150?u=1',
      verified: true,
    },
    tags: ['健康', '生活方式', '健身', '饮食', '挑战'],
    sources: [
      {
        url: 'https://example.com/videos/v4/1080p.mp4',
        type: 'video/mp4',
        size: 1080,
        label: '1080p',
      },
      {
        url: 'https://example.com/videos/v4/720p.mp4',
        type: 'video/mp4',
        size: 720,
        label: '720p',
      },
    ],
    subtitles: [
      {
        url: 'https://example.com/videos/v4/subtitles/zh.vtt',
        label: '中文',
        srclang: 'zh',
        default: true,
      },
    ],
  },
  {
    id: 'v5',
    title: '探索日本文化：东京街头漫步',
    description:
      '跟随我们的镜头，探索东京的街道、小巷和隐藏的宝藏，感受日本独特的城市文化和生活方式。',
    coverUrl: 'https://picsum.photos/id/5/640/360',
    videoUrl: 'https://example.com/videos/tokyo-streets',
    duration: 1523, // 25:23
    views: 35280,
    likes: 3050,
    favorites: 2240,
    comments: 278,
    createdAt: '2024-12-25T15:40:00Z',
    author: {
      id: '1',
      username: 'demo_user',
      nickname: '演示用户',
      avatar: 'https://i.pravatar.cc/150?u=1',
      verified: true,
    },
    tags: ['旅行', '日本', '文化', '探索', '东京'],
    sources: [
      {
        url: 'https://example.com/videos/v5/1080p.mp4',
        type: 'video/mp4',
        size: 1080,
        label: '1080p',
      },
      {
        url: 'https://example.com/videos/v5/720p.mp4',
        type: 'video/mp4',
        size: 720,
        label: '720p',
      },
      {
        url: 'https://example.com/videos/v5/480p.mp4',
        type: 'video/mp4',
        size: 480,
        label: '480p',
      },
    ],
    subtitles: [
      {
        url: 'https://example.com/videos/v5/subtitles/zh.vtt',
        label: '中文',
        srclang: 'zh',
        default: true,
      },
      {
        url: 'https://example.com/videos/v5/subtitles/en.vtt',
        label: 'English',
        srclang: 'en',
      },
      {
        url: 'https://example.com/videos/v5/subtitles/ja.vtt',
        label: '日本語',
        srclang: 'ja',
      },
    ],
  },
];

/**
 * 模拟评论数据
 */
export const mockComments: Comment[] = [
  {
    id: 'c1',
    content: '非常感谢分享这么有价值的信息！刚开始学习编程，这个视频给了我很好的方向。',
    createdAt: '2025-01-10T10:30:00Z',
    videoTitle: '2025年最值得学习的编程语言',
    user: {
      nickname: '初学者小李',
      avatar: 'https://i.pravatar.cc/150?u=10',
    },
    likes: 45,
    replyCount: 2,
  },
  {
    id: 'c2',
    content: '视频制作得很专业，内容也很全面。特别喜欢关于就业前景的分析部分。',
    createdAt: '2025-01-10T12:15:00Z',
    videoTitle: '2025年最值得学习的编程语言',
    user: {
      nickname: '职场程序员',
      avatar: 'https://i.pravatar.cc/150?u=11',
    },
    likes: 28,
    replyCount: 1,
  },
  {
    id: 'c3',
    content: '这个AI入门教程太棒了！解释得很清晰，非常适合我这样的新手。',
    createdAt: '2025-01-06T08:45:00Z',
    videoTitle: '人工智能初学者完全指南',
    user: {
      nickname: 'AI学习者',
      avatar: 'https://i.pravatar.cc/150?u=12',
    },
    likes: 32,
    replyCount: 3,
  },
  {
    id: 'c4',
    content: '简短精炼，5分钟内讲清楚了Vue 3的核心概念，节省了我很多时间！',
    createdAt: '2025-01-15T16:30:00Z',
    videoTitle: '5分钟学会Vue 3核心概念',
    user: {
      nickname: '前端开发者',
      avatar: 'https://i.pravatar.cc/150?u=13',
    },
    likes: 19,
    replyCount: 0,
  },
  {
    id: 'c5',
    content: '这个健康挑战很有意思，我已经开始尝试了，感觉很好！',
    createdAt: '2024-12-22T14:50:00Z',
    videoTitle: '健康生活方式：30天挑战',
    user: {
      nickname: '健康生活家',
      avatar: 'https://i.pravatar.cc/150?u=14',
    },
    likes: 24,
    replyCount: 1,
  },
];

/**
 * 用户视频互动数据存储
 */
export interface UserVideoInteractions {
  [userId: string]: {
    [videoId: string]: VideoInteraction;
  };
}

/**
 * 用户视频进度存储
 */
export interface UserVideoProgress {
  [userId: string]: {
    [videoId: string]: VideoProgress;
  };
}

/**
 * 获取默认用户数据
 */
export function getDefaultUser(): User {
  return mockUsers[0];
}

/**
 * 获取视频数据
 */
export function getVideos(limit?: number): Video[] {
  if (limit) {
    return mockVideos.slice(0, limit);
  }
  return mockVideos;
}

/**
 * 根据ID获取视频
 */
export function getVideoById(videoId: string): Video | undefined {
  return mockVideos.find(video => video.id === videoId);
}

/**
 * 获取视频评论
 */
export function getVideoComments(videoId: string): Comment[] {
  // 简单模拟，实际应根据videoId筛选
  return mockComments.filter((_, index) => index < 3);
}

/**
 * 获取用户视频互动数据
 */
export function getUserVideoInteraction(userId: string, videoId: string): VideoInteraction {
  // 从localStorage获取互动数据
  const interactionsJson = localStorage.getItem('userVideoInteractions');
  const interactions: UserVideoInteractions = interactionsJson ? JSON.parse(interactionsJson) : {};

  if (interactions[userId] && interactions[userId][videoId]) {
    return interactions[userId][videoId];
  }

  // 默认互动状态
  return {
    isLiked: false,
    isFavorited: false,
    isSubscribed: false,
  };
}

/**
 * 更新用户视频互动数据
 */
export function updateUserVideoInteraction(
  userId: string,
  videoId: string,
  interaction: Partial<VideoInteraction>
): void {
  // 从localStorage获取互动数据
  const interactionsJson = localStorage.getItem('userVideoInteractions');
  const interactions: UserVideoInteractions = interactionsJson ? JSON.parse(interactionsJson) : {};

  // 初始化用户的互动数据
  if (!interactions[userId]) {
    interactions[userId] = {};
  }

  // 初始化该视频的互动数据
  if (!interactions[userId][videoId]) {
    interactions[userId][videoId] = {
      isLiked: false,
      isFavorited: false,
      isSubscribed: false,
    };
  }

  // 更新互动数据
  interactions[userId][videoId] = {
    ...interactions[userId][videoId],
    ...interaction,
  };

  // 保存到localStorage
  localStorage.setItem('userVideoInteractions', JSON.stringify(interactions));

  // 更新视频统计数据
  updateVideoStats(videoId, interaction);
}

/**
 * 更新视频统计数据
 */
function updateVideoStats(videoId: string, interaction: Partial<VideoInteraction>): void {
  const video = getVideoById(videoId);
  if (!video) return;

  // 更新统计数据
  if (interaction.isLiked !== undefined) {
    // 如果点赞状态改变
    if (interaction.isLiked) {
      video.likes += 1;
    } else {
      video.likes = Math.max(0, video.likes - 1);
    }
  }

  if (interaction.isFavorited !== undefined) {
    // 如果收藏状态改变
    if (interaction.isFavorited) {
      video.favorites = (video.favorites || 0) + 1;
    } else {
      video.favorites = Math.max(0, (video.favorites || 0) - 1);
    }
  }
}

/**
 * 获取用户视频播放进度
 */
export function getVideoProgress(userId: string, videoId: string): VideoProgress | null {
  // 从localStorage获取播放进度数据
  const progressJson = localStorage.getItem('userVideoProgress');
  const progress: UserVideoProgress = progressJson ? JSON.parse(progressJson) : {};

  if (progress[userId] && progress[userId][videoId]) {
    return progress[userId][videoId];
  }

  return null;
}

/**
 * 保存用户视频播放进度
 */
export function saveVideoProgress(
  userId: string,
  videoId: string,
  currentTime: number,
  duration: number
): void {
  // 从localStorage获取播放进度数据
  const progressJson = localStorage.getItem('userVideoProgress');
  const progress: UserVideoProgress = progressJson ? JSON.parse(progressJson) : {};

  // 初始化用户的进度数据
  if (!progress[userId]) {
    progress[userId] = {};
  }

  // 更新进度数据
  progress[userId][videoId] = {
    videoId,
    currentTime,
    duration,
    percentage: Math.floor((currentTime / duration) * 100),
    lastPlayedAt: new Date().toISOString(),
  };

  // 保存到localStorage
  localStorage.setItem('userVideoProgress', JSON.stringify(progress));

  // 更新观看历史
  addToWatchHistory(userId, videoId);
}

/**
 * 获取用户观看历史
 */
export function getWatchHistory(userId: string): string[] {
  const historyJson = localStorage.getItem(`watchHistory_${userId}`);
  return historyJson ? JSON.parse(historyJson) : [];
}

/**
 * 添加到观看历史
 */
function addToWatchHistory(userId: string, videoId: string): void {
  let history = getWatchHistory(userId);

  // 如果已经在历史记录中，先移除
  history = history.filter(id => id !== videoId);

  // 添加到历史记录开头
  history.unshift(videoId);

  // 限制历史记录长度
  if (history.length > 50) {
    history = history.slice(0, 50);
  }

  // 保存到localStorage
  localStorage.setItem(`watchHistory_${userId}`, JSON.stringify(history));
}

/**
 * 初始化模拟数据
 */
// 移除这个函数声明，使用下面的常量声明代替
// export function initMockData(): void {
//   // 检查localStorage是否已有用户数据
//   if (!localStorage.getItem('user')) {
//     // 存储默认用户
//     localStorage.setItem('user', JSON.stringify(getDefaultUser()));
//   }

//   // 初始化通知设置
//   if (!localStorage.getItem('notificationSettings')) {
//     localStorage.setItem(
//       'notificationSettings',
//       JSON.stringify({
//         likes: true,
//         comments: true,
//         replies: true,
//         follows: true,
//         videoProcessing: true,
//         updates: false,
//         emailNotification: true,
//         browserNotification: false,
//       })
//     );
//   }

//   // 初始化隐私设置
//   if (!localStorage.getItem('privacySettings')) {
//     localStorage.setItem(
//       'privacySettings',
//       JSON.stringify({
//         showWatchHistory: false,
//         showFavorites: true,
//         showFollowing: true,
//         showLikes: false,
//         commentPermission: 'everyone',
//       })
//     );
//   }

//   // 初始化外观设置
//   if (!localStorage.getItem('appearanceSettings')) {
//     localStorage.setItem(
//       'appearanceSettings',
//       JSON.stringify({
//         theme: 'system',
//         fontSize: 16,
//       })
//     );
//   }

//   console.log('模拟数据已初始化');
// }

export default {
  // 确保引用的是后面定义的常量版本
  // initMockData,
  getDefaultUser,
  mockUsers,
  getVideos,
  getVideoById,
  getVideoComments,
  getUserVideoInteraction,
  updateUserVideoInteraction,
  getVideoProgress,
  saveVideoProgress,
  getWatchHistory,
};

/**
 * 获取模拟视频数据
 * @param id 视频ID
 */
export function getMockVideo(id: string): Video {
  // 优先使用ID查找
  const video = mockVideos.find(v => v.id === id);

  // 如果没有找到，返回第一个视频
  if (video) {
    return { ...video };
  }

  // 假设生成的视频
  return {
    ...mockVideos[0],
    id,
    title: `视频 ${id}`,
  };
}

/**
 * 获取模拟评论数据
 * @param videoId 视频ID
 */
export function getMockComments(videoId: string): Comment[] {
  // 可以直接返回我们已经定义的评论
  return mockComments;
}

/**
 * 获取模拟视频互动数据
 * @param videoId 视频ID
 */
export function getMockVideoInteraction(videoId: string): VideoInteraction {
  return {
    isLiked: false,
    isFavorited: false,
    isSubscribed: false,
  };
}

/**
 * 获取模拟推荐视频
 * @param videoId 当前视频ID
 * @param count 推荐数量
 */
export function getMockRecommendedVideos(videoId: string, count: number = 5): Video[] {
  // 排除当前视频
  const filteredVideos = mockVideos.filter(v => v.id !== videoId);

  // 如果视频数量不够，就重复使用
  let recommendedVideos: Video[] = [];
  while (recommendedVideos.length < count) {
    recommendedVideos = recommendedVideos.concat(filteredVideos);
  }

  // 截取需要的数量
  return recommendedVideos.slice(0, count).map(video => ({ ...video }));
}

/**
 * 模拟异步请求延迟
 * @param minDelay 最小延迟时间（毫秒）
 * @param maxDelay 最大延迟时间（毫秒）
 * @returns Promise对象
 */
export const mockDelay = (minDelay = 300, maxDelay = 1200): Promise<void> => {
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// 初始化模拟数据 - 此函数会在使用模拟模式时被调用
export const initMockData = () => {
  console.log('[Mock] 初始化模拟数据...');

  // mockDb 在导入时会自动初始化，无需在此处额外初始化

  // 设置localStorage标记，表示已初始化
  localStorage.setItem('mock_initialized', 'true');

  console.log('[Mock] 模拟数据初始化完成');
};

// 检查模拟数据是否已初始化
export const isMockInitialized = () => {
  return localStorage.getItem('mock_initialized') === 'true';
};

// 重置模拟数据
export const resetMockData = () => {
  // 清除初始化标记
  localStorage.removeItem('mock_initialized');

  // 为简化实现，刷新页面以重新加载模拟数据
  window.location.reload();
};
