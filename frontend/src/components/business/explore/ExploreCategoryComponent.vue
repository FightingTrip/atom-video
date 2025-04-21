/**
* @file ExploreCategoryComponent.vue
* @description 分类探索组件 - 展示特定分类内视频内容的业务组件
* @author Atom Video Team
* @date 2025-04-09
*/

<!-- 探索分类组件 -->
<template>
  <div class="explore-category">
    <div class="category-header">
      <h2>{{ categoryName }}</h2>
      <div class="category-filters">
        <n-select v-model:value="sortBy" placeholder="排序方式" @update:value="handleSortChange" :options="sortOptions" />
        <n-select v-model:value="timeRange" placeholder="时间范围" @update:value="handleTimeRangeChange"
          :options="timeOptions" />
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <n-spin size="large" />
      <p>加载中...</p>
    </div>

    <!-- 视频列表 -->
    <div v-else class="category-content">
      <div v-if="videos.length" class="explore-videos-grid">
        <VideoCard v-for="video in videos" :key="video.id" :video="video" @click="handleVideoClick(video)" />
      </div>
      <div v-else class="empty-state">
        <n-empty description="暂无视频" />
      </div>
    </div>

    <!-- 分页器 -->
    <div class="category-pagination">
      <n-pagination v-model:page="currentPage" v-model:page-size="pageSize" :item-count="total"
        :page-sizes="[12, 24, 36, 48]" @update:page="handlePageChange" @update:page-size="handleSizeChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { NSelect, NSpin, NEmpty, NPagination } from 'naive-ui';
  import type { Video, VideoSearchParams } from '@/types';
  import VideoCard from '@/components/common/VideoCard.vue';
  import videoService from '@/services/videoService';

  const route = useRoute();
  const router = useRouter();

  // 选项数据
  const sortOptions = [
    { label: '最新', value: 'latest' },
    { label: '最热', value: 'popular' },
    { label: '相关度', value: 'relevant' }
  ];

  const timeOptions = [
    { label: '全部时间', value: 'all' },
    { label: '今天', value: 'today' },
    { label: '本周', value: 'week' },
    { label: '本月', value: 'month' }
  ];

  // 状态
  const loading = ref(false);
  const videos = ref<Video[]>([]);
  const hasMore = ref(false);
  const total = ref(0);
  const categoryName = ref(route.params.category as string || '全部');
  const sortBy = ref<'latest' | 'popular' | 'relevant'>('latest');
  const timeRange = ref('all');
  const currentPage = ref(1);
  const pageSize = ref(12);

  // 加载视频
  const loadVideos = async () => {
    loading.value = true;
    try {
      const params: VideoSearchParams = {
        tags: categoryName.value === '全部' ? [] : [categoryName.value],
        sort: sortBy.value,
        page: currentPage.value,
        limit: pageSize.value
      };

      const response = await videoService.getVideos(pageSize.value, params);
      videos.value = response.videos;
      hasMore.value = response.hasMore;

      // 模拟总数据量
      total.value = response.videos.length * 3;
    } catch (error) {
      console.error('加载视频失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 方法
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  const handleSortChange = () => {
    currentPage.value = 1; // 切换排序时重置为第一页
    loadVideos();
  };

  const handleTimeRangeChange = () => {
    currentPage.value = 1; // 切换时间范围时重置为第一页
    loadVideos();
  };

  const handleSizeChange = () => {
    loadVideos();
  };

  const handlePageChange = () => {
    loadVideos();
  };

  // 监听路由参数变化
  watch(() => route.params.category, (newCategory) => {
    if (newCategory) {
      categoryName.value = newCategory as string;
      currentPage.value = 1; // 切换分类时重置为第一页
      loadVideos();
    }
  });

  // 生命周期钩子
  onMounted(() => {
    loadVideos();
  });
</script>

<style scoped>
  .explore-category {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .category-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  .category-filters {
    display: flex;
    gap: 16px;
  }

  .explore-videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 24px;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
  }

  .empty-state {
    display: flex;
    justify-content: center;
    padding: 60px 0;
  }

  .category-pagination {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }

  @media (max-width: 768px) {
    .category-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .explore-videos-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
    }
  }
</style>