/**
 * @file mockHandlers.ts
 * @description Mock API处理器注册
 */

import { registerMockHandler } from './api';
import {
  getMockVideo,
  getMockComments,
  getMockRecommendedVideos,
  getMockVideoInteraction,
} from './mockData';
import { localStorageSupport, safeGetItem, safeSetItem } from '@/utils/storageUtils';
import { registerAdminMockHandlers } from './mockHandlers/admin';
import { registerCreatorMockHandlers } from './mockHandlers/creator';
// 导入MSW的处理程序
import { handlers as mswHandlers } from '@/mock/handlers';

// 参数接口定义
interface QueryParams {
  page?: number;
  limit?: number;
  category?: string;
  q?: string;
  [key: string]: any;
}

// 常量定义
const LIKED_VIDEOS_KEY = 'atom-video-liked-videos';
const SAVED_VIDEOS_KEY = 'atom-video-saved-videos';
const SUBSCRIBED_CHANNELS_KEY = 'atom-video-subscribed-channels';
const HISTORY_VIDEOS_KEY = 'atom-video-history';

// 初始化本地存储
const initLocalStorage = () => {
  if (localStorageSupport()) {
    if (!localStorage.getItem(LIKED_VIDEOS_KEY)) {
      localStorage.setItem(LIKED_VIDEOS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(SAVED_VIDEOS_KEY)) {
      localStorage.setItem(SAVED_VIDEOS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(SUBSCRIBED_CHANNELS_KEY)) {
      localStorage.setItem(SUBSCRIBED_CHANNELS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(HISTORY_VIDEOS_KEY)) {
      localStorage.setItem(HISTORY_VIDEOS_KEY, JSON.stringify([]));
    }
  }
};

// 注册所有Mock处理器
export const registerAllMockHandlers = () => {
  // 初始化本地存储
  initLocalStorage();

  // 注册管理后台处理器
  registerAdminMockHandlers();

  // 注册创作者处理器
  registerCreatorMockHandlers();

  // 注册MSW处理程序 (这里不需要特别操作，因为MSW处理程序在setupMockWorker()时会自动注册)
  console.log('Registered MSW handlers:', mswHandlers.length);

  // 1. 视频相关API
  registerMockHandler({
    method: 'GET',
    url: /\/api\/videos\/([a-zA-Z0-9-_]+)$/,
    handler: (url: string) => {
      const videoId = url.split('/').pop();
      const video = getMockVideo(videoId || '');

      // 添加到历史记录
      const history = safeGetItem<string[]>(HISTORY_VIDEOS_KEY, []);
      if (!history.includes(videoId || '')) {
        history.unshift(videoId || '');
        if (history.length > 50) history.pop();
        safeSetItem(HISTORY_VIDEOS_KEY, history);
      }

      return { success: true, data: video };
    },
  });

  registerMockHandler({
    method: 'GET',
    url: '/api/videos',
    handler: (url: string, params?: QueryParams) => {
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const category = params?.category || 'all';

      // 生成一些随机视频
      const videos = Array(limit)
        .fill(0)
        .map((_, i) => getMockVideo(`video-${(page - 1) * limit + i + 1}`));

      return {
        success: true,
        data: {
          videos,
          total: 100, // 假设有100个视频
          hasMore: page * limit < 100,
        },
      };
    },
  });

  registerMockHandler({
    method: 'GET',
    url: '/api/videos/trending',
    handler: () => {
      // 生成热门视频
      const videos = Array(10)
        .fill(0)
        .map((_, i) => getMockVideo(`trending-${i + 1}`));

      return { success: true, data: videos };
    },
  });

  registerMockHandler({
    method: 'GET',
    url: '/api/videos/recommended',
    handler: (url: string, params?: QueryParams) => {
      const page = params?.page || 1;
      const limit = params?.limit || 10;

      // 生成推荐视频
      const videos = Array(limit)
        .fill(0)
        .map((_, i) => getMockVideo(`recommended-${(page - 1) * limit + i + 1}`));

      return {
        success: true,
        data: {
          videos,
          total: 50, // 假设有50个推荐视频
          hasMore: page * limit < 50,
        },
      };
    },
  });

  // 2. 视频互动API
  registerMockHandler({
    method: 'GET',
    url: /\/api\/videos\/([a-zA-Z0-9-_]+)\/interaction$/,
    handler: (url: string) => {
      const videoId = url.split('/')[3];

      // 获取用户互动状态
      const likedVideos = safeGetItem<string[]>(LIKED_VIDEOS_KEY, []);
      const savedVideos = safeGetItem<string[]>(SAVED_VIDEOS_KEY, []);
      const subscribedChannels = safeGetItem<string[]>(SUBSCRIBED_CHANNELS_KEY, []);

      const interaction = {
        isLiked: likedVideos.includes(videoId),
        isFavorited: savedVideos.includes(videoId),
        isSubscribed: subscribedChannels.includes(`channel-${videoId}`),
      };

      return { success: true, data: interaction };
    },
  });

  registerMockHandler({
    method: 'POST',
    url: /\/api\/videos\/([a-zA-Z0-9-_]+)\/like$/,
    handler: (url: string) => {
      const videoId = url.split('/')[3];

      // 切换点赞状态
      const likedVideos = safeGetItem<string[]>(LIKED_VIDEOS_KEY, []);
      let isLiked = likedVideos.includes(videoId);

      if (isLiked) {
        // 取消点赞
        const newLikedVideos = likedVideos.filter(id => id !== videoId);
        safeSetItem(LIKED_VIDEOS_KEY, newLikedVideos);
        isLiked = false;
      } else {
        // 添加点赞
        likedVideos.push(videoId);
        safeSetItem(LIKED_VIDEOS_KEY, likedVideos);
        isLiked = true;
      }

      return { success: true, data: { liked: isLiked } };
    },
  });

  registerMockHandler({
    method: 'POST',
    url: /\/api\/videos\/([a-zA-Z0-9-_]+)\/favorite$/,
    handler: (url: string) => {
      const videoId = url.split('/')[3];

      // 切换收藏状态
      const savedVideos = safeGetItem<string[]>(SAVED_VIDEOS_KEY, []);
      let isFavorited = savedVideos.includes(videoId);

      if (isFavorited) {
        // 取消收藏
        const newSavedVideos = savedVideos.filter(id => id !== videoId);
        safeSetItem(SAVED_VIDEOS_KEY, newSavedVideos);
        isFavorited = false;
      } else {
        // 添加收藏
        savedVideos.push(videoId);
        safeSetItem(SAVED_VIDEOS_KEY, savedVideos);
        isFavorited = true;
      }

      return { success: true, data: { favorited: isFavorited } };
    },
  });

  registerMockHandler({
    method: 'POST',
    url: /\/api\/users\/([a-zA-Z0-9-_]+)\/follow$/,
    handler: (url: string) => {
      const channelId = url.split('/')[3];

      // 切换关注状态
      const subscribedChannels = safeGetItem<string[]>(SUBSCRIBED_CHANNELS_KEY, []);
      let isSubscribed = subscribedChannels.includes(channelId);

      if (isSubscribed) {
        // 取消关注
        const newSubscribedChannels = subscribedChannels.filter(id => id !== channelId);
        safeSetItem(SUBSCRIBED_CHANNELS_KEY, newSubscribedChannels);
        isSubscribed = false;
      } else {
        // 添加关注
        subscribedChannels.push(channelId);
        safeSetItem(SUBSCRIBED_CHANNELS_KEY, subscribedChannels);
        isSubscribed = true;
      }

      return { success: true, data: { followed: isSubscribed } };
    },
  });

  // 3. 评论相关API
  registerMockHandler({
    method: 'GET',
    url: /\/api\/videos\/([a-zA-Z0-9-_]+)\/comments$/,
    handler: (url: string, params?: QueryParams) => {
      const videoId = url.split('/')[3];
      const page = params?.page || 1;
      const limit = params?.limit || 20;

      // 获取视频评论
      const comments = getMockComments(videoId);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedComments = comments.slice(startIndex, endIndex);

      return {
        success: true,
        data: {
          comments: paginatedComments,
          hasMore: endIndex < comments.length,
        },
      };
    },
  });

  // 4. 搜索API
  registerMockHandler({
    method: 'GET',
    url: '/api/search',
    handler: (url: string, params?: QueryParams) => {
      const query = params?.q || '';
      const page = params?.page || 1;
      const limit = params?.limit || 10;

      // 生成搜索结果
      const videos = Array(limit)
        .fill(0)
        .map((_, i) => {
          const video = getMockVideo(`search-${(page - 1) * limit + i + 1}`);
          video.title = `${query} 相关视频 ${(page - 1) * limit + i + 1}`;
          return video;
        });

      return {
        success: true,
        data: {
          videos,
          total: 50, // 假设有50个搜索结果
          hasMore: page * limit < 50,
        },
      };
    },
  });

  // 5. 用户相关API
  registerMockHandler({
    method: 'GET',
    url: '/api/user/library',
    handler: () => {
      const savedVideos = safeGetItem<string[]>(SAVED_VIDEOS_KEY, []);

      // 获取已收藏视频
      const videos = savedVideos.map(videoId => getMockVideo(videoId));

      return {
        success: true,
        data: {
          videos,
          total: videos.length,
          hasMore: false,
        },
      };
    },
  });

  registerMockHandler({
    method: 'GET',
    url: '/api/user/history',
    handler: () => {
      const history = safeGetItem<string[]>(HISTORY_VIDEOS_KEY, []);

      // 获取观看历史
      const videos = history.map(videoId => getMockVideo(videoId));

      return {
        success: true,
        data: videos,
      };
    },
  });

  registerMockHandler({
    method: 'DELETE',
    url: '/api/user/history',
    handler: () => {
      // 清空观看历史
      safeSetItem(HISTORY_VIDEOS_KEY, []);

      return { success: true };
    },
  });

  console.log('所有Mock处理器已注册');
};

// 导出常量和函数
export const STORAGE_KEYS = {
  LIKED_VIDEOS_KEY,
  SAVED_VIDEOS_KEY,
  SUBSCRIBED_CHANNELS_KEY,
  HISTORY_VIDEOS_KEY,
};
