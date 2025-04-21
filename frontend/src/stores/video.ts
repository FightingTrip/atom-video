/**
 * @file video.ts
 * @description 视频数据状态管理
 */
import { defineStore } from 'pinia';
import type { Video, VideoResponse, Comment } from '@/types';
import { mockVideosApi, videoCategories } from '@/mock/videos';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import videoService from '@/services/videoService';
import { useUserStore } from './user';

interface VideoState {
  videos: Video[];
  currentPage: number;
  pageSize: number;
  total: number;
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  watchHistory: string[];
  likedVideos: string[];
  savedVideos: string[];
  creators: Creator[];
  filteredVideos: Video[];
  searchQuery: string;
  currentFilters: SearchFilters;
  allTags: string[];
}

export interface Creator {
  id: string;
  name: string;
  avatarUrl: string;
}

interface SearchFilters {
  timeRange: string | null;
  duration: string | null;
  sort: string;
}

// 扩展Video类型添加category属性
interface ExtendedVideo extends Video {
  category?: string;
}

export const useVideoStore = defineStore('video', () => {
  // 用户存储
  const userStore = useUserStore();

  // 状态
  const videos = ref<Video[]>([]);
  const currentVideo = ref<Video | null>(null);
  const recommendedVideos = ref<Video[]>([]);
  const watchHistory = ref<Video[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchKeyword = ref('');
  const selectedCategory = ref('全部');
  const interactionState = ref<VideoInteraction>({
    isLiked: false,
    isFavorited: false,
    isSubscribed: false,
  });
  const playbackProgress = ref<VideoProgress | null>(null);
  const hasMoreVideos = ref(false);

  // 获取视频列表
  async function fetchVideos(limit?: number, params?: VideoSearchParams) {
    loading.value = true;
    error.value = null;

    try {
      const result = await videoService.getVideos(limit, params);
      videos.value = result.videos;
      hasMoreVideos.value = result.hasMore;
    } catch (err) {
      console.error('获取视频列表失败:', err);
      error.value = '获取视频列表失败';
    } finally {
      loading.value = false;
    }
  }

  // 获取推荐视频
  async function fetchRecommendedVideos(excludeVideoId?: string, limit?: number) {
    try {
      const recommended = await videoService.getRecommendedVideos(excludeVideoId, limit);
      recommendedVideos.value = recommended;
    } catch (err) {
      console.error('获取推荐视频失败:', err);
    }
  }

  // 获取单个视频
  async function fetchVideoById(videoId: string) {
    loading.value = true;
    error.value = null;

    try {
      const userId = userStore.currentUser?.id;
      const video = await videoService.getVideoById(videoId, userId);

      if (video) {
        currentVideo.value = video;

        // 如果用户已登录，获取互动状态
        if (userId) {
          // 获取互动状态
          interactionState.value = videoService.getVideoInteraction(userId, videoId);

          // 获取播放进度
          playbackProgress.value = videoService.getPlaybackProgress(userId, videoId);
        }

        // 获取推荐视频
        await fetchRecommendedVideos(videoId);
      } else {
        error.value = '视频不存在';
      }
    } catch (err) {
      console.error(`获取视频 ${videoId} 失败:`, err);
      error.value = '获取视频失败';
    } finally {
      loading.value = false;
    }
  }

  // 点赞/取消点赞视频
  async function toggleLike() {
    if (!userStore.currentUser || !currentVideo.value) return;

    const userId = userStore.currentUser.id;
    const videoId = currentVideo.value.id;
    const newLikeState = !interactionState.value.isLiked;

    // 乐观更新 UI
    interactionState.value.isLiked = newLikeState;

    // 调用服务更新点赞状态
    const success = await videoService.likeVideo(userId, videoId, newLikeState);

    if (!success) {
      // 如果失败，恢复原状态
      interactionState.value.isLiked = !newLikeState;
    }
  }

  // 收藏/取消收藏视频
  async function toggleFavorite() {
    if (!userStore.currentUser || !currentVideo.value) return;

    const userId = userStore.currentUser.id;
    const videoId = currentVideo.value.id;
    const newFavoriteState = !interactionState.value.isFavorited;

    // 乐观更新 UI
    interactionState.value.isFavorited = newFavoriteState;

    // 调用服务更新收藏状态
    const success = await videoService.favoriteVideo(userId, videoId, newFavoriteState);

    if (!success) {
      // 如果失败，恢复原状态
      interactionState.value.isFavorited = !newFavoriteState;
    }
  }

  // 订阅/取消订阅创作者
  async function toggleSubscribe() {
    if (!userStore.currentUser || !currentVideo.value) return;

    const userId = userStore.currentUser.id;
    const creatorId = currentVideo.value.author.id;
    const newSubscribeState = !interactionState.value.isSubscribed;

    // 乐观更新 UI
    interactionState.value.isSubscribed = newSubscribeState;

    // 调用服务更新订阅状态
    const success = await videoService.subscribeToCreator(userId, creatorId, newSubscribeState);

    if (!success) {
      // 如果失败，恢复原状态
      interactionState.value.isSubscribed = !newSubscribeState;
    }
  }

  // 保存视频播放进度
  function saveProgress(currentTime: number, duration: number) {
    if (!userStore.currentUser || !currentVideo.value) return;

    const userId = userStore.currentUser.id;
    const videoId = currentVideo.value.id;

    videoService.savePlaybackProgress(userId, videoId, currentTime, duration);

    // 更新本地状态
    playbackProgress.value = {
      videoId,
      currentTime,
      duration,
      lastUpdated: new Date().toISOString(),
      percentage: Math.floor((currentTime / duration) * 100),
    };
  }

  // 获取用户观看历史
  async function fetchWatchHistory(limit?: number) {
    if (!userStore.currentUser) return;

    try {
      const history = await videoService.getUserWatchHistory(userStore.currentUser.id, limit);
      watchHistory.value = history;
    } catch (err) {
      console.error('获取观看历史失败:', err);
    }
  }

  // 搜索视频
  async function searchVideos(keyword: string) {
    searchKeyword.value = keyword;

    if (!keyword.trim()) {
      await fetchVideos();
      return;
    }

    await fetchVideos(undefined, { keyword });
  }

  // 按分类筛选视频
  async function filterByCategory(category: string) {
    selectedCategory.value = category;

    if (category === '全部') {
      await fetchVideos();
      return;
    }

    await fetchVideos(undefined, { tags: [category] });
  }

  // 清除当前视频
  function clearCurrentVideo() {
    currentVideo.value = null;
    interactionState.value = {
      isLiked: false,
      isFavorited: false,
      isSubscribed: false,
    };
    playbackProgress.value = null;
  }

  // 导出状态和方法
  return {
    // 状态
    videos,
    currentVideo,
    recommendedVideos,
    watchHistory,
    loading,
    error,
    searchKeyword,
    selectedCategory,
    interactionState,
    playbackProgress,
    hasMoreVideos,

    // 方法
    fetchVideos,
    fetchRecommendedVideos,
    fetchVideoById,
    toggleLike,
    toggleFavorite,
    toggleSubscribe,
    saveProgress,
    fetchWatchHistory,
    searchVideos,
    filterByCategory,
    clearCurrentVideo,
  };
});
