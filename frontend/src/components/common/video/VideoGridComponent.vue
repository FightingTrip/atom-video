/**
* @file VideoGridComponent.vue
* @description 视频网格组件，用于以网格形式展示多个视频卡片
* @features
* - 响应式网格布局
* - 懒加载和优化的图片处理
* - 空状态和加载状态处理
* - 虚拟滚动支持大量视频展示
* - 无限滚动功能
* @dependencies
* - useIntersectionObserver: 用于实现无限滚动
* - 支持自定义内容插槽用于灵活展示
* @author Atom Video Team
* @date 2025-04-06
* @version 1.0.0
* @license MIT
*/

<template>
  <div class="video-grid-container" ref="containerRef">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="skeleton-grid">
        <div v-for="i in 8" :key="i" class="skeleton-item">
          <div class="skeleton-thumbnail"></div>
          <div class="skeleton-content">
            <div class="skeleton-title"></div>
            <div class="skeleton-meta"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="videoArray.length === 0" class="empty-state">
      <div class="empty-icon">📺</div>
      <p class="empty-text">{{ emptyText }}</p>
    </div>

    <!-- 视频网格 -->
    <div v-else class="video-grid">
      <div v-for="video in visibleVideos" :key="video.id" class="video-item" @click="handleVideoClick(video)">
        <VideoCardComponent :video="video" :show-author="showAuthor"
          @watch-later="(video) => emit('watch-later', video)" />
      </div>
    </div>

    <!-- 加载更多按钮 -->
    <div v-if="useVirtualScroll && !loadingMore && videoArray.length > 0 && visibleCount < videoArray.length"
      class="load-more-button" ref="bottomObserverRef">
      <button @click="loadMore">加载更多</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useElementSize, useIntersectionObserver } from '@vueuse/core';
  import VideoCardComponent from '@/components/business/video/VideoCardComponent.vue';
  import type { Video } from '@/types';

  const props = defineProps({
    /**
     * 视频列表
     */
    videos: {
      type: Array as () => Video[],
      default: () => []
    },
    /**
     * 加载状态
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示作者信息
     */
    showAuthor: {
      type: Boolean,
      default: true
    },
    /**
     * 空状态文本
     */
    emptyText: {
      type: String,
      default: '暂无视频'
    },
    /**
     * 是否使用虚拟滚动
     */
    useVirtualScroll: {
      type: Boolean,
      default: false // 改为简单的false默认值，避免使用this访问
    },
    /**
     * 一次加载的视频数量
     */
    batchSize: {
      type: Number,
      default: 12
    }
  });

  const emit = defineEmits(['video-click', 'watch-later']);

  const containerRef = ref<HTMLElement | null>(null);
  const loadingMore = ref(false);
  const visibleCount = ref(props.batchSize);

  // 安全访问视频数组
  const videoArray = computed(() => {
    return Array.isArray(props.videos) ? props.videos : [];
  });

  // 可见视频列表
  const visibleVideos = computed(() => {
    if (videoArray.value.length === 0) return [];

    return props.useVirtualScroll
      ? videoArray.value.slice(0, visibleCount.value)
      : videoArray.value;
  });

  // 检测容器底部可见性，用于实现无限滚动
  const bottomObserverRef = ref<HTMLElement | null>(null);
  const { stop } = useIntersectionObserver(
    bottomObserverRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting && !loadingMore.value && videoArray.value.length > 0 && visibleCount.value < videoArray.value.length) {
        loadMore();
      }
    },
    { threshold: 0.1 }
  );

  // 加载更多视频
  const loadMore = async () => {
    if (loadingMore.value || videoArray.value.length === 0 || visibleCount.value >= videoArray.value.length) return;

    loadingMore.value = true;

    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    visibleCount.value = Math.min(
      visibleCount.value + props.batchSize,
      videoArray.value.length
    );

    loadingMore.value = false;
  };

  const handleVideoClick = (video: Video) => {
    // 仅触发点击事件，不再在VideoCard中处理导航
    emit('video-click', video);
  };

  // 清理资源
  onUnmounted(() => {
    stop();
  });
</script>

<style scoped>
  .video-grid-container {
    width: 100%;
    background-color: transparent;
    /* 移除可能的背景色，使用父容器背景 */
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
    padding: var(--spacing-md);
    background-color: transparent;
    /* 确保网格背景透明 */
  }

  .video-item {
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    background-color: var(--bg-color-secondary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    /* 确保鼠标指针样式正确 */
  }

  .video-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  .loading-state {
    padding: var(--spacing-md);
    background-color: transparent;
    /* 确保加载状态背景透明 */
  }

  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }

  .skeleton-item {
    background-color: var(--bg-color-tertiary);
    border-radius: var(--radius-sm);
    overflow: hidden;
    animation: pulse 1.5s infinite;
  }

  .skeleton-thumbnail {
    width: 100%;
    padding-top: 56.25%;
    /* 16:9 比例 */
    background-color: var(--bg-color-tertiary);
  }

  .skeleton-content {
    padding: var(--spacing-md);
  }

  .skeleton-title {
    height: 20px;
    background-color: var(--bg-color-tertiary);
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-sm);
  }

  .skeleton-meta {
    height: 16px;
    width: 60%;
    background-color: var(--bg-color-tertiary);
    border-radius: var(--radius-sm);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    color: var(--text-color-secondary);
    background-color: transparent;
    /* 确保空状态背景透明 */
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: var(--spacing-md);
  }

  .empty-text {
    font-size: var(--text-lg);
  }

  @keyframes pulse {

    0%,
    100% {
      opacity: 0.6;
    }

    50% {
      opacity: 0.3;
    }
  }

  /* 深色模式优化 */
  :root.dark .video-item,
  .dark-mode .video-item {
    background-color: rgba(35, 35, 35, 0.7);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(70, 70, 70, 0.5);
  }

  :root.dark .video-item:hover,
  .dark-mode .video-item:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
    border-color: rgba(100, 100, 100, 0.7);
  }

  /* 标签样式优化 */
  :root.dark .tag,
  .dark-mode .tag {
    background-color: rgba(60, 60, 60, 0.8);
    color: rgba(240, 240, 240, 0.9);
  }

  @media (max-width: 768px) {

    .video-grid,
    .skeleton-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }
  }

  @media (max-width: 480px) {

    .video-grid,
    .skeleton-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }

  .load-more-button {
    display: flex;
    justify-content: center;
    padding: var(--spacing-md);
  }

  .load-more-button button {
    padding: var(--spacing-md) var(--spacing-xl);
    background-color: var(--bg-color-primary);
    color: var(--text-color-primary);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .load-more-button button:hover {
    background-color: var(--bg-color-primary-hover);
  }

  /* 暗色模式特定样式 */
  :root.dark .skeleton-item,
  .dark-mode .skeleton-item {
    background-color: var(--bg-color-dark);
  }

  :root.dark .skeleton-thumbnail,
  :root.dark .skeleton-title,
  :root.dark .skeleton-meta,
  .dark-mode .skeleton-thumbnail,
  .dark-mode .skeleton-title,
  .dark-mode .skeleton-meta {
    background-color: var(--bg-color-darker);
  }

  :root.dark .empty-state,
  .dark-mode .empty-state {
    color: var(--text-color-secondary-dark);
  }
</style>