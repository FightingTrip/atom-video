import type { Video } from '@/types';
export declare const useHistoryStore: import("pinia").StoreDefinition<"history", Pick<{
    watchHistory: import("vue").Ref<{
        id: string;
        title: string;
        description: string;
        coverUrl: string;
        videoUrl: string;
        duration: number;
        views: number;
        likes: number;
        favorites: number;
        comments: number;
        createdAt: string;
        author: {
            id: string;
            username: string;
            nickname: string;
            avatar: string;
            description?: string | undefined;
            verified: boolean;
            followersCount?: number | undefined;
            followingCount?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
        };
        tags: string[];
        sources: {
            url: string;
            type: string;
            size: number;
            label: string;
        }[];
        subtitles: {
            url: string;
            label: string;
            srclang: string;
            default: boolean;
        }[];
    }[], Video[] | {
        id: string;
        title: string;
        description: string;
        coverUrl: string;
        videoUrl: string;
        duration: number;
        views: number;
        likes: number;
        favorites: number;
        comments: number;
        createdAt: string;
        author: {
            id: string;
            username: string;
            nickname: string;
            avatar: string;
            description?: string | undefined;
            verified: boolean;
            followersCount?: number | undefined;
            followingCount?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
        };
        tags: string[];
        sources: {
            url: string;
            type: string;
            size: number;
            label: string;
        }[];
        subtitles: {
            url: string;
            label: string;
            srclang: string;
            default: boolean;
        }[];
    }[]>;
    searchHistory: import("vue").Ref<string[], string[]>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    getWatchHistory: () => Promise<Video[]>;
    clearWatchHistory: () => Promise<void>;
    removeFromWatchHistory: (videoId: string) => Promise<void>;
    addToWatchHistory: (videoId: string) => Promise<void>;
    getSearchHistory: () => Promise<string[]>;
    clearSearchHistory: () => Promise<void>;
    removeFromSearchHistory: (keyword: string) => Promise<void>;
    addToSearchHistory: (keyword: string) => Promise<void>;
}, "error" | "loading" | "searchHistory" | "watchHistory">, Pick<{
    watchHistory: import("vue").Ref<{
        id: string;
        title: string;
        description: string;
        coverUrl: string;
        videoUrl: string;
        duration: number;
        views: number;
        likes: number;
        favorites: number;
        comments: number;
        createdAt: string;
        author: {
            id: string;
            username: string;
            nickname: string;
            avatar: string;
            description?: string | undefined;
            verified: boolean;
            followersCount?: number | undefined;
            followingCount?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
        };
        tags: string[];
        sources: {
            url: string;
            type: string;
            size: number;
            label: string;
        }[];
        subtitles: {
            url: string;
            label: string;
            srclang: string;
            default: boolean;
        }[];
    }[], Video[] | {
        id: string;
        title: string;
        description: string;
        coverUrl: string;
        videoUrl: string;
        duration: number;
        views: number;
        likes: number;
        favorites: number;
        comments: number;
        createdAt: string;
        author: {
            id: string;
            username: string;
            nickname: string;
            avatar: string;
            description?: string | undefined;
            verified: boolean;
            followersCount?: number | undefined;
            followingCount?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
        };
        tags: string[];
        sources: {
            url: string;
            type: string;
            size: number;
            label: string;
        }[];
        subtitles: {
            url: string;
            label: string;
            srclang: string;
            default: boolean;
        }[];
    }[]>;
    searchHistory: import("vue").Ref<string[], string[]>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    getWatchHistory: () => Promise<Video[]>;
    clearWatchHistory: () => Promise<void>;
    removeFromWatchHistory: (videoId: string) => Promise<void>;
    addToWatchHistory: (videoId: string) => Promise<void>;
    getSearchHistory: () => Promise<string[]>;
    clearSearchHistory: () => Promise<void>;
    removeFromSearchHistory: (keyword: string) => Promise<void>;
    addToSearchHistory: (keyword: string) => Promise<void>;
}, never>, Pick<{
    watchHistory: import("vue").Ref<{
        id: string;
        title: string;
        description: string;
        coverUrl: string;
        videoUrl: string;
        duration: number;
        views: number;
        likes: number;
        favorites: number;
        comments: number;
        createdAt: string;
        author: {
            id: string;
            username: string;
            nickname: string;
            avatar: string;
            description?: string | undefined;
            verified: boolean;
            followersCount?: number | undefined;
            followingCount?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
        };
        tags: string[];
        sources: {
            url: string;
            type: string;
            size: number;
            label: string;
        }[];
        subtitles: {
            url: string;
            label: string;
            srclang: string;
            default: boolean;
        }[];
    }[], Video[] | {
        id: string;
        title: string;
        description: string;
        coverUrl: string;
        videoUrl: string;
        duration: number;
        views: number;
        likes: number;
        favorites: number;
        comments: number;
        createdAt: string;
        author: {
            id: string;
            username: string;
            nickname: string;
            avatar: string;
            description?: string | undefined;
            verified: boolean;
            followersCount?: number | undefined;
            followingCount?: number | undefined;
            createdAt?: string | undefined;
            updatedAt?: string | undefined;
        };
        tags: string[];
        sources: {
            url: string;
            type: string;
            size: number;
            label: string;
        }[];
        subtitles: {
            url: string;
            label: string;
            srclang: string;
            default: boolean;
        }[];
    }[]>;
    searchHistory: import("vue").Ref<string[], string[]>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    getWatchHistory: () => Promise<Video[]>;
    clearWatchHistory: () => Promise<void>;
    removeFromWatchHistory: (videoId: string) => Promise<void>;
    addToWatchHistory: (videoId: string) => Promise<void>;
    getSearchHistory: () => Promise<string[]>;
    clearSearchHistory: () => Promise<void>;
    removeFromSearchHistory: (keyword: string) => Promise<void>;
    addToSearchHistory: (keyword: string) => Promise<void>;
}, "getWatchHistory" | "clearWatchHistory" | "removeFromWatchHistory" | "addToWatchHistory" | "getSearchHistory" | "clearSearchHistory" | "removeFromSearchHistory" | "addToSearchHistory">>;
