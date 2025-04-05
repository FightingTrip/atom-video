/**
* @file UserMenu.vue
* @description 用户菜单组件，用于显示用户相关的操作菜单
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 用户信息：显示用户头像和用户名
* - 菜单选项：提供用户相关的功能入口
* - 下拉菜单：支持展开/收起菜单
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useUserStore: 用户状态管理
* - naive-ui: UI组件库
* - vue-i18n: 国际化支持
*/

<template>
  <div class="relative">
    <!-- 未登录状态 -->
    <template v-if="!authStore.isAuthenticated">
      <div class="flex items-center gap-2">
        <n-button size="small" ghost @click="router.push('/auth')">
          {{ $t('auth.login') }}
        </n-button>
        <n-button size="small" type="primary" @click="router.push('/auth')">
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