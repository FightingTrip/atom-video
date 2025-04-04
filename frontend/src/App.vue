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
  import TagList from '@/components/TagList.vue'
  import { useI18nStore } from '@/stores/i18n'
  import { useVideoStore } from '@/stores/video'

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
    TagList
  };

  const { t, locale } = useI18n();

  const themeStore = useThemeStore();
  const i18nStore = useI18nStore();
  const videoStore = useVideoStore();

  const theme = computed(() => {
    return themeStore.isDark ? darkTheme : lightTheme;
  });

  const sidebarCollapsed = ref(false);
  const selectedTag = ref('all');

  const currentLanguageLabel = computed(() =>
    i18nStore.currentLocale === 'zh-CN' ? '简体中文' : 'English'
  );

  const languageOptions = [
    {
      label: '简体中文',
      key: 'zh-CN',
    },
    {
      label: 'English',
      key: 'en-US',
    }
  ];

  const handleLanguageChange = (key: string) => {
    i18nStore.setLocale(key);
  };

  const toggleTheme = () => {
    themeStore.toggleTheme();
  };

  const tags = [
    { id: 'all', name: 'all' },
    { id: 'javascript', name: 'javascript' },
    { id: 'typescript', name: 'typescript' },
    { id: 'vue', name: 'vue' },
    { id: 'react', name: 'react' },
    { id: 'nodejs', name: 'nodejs' },
    { id: 'python', name: 'python' },
  ];

  const selectTag = (tagId: string) => {
    selectedTag.value = tagId;
    videoStore.setCategory(tagId);
  };

  // 初始化主题
  onMounted(() => {
    i18nStore.initLocale();
    themeStore.initTheme();

    // 设置初始语言
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18nStore.setLocale(savedLanguage);
      locale.value = savedLanguage;
    }
  });
</script>

<template>
  <n-config-provider :theme="themeStore.naiveTheme" :theme-overrides="themeStore.themeOverrides">
    <n-message-provider>
      <div class="flex h-screen app-container">
        <!-- 侧边栏 -->
        <TheSidebar v-model:collapsed="sidebarCollapsed" />

        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- 顶部导航栏 - 搜索栏居中，标题和功能按钮靠两边 -->
          <div class="h-14 flex items-center px-6 border-b theme-header">
            <!-- 左侧标题 -->
            <h1 class="text-xl font-bold theme-title whitespace-nowrap">
              Make Develop All In One
            </h1>

            <!-- 中间搜索栏 -->
            <div class="flex-1 mx-4 flex justify-center">
              <div class="relative w-full max-w-xl">
                <input type="text" :placeholder="t('header.search')"
                  class="w-full h-10 pl-10 pr-10 rounded-full bg-gray-700 dark:bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600" />
                <i class="fas fa-search absolute left-4 top-3 text-gray-400"></i>
                <div class="absolute right-2 top-1.5 h-7 w-7 flex items-center justify-center rounded-full">
                  <i class="fas fa-microphone text-gray-400"></i>
                </div>
              </div>
            </div>

            <!-- 右侧功能按钮 -->
            <div class="flex items-center space-x-2 whitespace-nowrap">
              <!-- 语言切换 -->
              <n-dropdown :options="languageOptions" @select="handleLanguageChange" trigger="click">
                <n-button quaternary>
                  <template #icon>
                    <i class="fas fa-globe text-lg"></i>
                  </template>
                  <span class="ml-1">{{ currentLanguageLabel }}</span>
                </n-button>
              </n-dropdown>

              <!-- 主题切换 -->
              <n-button quaternary @click="toggleTheme">
                <template #icon>
                  <i :class="['fas', themeStore.isDark ? 'fa-sun' : 'fa-moon', 'text-lg']"></i>
                </template>
              </n-button>

              <!-- 登录按钮 -->
              <n-button type="primary">
                {{ t('header.login') }}
              </n-button>
            </div>
          </div>

          <!-- 标签导航 -->
          <div class="h-12 flex items-center space-x-2 px-4 overflow-x-auto theme-tag-bar">
            <button v-for="tag in tags" :key="tag.id" :class="[
              'px-4 py-1 rounded-full text-sm font-medium transition-colors theme-tag',
              selectedTag === tag.id ? 'theme-tag-active' : 'theme-tag-inactive'
            ]" @click="selectTag(tag.id)">
              {{ t(`tags.${tag.name}`) }}
            </button>
          </div>

          <!-- 主内容 -->
          <main class="flex-1 overflow-auto theme-content p-4">
            <router-view />
          </main>

          <!-- 底部 -->
          <TheFooter />
        </div>
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
  @import '@fortawesome/fontawesome-free/css/all.min.css';

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

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

  .theme-title {
    color: var(--text-color);
    background: v-bind('themeStore.isDark ? "var(--primary-color)" : "var(--text-color)"');
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .theme-search-bar {
    background-color: var(--header-bg);
    border-color: var(--border-color);
    transition: background-color var(--transition-duration), border-color var(--transition-duration);
  }
</style>
