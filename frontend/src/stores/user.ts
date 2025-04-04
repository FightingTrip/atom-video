import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false);
  const userInfo = ref<{
    id: string;
    username: string;
    nickname: string;
    avatar: string;
    email: string;
    verified: boolean;
  } | null>(null);

  // 登录
  const login = (user: typeof userInfo.value) => {
    isLoggedIn.value = true;
    userInfo.value = user;
  };

  // 登出
  const logout = () => {
    isLoggedIn.value = false;
    userInfo.value = null;
  };

  return {
    isLoggedIn,
    userInfo,
    login,
    logout,
  };
});
