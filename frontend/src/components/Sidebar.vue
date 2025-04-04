<template>
  <div 
    class="fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-40"
    :class="[isCollapsed ? 'w-[72px]' : 'w-60']"
  >
    <!-- 收缩按钮 -->
    <button 
      class="absolute -right-3 top-4 w-6 h-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center cursor-pointer z-50 hover:bg-gray-100 dark:hover:bg-gray-800"
      @click="toggleSidebar"
    >
      <i :class="['fas', isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left', 'text-xs']"></i>
    </button>

    <div class="h-full overflow-y-auto overflow-x-hidden">
      <!-- 主导航 -->
      <nav class="p-2 space-y-1">
        <router-link
          v-for="item in mainNavItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative group"
          :class="[
            isActive(item.path)
              ? 'bg-gray-100 dark:bg-gray-800 text-blue-500'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
          ]"
        >
          <i :class="['fas', item.icon, isCollapsed ? 'text-xl' : '', 'w-5 text-center']"></i>
          <span 
            class="whitespace-nowrap transition-all duration-300"
            :class="[isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto']"
          >
            {{ item.title }}
          </span>
          <div 
            v-if="isCollapsed"
            class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto whitespace-nowrap z-50"
          >
            {{ item.title }}
          </div>
        </router-link>
      </nav>

      <!-- 分隔线 -->
      <div 
        class="my-2 border-t border-gray-200 dark:border-gray-800"
        :class="[isCollapsed ? 'mx-2' : 'mx-4']"
      ></div>

      <!-- 订阅列表 -->
      <div class="p-2">
        <h3 
          class="px-3 mb-2 text-sm font-medium text-gray-500 dark:text-gray-400"
          :class="[isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto']"
        >
          {{ $t('sidebar.subscriptions') }}
        </h3>
        <div class="space-y-1">
          <router-link
            v-for="channel in subscriptions"
            :key="channel.id"
            :to="`/channel/${channel.id}`"
            class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative group"
            :class="[
              isActive(`/channel/${channel.id}`)
                ? 'bg-gray-100 dark:bg-gray-800 text-blue-500'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            <n-avatar
              :src="channel.avatar"
              :round="true"
              :size="isCollapsed ? 'medium' : 'small'"
            />
            <span 
              class="truncate transition-all duration-300"
              :class="[isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto']"
            >
              {{ channel.name }}
            </span>
            <div 
              v-if="isCollapsed"
              class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto whitespace-nowrap z-50"
            >
              {{ channel.name }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app';

const { t } = useI18n();
const route = useRoute();
const appStore = useAppStore();
const { isSidebarCollapsed } = storeToRefs(appStore);

const isCollapsed = computed(() => isSidebarCollapsed.value);
const isHovered = ref(false);

// 主导航项 - 使用计算属性以支持多语言
const mainNavItems = computed(() => [
  { 
    path: '/', 
    title: t('sidebar.home'), 
    icon: 'fa-home' 
  },
  { 
    path: '/trending', 
    title: t('sidebar.trending'), 
    icon: 'fa-fire' 
  },
  { 
    path: '/subscriptions', 
    title: t('sidebar.subscriptions'), 
    icon: 'fa-play' 
  },
  { 
    path: '/library', 
    title: t('sidebar.library'), 
    icon: 'fa-folder' 
  },
  { 
    path: '/history', 
    title: t('sidebar.history'), 
    icon: 'fa-history' 
  },
]);

// 模拟订阅数据 - 实际应用中应该从API获取
const subscriptions = ref([
  { 
    id: '1', 
    name: t('channels.techChannel'), 
    avatar: 'https://via.placeholder.com/40',
    type: 'tech'
  },
  { 
    id: '2', 
    name: t('channels.musicChannel'), 
    avatar: 'https://via.placeholder.com/40',
    type: 'music'
  },
  { 
    id: '3', 
    name: t('channels.gamingChannel'), 
    avatar: 'https://via.placeholder.com/40',
    type: 'gaming'
  },
]);

// 判断路由是否激活
const isActive = (path: string) => {
  return route.path === path;
};

const toggleSidebar = () => {
  appStore.toggleSidebar();
};
</script>

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}
</style>