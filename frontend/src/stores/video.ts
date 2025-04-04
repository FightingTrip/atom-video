import { defineStore } from 'pinia';
import type { Video, VideoResponse } from '@/types';
import { mockVideosApi } from '@/mock/videos';

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
}

export const useVideoStore = defineStore('video', {
  state: (): VideoState => ({
    videos: [],
    currentPage: 1,
    pageSize: 12,
    total: 0,
    loading: false,
    error: null,
    selectedCategory: '全部',
    watchHistory: [],
    likedVideos: [],
    savedVideos: [],
  }),

  getters: {
    hasMore: state => {
      return state.videos.length < state.total;
    },

    filteredVideos: state => {
      if (state.selectedCategory === '全部') {
        return state.videos;
      }
      return state.videos.filter(video => video.category === state.selectedCategory);
    },
  },

  actions: {
    // 设置分类
    setCategory(category: string) {
      this.selectedCategory = category;
      this.videos = [];
      this.currentPage = 1;
      this.fetchVideos();
    },

    // 获取视频列表
    async fetchVideos() {
      if (this.loading) return;

      try {
        this.loading = true;
        this.error = null;

        const response = await mockVideosApi.getVideos({
          page: this.currentPage,
          pageSize: this.pageSize,
          category: this.selectedCategory,
        });

        // 更新状态
        this.videos =
          this.currentPage === 1 ? response.videos : [...this.videos, ...response.videos];
        this.total = response.total;

        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '加载视频失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 加载更多视频
    async loadMore() {
      if (this.loading || !this.hasMore) return;

      this.currentPage += 1;
      await this.fetchVideos();
    },

    // 重置状态
    reset() {
      this.videos = [];
      this.currentPage = 1;
      this.total = 0;
      this.loading = false;
      this.error = null;
      this.selectedCategory = '全部';
    },

    // 添加到观看历史
    addToHistory(videoId: string) {
      if (!this.watchHistory.includes(videoId)) {
        this.watchHistory.unshift(videoId);
        localStorage.setItem('watchHistory', JSON.stringify(this.watchHistory));
      }
    },

    // 切换喜欢状态
    toggleLike(videoId: string) {
      const index = this.likedVideos.indexOf(videoId);
      if (index === -1) {
        this.likedVideos.push(videoId);
      } else {
        this.likedVideos.splice(index, 1);
      }
      localStorage.setItem('likedVideos', JSON.stringify(this.likedVideos));
    },

    // 切换保存状态
    toggleSave(videoId: string) {
      const index = this.savedVideos.indexOf(videoId);
      if (index > -1) {
        this.savedVideos.splice(index, 1);
      } else {
        this.savedVideos.push(videoId);
      }
      localStorage.setItem('savedVideos', JSON.stringify(this.savedVideos));
    },

    // 初始化状态
    initialize() {
      const history = localStorage.getItem('watchHistory');
      const liked = localStorage.getItem('likedVideos');
      const saved = localStorage.getItem('savedVideos');

      if (history) this.watchHistory = JSON.parse(history);
      if (liked) this.likedVideos = JSON.parse(liked);
      if (saved) this.savedVideos = JSON.parse(saved);
    },
  },
});
