import { defineStore } from 'pinia';
import type { Video, VideoResponse, Comment } from '@/types';
import { mockVideosApi, videoCategories } from '@/mock/videos';
import { ref, computed } from 'vue';
import api from '@/utils/api';

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

export const useVideoStore = defineStore('video', () => {
  // 状态
  const videos = ref<Video[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const pageSize = ref(12);
  const total = ref(0);
  const searchQuery = ref('');
  const selectedCategory = ref('all');
  const creators = ref<Creator[]>([]);
  const currentFilters = ref<SearchFilters>({
    timeRange: null,
    duration: null,
    sort: 'relevance',
  });

  // 用户相关状态 - 这些将被持久化
  const watchHistory = ref<Video[]>([]);
  const likedVideos = ref<string[]>([]);
  const savedVideos = ref<string[]>([]);

  // 计算属性
  const hasMore = computed(() => {
    return videos.value.length < total.value;
  });

  const allTags = computed(() => {
    const tags = new Set<string>();
    videos.value.forEach(video => {
      video.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  });

  const filteredVideos = computed(() => {
    let results = [...videos.value];

    // 应用搜索过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      results = results.filter(
        video =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 应用分类过滤
    if (selectedCategory.value !== 'all') {
      results = results.filter(video => video.category === selectedCategory.value);
    }

    // 应用时间范围过滤
    if (currentFilters.value.timeRange) {
      const now = new Date();
      const timeRangeMap: { [key: string]: Date } = {
        today: new Date(now.setHours(0, 0, 0, 0)),
        week: new Date(now.setDate(now.getDate() - 7)),
        month: new Date(now.setMonth(now.getMonth() - 1)),
        year: new Date(now.setFullYear(now.getFullYear() - 1)),
      };

      const startDate = timeRangeMap[currentFilters.value.timeRange];
      if (startDate) {
        results = results.filter(video => new Date(video.createdAt) >= startDate);
      }
    }

    // 应用时长过滤
    if (currentFilters.value.duration) {
      const durationMap: { [key: string]: [number, number] } = {
        short: [0, 300], // 0-5分钟
        medium: [300, 1200], // 5-20分钟
        long: [1200, Infinity], // 20+分钟
      };

      const [min, max] = durationMap[currentFilters.value.duration];
      results = results.filter(video => video.duration >= min && video.duration < max);
    }

    // 应用排序
    const sortMap: { [key: string]: (a: Video, b: Video) => number } = {
      relevance: (a, b) => {
        const queryInTitle = (v: Video) =>
          v.title.toLowerCase().includes(searchQuery.value.toLowerCase());
        return Number(queryInTitle(b)) - Number(queryInTitle(a));
      },
      date: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      views: (a, b) => b.views - a.views,
      likes: (a, b) => b.likes - a.likes,
    };

    if (currentFilters.value.sort) {
      results.sort(sortMap[currentFilters.value.sort]);
    }

    return results;
  });

  // 方法
  const fetchVideos = async () => {
    if (loading.value) return;

    try {
      loading.value = true;
      error.value = null;

      const response = await mockVideosApi.getVideos({
        page: currentPage.value,
        pageSize: pageSize.value,
        category: selectedCategory.value,
      });

      videos.value =
        currentPage.value === 1 ? response.videos : [...videos.value, ...response.videos];
      total.value = response.total;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载视频失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchCreators = async () => {
    try {
      // TODO: 替换为实际的API调用
      const response = await fetch('/api/creators');
      creators.value = await response.json();
    } catch (error) {
      console.error('获取创作者列表失败:', error);
    }
  };

  const loadMore = async () => {
    if (loading.value || !hasMore.value) return;
    currentPage.value++;
    await fetchVideos();
  };

  const setCategory = async (category: string) => {
    selectedCategory.value = category;
    currentPage.value = 1;
    await fetchVideos();
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
    currentPage.value = 1;
  };

  const reset = () => {
    videos.value = [];
    currentPage.value = 1;
    total.value = 0;
    loading.value = false;
    error.value = null;
    searchQuery.value = '';
    selectedCategory.value = 'all';
    currentFilters.value = {
      timeRange: null,
      duration: null,
      sort: 'relevance',
    };
  };

  const search = (query: string, filters: SearchFilters) => {
    searchQuery.value = query;
    currentFilters.value = filters;
    applyFilters();
  };

  const applyFilters = () => {
    let results = [...videos.value];

    // 应用搜索查询
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      results = results.filter(
        video =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 应用时间范围过滤
    if (currentFilters.value.timeRange) {
      const now = new Date();
      const timeRangeMap: { [key: string]: Date } = {
        today: new Date(now.setHours(0, 0, 0, 0)),
        week: new Date(now.setDate(now.getDate() - 7)),
        month: new Date(now.setMonth(now.getMonth() - 1)),
        year: new Date(now.setFullYear(now.getFullYear() - 1)),
      };

      const startDate = timeRangeMap[currentFilters.value.timeRange];
      if (startDate) {
        results = results.filter(video => new Date(video.createdAt) >= startDate);
      }
    }

    // 应用时长过滤
    if (currentFilters.value.duration) {
      const durationMap: { [key: string]: [number, number] } = {
        short: [0, 300], // 0-5分钟
        medium: [300, 1200], // 5-20分钟
        long: [1200, Infinity], // 20+分钟
      };

      const [min, max] = durationMap[currentFilters.value.duration];
      results = results.filter(video => video.duration >= min && video.duration < max);
    }

    // 应用排序
    const sortMap: { [key: string]: (a: Video, b: Video) => number } = {
      relevance: (a, b) => {
        const queryInTitle = (v: Video) =>
          v.title.toLowerCase().includes(searchQuery.value.toLowerCase());
        return Number(queryInTitle(b)) - Number(queryInTitle(a));
      },
      date: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      views: (a, b) => b.views - a.views,
      likes: (a, b) => b.likes - a.likes,
    };

    results.sort(sortMap[currentFilters.value.sort]);
    filteredVideos.value = results;
  };

  const searchVideos = async (query: string) => {
    if (!query.trim()) {
      videos.value = [];
      total.value = 0;
      return;
    }

    try {
      loading.value = true;
      error.value = null;
      searchQuery.value = query;

      // 使用现有的 getVideos 方法获取所有视频
      const response = await mockVideosApi.getVideos({
        page: 1,
        pageSize: 50,
        category: 'all',
      });

      // 在本地进行搜索过滤
      const filteredResults = response.videos.filter(
        video =>
          video.title.toLowerCase().includes(query.toLowerCase()) ||
          video.description.toLowerCase().includes(query.toLowerCase()) ||
          video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      videos.value = filteredResults;
      total.value = filteredResults.length;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '搜索视频失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 根据标签过滤视频
  const filterByTags = (tags: string[]) => {
    if (!tags.length) {
      return videos.value;
    }
    return videos.value.filter(video => tags.some(tag => video.tags.includes(tag)));
  };

  // 视频详情相关方法
  const getVideoById = async (id: string): Promise<Video | null> => {
    try {
      const response = await api.get(`/videos/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取视频详情失败:', error);
      return null;
    }
  };

  const getVideoComments = async (
    videoId: string,
    offset = 0
  ): Promise<{ comments: Comment[]; hasMore: boolean }> => {
    try {
      const response = await api.get(`/videos/${videoId}/comments`, {
        params: { offset, limit: 20 },
      });
      return response.data;
    } catch (error) {
      console.error('获取视频评论失败:', error);
      return { comments: [], hasMore: false };
    }
  };

  const getRecommendedVideos = async (videoId: string): Promise<Video[]> => {
    try {
      const response = await api.get(`/videos/${videoId}/recommendations`);
      return response.data;
    } catch (error) {
      console.error('获取推荐视频失败:', error);
      return [];
    }
  };

  // 增强的用户互动方法

  // 添加视频到历史记录
  const addToHistory = (video: Video) => {
    // 如果已经在历史记录中，先移除旧的记录
    const index = watchHistory.value.findIndex(v => v.id === video.id);
    if (index !== -1) {
      watchHistory.value.splice(index, 1);
    }

    // 添加到历史记录开头
    watchHistory.value.unshift(video);

    // 限制历史记录数量，最多保存50条
    if (watchHistory.value.length > 50) {
      watchHistory.value = watchHistory.value.slice(0, 50);
    }
  };

  // 从历史记录中移除视频
  const removeFromHistory = (videoId: string) => {
    watchHistory.value = watchHistory.value.filter(video => video.id !== videoId);
  };

  // 清空历史记录
  const clearHistory = () => {
    watchHistory.value = [];
  };

  // 切换视频点赞状态
  const toggleVideoLike = (videoId: string) => {
    const index = likedVideos.value.indexOf(videoId);
    if (index === -1) {
      likedVideos.value.push(videoId);

      // 更新视频列表中的点赞数
      const video = videos.value.find(v => v.id === videoId);
      if (video) {
        video.likes += 1;
      }
    } else {
      likedVideos.value.splice(index, 1);

      // 更新视频列表中的点赞数
      const video = videos.value.find(v => v.id === videoId);
      if (video) {
        video.likes = Math.max(0, video.likes - 1);
      }
    }

    return likedVideos.value.includes(videoId);
  };

  // 检查视频是否已点赞
  const isVideoLiked = (videoId: string) => {
    return likedVideos.value.includes(videoId);
  };

  // 切换视频收藏状态
  const toggleVideoFavorite = (videoId: string) => {
    const index = savedVideos.value.indexOf(videoId);
    if (index === -1) {
      savedVideos.value.push(videoId);

      // 更新视频列表中的收藏数
      const video = videos.value.find(v => v.id === videoId);
      if (video) {
        video.favorites += 1;
      }
    } else {
      savedVideos.value.splice(index, 1);

      // 更新视频列表中的收藏数
      const video = videos.value.find(v => v.id === videoId);
      if (video) {
        video.favorites = Math.max(0, video.favorites - 1);
      }
    }

    return savedVideos.value.includes(videoId);
  };

  // 检查视频是否已收藏
  const isVideoFavorited = (videoId: string) => {
    return savedVideos.value.includes(videoId);
  };

  // 获取历史记录
  const getHistory = () => {
    return watchHistory.value;
  };

  // 获取收藏视频
  const getFavorites = () => {
    return videos.value.filter(video => savedVideos.value.includes(video.id));
  };

  // 获取点赞视频
  const getLikedVideos = () => {
    return videos.value.filter(video => likedVideos.value.includes(video.id));
  };

  return {
    // 状态
    videos,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    searchQuery,
    selectedCategory,
    creators,
    currentFilters,
    watchHistory,
    likedVideos,
    savedVideos,
    allTags,

    // 计算属性
    hasMore,
    filteredVideos,

    // 方法
    fetchVideos,
    fetchCreators,
    loadMore,
    setCategory,
    setSearchQuery,
    reset,
    search,
    applyFilters,
    searchVideos,
    filterByTags,
    getVideoById,
    getVideoComments,
    getRecommendedVideos,
    toggleVideoLike,
    toggleVideoFavorite,
    isVideoLiked,
    isVideoFavorited,
    getHistory,
    getFavorites,
    getLikedVideos,
  };
});
