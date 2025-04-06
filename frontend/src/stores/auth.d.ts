import type { User, AuthResponse } from '@/types';
export declare const useAuthStore: import("pinia").StoreDefinition<"auth", {
    user: import("@vueuse/shared").RemovableRef<User | null>;
    token: import("@vueuse/shared").RemovableRef<string | null>;
    loading: boolean;
    error: string | null;
}, {
    isAuthenticated: (state: {
        user: User | null;
        token: string | null;
        loading: boolean;
        error: string | null;
    } & import("pinia").PiniaCustomStateProperties<{
        user: import("@vueuse/shared").RemovableRef<User | null>;
        token: import("@vueuse/shared").RemovableRef<string | null>;
        loading: boolean;
        error: string | null;
    }>) => boolean;
    isAdmin: (state: {
        user: User | null;
        token: string | null;
        loading: boolean;
        error: string | null;
    } & import("pinia").PiniaCustomStateProperties<{
        user: import("@vueuse/shared").RemovableRef<User | null>;
        token: import("@vueuse/shared").RemovableRef<string | null>;
        loading: boolean;
        error: string | null;
    }>) => boolean;
}, {
    login(email: string, password: string): Promise<boolean>;
    register(username: string, password: string, nickname?: string): Promise<boolean>;
    checkAuth(): Promise<boolean>;
    setAuth(auth: AuthResponse): void;
    setUser(user: User): void;
    logout(): void;
    clearError(): void;
}>;
