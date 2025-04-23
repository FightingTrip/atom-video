/**
 * @file playlist.ts
 * @description 播放列表状态管理
 * @author Atom Video Team
 * @date 2025-04-10
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Playlist } from '@/mock/models';
import { useToast } from '@/composables/useToast';
import * as playlistService from '@/services/playlist';

export const usePlaylistStore = defineStore('playlist', () => {
  const toast = useToast();

  // 状态
  const userPlaylists = ref<Playlist[]>([]);
  const currentPlaylist = ref<Playlist | null>(null);
  const playlistVideos = ref<any[]>([]); // 播放列表中的视频
  const loading = ref<boolean>(false);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // 计算属性
  const hasMoreVideos = computed(() => {
    return pagination.value.page < pagination.value.totalPages;
  });

  /**
   * 获取用户播放列表
   */
  async function fetchUserPlaylists(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      visibility?: 'public' | 'private' | 'unlisted' | 'all';
    } = {}
  ) {
    try {
      loading.value = true;
      const result = await playlistService.getUserPlaylists(params);
      userPlaylists.value = result.playlists;
      pagination.value = {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      };
      return result;
    } catch (error: any) {
      toast.error(error.message || '获取播放列表失败');
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 获取播放列表详情
   */
  async function fetchPlaylistDetail(playlistId: string) {
    try {
      loading.value = true;
      const playlist = await playlistService.getPlaylistById(playlistId);
      currentPlaylist.value = playlist;
      return playlist;
    } catch (error: any) {
      toast.error(error.message || '获取播放列表详情失败');
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 获取播放列表中的视频
   */
  async function fetchPlaylistVideos(playlistId: string, page = 1, limit = 10) {
    try {
      loading.value = true;
      const result = await playlistService.getPlaylistVideos(playlistId, page, limit);
      playlistVideos.value = result.videos;
      pagination.value = {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      };
      return result;
    } catch (error: any) {
      toast.error(error.message || '获取播放列表视频失败');
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 创建播放列表
   */
  async function createPlaylist(data: {
    title: string;
    description?: string;
    visibility: 'public' | 'private' | 'unlisted';
    videoIds?: string[];
  }) {
    try {
      loading.value = true;
      const playlist = await playlistService.createPlaylist(data);
      // 添加到用户播放列表
      userPlaylists.value.unshift(playlist);

      toast.success('播放列表已创建');

      return playlist;
    } catch (error: any) {
      toast.error(error.message || '创建播放列表失败');
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 更新播放列表
   */
  async function updatePlaylist(
    playlistId: string,
    data: {
      title?: string;
      description?: string;
      visibility?: 'public' | 'private' | 'unlisted';
    }
  ) {
    try {
      loading.value = true;
      const updatedPlaylist = await playlistService.updatePlaylist(playlistId, data);

      // 更新当前播放列表
      if (currentPlaylist.value && currentPlaylist.value.id === playlistId) {
        currentPlaylist.value = updatedPlaylist;
      }

      // 更新用户播放列表中的对应项
      const index = userPlaylists.value.findIndex(p => p.id === playlistId);
      if (index !== -1) {
        userPlaylists.value[index] = updatedPlaylist;
      }

      toast.success('播放列表已更新');

      return updatedPlaylist;
    } catch (error: any) {
      toast.error(error.message || '更新播放列表失败');
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 删除播放列表
   */
  async function deletePlaylist(playlistId: string) {
    try {
      loading.value = true;
      await playlistService.deletePlaylist(playlistId);

      // 从用户播放列表中移除
      userPlaylists.value = userPlaylists.value.filter(p => p.id !== playlistId);

      // 如果当前显示的是被删除的播放列表，则清空
      if (currentPlaylist.value && currentPlaylist.value.id === playlistId) {
        currentPlaylist.value = null;
        playlistVideos.value = [];
      }

      toast.success('播放列表已删除');

      return true;
    } catch (error: any) {
      toast.error(error.message || '删除播放列表失败');
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 添加视频到播放列表
   */
  async function addVideoToPlaylist(playlistId: string, videoId: string) {
    try {
      loading.value = true;
      await playlistService.addVideoToPlaylist(playlistId, videoId);

      // 更新播放列表计数
      const index = userPlaylists.value.findIndex(p => p.id === playlistId);
      if (index !== -1) {
        userPlaylists.value[index].videoCount += 1;
      }

      // 如果当前显示的是这个播放列表，则刷新视频列表
      if (currentPlaylist.value && currentPlaylist.value.id === playlistId) {
        currentPlaylist.value.videoCount += 1;
        // 不立即刷新视频列表，等用户主动刷新
      }

      toast.success('视频已添加到播放列表');

      return true;
    } catch (error: any) {
      toast.error(error.message || '添加视频失败');
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 从播放列表中移除视频
   */
  async function removeVideoFromPlaylist(playlistId: string, videoId: string) {
    try {
      loading.value = true;
      await playlistService.removeVideoFromPlaylist(playlistId, videoId);

      // 从播放列表视频中移除
      if (currentPlaylist.value && currentPlaylist.value.id === playlistId) {
        playlistVideos.value = playlistVideos.value.filter(v => v.id !== videoId);
        currentPlaylist.value.videoCount -= 1;
      }

      // 更新播放列表计数
      const index = userPlaylists.value.findIndex(p => p.id === playlistId);
      if (index !== -1) {
        userPlaylists.value[index].videoCount -= 1;
      }

      toast.success('视频已从播放列表中移除');

      return true;
    } catch (error: any) {
      toast.error(error.message || '移除视频失败');
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 更新视频在播放列表中的位置
   */
  async function updateVideoPosition(playlistId: string, videoId: string, newPosition: number) {
    try {
      loading.value = true;
      await playlistService.updateVideoPosition(playlistId, videoId, newPosition);

      // 更新本地视频顺序（可选，也可以刷新列表）
      if (currentPlaylist.value && currentPlaylist.value.id === playlistId) {
        // 找到视频在列表中的当前位置
        const videoIndex = playlistVideos.value.findIndex(v => v.id === videoId);
        if (videoIndex !== -1) {
          // 克隆要移动的视频
          const videoToMove = { ...playlistVideos.value[videoIndex] };

          // 从列表中移除该视频
          playlistVideos.value.splice(videoIndex, 1);

          // 在新位置插入
          playlistVideos.value.splice(newPosition - 1, 0, videoToMove);

          // 更新所有视频的位置属性
          playlistVideos.value = playlistVideos.value.map((video, index) => ({
            ...video,
            position: index + 1,
          }));
        }
      }

      toast.success('视频位置已更新');

      return true;
    } catch (error: any) {
      toast.error(error.message || '更新视频位置失败');
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 设置播放列表缩略图
   */
  async function setPlaylistThumbnail(playlistId: string, thumbnailUrl: string) {
    try {
      loading.value = true;
      await playlistService.setPlaylistThumbnail(playlistId, thumbnailUrl);

      // 更新缩略图
      if (currentPlaylist.value && currentPlaylist.value.id === playlistId) {
        currentPlaylist.value.thumbnailUrl = thumbnailUrl;
      }

      // 更新用户播放列表中的对应项
      const index = userPlaylists.value.findIndex(p => p.id === playlistId);
      if (index !== -1) {
        userPlaylists.value[index].thumbnailUrl = thumbnailUrl;
      }

      toast.success('播放列表缩略图已更新');

      return true;
    } catch (error: any) {
      toast.error(error.message || '更新缩略图失败');
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 清空状态
   */
  function resetState() {
    userPlaylists.value = [];
    currentPlaylist.value = null;
    playlistVideos.value = [];
    loading.value = false;
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    };
  }

  return {
    // 状态
    userPlaylists,
    currentPlaylist,
    playlistVideos,
    loading,
    pagination,

    // 计算属性
    hasMoreVideos,

    // 方法
    fetchUserPlaylists,
    fetchPlaylistDetail,
    fetchPlaylistVideos,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updateVideoPosition,
    setPlaylistThumbnail,
    resetState,
  };
});
