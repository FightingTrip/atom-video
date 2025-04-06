import { Ref } from 'vue';
import { User, UserProfile } from '@/models/User';
export declare function useUser(): {
    user: Ref<User | null, User | null>;
    loading: Ref<boolean, boolean>;
    error: Ref<Error | null, Error | null>;
    fetchCurrentUser: () => Promise<void>;
};
export declare function useUserProfile(userId: string | Ref<string>): {
    profile: Ref<UserProfile | null, UserProfile | null>;
    loading: Ref<boolean, boolean>;
    error: Ref<Error | null, Error | null>;
    fetchUserProfile: () => Promise<void>;
    followUser: () => Promise<void>;
    unfollowUser: () => Promise<void>;
};
