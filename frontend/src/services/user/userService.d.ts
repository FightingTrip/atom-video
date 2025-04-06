import { User, UserProfile } from '@/models/User';
import { PaginatedData } from '@/services/api/types';
import { UpdateUserProfileRequest, UserQueryParams } from './types';
export declare const userService: {
    getCurrentUser(): Promise<User>;
    getUserProfile(userId: string): Promise<UserProfile>;
    updateProfile(data: UpdateUserProfileRequest): Promise<User>;
    getUsers(params?: UserQueryParams): Promise<PaginatedData<User>>;
    followUser(userId: string): Promise<void>;
    unfollowUser(userId: string): Promise<void>;
    getFollowing(userId: string, params?: UserQueryParams): Promise<PaginatedData<UserProfile>>;
    getFollowers(userId: string, params?: UserQueryParams): Promise<PaginatedData<UserProfile>>;
};
