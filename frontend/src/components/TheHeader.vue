<template>
  <header
    class="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
    <div class="flex items-center justify-between h-full px-4">
      <!-- 左侧区域：菜单按钮和 Logo -->
      <div class="flex items-center gap-4">
        <button 
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          @click="toggleSidebar"
          aria-label="Toggle sidebar"
        >
          <i class="fas fa-bars text-lg"></i>
        </button>
        <router-link to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <i class="fas fa-play text-white"></i>
          </div>
          <span class="text-xl font-bold hidden sm:inline">Atom Video</span>
        </router-link>
      </div>

      <!-- 中间区域：搜索框 -->
      <div class="flex-1 max-w-2xl mx-4">
        <SearchBar />
      </div>

      <!-- 右侧区域：工具栏 -->
      <div class="flex items-center gap-2">
        <ThemeToggle />
        <LanguageSelector />
        
        <template v-if="!isLoggedIn">
          <n-button
            secondary
            class="hidden sm:inline-flex min-w-20"
            @click="router.push('/auth/login')"
          >
            {{ $t('auth.login') }}
          </n-button>
          <n-button
            type="primary"
            class="min-w-20"
            @click="router.push('/auth/register')"
          >
            {{ $t('auth.register') }}
          </n-button>
        </template>

        <template v-else>
          <n-dropdown
            :options="userMenuOptions"
            @select="handleUserMenuSelect"
            trigger="click"
          >
            <n-avatar
              :src="userAvatar"
              :round="true"
              class="cursor-pointer"
            />
          </n-dropdown>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { useAuthStore } from '@/stores/auth';
  import SearchBar from './SearchBar.vue';
  import ThemeToggle from './ThemeToggle.vue';
  import LanguageSelector from './LanguageSelector.vue';
  import { useAppStore } from '@/stores/app';

  const router = useRouter();
  const { t } = useI18n();
  const authStore = useAuthStore();
  const appStore = useAppStore();

  const isLoggedIn = computed(() => authStore.isLoggedIn);
  const userAvatar = computed(() => authStore.user?.avatar || 'https://via.placeholder.com/40');

  const userMenuOptions = computed(() => [
    {
      label: t('user.profile'),
      key: 'profile',
      icon: 'fas fa-user'
    },
    {
      label: t('user.settings'),
      key: 'settings',
      icon: 'fas fa-cog'
    },
    {
      type: 'divider'
    },
    {
      label: t('auth.logout'),
      key: 'logout',
      icon: 'fas fa-sign-out-alt'
    }
  ]);

  const handleUserMenuSelect = (key: string) => {
    switch (key) {
      case 'profile':
        router.push('/user/profile');
        break;
      case 'settings':
        router.push('/user/settings');
        break;
      case 'logout':
        authStore.logout();
        router.push('/');
        break;
    }
  };

  const toggleSidebar = () => {
    appStore.toggleSidebar();
  };
</script>