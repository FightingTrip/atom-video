/**
 * @file playlist/index.ts
 * @description 播放列表服务，提供播放列表相关的API操作
 * @author Atom Video Team
 * @date 2025-04-10
 */

import api from '@/services/api';
import { mockDelay } from '@/utils/mockData';
import type { ChannelPlaylist, ChannelVideo } from '@/types/channel';
import { getMockChannel } from '../channel/mock';
import { generateMockVideos } from '@/utils/mockData';

/**
 * 获取播放列表详情
 * @param playlistId 播放列表ID
 * @returns 播放列表详情
 */
export async function getPlaylistById(
  playlistId: string
): Promise<ChannelPlaylist & { channelId: string; userId: string }> {
  try {
    // 模拟数据生成
    await mockDelay(300, 800);

    // 随机选择一个频道
    const channelId = Math.random() > 0.5 ? '1' : '2';

    // 创建播放列表信息
    return {
      id: playlistId,
      channelId: channelId,
      userId: channelId === '1' ? '3' : '2', // 对应频道的用户ID
      title: '前端开发精选课程',
      description: '精选前端开发课程，包括HTML、CSS、JavaScript、Vue、React等主题的教程。',
      thumbnailUrl: 'https://picsum.photos/400/225?random=42',
      videoCount: 12,
      visibility: 'public',
      createdAt: '2024-01-15T08:30:00Z',
      updatedAt: '2025-03-10T14:45:00Z',
    };
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
export async function getPlaylistVideos(
  playlistId: string,
  page = 1,
  limit = 10
): Promise<{ videos: ChannelVideo[]; total: number; hasMore: boolean }> {
  try {
    // 模拟数据生成
    await mockDelay(200, 600);

    // 获取播放列表
    const playlist = await getPlaylistById(playlistId);

    // 获取频道信息
    const channel = getMockChannel(playlist.channelId);

    // 生成随机视频
    const totalVideos = Math.min(playlist.videoCount, 25); // 最多25个视频
    const allVideos = generateMockVideos(totalVideos, channel.userId).map(video => ({
      ...video,
      publishedAt: video.createdAt,
      publishDate: video.createdAt,
      status: 'published',
      visibility: 'public',
    })) as ChannelVideo[];

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, allVideos.length);
    const paginatedVideos = allVideos.slice(startIndex, endIndex);

    return {
      videos: paginatedVideos,
      total: allVideos.length,
      hasMore: endIndex < allVideos.length,
    };
  } catch (error) {
    console.error(`获取播放列表视频失败: ${playlistId}`, error);
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
    title: string;
    description?: string;
    visibility: 'public' | 'private' | 'unlisted';
  }
): Promise<ChannelPlaylist> {
  try {
    // 模拟更新
    await mockDelay(500, 1000);

    // 获取当前播放列表
    const playlist = await getPlaylistById(playlistId);

    // 更新数据
    return {
      ...playlist,
      title: data.title,
      description: data.description || playlist.description,
      visibility: data.visibility,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`更新播放列表失败: ${playlistId}`, error);
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
    // 模拟删除操作
    await mockDelay(300, 800);

    console.log(`已从播放列表 ${playlistId} 中移除视频 ${videoId}`);
    return true;
  } catch (error) {
    console.error(`从播放列表中移除视频失败: ${playlistId}, ${videoId}`, error);
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
    // 模拟添加操作
    await mockDelay(300, 800);

    console.log(`已添加视频 ${videoId} 到播放列表 ${playlistId}`);
    return true;
  } catch (error) {
    console.error(`添加视频到播放列表失败: ${playlistId}, ${videoId}`, error);
    throw error;
  }
}
