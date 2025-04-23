/**
 * @file mockData.d.ts
 * @description mockData模块的类型声明
 */

declare module '@/utils/mockData' {
  export interface VideoAuthor {
    id: string;
    username: string;
    nickname?: string;
    avatar?: string;
    verified?: boolean;
  }

  export interface Video {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
    videoUrl: string;
    duration?: number;
    views: number;
    likes?: number;
    favorites?: number;
    comments?: number;
    createdAt: string;
    author: VideoAuthor;
    tags?: string[];
  }

  export function getVideoById(videoId: string): Video | undefined;
}

declare module '@/components/business/video/VideoPlayerComponent.vue';
