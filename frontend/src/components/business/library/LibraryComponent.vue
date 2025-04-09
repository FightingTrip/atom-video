/**
* @file LibraryComponent.vue
* @description 库组件 - 展示用户收藏视频的业务组件
* @author Atom Video Team
* @date 2025-04-09
*/
<template>
  <div class="library-container">
    <div class="library-header">
      <h1 class="library-title">视频图书馆</h1>

      <!-- 顶部控制区：搜索和视图切换 -->
      <div class="header-controls">
        <div class="search-container">
          <n-input-group>
            <n-input v-model:value="searchQuery" placeholder="搜索视频..." @keydown.enter="handleSearch" size="medium" />
            <n-button type="primary" ghost @click="handleSearch">
              <template #icon>
                <n-icon>
                  <SearchOutline />
                </n-icon>
              </template>
            </n-button>
          </n-input-group>
        </div>
      </div>

      <!-- 分类标签 -->
      <div class="category-filter">
        <CategoryTabs v-model="currentCategoryTab" :tabs="categoryTabs" @change="handleCategoryChange"
          :inline="false" />

        <n-select v-model:value="currentSort" :options="sortOptions" placeholder="排序" size="small"
          class="sort-select" />
      </div>
    </div>

    <div class="library-content">
      <!-- 加载状态 -->
      <n-spin :show="loading" description="加载中...">
        <!-- 视频列表 -->
        <VideoGridComponent :videos="displayVideos" :loading="loading" :disableToolbar="true" :empty-text="emptyText"
          @video-click="handleVideoClick" @watch-later="handleWatchLater" />

        <!-- 分页 -->
        <div class="pagination-container" v-if="totalPages > 1">
          <n-pagination v-model:page="currentPage" :page-count="totalPages" :on-update:page="handlePageChange" />
        </div>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { NSelect, NInput, NInputGroup, NButton, NButtonGroup, NIcon, NPagination, NSpin, useMessage } from 'naive-ui';
  import { SearchOutline, GridOutline, ListOutline } from '@vicons/ionicons5';
  import VideoGridComponent from '@/components/common/video/VideoGridComponent.vue';
  import VideoListComponent from '@/components/business/video/VideoListComponent.vue';
  import CategoryTabs from '@/components/common/controls/CategoryTabs.vue';
  import { useVideoStore } from '@/stores/video';
  import type { Video } from '@/types';

  const router = useRouter();
  const videoStore = useVideoStore();
  const message = useMessage();

  // 状态
  const loading = ref(false);
  const videos = ref<Video[]>([]);
  const viewMode = ref<'grid' | 'list'>('grid');
  const currentPage = ref(1);
  const totalPages = ref(1);
  const searchQuery = ref('');
  const currentCategoryTab = ref('all');
  const currentSort = ref('newest');

  // 将原始类别选项转换为标签格式
  const categoryTabs = [
    { value: 'all', label: '全部' },
    { value: 'tutorial', label: '教程' },
    { value: 'entertainment', label: '娱乐' },
    { value: 'music', label: '音乐' },
    { value: 'tech', label: '科技' }
  ];

  // 排序选项
  const sortOptions = [
    { label: '最新发布', value: 'newest' },
    { label: '最多观看', value: 'views' },
    { label: '最多点赞', value: 'likes' }
  ];

  // 计算属性
  const displayVideos = computed(() => {
    return videos.value;
  });

  const emptyText = computed(() => {
    if (searchQuery.value) {
      return `没有找到与"${searchQuery.value}"相关的视频`;
    }
    return '暂无视频';
  });

  // 方法
  const loadVideos = async () => {
    loading.value = true;
    try {
      // 构建筛选参数
      const params = {
        category: currentCategoryTab.value === 'all' ? null : currentCategoryTab.value,
        sort: currentSort.value,
        search: searchQuery.value,
        page: currentPage.value
      };

      console.log('加载视频，参数:', params);

      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 800));

      // 生成测试数据
      videos.value = Array(12).fill(0).map((_, i) => ({
        id: `video-${i}`,
        title: `测试视频 ${i + 1}`,
        description: `这是测试视频 ${i + 1} 的描述`,
        coverUrl: `https://picsum.photos/seed/video${i}/400/225`,
        videoUrl: '',
        duration: Math.floor(Math.random() * 600),
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        favorites: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 300),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        author: {
          id: `user-${i % 5}`,
          username: `user${i % 5}`,
          nickname: `用户${i % 5 + 1}`,
          avatar: `https://i.pravatar.cc/150?u=user${i % 5}`,
          verified: i % 3 === 0
        },
        tags: ['标签1', '标签2'],
        sources: [{
          url: '',
          type: 'video/mp4',
          size: 0,
          label: '标准'
        }],
        subtitles: []
      }));

      totalPages.value = 5; // 假设有5页
    } catch (error) {
      console.error('加载视频失败', error);
      message.error('加载视频失败');
    } finally {
      loading.value = false;
    }
  };

  const handleSearch = () => {
    currentPage.value = 1;
    loadVideos();
  };

  const handleCategoryChange = (category: string) => {
    currentCategoryTab.value = category;
    currentPage.value = 1;
    loadVideos();
  };

  const handlePageChange = (page: number) => {
    currentPage.value = page;
    loadVideos();
  };

  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  const handleWatchLater = (video: Video) => {
    message.success(`已将"${video.title}"添加到稍后观看`);
  };

  // 视图切换处理
  const updateView = (mode: 'grid' | 'list') => {
    viewMode.value = mode;
    // 保存用户偏好到本地存储
    localStorage.setItem('libraryViewMode', mode);
  };

  // 初始化
  onMounted(() => {
    // 尝试从本地存储加载用户偏好的视图模式
    const savedViewMode = localStorage.getItem('libraryViewMode');
    if (savedViewMode && (savedViewMode === 'grid' || savedViewMode === 'list')) {
      viewMode.value = savedViewMode as 'grid' | 'list';
    }

    loadVideos();
  });
</script>

<style scoped>
  .library-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .library-header {
    margin-bottom: 24px;
  }

  .library-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--text-color);
  }

  .header-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 12px;
  }

  .search-container {
    flex: 1;
    max-width: 600px;
  }

  .view-switcher-compact {
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: var(--radius-md);
    background-color: var(--bg-color-secondary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .category-filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .sort-select {
    width: 120px;
    flex-shrink: 0;
  }

  .library-content {
    min-height: 400px;
    border-radius: 12px;
    background-color: transparent;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 32px;
    margin-bottom: 32px;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .header-controls {
      flex-direction: column;
      align-items: stretch;
    }

    .search-container {
      max-width: 100%;
    }

    .view-switcher-compact {
      align-self: flex-end;
    }

    .category-filter {
      flex-direction: column;
      align-items: stretch;
    }

    .sort-select {
      width: 100%;
    }
  }

  /* 深色模式优化 */
  :root.dark .library-content,
  .dark-mode .library-content {
    background-color: transparent;
  }

  :root.dark .view-switcher-compact,
  .dark-mode .view-switcher-compact {
    background-color: rgba(50, 50, 50, 0.7);
    border: 1px solid rgba(70, 70, 70, 0.5);
  }
</style>