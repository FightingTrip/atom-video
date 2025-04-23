/**
 * @file video.ts
 * @description 用户视频服务
 */

import { Video } from '@/types';
import mockDb from '@/mock/mockDb';

// 获取模拟数据库实例
// const mockDb = new MockDb();

/**
 * 获取用户上传的视频
 * @param userId 用户ID
 * @param params 查询参数
 * @returns 用户上传的视频列表
 */
export async function getUserVideosList(
  userId: string,
  params: { page?: number; limit?: number } = {}
): Promise<{ videos: Video[]; total: number; hasMore: boolean }> {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 500) + 200));

    // 使用模拟数据库获取用户视频
    const result = mockDb.getCreatorVideos(userId, {
      page: params.page || 1,
      limit: params.limit || 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    return {
      videos: result.data,
      total: result.total,
      hasMore: (params.page || 1) * (params.limit || 10) < result.total,
    };
  } catch (error) {
    console.error('获取用户视频失败:', error);
    return { videos: [], total: 0, hasMore: false };
  }
}

/**
 * 获取用户收藏的视频
 * @param userId 用户ID
 * @param params 查询参数
 * @returns 用户收藏的视频列表
 */
export async function getUserFavoritesList(
  userId: string,
  params: { page?: number; limit?: number } = {}
): Promise<{ videos: Video[]; total: number; hasMore: boolean }> {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 500) + 200));

    // 使用模拟数据库获取用户收藏视频
    const result = mockDb.getUserFavorites(userId, {
      page: params.page || 1,
      limit: params.limit || 10,
    });

    return {
      videos: result.data,
      total: result.total,
      hasMore: (params.page || 1) * (params.limit || 10) < result.total,
    };
  } catch (error) {
    console.error('获取用户收藏视频失败:', error);
    return { videos: [], total: 0, hasMore: false };
  }
}

/**
 * 添加或删除收藏
 * @param videoId 视频ID
 * @param isFavorite 是否收藏
 * @returns 是否成功
 */
export async function toggleFavorite(videoId: string, isFavorite: boolean): Promise<boolean> {
  try {
    // 获取当前用户ID (这里应该从认证服务获取，临时使用固定ID)
    const userId = mockDb.getCurrentUserId() || 'u-user';

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 300) + 100));

    // 使用模拟数据库切换收藏状态
    mockDb.toggleVideoFavorite(userId, videoId);

    return true;
  } catch (error) {
    console.error(`${isFavorite ? '添加' : '删除'}收藏失败:`, error);
    return false;
  }
}

export default {
  getUserVideosList,
  getUserFavoritesList,
  toggleFavorite,
};
