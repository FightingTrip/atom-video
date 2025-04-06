/**
 * @file useVideo.ts
 * @description 视频相关的组合式函数
 * @author Atom Video Team
 * @date 2025-04-06
 */
import type { VideoQueryParams, VideoUploadParams } from '@/types/video';
export declare function useVideo(): {
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    videos: import("vue").ComputedRef<{
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
    currentVideo: import("vue").ComputedRef<any>;
    totalVideos: import("vue").ComputedRef<any>;
    fetchVideos: (params: VideoQueryParams) => Promise<void>;
    fetchVideoById: (id: string) => Promise<void>;
    uploadVideo: (params: VideoUploadParams) => Promise<void>;
    deleteVideo: (id: string) => Promise<void>;
    likeVideo: (id: string) => Promise<void>;
    favoriteVideo: (id: string) => Promise<void>;
};
