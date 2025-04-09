/**
* @file VideoCardSkeletonComponent.vue
* @description 视频卡片骨架屏组件 - 用于显示加载状态的骨架屏
* @author Atom Video Team
* @date 2025-04-09
*/

<!--
 * @description 视频卡片骨架屏组件
 * @features
 * - 加载状态展示：模拟视频卡片布局
 * - 动画效果：支持加载动画
 * - 响应式布局：适配不同屏幕尺寸
 * @dependencies
 * - naive-ui: UI组件库
 * @props
 * - count: 显示数量
 * - layout: 布局方式（grid/list）
 -->

<template>
  <div class="video-card-skeleton" :class="layout">
    <!-- 视频缩略图占位 -->
    <Skeleton type="video" :height="layout === 'grid' ? 'auto' : '180px'" class="aspect-video" />

    <div class="mt-3 flex">
      <!-- 头像占位 -->
      <Skeleton type="circle" width="36" height="36" class="mr-3" />

      <div class="flex-1">
        <!-- 标题占位 -->
        <Skeleton type="rect" height="16" class="mb-2 w-3/4" />
        <!-- 频道名称占位 -->
        <Skeleton type="rect" height="16" class="w-1/2" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Skeleton from '@/components/common/loading/Skeleton.vue'

  interface Props {
    /** 布局方式 */
    layout?: 'grid' | 'list'
  }

  // Props 定义
  withDefaults(defineProps<Props>(), {
    layout: 'grid'
  })
</script>

<style scoped>
  .video-card-skeleton {
    width: 100%;
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .video-card-skeleton.list {
    display: flex;
    gap: var(--spacing-lg);
  }

  .video-card-skeleton.list .aspect-video {
    flex: 0 0 320px;
  }

  .aspect-video {
    width: 100%;
    aspect-ratio: 16 / 9;
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .skeleton-content {
    margin-top: var(--spacing-md);
    display: flex;
    gap: var(--spacing-md);
  }

  .avatar-skeleton {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    background-color: var(--secondary-bg);
  }

  .text-skeleton {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .title-skeleton {
    height: 16px;
    width: 75%;
    background-color: var(--secondary-bg);
    border-radius: var(--radius-sm);
  }

  .channel-skeleton {
    height: 16px;
    width: 50%;
    background-color: var(--secondary-bg);
    border-radius: var(--radius-sm);
  }

  @keyframes pulse {

    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }
  }

  @media (max-width: 768px) {
    .video-card-skeleton {
      padding: var(--spacing-sm);
    }

    .video-card-skeleton.list {
      flex-direction: column;
    }

    .video-card-skeleton.list .aspect-video {
      flex: none;
    }

    .skeleton-content {
      margin-top: var(--spacing-sm);
    }
  }
</style>