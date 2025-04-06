import type { User, Video } from '@/types';
export declare const generateUsers: (count: number) => User[];
export declare const generateVideos: (users: User[], count: number) => Video[];
