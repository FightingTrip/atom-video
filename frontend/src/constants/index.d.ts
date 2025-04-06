/**
 * @file index.ts
 * @description 常量配置文件
 * @author Atom Video Team
 * @date 2025-04-06
 */
export declare const APP_CONFIG: {
    name: string;
    version: string;
    description: string;
};
export declare const VIDEO_CONFIG: {
    maxFileSize: number;
    allowedTypes: string[];
    maxDuration: number;
    thumbnailSize: {
        width: number;
        height: number;
    };
};
export declare const USER_CONFIG: {
    maxAvatarSize: number;
    allowedAvatarTypes: string[];
    maxBioLength: number;
    maxUsernameLength: number;
};
export declare const PAGINATION_CONFIG: {
    defaultPageSize: number;
    maxPageSize: number;
};
export declare const CACHE_CONFIG: {
    videoCacheDuration: number;
    userCacheDuration: number;
    tagCacheDuration: number;
};
export declare const THEME_CONFIG: {
    light: {
        primary: string;
        success: string;
        warning: string;
        error: string;
        background: string;
        text: string;
    };
    dark: {
        primary: string;
        success: string;
        warning: string;
        error: string;
        background: string;
        text: string;
    };
};
