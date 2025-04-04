<!-- 
  技术栈说明：
  - Vue 3: 使用 Composition API 和 <script setup> 语法
  - TypeScript: 强类型支持
  - Tailwind CSS: 样式框架
  - Vue Router: 路由管理
  - Pinia: 状态管理
-->

<script setup lang="ts">
  // 导入路由视图
  import { RouterView } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  // 导入 Naive UI 组件
  import { NConfigProvider, NMessageProvider, NButton, NDropdown, NAvatar } from 'naive-ui'
  // 导入 Toast 组件
  import Toast from '@/components/Toast.vue'
  import LanguageSelector from '@/components/LanguageSelector.vue'
  import { computed, ref } from 'vue';
  import { useThemeStore } from '@/stores/theme';
  import { darkTheme, lightTheme } from 'naive-ui';
  import ThemeToggle from '@/components/ThemeToggle.vue';
  import UserMenu from '@/components/UserMenu.vue';
  import Sidebar from '@/components/Sidebar.vue';
  import SearchBar from '@/components/SearchBar.vue';

  // 声明使用的组件
  const components = {
    NConfigProvider,
    NMessageProvider,
    RouterView,
    Toast,
    LanguageSelector,
    ThemeToggle,
    UserMenu,
    Sidebar,
    SearchBar,
  };

  const { t } = useI18n();

  const themeStore = useThemeStore();

  const theme = computed(() => {
    return themeStore.isDark ? darkTheme : lightTheme;
  });

  const sidebarRef = ref();

  const toggleSidebar = () => {
    sidebarRef.value?.toggle();
  };
</script>

<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <div class="min-h-screen transition-colors duration-200"
        :class="[themeStore.isDark ? 'dark bg-gray-900' : 'bg-white']">
        <!-- 顶部导航栏 -->
        <nav
          class="fixed top-0 left-0 right-0 h-14 z-50 transition-colors duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center h-full px-4">
            <!-- 菜单按钮 -->
            <button @click="toggleSidebar"
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2">
              <i class="fas fa-bars"></i>
            </button>

            <!-- Logo -->
            <router-link to="/" class="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img src="/logo-192.png" alt="Atom Video" class="h-8 w-8" />
              <span class="text-xl font-semibold">Atom Video</span>
            </router-link>

            <!-- 搜索栏 -->
            <div class="flex-1 max-w-2xl mx-4">
              <SearchBar />
            </div>

            <!-- 右侧工具栏 -->
            <div class="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSelector />
              <UserMenu />
            </div>
          </div>
        </nav>

        <!-- 侧边栏 -->
        <Sidebar ref="sidebarRef" />

        <!-- 主要内容区 -->
        <main class="pt-14 pl-60 transition-all duration-300">
          <div class="max-w-7xl mx-auto px-4">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </main>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
  @import '@fortawesome/fontawesome-free/css/all.min.css';

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* 自定义滚动条 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #666;
  }

  /* 深色模式滚动条 */
  .dark ::-webkit-scrollbar-thumb {
    background: #666;
  }

  .dark ::-webkit-scrollbar-thumb:hover {
    background: #888;
  }
</style>
