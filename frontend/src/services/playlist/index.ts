/**
 * @file playlist/index.ts
 * @description 播放列表服务，提供播放列表相关的API操作
 * @author Atom Video Team
 * @date 2025-04-10
 */

import api from '@/services/api';
import { mockDelay } from '@/utils/mockInitializer';
import type { Playlist } from '@/mock/models';
import mockDb from '@/mock/mockDb';

/**
 * 获取用户播放列表
 * @param params 查询参数
 * @returns 播放列表列表
 */
export async function getUserPlaylists(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    visibility?: 'public' | 'private' | 'unlisted' | 'all';
  } = {}
) {
  try {
    await mockDelay();

    // 从localStorage获取用户token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未授权，请先登录');
    }

    // 获取用户ID
    const userId = mockDb.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('无效的用户令牌');
    }

    // 获取用户播放列表
    const result = mockDb.getUserPlaylists(userId, params);

    return {
      playlists: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasMore: result.page < result.totalPages,
    };
  } catch (error) {
    console.error('获取用户播放列表失败', error);
    throw error;
  }
}

/**
 * 获取播放列表详情
 * @param playlistId 播放列表ID
 * @returns 播放列表详情
 */
export async function getPlaylistById(playlistId: string): Promise<Playlist> {
  try {
    await mockDelay();

    const playlist = mockDb.getPlaylistById(playlistId);
    if (!playlist) {
      throw new Error('播放列表不存在');
    }

    return playlist;
  } catch (error) {
    console.error(`获取播放列表详情失败: ${playlistId}`, error);
    throw error;
  }
}

/**
 * 获取播放列表中的视频
 * @param playlistId 播放列表ID
 * @param page 页码
 * @param limit 每页数量
 * @returns 视频列表响应
 */
export async function getPlaylistVideos(playlistId: string, page = 1, limit = 10) {
  try {
    await mockDelay();

    const result = mockDb.getPlaylistVideos(playlistId, { page, limit });

    return {
      videos: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasMore: result.page < result.totalPages,
    };
  } catch (error) {
    console.error(`获取播放列表视频失败: ${playlistId}`, error);
    throw error;
  }
}

/**
 * 创建播放列表
 * @param data 播放列表数据
 * @returns 创建的播放列表
 */
export async function createPlaylist(data: {
  title: string;
  description?: string;
  visibility: 'public' | 'private' | 'unlisted';
  videoIds?: string[];
}): Promise<Playlist> {
  try {
    await mockDelay();

    // 从localStorage获取用户token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未授权，请先登录');
    }

    // 获取用户ID
    const userId = mockDb.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('无效的用户令牌');
    }

    // 创建播放列表
    const playlist = mockDb.createPlaylist(userId, data);

    return playlist;
  } catch (error) {
    console.error('创建播放列表失败', error);
    throw error;
  }
}

/**
 * 更新播放列表
 * @param playlistId 播放列表ID
 * @param data 更新数据
 * @returns 更新后的播放列表
 */
export async function updatePlaylist(
  playlistId: string,
  data: {
    title?: string;
    description?: string;
    visibility?: 'public' | 'private' | 'unlisted';
  }
): Promise<Playlist> {
  try {
    await mockDelay();

    // 从localStorage获取用户token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未授权，请先登录');
    }

    // 获取用户ID
    const userId = mockDb.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('无效的用户令牌');
    }

    // 更新播放列表
    const result = mockDb.updatePlaylist(playlistId, userId, data);

    if (!result.success) {
      throw new Error(result.error || '更新播放列表失败');
    }

    return result.playlist as Playlist;
  } catch (error) {
    console.error(`更新播放列表失败: ${playlistId}`, error);
    throw error;
  }
}

/**
 * 删除播放列表
 * @param playlistId 播放列表ID
 * @returns 是否成功
 */
export async function deletePlaylist(playlistId: string): Promise<boolean> {
  try {
    await mockDelay();

    // 从localStorage获取用户token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未授权，请先登录');
    }

    // 获取用户ID
    const userId = mockDb.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('无效的用户令牌');
    }

    // 删除播放列表
    const result = mockDb.deletePlaylist(playlistId, userId);

    if (!result.success) {
      throw new Error(result.error || '删除播放列表失败');
    }

    return true;
  } catch (error) {
    console.error(`删除播放列表失败: ${playlistId}`, error);
    throw error;
  }
}

/**
 * 添加视频到播放列表
 * @param playlistId 播放列表ID
 * @param videoId 视频ID
 * @returns 是否成功
 */
export async function addVideoToPlaylist(playlistId: string, videoId: string): Promise<boolean> {
  try {
    await mockDelay();

    // 从localStorage获取用户token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未授权，请先登录');
    }

    // 获取用户ID
    const userId = mockDb.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('无效的用户令牌');
    }

    // 添加视频到播放列表
    const result = mockDb.addVideoToPlaylist(playlistId, videoId, userId);

    if (!result.success) {
      throw new Error(result.error || '添加视频到播放列表失败');
    }

    return true;
  } catch (error) {
    console.error(`添加视频到播放列表失败: ${playlistId}, ${videoId}`, error);
    throw error;
  }
}

/**
 * 从播放列表中移除视频
 * @param playlistId 播放列表ID
 * @param videoId 视频ID
 * @returns 是否成功
 */
export async function removeVideoFromPlaylist(
  playlistId: string,
  videoId: string
): Promise<boolean> {
  try {
    await mockDelay();

    // 从localStorage获取用户token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未授权，请先登录');
    }

    // 获取用户ID
    const userId = mockDb.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('无效的用户令牌');
    }

    // 从播放列表中移除视频
    const result = mockDb.removeVideoFromPlaylist(playlistId, videoId, userId);

    if (!result.success) {
      throw new Error(result.error || '从播放列表中移除视频失败');
    }

    return true;
  } catch (error) {
    console.error(`从播放列表中移除视频失败: ${playlistId}, ${videoId}`, error);
    throw error;
  }
}

/**
 * 更新视频在播放列表中的位置
 * @param playlistId 播放列表ID
 * @param videoId 视频ID
 * @param newPosition 新位置
 * @returns 是否成功
 */
export async function updateVideoPosition(
  playlistId: string,
  videoId: string,
  newPosition: number
): Promise<boolean> {
  try {
    await mockDelay();

    // 从localStorage获取用户token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未授权，请先登录');
    }

    // 获取用户ID
    const userId = mockDb.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('无效的用户令牌');
    }

    // 更新视频位置
    const result = mockDb.updateVideoPosition(playlistId, videoId, newPosition, userId);

    if (!result.success) {
      throw new Error(result.error || '更新视频位置失败');
    }

    return true;
  } catch (error) {
    console.error(`更新视频位置失败: ${playlistId}, ${videoId}, ${newPosition}`, error);
    throw error;
  }
}

/**
 * 设置播放列表缩略图
 * @param playlistId 播放列表ID
 * @param thumbnailUrl 缩略图URL
 * @returns 是否成功
 */
export async function setPlaylistThumbnail(
  playlistId: string,
  thumbnailUrl: string
): Promise<boolean> {
  try {
    await mockDelay();

    // 从localStorage获取用户token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未授权，请先登录');
    }

    // 获取用户ID
    const userId = mockDb.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('无效的用户令牌');
    }

    // 设置播放列表缩略图
    const result = mockDb.setPlaylistThumbnail(playlistId, thumbnailUrl, userId);

    if (!result.success) {
      throw new Error(result.error || '设置播放列表缩略图失败');
    }

    return true;
  } catch (error) {
    console.error(`设置播放列表缩略图失败: ${playlistId}`, error);
    throw error;
  }
}

/**
 * 分享播放列表
 * @param playlistId 播放列表ID
 * @param shareData 分享数据
 * @returns 分享结果
 */
export async function sharePlaylist(
  playlistId: string,
  shareData: {
    shareType: 'link' | 'social';
    platform?: 'wechat' | 'weibo' | 'qq';
    emailAddresses?: string[];
  }
): Promise<{ shareLink: string; platform?: string; shareType: string }> {
  try {
    await mockDelay();

    // 从localStorage获取用户token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未授权，请先登录');
    }

    // 获取用户ID
    const userId = mockDb.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('无效的用户令牌');
    }

    // 调用API
    const response = await api.post(`/api/playlists/${playlistId}/share`, shareData);

    return response.data.data;
  } catch (error) {
    console.error(`分享播放列表失败: ${playlistId}`, error);
    throw error;
  }
}

/**
 * 批量更新播放列表中视频的位置
 * @param playlistId 播放列表ID
 * @param videoPositions 视频位置数组，每个元素包含videoId和position
 * @returns 是否成功
 */
export async function updatePlaylistVideoPositions(
  playlistId: string,
  videoPositions: Array<{ videoId: string; position: number }>
): Promise<boolean> {
  try {
    await mockDelay();

    // 从localStorage获取用户token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('未授权，请先登录');
    }

    // 获取用户ID
    const userId = mockDb.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('无效的用户令牌');
    }

    // 调用API进行批量更新
    const response = await api.post(`/api/playlists/${playlistId}/videos/positions`, {
      videoPositions,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || '批量更新视频位置失败');
    }

    return true;
  } catch (error) {
    console.error(`批量更新播放列表视频位置失败: ${playlistId}`, error);
    throw error;
  }
}

// 导出所有函数
export default {
  getUserPlaylists,
  getPlaylistById,
  getPlaylistVideos,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  updateVideoPosition,
  updatePlaylistVideoPositions,
  setPlaylistThumbnail,
  sharePlaylist,
};
