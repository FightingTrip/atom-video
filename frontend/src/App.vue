<!-- 
  App.vue 
  这是Vue应用的根组件，确保整个应用只有一个视图区域。
  简化结构，移除任何可能导致双重头部和重复滚动条的嵌套布局。
-->

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides" :locale="locale" :date-locale="dateLocale">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <app-message-registrar />
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch, markRaw, defineComponent } from 'vue'
  import { useThemeStore } from '@/stores/theme'
  import { useUserStore } from '@/stores/user'
  import {
    NConfigProvider,
    NMessageProvider,
    NNotificationProvider,
    NDialogProvider,
    NLoadingBarProvider,
    darkTheme,
    zhCN,
    dateZhCN,
    useMessage
  } from 'naive-ui'
  import { setGlobalMessage } from '@/composables/useToast'

  // 注册全局消息组件
  const AppMessageRegistrar = defineComponent({
    name: 'AppMessageRegistrar',
    setup() {
      const message = useMessage()

      // 设置全局消息实例，用于非组件上下文
      // 使用markRaw确保消息实例不被Vue的响应式系统代理，避免性能问题
      setGlobalMessage(markRaw(message))

      console.log('[App] 全局消息提供者已注册')

      return () => null
    }
  })

  // 全局状态
  const themeStore = useThemeStore()
  const userStore = useUserStore()

  // 主题计算
  const theme = computed(() => themeStore.isDark ? darkTheme : null)
  const themeOverrides = computed(() => themeStore.themeOverrides)

  // 设置区域化
  const locale = ref(zhCN)
  const dateLocale = ref(dateZhCN)

  // 在document根元素上设置深色模式类
  watch(() => themeStore.isDark, (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, { immediate: true })

  onMounted(async () => {
    try {
      // 初始化主题
      themeStore.initTheme()

      // 立即应用主题类
      if (themeStore.isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      // 初始化用户
      await userStore.initUser()

      console.log('[App] 应用初始化完成')
    } catch (error) {
      console.error('应用初始化失败', error)
    }
  })
</script>

<style>

  /* 全局CSS变量 */
  :root {
    /* 主题色 */
    --primary-color: #3b82f6;
    --primary-color-hover: #60a5fa;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --error-color: #ef4444;
    --info-color: #6366f1;

    /* 全局颜色 */
    --bg-color: #ffffff;
    --bg-color-secondary: #f9fafb;
    --text-color: #18181b;
    --text-color-secondary: #71717a;
    --text-color-placeholder: #a1a1aa;
    --border-color: #e5e7eb;
    --hover-color: #f3f4f6;

    /* 间距 */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;

    /* 尺寸 */
    --header-height: 56px;
    --sidebar-width: 240px;
    --sidebar-collapsed-width: 72px;
    --footer-height: 40px;

    /* 动画 */
    --transition-fast: 0.2s;
    --transition-normal: 0.3s;
    --transition-slow: 0.5s;

    /* 字体 */
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  }

  /* 深色主题 */
  [data-theme="dark"] {
    --bg-color: #18181b;
    --bg-color-secondary: #27272a;
    --text-color: #f4f4f5;
    --text-color-secondary: #a1a1aa;
    --text-color-placeholder: #71717a;
    --border-color: #3f3f46;
    --hover-color: #27272a;
  }

  /* 基础样式 */
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    font-family: var(--font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    background-color: var(--bg-color);
    color: var(--text-color);
    font-size: 16px;
    line-height: 1.5;
    overflow-x: hidden;
  }

  #app {
    height: 100%;
    width: 100%;
  }

  /* 过渡动画 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity var(--transition-fast) ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .n-config-provider {
    height: 100%;
  }
</style>
