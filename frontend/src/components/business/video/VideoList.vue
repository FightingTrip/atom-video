/**
* @file VideoList.vue
* @description 视频列表业务组件
* @author Atom Video Team
* @date 2025-04-06
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
    <!-- 筛选与排序工具栏 -->
    <div class="filter-toolbar">
      <div class="layout-switch">
        <n-button-group>
          <n-button :type="layout === 'grid' ? 'primary' : 'default'" @click="layout = 'grid'">
            <template #icon>
              <n-icon>
                <GridOutline />
              </n-icon>
            </template>
            网格
          </n-button>
          <n-button :type="layout === 'list' ? 'primary' : 'default'" @click="layout = 'list'">
            <template #icon>
              <n-icon>
                <ListOutline />
              </n-icon>
            </template>
            列表
          </n-button>
        </n-button-group>
      </div>

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
      <div :class="['video-grid', { 'list-layout': layout === 'list' }]">
        <transition-group name="video-fade">
          <VideoCard v-for="video in videos" :key="video.id" :video="video" @click="handleVideoClick(video)" />
        </transition-group>
      </div>

      <!-- 骨架屏 -->
      <div v-if="loading" class="skeleton-container">
        <VideoCardSkeleton v-for="i in 4" :key="'skeleton-' + i" />
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
  import VideoCard from '@/components/business/video/VideoCard.vue';
  import VideoCardSkeleton from '@/components/business/video/VideoCardSkeleton.vue';
  import type { Video } from '@/types';

  const props = defineProps<{
    initialFilters?: {
      category?: string;
      sortBy?: string;
    };
  }>();

  const emit = defineEmits<{
    (e: 'filter-change', filters: { category: string; sortBy: string }): void;
  }>();

  // 状态管理
  const router = useRouter();
  const videos = ref<Video[]>([]);
  const loading = ref(false);
  const error = ref('');
  const page = ref(1);
  const pageSize = ref(12);
  const hasMore = ref(true);
  const listContainerRef = ref<HTMLElement | null>(null);

  // 布局和筛选
  const layout = ref('grid');
  const sortBy = ref(props.initialFilters?.sortBy || 'newest');
  const category = ref(props.initialFilters?.category || '');

  // 加载状态
  const isLoadingMore = ref(false);
  const canLoadMore = computed(() => hasMore.value && !loading.value && !error.value);

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

  // 方法
  const fetchVideos = async (resetList = false) => {
    if (loading.value || (!hasMore.value && !resetList)) return;

    try {
      loading.value = true;
      error.value = '';

      if (resetList) {
        page.value = 1;
        videos.value = [];
      }

      // 模拟API调用 - 实际项目中替换为真实API
      const params = {
        page: page.value,
        pageSize: pageSize.value,
        sortBy: sortBy.value,
        category: category.value
      };

      console.log('Fetching videos with params:', params);

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 800));

      // 模拟API响应
      const mockResponse = {
        data: Array.from({ length: 8 }, (_, i) => ({
          id: `video-${Date.now()}-${i}`,
          title: `测试视频 ${page.value}-${i + 1}`,
          description: '这是一个测试视频描述',
          coverUrl: `https://picsum.photos/seed/${Date.now() + i}/300/168`,
          duration: Math.floor(Math.random() * 600) + 60,
          views: Math.floor(Math.random() * 10000),
          likes: Math.floor(Math.random() * 1000),
          favorites: Math.floor(Math.random() * 500),
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          author: {
            id: `user-${i + 1}`,
            nickname: `用户${i + 1}`,
            avatar: `https://i.pravatar.cc/150?u=${i + 1}`,
            followers: Math.floor(Math.random() * 1000),
            isFollowed: Math.random() > 0.7
          },
          tags: ['标签1', '标签2']
        })),
        meta: {
          hasMore: page.value < 5,
          total: 40
        }
      };

      const newVideos = mockResponse.data;
      videos.value = resetList ? newVideos : [...videos.value, ...newVideos];
      hasMore.value = mockResponse.meta.hasMore;

      if (hasMore.value) {
        page.value++;
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      error.value = '加载视频失败，请重试';
    } finally {
      loading.value = false;
      isLoadingMore.value = false;
    }
  };

  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  const applyFilters = () => {
    videos.value = [];
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
    if (!listContainerRef.value || loading.value || !hasMore.value) return;

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
    fetchVideos();
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
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
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
    background-color: var(--primary-bg);
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

  .list-layout {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
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
    color: var(--text-secondary);
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
  }

  .error-icon {
    color: var(--error-color);
  }

  .empty-icon {
    color: var(--text-tertiary);
    opacity: 0.5;
  }

  .error-text,
  .empty-text {
    color: var(--text-secondary);
    font-size: var(--text-base);
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