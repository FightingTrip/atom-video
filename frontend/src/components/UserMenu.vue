<template>
  <div class="relative" ref="menuRef">
    <button class="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      @click="isOpen = !isOpen">
      <img :src="authStore.user?.avatar || '/default-avatar.svg'" :alt="authStore.user?.nickname || '用户头像'"
        class="w-8 h-8 rounded-full" />
      <span class="text-gray-700 dark:text-gray-200">{{ authStore.user?.nickname || '未登录' }}</span>
    </button>

    <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1">
      <template v-if="authStore.isAuthenticated">
        <router-link to="/profile"
          class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          个人资料
        </router-link>
        <router-link to="/settings"
          class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          设置
        </router-link>
        <button @click="handleLogout"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          退出登录
        </button>
      </template>
      <template v-else>
        <router-link to="/auth/login"
          class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          登录
        </router-link>
        <router-link to="/auth/register"
          class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          注册
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';

  const router = useRouter();
  const authStore = useAuthStore();
  const isOpen = ref(false);
  const menuRef = ref<HTMLElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
      isOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  const handleLogout = async () => {
    await authStore.logout();
    isOpen.value = false;
    router.push('/auth/login');
  };
</script>