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

    <!-- 调试信息 - 仅在开发环境显示 -->
    <div v-if="isDevelopment" class="debug-info">
      <n-tag type="info">角色: {{ authStore.userRole }}</n-tag>
      <n-tag v-if="authStore.isAdmin" type="success">是管理员</n-tag>
      <n-tag v-else type="error">不是管理员</n-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { useI18n } from 'vue-i18n';
  import { NDropdown, NAvatar, NTag } from 'naive-ui';

  const router = useRouter();
  const authStore = useAuthStore();
  const { t } = useI18n();

  const isOpen = ref(false);
  const menuRef = ref<HTMLElement | null>(null);

  // 开发环境标志
  const isDevelopment = import.meta.env.DEV;

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

  const userMenuOptions = computed(() => {
    const options = [
      {
        label: '个人资料',
        key: 'profile',
        onClick: () => router.push('/profile')
      },
      {
        label: '设置',
        key: 'settings',
        onClick: () => router.push('/settings')
      }
    ];

    // 如果用户是创作者，添加创作者中心选项
    if (authStore.isCreator) {
      options.unshift({
        label: '创作者中心',
        key: 'creator',
        onClick: () => router.push('/creator/studio')
      });
    }

    // 添加退出登录选项
    options.push({
      label: '退出登录',
      key: 'logout',
      onClick: handleLogout
    });

    return options;
  });

  const handleSelect = (key: string) => {
    if (key === 'logout') {
      handleLogout();
    }
  };
</script>

<style scoped>
  .user-menu {
    position: relative;
  }

  .menu-trigger {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: background-color var(--transition-normal);
  }

  .menu-trigger:hover {
    background-color: var(--tertiary-bg);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .username {
    color: var(--text-primary);
    font-size: var(--text-sm);
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: var(--spacing-sm);
    background-color: var(--primary-bg);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    min-width: 200px;
    z-index: 50;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    color: var(--text-primary);
    cursor: pointer;
    transition: background-color var(--transition-normal);
  }

  .menu-item:hover {
    background-color: var(--tertiary-bg);
  }

  .menu-item.danger {
    color: var(--error-color);
  }

  .menu-item.danger:hover {
    background-color: var(--error-bg);
    color: var(--error-text);
  }

  @media (max-width: 768px) {
    .username {
      display: none;
    }
  }

  /* 调试信息样式 */
  .debug-info {
    position: absolute;
    top: 60px;
    right: 0;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
</style>