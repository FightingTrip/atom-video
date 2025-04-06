export declare const userApi: {
    getUsers(page?: number, limit?: number): Promise<{
        users: import("../types").User[];
        total: number;
        hasMore: boolean;
    }>;
    getUserById(id: string): Promise<import("../types").User | undefined>;
};
export declare const videoApi: {
    getVideos(page?: number, limit?: number, tag?: string): Promise<{
        videos: import("../types").Video[];
        total: number;
        hasMore: boolean;
    }>;
    getVideoById(id: string): Promise<import("../types").Video | undefined>;
    getVideosByUser(userId: string, page?: number, limit?: number): Promise<{
        videos: import("../types").Video[];
        total: number;
        hasMore: boolean;
    }>;
};
