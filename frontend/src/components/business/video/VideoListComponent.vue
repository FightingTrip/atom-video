/**
* @file VideoListComponent.vue
* @description 视频列表业务组件 - 用于展示视频列表和提供筛选排序功能
* @author Atom Video Team
* @date 2025-04-09
*/

<!--
 * @description 视频列表组件
 * @features
 * - 视频列表展示：支持网格和列表两种布局
 * - 无限滚动：支持滚动加载更多
 * - 加载状态：支持骨架屏和加载动画
 * - 空状态：支持自定义空状态展示
 * - 响应式布局：自适应不同屏幕尺寸
 * - 筛选排序：支持多种排序和筛选方式
 * @dependencies
 * - naive-ui: UI组件库
 * - @vueuse/core: 实用工具集
 * @props
 * - videos: 视频列表数据
 * - loading: 是否显示加载状态
 * - layout: 布局方式（grid/list）
 * @emits
 * - load-more: 加载更多事件
 * - video-click: 视频点击事件
 -->

<template>
  <div class="video-list">
    <!-- 筛选与排序工具栏，仅当独立使用且未禁用时显示 -->
    <div v-if="!disableToolbar" class="filter-toolbar">
      <div class="filter-options">
        <n-select v-model:value="sortBy" :options="sortOptions" placeholder="排序方式" class="sort-select" />
        <n-select v-model:value="category" :options="categoryOptions" placeholder="分类" class="category-select" />
        <n-button @click="applyFilters" :loading="loading" type="primary" ghost>
          筛选
        </n-button>
      </div>
    </div>

    <!-- 视频列表 -->
    <div class="video-container" ref="listContainerRef" @scroll="handleScroll">
      <div class="video-grid">
        <transition-group name="video-fade">
          <VideoCardComponent v-for="video in videos" :key="video.id" :video="video" @click="handleVideoClick(video)" />
        </transition-group>
      </div>

      <!-- 骨架屏 -->
      <div v-if="loading" class="skeleton-container">
        <VideoCardSkeletonComponent v-for="i in 4" :key="'skeleton-' + i" />
      </div>

      <!-- 加载更多提示 -->
      <div v-if="canLoadMore && !loading && !error" class="load-more">
        <n-spin size="small" />
        <span>加载更多</span>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-container">
        <n-icon size="24" class="error-icon">
          <AlertCircleOutline />
        </n-icon>
        <p class="error-text">{{ error }}</p>
        <n-button @click="resetAndRetry">重试</n-button>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && !error && videos.length === 0" class="empty-container">
        <n-icon size="48" class="empty-icon">
          <VideocamOutline />
        </n-icon>
        <p class="empty-text">暂无视频</p>
        <n-button @click="resetFilters">重置筛选</n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useIntersectionObserver, useThrottleFn } from '@vueuse/core';
  import { NButton, NButtonGroup, NIcon, NSelect, NSpin } from 'naive-ui';
  import {
    GridOutline,
    ListOutline,
    VideocamOutline,
    AlertCircleOutline
  } from '@vicons/ionicons5';
  import VideoCardComponent from '@/components/business/video/VideoCardComponent.vue';
  import VideoCardSkeletonComponent from '@/components/business/video/VideoCardSkeletonComponent.vue';
  import type { Video } from '@/types';

  const props = defineProps({
    videos: {
      type: Array as () => Video[],
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    initialFilters: {
      type: Object as () => {
        category?: string;
        sortBy?: string;
      },
      default: () => ({})
    },
    disableToolbar: {
      type: Boolean,
      default: false // 是否禁用工具栏，在作为子组件使用时设置为true
    },
    initialLayout: {
      type: String,
      default: 'grid' // 默认布局模式
    }
  });

  const emit = defineEmits<{
    (e: 'filter-change', filters: { category: string; sortBy: string }): void;
    (e: 'video-click', video: Video): void;
  }>();

  // 状态管理
  const router = useRouter();
  const error = ref('');
  const page = ref(1);
  const pageSize = ref(12);
  const hasMore = ref(true);
  const listContainerRef = ref<HTMLElement | null>(null);

  // 布局和筛选
  const layout = ref(props.initialLayout);
  const sortBy = ref(props.initialFilters?.sortBy || 'newest');
  const category = ref(props.initialFilters?.category || '');

  // 加载状态
  const isLoadingMore = ref(false);
  const canLoadMore = computed(() => hasMore.value && !props.loading && !error.value);

  // 筛选选项
  const sortOptions = [
    { label: '最新发布', value: 'newest' },
    { label: '最多观看', value: 'views' },
    { label: '最多点赞', value: 'likes' },
    { label: '最多收藏', value: 'favorites' }
  ];

  const categoryOptions = [
    { label: '全部', value: '' },
    { label: '编程语言', value: 'programming' },
    { label: '框架技术', value: 'framework' },
    { label: '云服务', value: 'cloud' },
    { label: '算法与数据结构', value: 'algorithm' },
    { label: '系统架构', value: 'architecture' }
  ];

  // 在集成到其他组件中时，使用传入的videos
  // 独立使用时，通过API获取视频
  const fetchVideos = async (resetList = false) => {
    if (props.videos.length > 0) return; // 如果已有传入的videos，则不需要获取

    if (props.loading || (!hasMore.value && !resetList)) return;

    try {
      if (resetList) {
        page.value = 1;
      }

      // 调用API获取视频列表
      // 这里省略具体实现...
    } catch (err) {
      console.error('Error fetching videos:', err);
      error.value = '加载视频失败，请重试';
    }
  };

  const handleVideoClick = (video: Video) => {
    emit('video-click', video);
  };

  const applyFilters = () => {
    page.value = 1;
    hasMore.value = true;
    fetchVideos(true);

    emit('filter-change', {
      category: category.value,
      sortBy: sortBy.value
    });
  };

  const resetFilters = () => {
    sortBy.value = 'newest';
    category.value = '';
    applyFilters();
  };

  const resetAndRetry = () => {
    error.value = '';
    fetchVideos(true);
  };

  // 使用节流函数处理滚动事件，防止频繁触发
  const handleScroll = useThrottleFn(() => {
    if (!listContainerRef.value || props.loading || !hasMore.value) return;

    const { scrollTop, scrollHeight, clientHeight } = listContainerRef.value;
    // 当滚动到距离底部100px时加载更多
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      isLoadingMore.value = true;
      fetchVideos();
    }
  }, 200);

  // 监听筛选变化
  watch([sortBy, category], () => {
    // 不自动应用筛选，让用户点击按钮手动应用
  });

  // 初始化加载
  onMounted(() => {
    if (props.videos.length === 0) {
      fetchVideos();
    }
  });
</script>

<style scoped>
  .video-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .filter-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    background-color: var(--bg-color-secondary);
    border-radius: var(--radius-lg);
    margin-bottom: var(--spacing-md);
  }

  .filter-options {
    display: flex;
    gap: var(--spacing-sm);
  }

  .sort-select,
  .category-select {
    width: 140px;
  }

  .video-container {
    position: relative;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding: var(--spacing-md);
    background-color: transparent;
    border-radius: var(--radius-lg);
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  }

  .video-container::-webkit-scrollbar {
    width: 8px;
  }

  .video-container::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
  }

  .video-container::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-thumb);
    border-radius: 4px;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }

  .skeleton-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-lg);
  }

  .load-more {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    color: var(--text-color-secondary);
  }

  .error-container,
  .empty-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-xl);
    text-align: center;
    background-color: transparent;
  }

  .error-icon {
    color: var(--error-color);
  }

  .empty-icon {
    color: var(--text-color-tertiary);
    opacity: 0.5;
  }

  .error-text,
  .empty-text {
    color: var(--text-color-secondary);
    font-size: var(--font-size-base);
  }

  /* 过渡动画 */
  .video-fade-enter-active,
  .video-fade-leave-active {
    transition: all 0.3s ease;
  }

  .video-fade-enter-from,
  .video-fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }

  /* 深色模式优化 */
  :root.dark .filter-toolbar,
  .dark-mode .filter-toolbar {
    background-color: rgba(40, 40, 40, 0.6);
    border: 1px solid rgba(70, 70, 70, 0.5);
  }

  /* 响应式布局 */
  @media (max-width: 768px) {
    .filter-toolbar {
      flex-direction: column;
      gap: var(--spacing-md);
      padding: var(--spacing-sm);
    }

    .filter-options {
      width: 100%;
      flex-wrap: wrap;
      justify-content: center;
    }

    .sort-select,
    .category-select {
      width: 100%;
    }

    .video-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--spacing-md);
    }

    .skeleton-container {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }

    .video-container {
      max-height: calc(100vh - 250px);
    }
  }
</style>