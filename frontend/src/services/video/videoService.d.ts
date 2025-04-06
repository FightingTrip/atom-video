import { Video } from '@/models/Video';
import { PaginatedData } from '@/services/api/types';
import { VideoUploadRequest, VideoUpdateRequest, VideoQueryParams } from './types';
export interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: number;
    views: number;
    createdAt: string;
    tags: string[];
    user: {
        id: string;
        nickname: string;
        avatar: string;
        verified: boolean;
    };
}
export declare const videoService: {
    getVideos(params?: VideoQueryParams): Promise<PaginatedData<Video>>;
    getVideoById(id: string): Promise<Video>;
    uploadVideo(data: VideoUploadRequest): Promise<Video>;
    updateVideo(id: string, data: VideoUpdateRequest): Promise<Video>;
    deleteVideo(id: string): Promise<void>;
    toggleLike(id: string): Promise<{
        liked: boolean;
        likesCount: number;
    }>;
    toggleFavorite(id: string): Promise<{
        favorited: boolean;
        favoritesCount: number;
    }>;
    getRelatedVideos(id: string, limit?: number): Promise<Video[]>;
    incrementViews(id: string): Promise<{
        views: number;
    }>;
    getUserVideos(userId: string, params?: VideoQueryParams): Promise<PaginatedData<Video>>;
    getUserLikedVideos(userId: string, params?: VideoQueryParams): Promise<PaginatedData<Video>>;
};
