import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Video } from '@/types';
import api from '@/utils/api';

interface VideoProgress {
  videoId: string;
  progress: number;
  timestamp: number;
}

// Mock数据，用于开发环境中模拟API响应
const mockVideos: Video[] = [
  {
    id: '1',
    title: '示例视频1',
    description: '这是一个示例视频描述',
    duration: 180,
    createdAt: new Date('2025-04-01').toISOString(),
    updatedAt: new Date('2025-04-01').toISOString(),
    coverUrl: 'https://picsum.photos/id/1/320/180',
    views: 1200,
    likes: 120,
    creator: {
      id: 'u1',
      username: 'creator1',
      nickname: '创作者1',
      avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
  },
  {
    id: '2',
    title: '示例视频2',
    description: '这是另一个示例视频描述',
    duration: 260,
    createdAt: new Date('2025-04-02').toISOString(),
    updatedAt: new Date('2025-04-02').toISOString(),
    coverUrl: 'https://picsum.photos/id/2/320/180',
    views: 3500,
    likes: 350,
    creator: {
      id: 'u2',
      username: 'creator2',
      nickname: '创作者2',
      avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
  },
  {
    id: '3',
    title: '示例视频3',
    description: '第三个示例视频描述',
    duration: 320,
    createdAt: new Date('2025-04-03').toISOString(),
    updatedAt: new Date('2025-04-03').toISOString(),
    coverUrl: 'https://picsum.photos/id/3/320/180',
    views: 8200,
    likes: 780,
    creator: {
      id: 'u3',
      username: 'creator3',
      nickname: '创作者3',
      avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
  },
];

export const useHistoryStore = defineStore('history', () => {
  // 状态
  const watchHistory = ref<Video[]>([]);
  const searchHistory = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const videoProgressHistory = ref<VideoProgress[]>([]);
  const mockMode = ref(process.env.NODE_ENV === 'development');

  // 获取观看历史
  const getWatchHistory = async (): Promise<Video[]> => {
    try {
      loading.value = true;
      error.value = null;

      if (mockMode.value) {
        // 使用模拟数据
        watchHistory.value = [...mockVideos];
        return watchHistory.value;
      }

      // 实际API调用
      const response = await api.get('/history/watch');
      watchHistory.value = response.data;
      return response.data;
    } catch (err) {
      if (mockMode.value) {
        // 如果在mock模式下，返回模拟数据
        watchHistory.value = [...mockVideos];
        return watchHistory.value;
      }
      error.value = err instanceof Error ? err.message : '获取观看历史失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 清除观看历史
  const clearWatchHistory = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      if (mockMode.value) {
        // 在mock模式下，只清空本地状态
        watchHistory.value = [];
        return;
      }

      // 实际API调用
      await api.delete('/history/watch');
      watchHistory.value = [];
    } catch (err) {
      if (mockMode.value) {
        watchHistory.value = [];
        return;
      }
      error.value = err instanceof Error ? err.message : '清除观看历史失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 从历史记录中移除视频
  const removeFromWatchHistory = async (videoId: string): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      if (mockMode.value) {
        // 在mock模式下，只从本地状态移除
        watchHistory.value = watchHistory.value.filter(v => v.id !== videoId);
        return;
      }

      // 实际API调用
      await api.delete(`/history/watch/${videoId}`);
      watchHistory.value = watchHistory.value.filter(v => v.id !== videoId);
    } catch (err) {
      if (mockMode.value) {
        watchHistory.value = watchHistory.value.filter(v => v.id !== videoId);
        return;
      }
      error.value = err instanceof Error ? err.message : '移除视频失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 添加视频到观看历史
  const addToWatchHistory = async (videoId: string): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      if (mockMode.value) {
        // 在mock模式下不执行任何操作
        return;
      }

      // 实际API调用
      await api.post(`/history/watch/${videoId}`);
    } catch (err) {
      if (mockMode.value) {
        return;
      }
      error.value = err instanceof Error ? err.message : '添加视频失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取搜索历史
  const getSearchHistory = async (): Promise<string[]> => {
    try {
      loading.value = true;
      error.value = null;

      if (mockMode.value) {
        // 使用模拟数据
        searchHistory.value = ['视频', '教程', 'Vue', 'TypeScript', '音乐'];
        return searchHistory.value;
      }

      // 实际API调用
      const response = await api.get('/history/search');
      searchHistory.value = response.data;
      return response.data;
    } catch (err) {
      if (mockMode.value) {
        searchHistory.value = ['视频', '教程', 'Vue', 'TypeScript', '音乐'];
        return searchHistory.value;
      }
      error.value = err instanceof Error ? err.message : '获取搜索历史失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 清除搜索历史
  const clearSearchHistory = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      if (mockMode.value) {
        // 在mock模式下，只清空本地状态
        searchHistory.value = [];
        return;
      }

      // 实际API调用
      await api.delete('/history/search');
      searchHistory.value = [];
    } catch (err) {
      if (mockMode.value) {
        searchHistory.value = [];
        return;
      }
      error.value = err instanceof Error ? err.message : '清除搜索历史失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 从搜索历史中移除关键词
  const removeFromSearchHistory = async (keyword: string): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      if (mockMode.value) {
        // 在mock模式下，只从本地状态移除
        searchHistory.value = searchHistory.value.filter(k => k !== keyword);
        return;
      }

      // 实际API调用
      await api.delete(`/history/search/${encodeURIComponent(keyword)}`);
      searchHistory.value = searchHistory.value.filter(k => k !== keyword);
    } catch (err) {
      if (mockMode.value) {
        searchHistory.value = searchHistory.value.filter(k => k !== keyword);
        return;
      }
      error.value = err instanceof Error ? err.message : '移除关键词失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 添加关键词到搜索历史
  const addToSearchHistory = async (keyword: string): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;

      if (mockMode.value) {
        // 在mock模式下不执行任何操作
        return;
      }

      // 实际API调用
      await api.post(`/history/search/${encodeURIComponent(keyword)}`);
    } catch (err) {
      if (mockMode.value) {
        return;
      }
      error.value = err instanceof Error ? err.message : '添加关键词失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 添加视频进度到历史记录
  const saveVideoProgress = (videoId: string, progress: number): void => {
    const existingIndex = videoProgressHistory.value.findIndex(item => item.videoId === videoId);
    if (existingIndex >= 0) {
      videoProgressHistory.value[existingIndex] = {
        videoId,
        progress,
        timestamp: Date.now(),
      };
    } else {
      videoProgressHistory.value.push({
        videoId,
        progress,
        timestamp: Date.now(),
      });
    }
  };

  // 获取视频进度
  const getVideoProgress = (videoId: string): number => {
    const video = videoProgressHistory.value.find(item => item.videoId === videoId);
    return video?.progress || 0;
  };

  // 清除视频进度历史
  const clearVideoProgressHistory = (): void => {
    videoProgressHistory.value = [];
  };

  return {
    watchHistory,
    searchHistory,
    loading,
    error,
    videoProgressHistory,
    getWatchHistory,
    clearWatchHistory,
    removeFromWatchHistory,
    addToWatchHistory,
    getSearchHistory,
    clearSearchHistory,
    removeFromSearchHistory,
    addToSearchHistory,
    saveVideoProgress,
    getVideoProgress,
    clearVideoProgressHistory,
  };
});
