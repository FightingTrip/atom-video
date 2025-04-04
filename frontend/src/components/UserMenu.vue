<template>
  <div class="relative">
    <!-- 未登录状态 -->
    <template v-if="!authStore.isAuthenticated">
      <div class="flex items-center gap-2">
        <n-button size="small" ghost @click="router.push('/auth/login')">
          {{ $t('auth.login') }}
        </n-button>
        <n-button size="small" type="primary" @click="router.push('/auth/register')">
          {{ $t('auth.register') }}
        </n-button>
      </div>
    </template>

    <!-- 已登录状态 -->
    <template v-else>
      <n-dropdown trigger="click" :options="userMenuOptions" @select="handleSelect">
        <div
          class="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <n-avatar :src="authStore.user?.avatar || '/default-avatar.svg'" :round="true" :size="32" />
          <span class="text-gray-700 dark:text-gray-200">{{ authStore.user?.nickname || '未登录' }}</span>
        </div>
      </n-dropdown>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { useI18n } from 'vue-i18n';
  import { NDropdown, NAvatar } from 'naive-ui';

  const router = useRouter();
  const authStore = useAuthStore();
  const { t } = useI18n();

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

  const userMenuOptions = [
    {
      label: '个人资料',
      key: 'profile',
      onClick: () => router.push('/profile')
    },
    {
      label: '设置',
      key: 'settings',
      onClick: () => router.push('/settings')
    },
    {
      label: '退出登录',
      key: 'logout',
      onClick: handleLogout
    }
  ];

  const handleSelect = (key: string) => {
    if (key === 'logout') {
      handleLogout();
    }
  };
</script>