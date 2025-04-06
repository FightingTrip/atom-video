import type { User } from '@/types';
interface UserState {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
}
export declare const useUserStore: import("pinia").StoreDefinition<"user", UserState, {
    isLoggedIn: (state: {
        user: {
            id: string;
            username: string;
            email: string;
            nickname: string;
            avatar: string;
            bio: string;
            verified: boolean;
            subscribers: number;
            subscribing: number;
            totalViews: number;
            joinedAt: string;
            isFollowed?: boolean | undefined;
            social?: {
                website?: string | undefined;
                github?: string | undefined;
                twitter?: string | undefined;
            } | undefined;
        } | null;
        isLoading: boolean;
        error: Error | null;
    } & import("pinia").PiniaCustomStateProperties<UserState>) => boolean;
    username: (state: {
        user: {
            id: string;
            username: string;
            email: string;
            nickname: string;
            avatar: string;
            bio: string;
            verified: boolean;
            subscribers: number;
            subscribing: number;
            totalViews: number;
            joinedAt: string;
            isFollowed?: boolean | undefined;
            social?: {
                website?: string | undefined;
                github?: string | undefined;
                twitter?: string | undefined;
            } | undefined;
        } | null;
        isLoading: boolean;
        error: Error | null;
    } & import("pinia").PiniaCustomStateProperties<UserState>) => string;
    avatarUrl: (state: {
        user: {
            id: string;
            username: string;
            email: string;
            nickname: string;
            avatar: string;
            bio: string;
            verified: boolean;
            subscribers: number;
            subscribing: number;
            totalViews: number;
            joinedAt: string;
            isFollowed?: boolean | undefined;
            social?: {
                website?: string | undefined;
                github?: string | undefined;
                twitter?: string | undefined;
            } | undefined;
        } | null;
        isLoading: boolean;
        error: Error | null;
    } & import("pinia").PiniaCustomStateProperties<UserState>) => string;
    userId: (state: {
        user: {
            id: string;
            username: string;
            email: string;
            nickname: string;
            avatar: string;
            bio: string;
            verified: boolean;
            subscribers: number;
            subscribing: number;
            totalViews: number;
            joinedAt: string;
            isFollowed?: boolean | undefined;
            social?: {
                website?: string | undefined;
                github?: string | undefined;
                twitter?: string | undefined;
            } | undefined;
        } | null;
        isLoading: boolean;
        error: Error | null;
    } & import("pinia").PiniaCustomStateProperties<UserState>) => string;
    userRole: (state: {
        user: {
            id: string;
            username: string;
            email: string;
            nickname: string;
            avatar: string;
            bio: string;
            verified: boolean;
            subscribers: number;
            subscribing: number;
            totalViews: number;
            joinedAt: string;
            isFollowed?: boolean | undefined;
            social?: {
                website?: string | undefined;
                github?: string | undefined;
                twitter?: string | undefined;
            } | undefined;
        } | null;
        isLoading: boolean;
        error: Error | null;
    } & import("pinia").PiniaCustomStateProperties<UserState>) => any;
    isAdmin: (state: {
        user: {
            id: string;
            username: string;
            email: string;
            nickname: string;
            avatar: string;
            bio: string;
            verified: boolean;
            subscribers: number;
            subscribing: number;
            totalViews: number;
            joinedAt: string;
            isFollowed?: boolean | undefined;
            social?: {
                website?: string | undefined;
                github?: string | undefined;
                twitter?: string | undefined;
            } | undefined;
        } | null;
        isLoading: boolean;
        error: Error | null;
    } & import("pinia").PiniaCustomStateProperties<UserState>) => boolean;
    isCreator: (state: {
        user: {
            id: string;
            username: string;
            email: string;
            nickname: string;
            avatar: string;
            bio: string;
            verified: boolean;
            subscribers: number;
            subscribing: number;
            totalViews: number;
            joinedAt: string;
            isFollowed?: boolean | undefined;
            social?: {
                website?: string | undefined;
                github?: string | undefined;
                twitter?: string | undefined;
            } | undefined;
        } | null;
        isLoading: boolean;
        error: Error | null;
    } & import("pinia").PiniaCustomStateProperties<UserState>) => boolean;
}, {
    fetchCurrentUser(): Promise<void>;
    updateProfile(data: any): Promise<void>;
    setUser(user: User | null): void;
    clearUser(): void;
    setError(error: Error | null): void;
    refreshToken(): any;
    logout(): Promise<void>;
}>;
export {};
