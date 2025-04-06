import type { Video, VideoResponse, Comment } from '@/types';
export interface Creator {
    id: string;
    name: string;
    avatarUrl: string;
}
interface SearchFilters {
    timeRange: string | null;
    duration: string | null;
    sort: string;
}
export declare const useVideoStore: import("pinia").StoreDefinition<"video", Pick<{
    videos: import("vue").Ref<{
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
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    currentPage: import("vue").Ref<number, number>;
    pageSize: import("vue").Ref<number, number>;
    total: import("vue").Ref<number, number>;
    searchQuery: import("vue").Ref<string, string>;
    selectedCategory: import("vue").Ref<string, string>;
    creators: import("vue").Ref<{
        id: string;
        name: string;
        avatarUrl: string;
    }[], Creator[] | {
        id: string;
        name: string;
        avatarUrl: string;
    }[]>;
    currentFilters: import("vue").Ref<{
        timeRange: string | null;
        duration: string | null;
        sort: string;
    }, SearchFilters | {
        timeRange: string | null;
        duration: string | null;
        sort: string;
    }>;
    allTags: import("vue").ComputedRef<string[]>;
    hasMore: import("vue").ComputedRef<boolean>;
    filteredVideos: import("vue").ComputedRef<{
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
    fetchVideos: () => Promise<void>;
    fetchCreators: () => Promise<void>;
    loadMore: () => Promise<void>;
    setCategory: (category: string) => Promise<void>;
    setSearchQuery: (query: string) => void;
    reset: () => void;
    search: (query: string, filters: SearchFilters) => void;
    applyFilters: () => void;
    searchVideos: (query: string) => Promise<void>;
    filterByTags: (tags: string[]) => {
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
    }[];
    getVideoById: (id: string) => Promise<Video | null>;
    getVideoComments: (videoId: string, offset?: number) => Promise<{
        comments: Comment[];
        hasMore: boolean;
    }>;
    getRecommendedVideos: (videoId: string) => Promise<Video[]>;
    toggleVideoLike: (videoId: string) => Promise<boolean>;
    toggleVideoFavorite: (videoId: string) => Promise<boolean>;
    toggleAuthorFollow: (authorId: string) => Promise<boolean>;
    postComment: (videoId: string, content: string) => Promise<Comment>;
    replyComment: (videoId: string, commentId: string, content: string, replyToId?: string) => Promise<Comment>;
    toggleCommentLike: (commentId: string) => Promise<boolean>;
    getVideos: (page?: number, category?: string) => Promise<VideoResponse>;
    getTrendingVideos: () => Promise<Video[]>;
    getLibraryVideos: (page?: number) => Promise<VideoResponse>;
    getHistory: () => Promise<Video[]>;
    clearHistory: () => Promise<void>;
    removeFromHistory: (videoId: string) => Promise<void>;
    toggleFavorite: (videoId: string) => Promise<void>;
    toggleLike: (videoId: string) => Promise<void>;
}, "error" | "loading" | "videos" | "searchQuery" | "pageSize" | "total" | "currentPage" | "selectedCategory" | "creators" | "currentFilters">, Pick<{
    videos: import("vue").Ref<{
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
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    currentPage: import("vue").Ref<number, number>;
    pageSize: import("vue").Ref<number, number>;
    total: import("vue").Ref<number, number>;
    searchQuery: import("vue").Ref<string, string>;
    selectedCategory: import("vue").Ref<string, string>;
    creators: import("vue").Ref<{
        id: string;
        name: string;
        avatarUrl: string;
    }[], Creator[] | {
        id: string;
        name: string;
        avatarUrl: string;
    }[]>;
    currentFilters: import("vue").Ref<{
        timeRange: string | null;
        duration: string | null;
        sort: string;
    }, SearchFilters | {
        timeRange: string | null;
        duration: string | null;
        sort: string;
    }>;
    allTags: import("vue").ComputedRef<string[]>;
    hasMore: import("vue").ComputedRef<boolean>;
    filteredVideos: import("vue").ComputedRef<{
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
    fetchVideos: () => Promise<void>;
    fetchCreators: () => Promise<void>;
    loadMore: () => Promise<void>;
    setCategory: (category: string) => Promise<void>;
    setSearchQuery: (query: string) => void;
    reset: () => void;
    search: (query: string, filters: SearchFilters) => void;
    applyFilters: () => void;
    searchVideos: (query: string) => Promise<void>;
    filterByTags: (tags: string[]) => {
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
    }[];
    getVideoById: (id: string) => Promise<Video | null>;
    getVideoComments: (videoId: string, offset?: number) => Promise<{
        comments: Comment[];
        hasMore: boolean;
    }>;
    getRecommendedVideos: (videoId: string) => Promise<Video[]>;
    toggleVideoLike: (videoId: string) => Promise<boolean>;
    toggleVideoFavorite: (videoId: string) => Promise<boolean>;
    toggleAuthorFollow: (authorId: string) => Promise<boolean>;
    postComment: (videoId: string, content: string) => Promise<Comment>;
    replyComment: (videoId: string, commentId: string, content: string, replyToId?: string) => Promise<Comment>;
    toggleCommentLike: (commentId: string) => Promise<boolean>;
    getVideos: (page?: number, category?: string) => Promise<VideoResponse>;
    getTrendingVideos: () => Promise<Video[]>;
    getLibraryVideos: (page?: number) => Promise<VideoResponse>;
    getHistory: () => Promise<Video[]>;
    clearHistory: () => Promise<void>;
    removeFromHistory: (videoId: string) => Promise<void>;
    toggleFavorite: (videoId: string) => Promise<void>;
    toggleLike: (videoId: string) => Promise<void>;
}, "hasMore" | "allTags" | "filteredVideos">, Pick<{
    videos: import("vue").Ref<{
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
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    currentPage: import("vue").Ref<number, number>;
    pageSize: import("vue").Ref<number, number>;
    total: import("vue").Ref<number, number>;
    searchQuery: import("vue").Ref<string, string>;
    selectedCategory: import("vue").Ref<string, string>;
    creators: import("vue").Ref<{
        id: string;
        name: string;
        avatarUrl: string;
    }[], Creator[] | {
        id: string;
        name: string;
        avatarUrl: string;
    }[]>;
    currentFilters: import("vue").Ref<{
        timeRange: string | null;
        duration: string | null;
        sort: string;
    }, SearchFilters | {
        timeRange: string | null;
        duration: string | null;
        sort: string;
    }>;
    allTags: import("vue").ComputedRef<string[]>;
    hasMore: import("vue").ComputedRef<boolean>;
    filteredVideos: import("vue").ComputedRef<{
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
    fetchVideos: () => Promise<void>;
    fetchCreators: () => Promise<void>;
    loadMore: () => Promise<void>;
    setCategory: (category: string) => Promise<void>;
    setSearchQuery: (query: string) => void;
    reset: () => void;
    search: (query: string, filters: SearchFilters) => void;
    applyFilters: () => void;
    searchVideos: (query: string) => Promise<void>;
    filterByTags: (tags: string[]) => {
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
    }[];
    getVideoById: (id: string) => Promise<Video | null>;
    getVideoComments: (videoId: string, offset?: number) => Promise<{
        comments: Comment[];
        hasMore: boolean;
    }>;
    getRecommendedVideos: (videoId: string) => Promise<Video[]>;
    toggleVideoLike: (videoId: string) => Promise<boolean>;
    toggleVideoFavorite: (videoId: string) => Promise<boolean>;
    toggleAuthorFollow: (authorId: string) => Promise<boolean>;
    postComment: (videoId: string, content: string) => Promise<Comment>;
    replyComment: (videoId: string, commentId: string, content: string, replyToId?: string) => Promise<Comment>;
    toggleCommentLike: (commentId: string) => Promise<boolean>;
    getVideos: (page?: number, category?: string) => Promise<VideoResponse>;
    getTrendingVideos: () => Promise<Video[]>;
    getLibraryVideos: (page?: number) => Promise<VideoResponse>;
    getHistory: () => Promise<Video[]>;
    clearHistory: () => Promise<void>;
    removeFromHistory: (videoId: string) => Promise<void>;
    toggleFavorite: (videoId: string) => Promise<void>;
    toggleLike: (videoId: string) => Promise<void>;
}, "reset" | "search" | "fetchVideos" | "fetchCreators" | "loadMore" | "setCategory" | "setSearchQuery" | "applyFilters" | "searchVideos" | "filterByTags" | "getVideoById" | "getVideoComments" | "getRecommendedVideos" | "toggleVideoLike" | "toggleVideoFavorite" | "toggleAuthorFollow" | "postComment" | "replyComment" | "toggleCommentLike" | "getVideos" | "getTrendingVideos" | "getLibraryVideos" | "getHistory" | "clearHistory" | "removeFromHistory" | "toggleFavorite" | "toggleLike">>;
export {};
