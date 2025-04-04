<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <TheHeader @toggle-sidebar="toggleSidebar" />

    <!-- 桌面端侧边栏 -->
    <Sidebar v-if="breakpoints.md" />

    <!-- 移动端抽屉菜单 -->
    <n-drawer v-model:show="isDrawerOpen" :width="280" placement="left" v-else>
      <Sidebar class="!fixed !top-0" />
    </n-drawer>

    <!-- 主内容区 -->
    <main class="transition-all duration-300" :class="[
      breakpoints.md ? (isCollapsed ? 'ml-[72px]' : 'ml-60') : 'ml-0',
      'pt-14 min-h-screen'
    ]">
      <div class="container mx-auto px-4 py-6" :class="[breakpoints.xl ? 'max-w-7xl' : '']">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- 移动端底部导航 -->
    <nav v-if="!breakpoints.md"
      class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40">
      <div class="flex justify-around py-2">
        <router-link v-for="item in mobileNavItems" :key="item.path" :to="item.path"
          class="flex flex-col items-center px-4 py-2" :class="[
            isActive(item.path)
              ? 'text-blue-500'
              : 'text-gray-700 dark:text-gray-300'
          ]">
          <i :class="['fas', item.icon, 'text-xl']"></i>
          <span class="text-xs mt-1">{{ item.title }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  import { useAppStore } from '@/stores/app';
  import { useBreakpoints } from '@/composables/useBreakpoints';
  import TheHeader from '@/components/TheHeader.vue';
  import Sidebar from '@/components/Sidebar.vue';

  const route = useRoute();
  const appStore = useAppStore();
  const { isCollapsed, isDrawerOpen } = storeToRefs(appStore);
  const breakpoints = useBreakpoints();

  const mobileNavItems = computed(() => [
    { path: '/', title: '首页', icon: 'fa-home' },
    { path: '/trending', title: '趋势', icon: 'fa-fire' },
    { path: '/subscriptions', title: '订阅', icon: 'fa-play' },
    { path: '/library', title: '媒体库', icon: 'fa-folder' },
  ]);

  const isActive = (path: string) => route.path === path;

  const toggleSidebar = () => {
    if (breakpoints.value.md) {
      appStore.toggleSidebar();
    } else {
      appStore.toggleDrawer();
    }
  };
</script>

<style scoped>

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>