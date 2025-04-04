import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Video } from '@/types';

export const useVideoStore = defineStore('video', () => {
  const watchHistory = ref<string[]>([]);
  const likedVideos = ref<string[]>([]);
  const savedVideos = ref<string[]>([]);

  // 添加到观看历史
  const addToHistory = (videoId: string) => {
    if (!watchHistory.value.includes(videoId)) {
      watchHistory.value.unshift(videoId);
    }
  };

  // 切换视频喜欢状态
  const toggleLike = (videoId: string) => {
    const index = likedVideos.value.indexOf(videoId);
    if (index === -1) {
      likedVideos.value.push(videoId);
    } else {
      likedVideos.value.splice(index, 1);
    }
  };

  // 切换视频保存状态
  const toggleSave = (videoId: string) => {
    const index = savedVideos.value.indexOf(videoId);
    if (index > -1) {
      savedVideos.value.splice(index, 1);
    } else {
      savedVideos.value.push(videoId);
    }
    localStorage.setItem('savedVideos', JSON.stringify(savedVideos.value));
  };

  // 初始化状态
  const initialize = () => {
    const history = localStorage.getItem('watchHistory');
    const liked = localStorage.getItem('likedVideos');
    const saved = localStorage.getItem('savedVideos');

    if (history) watchHistory.value = JSON.parse(history);
    if (liked) likedVideos.value = JSON.parse(liked);
    if (saved) savedVideos.value = JSON.parse(saved);
  };

  // 初始化
  initialize();

  return {
    watchHistory,
    likedVideos,
    savedVideos,
    addToHistory,
    toggleLike,
    toggleSave,
  };
});
