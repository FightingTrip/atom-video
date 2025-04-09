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
  // 默认视频URL列表（公共可访问的示例视频）
  const sampleVideoUrls = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
  ];

  // 基于videoId确定一个稳定的视频URL（相同ID总是返回相同视频）
  const videoIndex = parseInt(videoId.replace(/\D/g, '0')) % sampleVideoUrls.length;
  const selectedVideoUrl = sampleVideoUrls[videoIndex];

  return {
    id: videoId,
    title: '测试视频 - ' + videoId,
    description:
      '这是一个模拟视频，用于测试视频播放界面效果。实际项目中，这里将显示从后端获取的真实视频数据。这个视频包含了各种测试场景，用于确保视频播放器的功能正常工作，比如全屏播放、音量控制、播放速度调整等。',
    thumbnail: `https://picsum.photos/seed/${videoId}/480/270`,
    coverUrl: `https://picsum.photos/seed/${videoId}/480/270`,
    // 确保始终有视频URL
    videoUrl: selectedVideoUrl,
    // 确保有有效的源列表
    sources: [
      {
        url: selectedVideoUrl,
        type: 'video/mp4',
        label: '720p',
        size: 720,
      },
      {
        url: selectedVideoUrl,
        type: 'video/mp4',
        label: '480p',
        size: 480,
      },
      {
        url: selectedVideoUrl,
        type: 'video/mp4',
        label: '360p',
        size: 360,
      },
    ],
    duration: 120 + Math.floor(Math.random() * 600), // 2-12分钟
    views: 1000 + Math.floor(Math.random() * 1000000),
    likes: 100 + Math.floor(Math.random() * 10000),
    favorites: 50 + Math.floor(Math.random() * 5000),
    comments: 10 + Math.floor(Math.random() * 1000),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000).toISOString(), // 0-90天前
    tags: ['测试', '开发', 'UI设计', '视频播放'],
    subtitles: [], // 空字幕列表
    author: {
      id: 'author-' + videoId,
      nickname: '测试用户-' + videoId,
      avatar: `https://i.pravatar.cc/150?u=${videoId}`,
      verified: true,
      followersCount: 1200 + Math.floor(Math.random() * 100000),
      followingCount: 45 + Math.floor(Math.random() * 1000),
      description:
        '这是一个测试用户账号，用于展示视频详情页的作者信息区域。这位创作者专注于技术教程和编程视频。',
    },
    // 添加可能需要的其他字段
    url: selectedVideoUrl, // 兼容某些组件可能使用的url字段
    previewUrl: selectedVideoUrl, // 视频预览
    downloadUrl: selectedVideoUrl, // 下载链接
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
