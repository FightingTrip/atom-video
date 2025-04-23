/**
 * @file models.ts
 * @description 模拟数据库的数据模型定义
 */

// 用户模型
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  nickname: string;
  avatar: string;
  bio: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
  following?: string[];
  subscribers: number;
  subscribing: number;
  videoCount?: number;
  lastLogin?: string;
  joinedAt?: string;
  totalViews?: number;
  preferences?: {
    categories?: string[];
    tags?: string[];
    lastWatched?: string[];
  };
  stats?: {
    totalVideosWatched: number;
    totalCommentsPosted: number;
    totalLikesGiven: number;
    totalViews?: number;
  };
  social?: {
    website?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
    facebook?: string;
    location?: string;
  };
  location?: string;
  bannerUrl?: string;
  themeColor?: string;
  // 视频交互相关
  likedVideos?: string[];
  favorites?: string[];
  watchHistory?: {
    videoId: string;
    timestamp: string;
    progress: number;
    currentTime: number;
    duration: number;
  }[];
  notifications?: Notification[]; // 用户的通知列表
}

// 视频模型
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  coverUrl: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  authorId: string;
  author?:
    | User
    | {
        id: string;
        username: string;
        nickname?: string;
        avatar: string;
        verified?: boolean;
      };
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: string;
  privacy?: 'public' | 'private' | 'unlisted';
  isRecommended: boolean;
  isTrending: boolean;
  favorites?: number;
  playlists?: string[];
  reason?: string;
  subtitles?: {
    url: string;
    label: string;
    srclang: string;
    default?: boolean;
  }[];
  sources?: {
    url: string;
    type: string;
    size: number;
    label: string;
  }[];
  [key: string]: any; // 添加索引签名，允许动态访问属性
}

// 评论模型
export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  content: string;
  likes: number;
  status: 'normal' | 'hidden' | 'pending';
  createdAt: string;
  updatedAt: string;
  parentId?: string;
  replies?: number;
}

// 举报模型
export interface Report {
  id: string;
  type: 'video' | 'comment' | 'user';
  targetId: string;
  reporterId: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'ignored';
  createdAt: string;
  updatedAt: string;
  resolution?: string;
}

// 活动日志模型
export interface Activity {
  id: string;
  userId: string;
  action: string;
  target: string;
  targetId?: string;
  timestamp: string;
  details?: string;
  type?: 'video' | 'user' | 'comment' | 'report' | 'system';
}

// 收入模型
export interface Revenue {
  id: string;
  userId: string;
  amount: number;
  source: 'ads' | 'sponsors' | 'tips' | 'membership';
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  paidAt?: string;
}

// 用于仪表盘的统计数据
export interface DashboardStats {
  totalUsers: number;
  newUsersToday: number;
  totalVideos: number;
  newVideosToday: number;
  totalViews: number;
  viewsToday: number;
  pendingVideos: number;
  pendingReports: number;
  totalRevenue: number;
  revenueToday: number;
  userGrowthRate: number;
  contentGrowthRate: number;
  viewsGrowthRate: number;
  revenueGrowthRate: number;
}

// 通知模型
export interface Notification {
  id: string;
  userId: string;
  type: 'video' | 'comment' | 'subscription' | 'system' | 'like';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string; // 相关的用户、视频或评论ID
  actionUrl?: string; // 通知操作链接
}

// 播放列表模型
export interface Playlist {
  id: string;
  title: string;
  description: string;
  userId: string;
  thumbnailUrl: string;
  videoCount: number;
  visibility: 'public' | 'private' | 'unlisted';
  createdAt: string;
  updatedAt: string;
  isSystem?: boolean; // 是否为系统播放列表（例如"稍后观看"）
  isLiked?: boolean; // 用户是否已收藏该播放列表
  viewCount?: number; // 播放列表被观看次数
}

// 播放列表视频关联模型
export interface PlaylistVideo {
  id: string;
  playlistId: string;
  videoId: string;
  position: number; // 视频在播放列表中的位置
  addedAt: string;
  addedBy: string; // 添加者的userId
}

// 添加频道相关类型
export interface ChannelSocialLink {
  platform: string;
  url: string;
}

export interface Channel {
  id: string;
  userId: string;
  name: string;
  handle: string;
  description: string;
  avatarUrl: string;
  coverUrl: string;
  subscriberCount: number;
  videoCount: number;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
  location: string;
  verified: boolean;
  socialLinks: ChannelSocialLink[];
  isSubscribed: boolean;
  categories?: string[];
}

export interface ChannelStats {
  subscriberCount: number;
  videoCount: number;
  totalViews: number;
  subscriberGrowth: {
    day: number;
    week: number;
    month: number;
  };
  viewsGrowth: {
    day: number;
    week: number;
    month: number;
  };
}

export interface ChannelVideo extends Video {
  publishedAt: string;
  visibility: 'public' | 'private' | 'unlisted';
  status: 'published' | 'draft' | 'processing' | 'failed';
}

export interface ChannelPlaylist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoCount: number;
  visibility: 'public' | 'private' | 'unlisted';
  createdAt: string;
  updatedAt: string;
}

// 作为模拟数据库的表
export interface DbTables {
  users: User[];
  videos: Video[];
  comments: Comment[];
  reports: Report[];
  activities: Activity[];
  revenues: Revenue[];
  notifications: Notification[]; // 添加通知表
  playlists: Playlist[]; // 添加播放列表表
  playlistVideos: PlaylistVideo[]; // 添加播放列表视频关联表
}
