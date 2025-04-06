import type { Video, VideoResponse, VideoComment } from '@/types';
export declare const videoCategories: {
    id: string;
    name: string;
    icon: string;
}[];
export declare const mockVideosApi: {
    getVideos: ({ page, pageSize, category }: {
        page?: number | undefined;
        pageSize?: number | undefined;
        category?: string | undefined;
    }) => Promise<VideoResponse>;
    getVideoById(id: string): Promise<Video | undefined>;
    getVideoComments(videoId: string): Promise<VideoComment[]>;
    addVideoComment(videoId: string, content: string, userId: string): Promise<VideoComment>;
    deleteVideoComment(videoId: string, commentId: string): Promise<boolean>;
};
export declare const testVideoData: {
    videos: Video[];
};
