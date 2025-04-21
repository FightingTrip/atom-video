/**
 * @file index.ts
 * @description 频道服务，提供频道相关的API操作
 * @author Atom Video Team
 * @date 2025-04-08
 */

import api from '@/services/api';
import { mockDelay } from '@/utils/mockData';
import type {
  Channel,
  ChannelVideo,
  ChannelPlaylist,
  ChannelQueryParams,
  ChannelVideosQueryParams,
  CreateChannelRequest,
  UpdateChannelRequest,
  ChannelStats,
  CreatePlaylistRequest,
  ChannelSubscriber,
  ChannelListResponse,
  ChannelVideosResponse,
  ChannelPlaylistsResponse,
} from '@/types/channel';
import {
  generateMockChannels,
  getMockChannel,
  getMockChannelVideos,
  getMockChannelPlaylists,
} from './mock';

/**
 * 获取频道列表
 * @param params 查询参数
 * @returns 频道列表响应
 */
export async function getChannels(params: ChannelQueryParams = {}): Promise<ChannelListResponse> {
  try {
    // 模拟数据生成
    await mockDelay(300, 800);
    const mockResponse = generateMockChannels(params);
    return mockResponse;
  } catch (error) {
    console.error('获取频道列表失败', error);
    throw error;
  }
}

/**
 * 获取频道详情
 * @param channelId 频道ID
 * @returns 频道详情
 */
export async function getChannelById(channelId: string): Promise<Channel> {
  try {
    // 模拟数据生成
    await mockDelay(200, 600);
    return getMockChannel(channelId);
  } catch (error) {
    console.error(`获取频道详情失败: ${channelId}`, error);
    throw error;
  }
}

/**
 * 获取频道的视频列表
 * @param params 查询参数
 * @returns 频道视频列表响应
 */
export async function getChannelVideos(
  params: ChannelVideosQueryParams
): Promise<ChannelVideosResponse> {
  if (!params.channelId) {
    throw new Error('Channel ID is required');
  }

  try {
    // 模拟数据生成
    await mockDelay(300, 800);
    return getMockChannelVideos(params);
  } catch (error) {
    console.error(`获取频道视频列表失败: ${params.channelId}`, error);
    throw error;
  }
}

/**
 * 获取频道的播放列表
 * @param channelId 频道ID
 * @param page 页码
 * @param limit 每页数量
 * @returns 频道播放列表响应
 */
export async function getChannelPlaylists(
  channelId: string,
  page = 1,
  limit = 10
): Promise<ChannelPlaylistsResponse> {
  try {
    // 模拟数据生成
    await mockDelay(200, 600);
    return getMockChannelPlaylists(channelId, page, limit);
  } catch (error) {
    console.error(`获取频道播放列表失败: ${channelId}`, error);
    throw error;
  }
}

/**
 * 创建频道
 * @param data 创建频道请求
 * @returns 创建的频道
 */
export async function createChannel(data: CreateChannelRequest): Promise<Channel> {
  try {
    // 实际API调用
    // return await api.post<Channel>('/channels', data);

    // 模拟创建频道
    await mockDelay(800, 1500);
    const mockChannel: Channel = {
      id: `ch-${Date.now()}`,
      userId: 'user-1',
      name: data.name,
      handle: data.handle,
      description: data.description || '',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=' + data.name,
      coverUrl: 'https://picsum.photos/1200/300',
      subscriberCount: 0,
      videoCount: 0,
      totalViews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSubscribed: false,
    };
    return mockChannel;
  } catch (error) {
    console.error('创建频道失败', error);
    throw error;
  }
}

/**
 * 更新频道
 * @param channelId 频道ID
 * @param data 更新频道请求
 * @returns 更新后的频道
 */
export async function updateChannel(
  channelId: string,
  data: UpdateChannelRequest
): Promise<Channel> {
  try {
    // 实际API调用
    // return await api.put<Channel>(`/channels/${channelId}`, data);

    // 模拟更新频道
    await mockDelay(600, 1200);
    const channel = getMockChannel(channelId);

    const updatedChannel: Channel = {
      ...channel,
      ...(data.name && { name: data.name }),
      ...(data.handle && { handle: data.handle }),
      ...(data.description && { description: data.description }),
      ...(data.location && { location: data.location }),
      ...(data.socialLinks && { socialLinks: data.socialLinks }),
      ...(data.categories && { categories: data.categories }),
      ...(data.customization && { customization: data.customization }),
      updatedAt: new Date().toISOString(),
    };

    return updatedChannel;
  } catch (error) {
    console.error(`更新频道失败: ${channelId}`, error);
    throw error;
  }
}

/**
 * 订阅频道
 * @param channelId 频道ID
 * @returns 是否成功
 */
export async function subscribeChannel(channelId: string): Promise<boolean> {
  try {
    // 实际API调用
    // await api.post(`/channels/${channelId}/subscribe`);

    // 模拟订阅
    await mockDelay(200, 500);
    console.log(`已订阅频道: ${channelId}`);
    return true;
  } catch (error) {
    console.error(`订阅频道失败: ${channelId}`, error);
    throw error;
  }
}

/**
 * 取消订阅频道
 * @param channelId 频道ID
 * @returns 是否成功
 */
export async function unsubscribeChannel(channelId: string): Promise<boolean> {
  try {
    // 实际API调用
    // await api.delete(`/channels/${channelId}/subscribe`);

    // 模拟取消订阅
    await mockDelay(200, 500);
    console.log(`已取消订阅频道: ${channelId}`);
    return true;
  } catch (error) {
    console.error(`取消订阅频道失败: ${channelId}`, error);
    throw error;
  }
}

/**
 * 获取频道统计信息
 * @param channelId 频道ID
 * @returns 频道统计信息
 */
export async function getChannelStats(channelId: string): Promise<ChannelStats> {
  try {
    // 实际API调用
    // return await api.get<ChannelStats>(`/channels/${channelId}/stats`);

    // 模拟频道统计
    await mockDelay(300, 800);
    return {
      subscriberCount: Math.floor(Math.random() * 10000),
      videoCount: Math.floor(Math.random() * 100),
      totalViews: Math.floor(Math.random() * 1000000),
      subscriberGrowth: {
        day: Math.floor(Math.random() * 100),
        week: Math.floor(Math.random() * 500),
        month: Math.floor(Math.random() * 2000),
      },
      viewsGrowth: {
        day: Math.floor(Math.random() * 1000),
        week: Math.floor(Math.random() * 5000),
        month: Math.floor(Math.random() * 20000),
      },
    };
  } catch (error) {
    console.error(`获取频道统计失败: ${channelId}`, error);
    throw error;
  }
}

/**
 * 创建播放列表
 * @param channelId 频道ID
 * @param data 创建播放列表请求
 * @returns 创建的播放列表
 */
export async function createPlaylist(
  channelId: string,
  data: CreatePlaylistRequest
): Promise<ChannelPlaylist> {
  try {
    // 实际API调用
    // return await api.post<ChannelPlaylist>(`/channels/${channelId}/playlists`, data);

    // 模拟创建播放列表
    await mockDelay(600, 1200);
    return {
      id: `pl-${Date.now()}`,
      title: data.title,
      description: data.description || '',
      thumbnailUrl: 'https://picsum.photos/400/225',
      videoCount: data.videoIds?.length || 0,
      visibility: data.visibility,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`创建播放列表失败: ${channelId}`, error);
    throw error;
  }
}

export default {
  getChannels,
  getChannelById,
  getChannelVideos,
  getChannelPlaylists,
  createChannel,
  updateChannel,
  subscribeChannel,
  unsubscribeChannel,
  getChannelStats,
  createPlaylist,
};
