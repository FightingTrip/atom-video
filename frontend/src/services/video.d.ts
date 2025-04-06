import type { Video } from '@/types';
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
    getVideos(page?: number, limit?: number, tag?: string): Promise<{
        videos: Video[];
        hasMore: boolean;
    }>;
    getVideoById(id: string): Promise<Video>;
};
