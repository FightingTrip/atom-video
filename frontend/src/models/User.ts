export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  preferences: UserPreferences;
  stats: UserStats;
}

export enum UserRole {
  USER = 'user',
  CREATOR = 'creator',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface UserStats {
  videosCount: number;
  followersCount: number;
  followingCount: number;
  likesCount: number;
}

export interface UserProfile extends Pick<User, 'id' | 'username' | 'avatar' | 'bio'> {
  isFollowing: boolean;
}
