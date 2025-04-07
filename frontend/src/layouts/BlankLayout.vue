/**
* @file BlankLayout.vue
* @description 空白布局组件，用于不需要导航栏和侧边栏的页面
* @features
* - 最小化布局
* - 响应式设计
* - 主题适配
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="blank-layout" :data-theme="isDarkMode ? 'dark' : 'light'">
    <!-- 调试信息
    <div
      style="position: fixed; top: 0; left: 0; color: white; z-index: 9999; padding: 10px; background: rgba(0,0,0,0.5);">
      BlankLayout Loaded - {{ new Date().toLocaleTimeString() }}
    </div> -->

    <!-- 显式包含RouterView组件 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onBeforeMount, onUpdated, useSlots, computed } from 'vue'
  import { useThemeStore } from '@/stores/theme'

  // 获取主题状态
  const themeStore = useThemeStore()
  const isDarkMode = computed(() => themeStore.isDark)

  // 调试信息
  console.log('[BlankLayout] 组件定义阶段')

  const slots = useSlots()

  onBeforeMount(() => {
    console.log('[BlankLayout] onBeforeMount 触发')
  })

  onMounted(() => {
    console.log('[BlankLayout] onMounted 触发', {
      slots: slots,
      hasDefaultSlot: !!slots.default,
      slotContent: slots.default && slots.default()
    })

    // 确保整个页面背景也是黑色
    document.body.style.backgroundColor = '#000';
  })

</script>

<style scoped>
  .blank-layout {
    min-height: 100vh;
    width: 100%;
    background-color: #000;
    color: var(--text-color);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    overflow: auto;
  }

  .blank-layout[data-theme="light"] {
    background-color: #000;
  }

  .blank-layout[data-theme="dark"] {
    background-color: #000;
  }

  /* 淡入淡出过渡效果 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>