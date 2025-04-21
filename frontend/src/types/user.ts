/**
 * @file user.ts
 * @description 用户相关的类型定义
 * @author Atom Video Team
 * @date 2025-04-08
 */

// 技术栈说明：
// - TypeScript: 强类型支持
// - Vue 3: 类型集成

/**
 * 用户基础信息
 */
export interface User {
  id: string;
  username: string;
  email: string;
  nickname: string;
  avatar: string;
  bio?: string;
  verified: boolean;
  subscribers?: number;
  subscribing?: number;
  totalViews?: number;
  joinedAt: string;
  role?: 'user' | 'creator' | 'admin';
  coverImage?: string;
  social?: UserSocialLinks;
  preferences?: UserPreferences;
  notifications?: UserNotificationSettings;
  privacy?: UserPrivacySettings;
  isFollowed?: boolean;
}

/**
 * 用户简要信息（用于列表展示等场景）
 */
export interface UserBrief {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  verified: boolean;
}

/**
 * 用户社交链接
 */
export interface UserSocialLinks {
  website?: string;
  github?: string;
  twitter?: string;
  youtube?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
}

/**
 * 用户偏好设置
 */
export interface UserPreferences {
  theme: 'system' | 'light' | 'dark';
  fontSize: number;
  language: string;
  videoQuality: 'auto' | '1080p' | '720p' | '480p' | '360p';
  autoplay: boolean;
  notifications: boolean;
}

/**
 * 用户通知设置
 */
export interface UserNotificationSettings {
  likes: boolean;
  comments: boolean;
  replies: boolean;
  follows: boolean;
  videoProcessing: boolean;
  updates: boolean;
  browserNotification: boolean;
  emailNotification: boolean;
}

/**
 * 用户隐私设置
 */
export interface UserPrivacySettings {
  showWatchHistory: boolean;
  showFavorites: boolean;
  showFollowing: boolean;
  showLikes: boolean;
  commentPermission: 'everyone' | 'followers' | 'following' | 'none';
}

/**
 * 用户状态
 */
export interface UserStatus {
  online: boolean;
  lastActive: string;
  currentActivity?: 'watching' | 'uploading' | 'browsing';
}

/**
 * 用户认证响应
 */
export interface UserAuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

/**
 * 用户注册请求
 */
export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  nickname?: string;
}

/**
 * 用户登录请求
 */
export interface UserLoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * 用户资料更新请求
 */
export interface UserProfileUpdateRequest {
  nickname?: string;
  bio?: string;
  avatar?: File;
  coverImage?: File;
  social?: UserSocialLinks;
}

/**
 * 用户查询参数
 */
export interface UserQueryParams {
  page?: number;
  limit?: number;
  sort?: 'username' | 'createdAt' | 'subscribers';
  order?: 'asc' | 'desc';
  search?: string;
  role?: 'user' | 'creator' | 'admin';
}

/**
 * 用户列表响应
 */
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * 用户统计信息
 */
export interface UserStats {
  videoCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  subscriberCount: number;
  subscribingCount: number;
  topVideos: {
    id: string;
    title: string;
    views: number;
    thumbnail: string;
  }[];
  viewsGraph: {
    labels: string[];
    data: number[];
  };
}

/**
 * 用户活动记录
 */
export interface UserActivity {
  id: string;
  userId: string;
  activityType: 'upload' | 'like' | 'comment' | 'subscribe' | 'watch';
  timestamp: string;
  videoId?: string;
  channelId?: string;
  commentId?: string;
}

/**
 * 用户通知
 */
export interface UserNotification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'reply' | 'subscribe' | 'mention' | 'system';
  content: string;
  isRead: boolean;
  createdAt: string;
  senderId?: string;
  senderAvatar?: string;
  senderName?: string;
  targetId?: string;
  targetType?: 'video' | 'comment' | 'channel';
}
