/**
 * @file mock.ts
 * @description 频道模拟数据生成
 * @author Atom Video Team
 * @date 2025-04-08
 */

import { mockVideos } from '@/utils/mockData';
import type {
  Channel,
  ChannelVideo,
  ChannelPlaylist,
  ChannelQueryParams,
  ChannelVideosQueryParams,
  ChannelListResponse,
  ChannelVideosResponse,
  ChannelPlaylistsResponse,
} from '@/types/channel';
import type { VideoInfo } from '@/types/video';

// 社交平台图标映射
const socialPlatforms = [
  'GitHub',
  'Twitter',
  'Youtube',
  'Facebook',
  'Instagram',
  'LinkedIn',
  'Twitch',
  'Discord',
];

// 模拟频道数据
const mockChannels: Channel[] = [
  {
    id: '1',
    userId: '3',
    name: 'Atom 技术频道',
    handle: 'atomtech',
    description:
      '这是一个专注于分享编程和技术内容的频道，主要涵盖前端、后端、人工智能等多个领域的知识分享。欢迎订阅！',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=AT&backgroundColor=4355db',
    coverUrl: 'https://picsum.photos/1200/300?random=1',
    subscriberCount: 12500,
    videoCount: 87,
    totalViews: 1250000,
    createdAt: '2022-01-15T08:00:00Z',
    updatedAt: '2025-03-10T14:30:00Z',
    location: '中国',
    verified: true,
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/atomtech' },
      { platform: 'Twitter', url: 'https://twitter.com/atomtech' },
    ],
    isSubscribed: false,
  },
  {
    id: '2',
    userId: '2',
    name: '前端开发者',
    handle: 'frontenddev',
    description: '分享前端开发的最新技术、框架和工具，帮助开发者提升技能。',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=FD&backgroundColor=10b981',
    coverUrl: 'https://picsum.photos/1200/300?random=2',
    subscriberCount: 35800,
    videoCount: 142,
    totalViews: 4320000,
    createdAt: '2023-05-20T10:15:00Z',
    updatedAt: '2025-04-01T09:45:00Z',
    location: '美国',
    verified: true,
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/frontenddev' },
      { platform: 'Twitter', url: 'https://twitter.com/frontenddev' },
      { platform: 'Youtube', url: 'https://youtube.com/frontenddev' },
    ],
    isSubscribed: true,
  },
  {
    id: '3',
    userId: '1',
    name: 'AI研究实验室',
    handle: 'airesearch',
    description: '探索人工智能和机器学习的前沿研究，分享最新技术进展和应用案例。',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=AI&backgroundColor=f59e0b',
    coverUrl: 'https://picsum.photos/1200/300?random=3',
    subscriberCount: 56200,
    videoCount: 98,
    totalViews: 8750000,
    createdAt: '2023-02-10T14:20:00Z',
    updatedAt: '2025-03-28T16:30:00Z',
    location: '英国',
    verified: true,
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/airesearch' },
      { platform: 'Twitter', url: 'https://twitter.com/airesearch' },
    ],
    isSubscribed: false,
  },
];

// 模拟播放列表数据
const mockPlaylists: Record<string, ChannelPlaylist[]> = {
  '1': [
    {
      id: 'pl-1-1',
      title: 'Vue 3 完全指南',
      description: '从零开始学习Vue 3的所有核心概念和高级特性',
      thumbnailUrl: 'https://picsum.photos/400/225?random=11',
      videoCount: 15,
      visibility: 'public',
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2025-03-10T14:30:00Z',
    },
    {
      id: 'pl-1-2',
      title: 'TypeScript 进阶教程',
      description: 'TypeScript高级类型、泛型和装饰器等进阶用法',
      thumbnailUrl: 'https://picsum.photos/400/225?random=12',
      videoCount: 10,
      visibility: 'public',
      createdAt: '2024-02-20T10:15:00Z',
      updatedAt: '2025-03-15T09:45:00Z',
    },
    {
      id: 'pl-1-3',
      title: 'Web性能优化',
      description: '现代Web应用性能优化策略和最佳实践',
      thumbnailUrl: 'https://picsum.photos/400/225?random=13',
      videoCount: 8,
      visibility: 'public',
      createdAt: '2024-03-05T14:20:00Z',
      updatedAt: '2025-03-20T16:30:00Z',
    },
  ],
  '2': [
    {
      id: 'pl-2-1',
      title: 'React 18新特性详解',
      description: 'React 18的并发模式、Suspense和Server Components等新特性',
      thumbnailUrl: 'https://picsum.photos/400/225?random=21',
      videoCount: 12,
      visibility: 'public',
      createdAt: '2024-01-10T09:30:00Z',
      updatedAt: '2025-02-15T11:20:00Z',
    },
    {
      id: 'pl-2-2',
      title: 'CSS现代布局技术',
      description: 'Flexbox、Grid等现代CSS布局技术的实际应用',
      thumbnailUrl: 'https://picsum.photos/400/225?random=22',
      videoCount: 8,
      visibility: 'public',
      createdAt: '2024-02-05T13:45:00Z',
      updatedAt: '2025-03-10T15:30:00Z',
    },
  ],
  '3': [
    {
      id: 'pl-3-1',
      title: '机器学习基础',
      description: '机器学习算法及应用的基础知识',
      thumbnailUrl: 'https://picsum.photos/400/225?random=31',
      videoCount: 20,
      visibility: 'public',
      createdAt: '2023-12-20T10:00:00Z',
      updatedAt: '2025-01-25T12:15:00Z',
    },
    {
      id: 'pl-3-2',
      title: '计算机视觉实战',
      description: '使用Python和OpenCV进行计算机视觉应用开发',
      thumbnailUrl: 'https://picsum.photos/400/225?random=32',
      videoCount: 15,
      visibility: 'public',
      createdAt: '2024-01-15T14:30:00Z',
      updatedAt: '2025-02-20T16:45:00Z',
    },
    {
      id: 'pl-3-3',
      title: '强化学习入门到精通',
      description: '强化学习的核心概念、算法和实践应用',
      thumbnailUrl: 'https://picsum.photos/400/225?random=33',
      videoCount: 18,
      visibility: 'public',
      createdAt: '2024-02-10T09:15:00Z',
      updatedAt: '2025-03-15T11:30:00Z',
    },
    {
      id: 'pl-3-4',
      title: '自然语言处理案例分析',
      description: 'NLP在实际项目中的应用案例分析',
      thumbnailUrl: 'https://picsum.photos/400/225?random=34',
      videoCount: 12,
      visibility: 'public',
      createdAt: '2024-03-05T13:45:00Z',
      updatedAt: '2025-04-10T15:00:00Z',
    },
  ],
};

/**
 * 生成模拟频道列表
 * @param params 查询参数
 * @returns 频道列表响应
 */
export function generateMockChannels(params: ChannelQueryParams = {}): ChannelListResponse {
  const { page = 1, limit = 10, search = '', sort = 'subscribers', order = 'desc' } = params;

  // 过滤和排序
  let filteredChannels = [...mockChannels];

  // 搜索
  if (search) {
    const searchLower = search.toLowerCase();
    filteredChannels = filteredChannels.filter(
      channel =>
        channel.name.toLowerCase().includes(searchLower) ||
        channel.description.toLowerCase().includes(searchLower) ||
        channel.handle.toLowerCase().includes(searchLower)
    );
  }

  // 排序
  filteredChannels.sort((a, b) => {
    let compare = 0;
    switch (sort) {
      case 'name':
        compare = a.name.localeCompare(b.name);
        break;
      case 'subscribers':
        compare = a.subscriberCount - b.subscriberCount;
        break;
      case 'views':
        compare = a.totalViews - b.totalViews;
        break;
      case 'videoCount':
        compare = a.videoCount - b.videoCount;
        break;
      case 'createdAt':
        compare = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        compare = a.subscriberCount - b.subscriberCount;
    }

    return order === 'asc' ? compare : -compare;
  });

  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedChannels = filteredChannels.slice(startIndex, endIndex);

  return {
    channels: paginatedChannels,
    total: filteredChannels.length,
    page,
    limit,
    hasMore: endIndex < filteredChannels.length,
  };
}

/**
 * 获取模拟频道详情
 * @param channelId 频道ID
 * @returns 频道详情
 */
export function getMockChannel(channelId: string): Channel {
  const channel = mockChannels.find(c => c.id === channelId);

  if (!channel) {
    throw new Error(`Channel not found with ID: ${channelId}`);
  }

  return {
    ...channel,
    // 随机生成是否已订阅
    isSubscribed: Math.random() > 0.5,
  };
}

/**
 * 获取模拟频道视频列表
 * @param params 查询参数
 * @returns 频道视频列表响应
 */
export function getMockChannelVideos(params: ChannelVideosQueryParams): ChannelVideosResponse {
  const { channelId, page = 1, limit = 12, sort = 'newest', search = '', tags = [] } = params;

  // 根据频道ID过滤视频
  let channelVideos = mockVideos
    .filter(video => video.author.id === mockChannels.find(c => c.id === channelId)?.userId)
    .map(
      video =>
        ({
          ...video,
          publishedAt: video.createdAt,
          visibility: Math.random() > 0.8 ? 'private' : 'public',
          status: 'published',
        }) as ChannelVideo
    );

  // 搜索
  if (search) {
    const searchLower = search.toLowerCase();
    channelVideos = channelVideos.filter(
      video =>
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower)
    );
  }

  // 标签过滤
  if (tags && tags.length > 0) {
    channelVideos = channelVideos.filter(video => tags.some(tag => video.tags.includes(tag)));
  }

  // 排序
  channelVideos.sort((a, b) => {
    switch (sort) {
      case 'newest':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'oldest':
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      case 'popular':
      case 'views':
        return b.views - a.views;
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedVideos = channelVideos.slice(startIndex, endIndex);

  return {
    videos: paginatedVideos,
    total: channelVideos.length,
    page,
    limit,
    hasMore: endIndex < channelVideos.length,
  };
}

/**
 * 获取模拟频道播放列表
 * @param channelId 频道ID
 * @param page 页码
 * @param limit 每页数量
 * @returns 频道播放列表响应
 */
export function getMockChannelPlaylists(
  channelId: string,
  page: number = 1,
  limit: number = 10
): ChannelPlaylistsResponse {
  const channelPlaylists = mockPlaylists[channelId] || [];

  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPlaylists = channelPlaylists.slice(startIndex, endIndex);

  return {
    playlists: paginatedPlaylists,
    total: channelPlaylists.length,
    page,
    limit,
    hasMore: endIndex < channelPlaylists.length,
  };
}

/**
 * 生成随机频道
 */
export function generateRandomChannel(): Channel {
  const id = `ch-${Date.now()}`;
  const handle = `channel${Math.floor(Math.random() * 10000)}`;
  const name = `频道 ${handle}`;

  return {
    id,
    userId: `user-${Math.floor(Math.random() * 100)}`,
    name,
    handle,
    description: `这是${name}的描述，提供各种精彩内容。`,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${handle}`,
    coverUrl: `https://picsum.photos/1200/300?random=${Math.floor(Math.random() * 100)}`,
    subscriberCount: Math.floor(Math.random() * 100000),
    videoCount: Math.floor(Math.random() * 200),
    totalViews: Math.floor(Math.random() * 10000000),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString(), // 随机1年内
    updatedAt: new Date().toISOString(),
    location: ['中国', '美国', '英国', '日本', '加拿大'][Math.floor(Math.random() * 5)],
    verified: Math.random() > 0.7,
    socialLinks: Array(Math.floor(Math.random() * 3) + 1)
      .fill(0)
      .map(() => {
        const platform = socialPlatforms[Math.floor(Math.random() * socialPlatforms.length)];
        return {
          platform,
          url: `https://${platform.toLowerCase()}.com/${handle}`,
        };
      }),
    isSubscribed: Math.random() > 0.5,
  };
}
