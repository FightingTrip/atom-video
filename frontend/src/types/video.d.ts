/**
 * @file video.ts
 * @description 视频相关的类型定义
 * @author Atom Video Team
 * @date 2025-04-06
 */
export declare enum VideoStatus {
    DRAFT = "draft",
    PROCESSING = "processing",
    PUBLISHED = "published",
    PRIVATE = "private",
    DELETED = "deleted"
}
export declare enum VideoCategory {
    ENTERTAINMENT = "entertainment",
    EDUCATION = "education",
    GAMING = "gaming",
    MUSIC = "music",
    SPORTS = "sports",
    TECH = "tech",
    OTHER = "other"
}
export interface VideoInfo {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    videoUrl: string;
    thumbnail: string;
    duration: number;
    views: number;
    likes: number;
    favorites: number;
    comments: number;
    status: VideoStatus;
    category: VideoCategory;
    tags: string[];
    userId: string;
    createdAt: string;
    updatedAt: string;
}
export interface VideoQueryParams {
    page?: number;
    pageSize?: number;
    category?: VideoCategory;
    tags?: string[];
    userId?: string;
    status?: VideoStatus;
    sortBy?: 'views' | 'likes' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
export interface VideoUploadParams {
    title: string;
    description: string;
    category: VideoCategory;
    tags: string[];
    file: File;
    thumbnail?: File;
}
export interface VideoComment {
    id: string;
    content: string;
    userId: string;
    videoId: string;
    createdAt: string;
    updatedAt: string;
    likes: number;
    replies: VideoComment[];
}
export interface VideoUploadResponse {
    id: string;
    uploadUrl: string;
    thumbnailUploadUrl: string;
}
export interface VideoStats {
    views: number;
    likes: number;
    favorites: number;
    comments: number;
    duration: number;
}
export interface VideoFilter {
    tags?: string[];
    userId?: string;
    status?: 'processing' | 'published' | 'failed';
    visibility?: 'public' | 'private' | 'unlisted';
    sortBy: 'views' | 'likes' | 'date';
    order: 'asc' | 'desc';
}
export interface VideoSearchResult {
    videos: VideoInfo[];
    total: number;
    page: number;
    pageSize: number;
}
export interface VideoPlayerConfig {
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    volume: number;
    quality: '1080p' | '720p' | '480p' | '360p';
    playbackRate: number;
    danmakuEnabled: boolean;
}
export type VideoQuality = '1080p' | '720p' | '480p' | '360p';
export interface VideoSource {
    quality: VideoQuality;
    url: string;
    type: string;
}
export interface VideoFormData {
    title: string;
    description: string;
    tags: string[];
    visibility: 'public' | 'private' | 'unlisted';
    coverUrl?: string;
    videoUrl?: string;
}
export interface VideoProgress {
    videoId: string;
    currentTime: number;
    duration: number;
    lastPlayedAt: string;
}
export interface VideoSearchParams {
    keyword?: string;
    tags?: string[];
    sort?: 'latest' | 'popular' | 'relevant';
    page?: number;
    limit?: number;
}
export interface VideoListResponse {
    videos: VideoInfo[];
    total: number;
    hasMore: boolean;
}
export interface VideoCommentsResponse {
    comments: Comment[];
    total: number;
    hasMore: boolean;
}
export interface VideoRecommendationsResponse {
    videos: VideoInfo[];
    hasMore: boolean;
}
export * from './index';
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export interface VideoService {
    getVideos(page: number, limit: number, tag?: string): Promise<{
        videos: VideoInfo[];
        hasMore: boolean;
    }>;
    getVideoById(id: string): Promise<VideoInfo>;
    getVideosByUser(userId: string, page?: number, limit?: number): Promise<{
        videos: VideoInfo[];
        hasMore: boolean;
    }>;
}
