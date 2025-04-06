import type { User, AuthResponse, ApiResponse } from '@/types';
import type { Channel, Playlist } from '@/types';
export interface User {
    id: string;
    username: string;
    email: string;
    nickname: string;
    avatar: string;
    bio: string;
    verified: boolean;
    subscribers: number;
    subscribing: number;
    totalViews: number;
    joinedAt: string;
    social: {
        website?: string;
        twitter?: string;
        github?: string;
        instagram?: string;
    };
}
export interface Channel {
    id: string;
    userId: string;
    name: string;
    description: string;
    banner: string;
    playlists: Playlist[];
}
export interface Playlist {
    id: string;
    name: string;
    description: string;
    videoCount: number;
    visibility: 'public' | 'private' | 'unlisted';
    createdAt: string;
    updatedAt: string;
}
export declare const mockUsers: User[];
export declare const tokens: Map<string, string>;
export declare function generateId(): string;
export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    error?: string;
}
export interface AuthResponse {
    token: string;
    user: User;
}
export declare function login(data: {
    username: string;
    password: string;
}): Promise<ApiResponse<AuthResponse>>;
export declare function register(data: {
    username: string;
    password: string;
    nickname?: string;
}): Promise<ApiResponse<User>>;
export declare function getUserByToken(token: string): Promise<ApiResponse<User>>;
export declare function sendVerificationCode(email: string): Promise<ApiResponse<string>>;
export declare function validateToken(token: string): boolean;
export declare const generateMockUsers: (count: number) => User[];
export declare const mockUserApi: {
    getUserById(id: string): Promise<User | undefined>;
    getUsers(page?: number, limit?: number): Promise<{
        users: User[];
        total: number;
        hasMore: boolean;
    }>;
    getChannelByUserId(userId: string): Promise<Channel | undefined>;
    getUserPlaylists(userId: string): Promise<Playlist[]>;
    searchUsers(query: string, page?: number, limit?: number): Promise<{
        users: User[];
        total: number;
        hasMore: boolean;
    }>;
};
export declare const testUserData: {
    users: User[];
    channels: Channel[];
};
export declare function getUserInfo(userId: string): Promise<ApiResponse<User>>;
export declare function updateUserInfo(userId: string, data: Partial<User>): Promise<ApiResponse<User>>;
export declare const getUserById: (id: string) => Promise<User | undefined>;
export declare const getChannelByUserId: (userId: string) => Promise<Channel | undefined>;
export declare const getUserPlaylists: (userId: string) => Promise<Playlist[]>;
