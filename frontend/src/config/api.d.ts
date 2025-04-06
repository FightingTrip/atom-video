/**
 * @file api.ts
 * @description API 配置文件
 * @author Atom Video Team
 * @date 2025-04-06
 */
export declare const API_CONFIG: {
    baseURL: any;
    timeout: number;
    headers: {
        'Content-Type': string;
    };
};
export declare const api: any;
export declare const API_ENDPOINTS: {
    video: {
        list: string;
        detail: (id: string) => string;
        upload: string;
        delete: (id: string) => string;
        like: (id: string) => string;
        favorite: (id: string) => string;
        comment: (id: string) => string;
    };
    user: {
        profile: string;
        settings: string;
        subscriptions: string;
        history: string;
    };
    tag: {
        list: string;
        detail: (id: string) => string;
        popular: string;
        trending: string;
    };
    auth: {
        login: string;
        register: string;
        logout: string;
        refresh: string;
    };
};
