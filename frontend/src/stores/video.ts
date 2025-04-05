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

  const toggleVideoLike = async (videoId: string): Promise<boolean> => {
    try {
      const response = await api.post(`/videos/${videoId}/like`);
      return response.data.liked;
    } catch (error) {
      console.error('视频点赞操作失败:', error);
      return false;
    }
  };

  const toggleVideoFavorite = async (videoId: string): Promise<boolean> => {
    try {
      const response = await api.post(`/videos/${videoId}/favorite`);
      return response.data.favorited;
    } catch (error) {
      console.error('视频收藏操作失败:', error);
      return false;
    }
  };

  const toggleAuthorFollow = async (authorId: string): Promise<boolean> => {
    try {
      const response = await api.post(`/users/${authorId}/follow`);
      return response.data.followed;
    } catch (error) {
      console.error('关注作者操作失败:', error);
      return false;
    }
  };

  const postComment = async (videoId: string, content: string): Promise<Comment> => {
    try {
      const response = await api.post(`/videos/${videoId}/comments`, { content });
      return response.data;
    } catch (error) {
      console.error('发表评论失败:', error);
      throw error;
    }
  };

  const replyComment = async (
    videoId: string,
    commentId: string,
    content: string,
    replyToId?: string
  ): Promise<Comment> => {
    try {
      const response = await api.post(`/videos/${videoId}/comments/${commentId}/replies`, {
        content,
        replyToId,
      });
      return response.data;
    } catch (error) {
      console.error('回复评论失败:', error);
      throw error;
    }
  };

  const toggleCommentLike = async (commentId: string): Promise<boolean> => {
    try {
      const response = await api.post(`/comments/${commentId}/like`);
      return response.data.liked;
    } catch (error) {
      console.error('评论点赞操作失败:', error);
      return false;
    }
  };

  // 获取视频列表
  const getVideos = async (page = 1, category?: string): Promise<VideoResponse> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.get('/videos', {
        params: { page, category },
      });
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取视频列表失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取趋势视频
  const getTrendingVideos = async (): Promise<Video[]> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.get('/videos/trending');
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取趋势视频失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取推荐视频
  const getRecommendedVideos = async (page = 1): Promise<VideoResponse> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.get('/videos/recommended', {
        params: { page },
      });
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取推荐视频失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取收藏视频
  const getLibraryVideos = async (page = 1): Promise<VideoResponse> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.get('/videos/library', {
        params: { page },
      });
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取收藏视频失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取观看历史
  const getHistory = async (): Promise<Video[]> => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.get('/videos/history');
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取观看历史失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 清除观看历史
  const clearHistory = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      await api.delete('/videos/history');
    } catch (err) {
      error.value = err instanceof Error ? err.message : '清除观看历史失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 从历史记录中移除视频
  const removeFromHistory = async (videoId: string): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      await api.delete(`/videos/history/${videoId}`);
    } catch (err) {
      error.value = err instanceof Error ? err.message : '移除视频失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 收藏/取消收藏视频
  const toggleFavorite = async (videoId: string): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      await api.post(`/videos/${videoId}/favorite`);
    } catch (err) {
      error.value = err instanceof Error ? err.message : '操作失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 点赞/取消点赞视频
  const toggleLike = async (videoId: string): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      await api.post(`/videos/${videoId}/like`);
    } catch (err) {
      error.value = err instanceof Error ? err.message : '操作失败';
      throw err;
    } finally {
      loading.value = false;
    }
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
    toggleAuthorFollow,
    postComment,
    replyComment,
    toggleCommentLike,
    getVideos,
    getTrendingVideos,
    getLibraryVideos,
    getHistory,
    clearHistory,
    removeFromHistory,
    toggleFavorite,
    toggleLike,
  };
});
