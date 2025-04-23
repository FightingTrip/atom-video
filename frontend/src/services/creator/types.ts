/**
 * 创作者服务类型定义
 *
 * 定义创作者工作区相关的类型接口
 */

export interface CreatorStats {
  totalVideos: number;
  totalViews: number;
  totalSubscribers: number;
  totalLikes: number;
  totalComments: number;
  newSubscribers: number;
  revenueGenerated?: number;
  lastUpdated: string;
}

export interface VideoAnalytics {
  id: string;
  title: string;
  views: number;
  watchTime: number;
  likes: number;
  comments: number;
  retention: number;
  viewsLast7Days: number[];
  viewsLast30Days: number[];
  audienceRegions: { region: string; percentage: number }[];
  audienceDevices: { device: string; percentage: number }[];
  publishedAt: string;
}

export interface CreatorVideo {
  id: string;
  title: string;
  thumbnail: string;
  status: 'draft' | 'processing' | 'published' | 'scheduled' | 'rejected';
  privacy: 'public' | 'private' | 'unlisted';
  uploadDate: string;
  publishedAt?: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  description?: string;
}

export interface CreatorComment {
  id: string;
  content: string;
  videoId: string;
  videoTitle: string;
  user: {
    id: string;
    nickname: string;
    avatar: string;
  };
  createdAt: string;
  status: string;
  likes: number;
  replies: number;
  parentId?: string;
}

export interface ChannelSettings {
  name: string;
  description: string;
  bannerUrl?: string;
  avatarUrl?: string;
  links: {
    type: string;
    url: string;
    title: string;
  }[];
  themeColor: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
