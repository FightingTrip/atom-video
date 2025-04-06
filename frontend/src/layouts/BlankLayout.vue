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
  <div class="blank-layout">
    <!-- 调试信息 -->
    <div
      style="position: fixed; top: 0; left: 0; color: white; z-index: 9999; padding: 10px; background: rgba(0,0,0,0.5);">
      BlankLayout Loaded - {{ new Date().toLocaleTimeString() }}
    </div>

    <!-- 调试插槽内容 -->
    <div
      style="position: fixed; top: 30px; left: 0; color: white; z-index: 9999; padding: 10px; background: rgba(0,0,255,0.5);">
      BlankLayout Slot Content: {{ hasSlotContent ? '有内容' : '无内容' }}
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeMount, onUpdated, useSlots, computed } from 'vue'

  // 调试信息
  console.log('[BlankLayout] 组件定义阶段')

  const slots = useSlots()
  const hasSlotContent = computed(() => {
    return !!slots.default
  })

  onBeforeMount(() => {
    console.log('[BlankLayout] onBeforeMount 触发')
  })

  onMounted(() => {
    console.log('[BlankLayout] onMounted 触发', {
      slots: slots,
      hasDefaultSlot: !!slots.default,
      slotContent: slots.default && slots.default()
    })
  })

  onUpdated(() => {
    console.log('[BlankLayout] onUpdated 触发', {
      hasDefaultSlot: !!slots.default,
      slotContent: slots.default && slots.default()
    })
  })
</script>

<style scoped>
  .blank-layout {
    min-height: 100vh;
    width: 100%;
    background-color: #000;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
</style>