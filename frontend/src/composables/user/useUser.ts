import { ref, Ref } from 'vue';
import { User, UserProfile } from '@/models/User';
import { userService } from '@/services/user/userService';

export function useUser() {
  const user: Ref<User | null> = ref(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // 获取当前用户信息
  const fetchCurrentUser = async () => {
    loading.value = true;
    error.value = null;

    try {
      user.value = await userService.getCurrentUser();
    } catch (err) {
      error.value = err as Error;
      console.error('Failed to fetch current user:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    error,
    fetchCurrentUser,
  };
}

export function useUserProfile(userId: string | Ref<string>) {
  const profile: Ref<UserProfile | null> = ref(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // 获取用户资料
  const fetchUserProfile = async () => {
    loading.value = true;
    error.value = null;

    try {
      const id = typeof userId === 'string' ? userId : userId.value;
      profile.value = await userService.getUserProfile(id);
    } catch (err) {
      error.value = err as Error;
      console.error('Failed to fetch user profile:', err);
    } finally {
      loading.value = false;
    }
  };

  // 关注用户
  const followUser = async () => {
    try {
      const id = typeof userId === 'string' ? userId : userId.value;
      await userService.followUser(id);

      // 更新本地状态
      if (profile.value) {
        profile.value = {
          ...profile.value,
          isFollowing: true,
        };
      }
    } catch (err) {
      console.error('Failed to follow user:', err);
      throw err;
    }
  };

  // 取消关注用户
  const unfollowUser = async () => {
    try {
      const id = typeof userId === 'string' ? userId : userId.value;
      await userService.unfollowUser(id);

      // 更新本地状态
      if (profile.value) {
        profile.value = {
          ...profile.value,
          isFollowing: false,
        };
      }
    } catch (err) {
      console.error('Failed to unfollow user:', err);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    fetchUserProfile,
    followUser,
    unfollowUser,
  };
}
