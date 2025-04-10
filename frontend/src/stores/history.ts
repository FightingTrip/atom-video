import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Video } from '@/types';
import api from '@/utils/api';

interface VideoProgress {
  videoId: string;
  progress: number;
  timestamp: number;
}

export const useHistoryStore = defineStore('history', () => {
  // 状态
  const watchHistory = ref<Video[]>([]);
  const searchHistory = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 初始化videoProgressHistory，尝试从localStorage加载
  const videoProgressHistory = ref<VideoProgress[]>(
    (() => {
      try {
        const savedProgress = localStorage.getItem('video-progress-history');
        if (savedProgress) {
          return JSON.parse(savedProgress);
        }
      } catch (err) {
        console.error('从本地存储加载视频进度失败:', err);
      }
      return [];
    })()
  );

  // 获取观看历史
  const getWatchHistory = async (): Promise<Video[]> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.get('/history/watch');
      watchHistory.value = response.data;
      return response.data;
    } catch (err) {
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
      await api.delete('/history/watch');
      watchHistory.value = [];
    } catch (err) {
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
      await api.delete(`/history/watch/${videoId}`);
      watchHistory.value = watchHistory.value.filter(v => v.id !== videoId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : '移除视频失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 添加视频到观看历史
  const addToWatchHistory = async (videoId: string): Promise<void> => {
    // 如果处于离线模式，不发送请求
    if (localStorage.getItem('offline_mode') === 'true') {
      return;
    }

    try {
      loading.value = true;
      error.value = null;

      // 设置请求超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      await api.post(`/history/watch/${videoId}`, {}, { signal: controller.signal });
      clearTimeout(timeoutId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : '添加视频失败';

      // 检查是否为网络错误
      if (
        err instanceof Error &&
        (err.message.includes('Network Error') ||
          err.message.includes('Failed to fetch') ||
          err.message.includes('ERR_CONNECTION_REFUSED') ||
          err.name === 'AbortError')
      ) {
        // 设置离线模式标记，避免后续重复请求
        localStorage.setItem('offline_mode', 'true');
        console.warn('网络连接失败，已切换至离线模式，历史记录将只保存在本地');
      }

      // 不再向外部抛出错误，仅记录日志
      console.error('添加观看历史失败:', err);
    } finally {
      loading.value = false;
    }
  };

  // 获取搜索历史
  const getSearchHistory = async (): Promise<string[]> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.get('/history/search');
      searchHistory.value = response.data;
      return response.data;
    } catch (err) {
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
      await api.delete('/history/search');
      searchHistory.value = [];
    } catch (err) {
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
      await api.delete(`/history/search/${encodeURIComponent(keyword)}`);
      searchHistory.value = searchHistory.value.filter(k => k !== keyword);
    } catch (err) {
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
      await api.post(`/history/search/${encodeURIComponent(keyword)}`);
    } catch (err) {
      error.value = err instanceof Error ? err.message : '添加关键词失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 添加视频进度到历史记录
  const addVideoProgress = (videoId: string, progress: number): void => {
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

  // 添加视频到历史记录，直接保存视频对象
  const addToHistory = (video: Video): void => {
    // 检查是否已经存在于历史记录中
    const existingIndex = watchHistory.value.findIndex(v => v.id === video.id);
    if (existingIndex >= 0) {
      // 如果存在，将该视频移动到历史记录的最前面
      const existingVideo = watchHistory.value.splice(existingIndex, 1)[0];
      watchHistory.value.unshift(existingVideo);
    } else {
      // 如果不存在，将视频添加到历史记录的最前面
      watchHistory.value.unshift(video);
    }

    // 保持历史记录不超过100条
    if (watchHistory.value.length > 100) {
      watchHistory.value = watchHistory.value.slice(0, 100);
    }

    // 保存到本地存储
    try {
      localStorage.setItem('watch_history', JSON.stringify(watchHistory.value.slice(0, 30)));
    } catch (err) {
      console.error('保存观看历史到本地存储失败:', err);
    }

    // 如果在线且未进入离线模式，则同时调用后端API记录观看历史
    const isOfflineMode = localStorage.getItem('offline_mode') === 'true';
    if (!isOfflineMode) {
      // 添加防抖，避免短时间内重复调用API
      const now = Date.now();
      const lastCall = parseInt(localStorage.getItem(`last_history_call_${video.id}`) || '0');

      // 如果距离上次调用不足30秒，则不重复调用
      if (now - lastCall < 30000) {
        return;
      }

      // 记录本次调用时间
      localStorage.setItem(`last_history_call_${video.id}`, now.toString());

      // 调用API，但不等待结果
      addToWatchHistory(video.id).catch(() => {
        // 错误处理已在addToWatchHistory内部完成
      });
    }
  };

  // 保存视频播放进度
  const saveVideoProgress = (videoId: string, progress: number): void => {
    addVideoProgress(videoId, progress);

    // 将播放进度同步到本地存储
    try {
      const progressData = JSON.stringify(videoProgressHistory.value);
      localStorage.setItem('video-progress-history', progressData);
    } catch (err) {
      console.error('保存视频进度到本地存储失败:', err);
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

  // 初始化
  const initFromLocalStorage = () => {
    // 加载本地存储的观看历史
    try {
      const savedHistory = localStorage.getItem('watch_history');
      if (savedHistory) {
        watchHistory.value = JSON.parse(savedHistory);
      }
    } catch (err) {
      console.error('从本地存储加载观看历史失败:', err);
    }
  };

  // 初始化时从本地存储加载数据
  initFromLocalStorage();

  // 检查网络状态，如果曾经设置了离线模式，尝试重新连接
  if (localStorage.getItem('offline_mode') === 'true') {
    // 尝试重新连接一次API服务器，如果成功则取消离线模式
    api
      .get('/ping')
      .then(() => {
        localStorage.removeItem('offline_mode');
        console.log('网络已恢复，已退出离线模式');
      })
      .catch(() => {
        console.log('网络仍不可用，保持离线模式');
      });
  }

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
    addVideoProgress,
    getVideoProgress,
    clearVideoProgressHistory,
    addToHistory,
    saveVideoProgress,
    initFromLocalStorage,
  };
});
