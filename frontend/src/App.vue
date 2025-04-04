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
  import { computed, ref, onMounted } from 'vue';
  import { useThemeStore } from '@/stores/theme';
  import { darkTheme, lightTheme } from 'naive-ui';
  import ThemeToggle from '@/components/ThemeToggle.vue';
  import UserMenu from '@/components/UserMenu.vue';
  import Sidebar from '@/components/Sidebar.vue';
  import SearchBar from '@/components/SearchBar.vue';
  import TheHeader from '@/components/layout/TheHeader.vue';
  import TheSidebar from '@/components/layout/TheSidebar.vue';
  import TheFooter from '@/components/layout/TheFooter.vue';

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
    TheHeader,
    TheSidebar,
    TheFooter,
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

  // 初始化主题
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      themeStore.toggleTheme();
    }
  });
</script>

<template>
  <n-config-provider :theme="themeStore.theme">
    <n-message-provider>
      <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
        <TheHeader />
        <div class="flex">
          <TheSidebar />
          <main class="flex-1 ml-0 lg:ml-64 pt-14">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </main>
        </div>
        <TheFooter />
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
  @import '@fortawesome/fontawesome-free/css/all.min.css';

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
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
