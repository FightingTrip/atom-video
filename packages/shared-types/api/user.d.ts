import { ExperienceLevel, UserRole } from '../models';

/**
 * 用户API请求/响应类型定义
 */

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
  name?: string;
  isCreator?: boolean;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  githubProfile?: string;
  stackOverflowProfile?: string;
  personalWebsite?: string;
  company?: string;
  position?: string;
  experienceLevel?: ExperienceLevel;
  channelDescription?: string;
  channelBannerUrl?: string;
}

export interface UserCreatorProfileUpdateRequest {
  channelDescription?: string;
  channelBannerUrl?: string;
  isCreator?: boolean;
}

export interface UserPasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserEmailChangeRequest {
  email: string;
  password: string;
}

export interface UserProgrammingLanguageRequest {
  languageId: string;
  proficiencyLevel: number;
}

export interface UserTechnologyRequest {
  technologyId: string;
  proficiencyLevel: number;
}

export interface UserSubscriptionRequest {
  creatorId: string;
  notificationsEnabled?: boolean;
}

export interface UserFetchRequest {
  userId?: string;
  username?: string;
}

export interface UserPlaylistRequest {
  title: string;
  description?: string;
  isPublic?: boolean;
}

export interface UserPlaylistUpdateRequest {
  id: string;
  title?: string;
  description?: string;
  isPublic?: boolean;
}

export interface UserPlaylistAddVideoRequest {
  playlistId: string;
  videoId: string;
  order?: number;
}

export interface UserNotificationUpdateRequest {
  notificationId: string;
  isRead: boolean;
}
