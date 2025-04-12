/**
* @file DefaultLayout.vue
* @description 默认布局组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="layout-container" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!-- 顶部导航栏 -->
    <TheHeader @toggle-sidebar="toggleSidebar" />

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 侧边栏 -->
      <TheSidebar :collapsed="sidebarCollapsed" />

      <!-- 主内容区域 -->
      <main class="content-area" :data-theme="isDarkMode ? 'dark' : 'light'">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- 底部 -->
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
  import TheSidebar from '@/layouts/components/TheSidebar.vue'
  import TheHeader from '@/layouts/components/TheHeader.vue'
  import TheFooter from '@/layouts/components/TheFooter.vue'
  import { useThemeStore } from '@/stores/theme'

  // 获取主题状态
  const themeStore = useThemeStore()
  const isDarkMode = computed(() => themeStore.isDark)

  // 布局状态持久化
  const LAYOUT_STORAGE_KEY = 'atom-video-layout-state'

  // 侧边栏折叠状态
  const sidebarCollapsed = ref(false)

  // 从本地存储加载布局状态
  const loadLayoutState = () => {
    const savedState = localStorage.getItem(LAYOUT_STORAGE_KEY)
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        sidebarCollapsed.value = state.sidebarCollapsed
      } catch (error) {
        console.error('Failed to load layout state:', error)
      }
    }
  }

  // 保存布局状态到本地存储
  const saveLayoutState = () => {
    const state = {
      sidebarCollapsed: sidebarCollapsed.value
    }
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(state))
  }

  // 切换侧边栏状态
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  // 监听侧边栏状态变化
  watch(sidebarCollapsed, () => {
    saveLayoutState()
  })

  // 处理窗口大小变化
  const handleResize = () => {
    if (window.innerWidth < 768) {
      sidebarCollapsed.value = true;
    }
  }

  // 组件挂载时加载布局状态
  onMounted(() => {
    loadLayoutState()

    // 在移动设备上默认折叠侧边栏
    if (window.innerWidth < 768 && !sidebarCollapsed.value) {
      sidebarCollapsed.value = true;
    }

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
  })

  // 组件卸载前移除事件监听
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  })
</script>

<style scoped>
  .layout-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100%;
    background-color: var(--bg-dark, #0d1117);
    position: relative;
    overflow: hidden;
  }

  /* 浅色模式下的容器背景 */
  :root:not(.dark) .layout-container {
    background-color: #f6f8fa;
  }

  .main-container {
    display: flex;
    flex: 1;
    height: calc(100vh - 56px - 40px);
    /* 减去头部和底部的高度 */
    position: relative;
  }

  .content-area {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    padding-top: 24px;
    margin-left: 240px;
    /* 与侧边栏宽度匹配 */
    width: calc(100% - 240px);
    transition: margin-left 0.3s, width 0.3s, background-color 0.3s;
    background-color: var(--bg-dark, #0d1117);
    color: var(--text-primary, #e6edf3);
  }

  /* 浅色模式内容区域 */
  :root:not(.dark) .content-area {
    background-color: var(--studio-bg, linear-gradient(180deg, #f6f8fa 0%, #ffffff 100%));
    color: var(--text-primary, #24292e);
  }

  .content-area[data-theme="dark"] {
    background-color: var(--bg-dark, #0d1117);
  }

  .sidebar-collapsed .content-area {
    margin-left: 72px;
    /* 与折叠侧边栏宽度匹配 */
    width: calc(100% - 72px);
  }

  /* 页面切换动画 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* 响应式布局 */
  @media (max-width: 1280px) {
    .content-area {
      padding: 16px;
    }
  }

  @media (max-width: 768px) {
    .content-area {
      padding: 12px;
      margin-left: 0 !important;
      width: 100% !important;
    }

    .sidebar-collapsed .content-area {
      margin-left: 0;
    }
  }
</style>