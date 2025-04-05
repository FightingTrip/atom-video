/**
* @file VideoCardSkeleton.vue
* @description 视频卡片的骨架屏组件，用于视频列表加载时的占位显示
* @features
* - 支持网格和列表布局
* - 响应式设计
* - 暗色主题支持
* @author Atom Video Team
* @date 2025-04-06
*/

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
  import Skeleton from '@/components/loading/Skeleton.vue'

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
  }

  .video-card-skeleton.list {
    display: flex;
    gap: 1rem;
  }

  .video-card-skeleton.list .aspect-video {
    flex: 0 0 320px;
  }

  @media (max-width: 640px) {
    .video-card-skeleton.list {
      flex-direction: column;
    }

    .video-card-skeleton.list .aspect-video {
      flex: none;
    }
  }
</style>