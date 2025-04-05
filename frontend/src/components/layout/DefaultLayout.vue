/**
* @file DefaultLayout.vue
* @description 默认布局组件，包含顶部导航栏、侧边栏和页脚
* @features
* - 响应式布局，支持移动端和桌面端
* - 可折叠的侧边栏
* - 主题切换支持
* - 布局状态持久化
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- 侧边栏 -->
    <TheSidebar v-model:collapsed="sidebarCollapsed" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶部导航栏 -->
      <TheHeader />

      <!-- 主内容区域 -->
      <main class="flex-1 overflow-auto p-4">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- 底部 -->
      <TheFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import TheSidebar from '@/components/layout/TheSidebar.vue'
  import TheHeader from '@/components/layout/TheHeader.vue'
  import TheFooter from '@/components/layout/TheFooter.vue'

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

  // 监听侧边栏状态变化
  watch(sidebarCollapsed, () => {
    saveLayoutState()
  })

  // 组件挂载时加载布局状态
  onMounted(() => {
    loadLayoutState()
  })
</script>

<style scoped>

  /* 页面切换动画 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* 响应式布局样式 */
  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      z-index: 40;
    }
  }
</style>