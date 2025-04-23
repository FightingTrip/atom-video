/**
 * 创作者服务类型定义
 *
 * 定义创作者工作区相关的类型接口
 */

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 创作者统计数据
 */
export interface CreatorStats {
  totalVideos: number;
  publishedVideos: number;
  draftVideos: number;
  totalViews: number;
  totalMinutesWatched: number;
  averageViewDuration: number;
  averageCompletionRate: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingRevenue: number;
  subscribersCount: number;
  subscribersGrowth: number;
  videosTrend: number;
  publishedVideosTrend: number;
  draftVideosTrend: number;
  viewsTrend: number;
  minutesWatchedTrend: number;
  viewDurationTrend: number;
  completionRateTrend: number;
  likesTrend: number;
  commentsTrend: number;
  sharesTrend: number;
  revenueTrend: number;
  monthlyRevenueTrend: number;
  subscribersTrend: number;
}

/**
 * 视频统计数据（用于排行榜展示）
 */
export interface VideoStats {
  id: string;
  title: string;
  coverUrl: string;
  duration: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  revenue: number;
  publishDate: string;
  completionRate: number;
}

/**
 * 趋势数据
 */
export interface TrendData {
  labels: string[];
  data: number[];
  trend: number;
}

/**
 * 视频分析数据
 */
export interface VideoAnalytics {
  id: string;
  title: string;
  views: number;
  viewsTrend: number;
  uniqueViewers: number;
  uniqueViewersTrend: number;
  averageViewDuration: number;
  viewDurationTrend: number;
  completionRate: number;
  completionRateTrend: number;
  likes: number;
  likesTrend: number;
  comments: number;
  commentsTrend: number;
  shares: number;
  sharesTrend: number;
  revenue: number;
  revenueTrend: number;
  audienceRetention: { position: number; percentage: number }[];
  audienceDemographics: { age: string; percentage: number }[];
  audienceLocations: { location: string; percentage: number }[];
  trafficSources: { source: string; percentage: number }[];
  deviceTypes: { device: string; percentage: number }[];
  viewsOverTime: { date: string; views: number }[];
  viewsByHour: { hour: number; views: number }[];
}

/**
 * 创作者视频
 */
export interface CreatorVideo {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  visibility: 'public' | 'unlisted' | 'private';
  status: 'published' | 'draft' | 'processing' | 'failed';
  thumbnail: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  comments: number;
  uploadDate: string;
  publishDate: string;
  processingProgress?: number;
  scheduledAt?: string;
  monetizationStatus: 'enabled' | 'disabled' | 'ineligible';
  restrictionStatus: 'none' | 'age-restricted' | 'limited';
}

/**
 * 创作者评论
 */
export interface CreatorComment {
  id: string;
  videoId: string;
  videoTitle: string;
  content: string;
  user: {
    id: string;
    nickname: string;
    avatar: string;
  };
  status: 'visible' | 'pending' | 'hidden';
  createdAt: string;
  likeCount: number;
  replyCount: number;
  isEdited: boolean;
}

/**
 * 频道设置
 */
export interface ChannelSettings {
  id: string;
  name: string;
  description: string;
  bannerImage: string;
  avatar: string;
  themeColor: string;
  featuredVideoId: string;
  featuredPlaylistId: string;
  trailerVideoId: string;
  contactEmail: string;
  websiteUrl: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
  layout: 'grid' | 'list';
  customization: {
    showSubscriberCount: boolean;
    showJoinDateToPublic: boolean;
    hideUpcomingPremieres: boolean;
  };
}
