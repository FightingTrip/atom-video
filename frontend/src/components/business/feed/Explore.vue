/**
* @file Explore.vue
* @description 发现页业务组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="explore">
    <!-- 搜索和筛选区域 -->
    <section class="filter-section">
      <SearchBar v-model="searchQuery" placeholder="搜索视频、用户或标签" @search="handleSearch" />
      <FilterPanel :categories="categories" :tags="popularTags" @filter="handleFilter" />
    </section>

    <!-- 视频网格 -->
    <section class="video-grid">
      <VideoCard v-for="video in videos" :key="video.id" :video="video" @click="handleVideoClick(video)" />
    </section>

    <!-- 加载更多按钮 -->
    <div v-if="hasMore" class="load-more">
      <Button :loading="loading" @click="loadMore">
        加载更多
      </Button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading && !videos.length" class="loading-container">
      <LoadingSpinner />
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-container">
      <ErrorMessage :message="error" />
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && !error && !videos.length" class="empty-container">
      <EmptyState message="暂无视频" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useVideo } from '@/composables/useVideo';
  import { useCategory } from '@/composables/useCategory';
  import { useTag } from '@/composables/useTag';
  import SearchBar from '@/components/common/search/SearchBar.vue';
  import FilterPanel from '@/components/common/filter/FilterPanel.vue';
  import VideoCard from '@/components/common/video/VideoCard.vue';
  import Button from '@/components/common/button/Button.vue';
  import LoadingSpinner from '@/components/common/loading/LoadingSpinner.vue';
  import ErrorMessage from '@/components/common/feedback/ErrorMessage.vue';
  import EmptyState from '@/components/common/feedback/EmptyState.vue';
  import type { Video, Category, Tag } from '@/types';

  const router = useRouter();

  // 状态
  const loading = ref(false);
  const error = ref<string | null>(null);
  const videos = ref<Video[]>([]);
  const categories = ref<Category[]>([]);
  const popularTags = ref<Tag[]>([]);
  const searchQuery = ref('');
  const currentPage = ref(1);
  const hasMore = ref(true);

  // 组合式函数
  const { fetchVideos } = useVideo();
  const { fetchCategories } = useCategory();
  const { fetchPopularTags } = useTag();

  // 方法
  const handleSearch = async () => {
    try {
      loading.value = true;
      error.value = null;
      currentPage.value = 1;
      videos.value = [];
      hasMore.value = true;

      const result = await fetchVideos({
        page: 1,
        pageSize: 12,
        query: searchQuery.value,
      });

      videos.value = result;
      hasMore.value = result.length === 12;
    } catch (err) {
      error.value = '搜索失败';
      console.error('搜索失败:', err);
    } finally {
      loading.value = false;
    }
  };

  const handleFilter = async (filters: {
    categories?: string[];
    tags?: string[];
  }) => {
    try {
      loading.value = true;
      error.value = null;
      currentPage.value = 1;
      videos.value = [];
      hasMore.value = true;

      const result = await fetchVideos({
        page: 1,
        pageSize: 12,
        ...filters,
      });

      videos.value = result;
      hasMore.value = result.length === 12;
    } catch (err) {
      error.value = '筛选失败';
      console.error('筛选失败:', err);
    } finally {
      loading.value = false;
    }
  };

  const loadMore = async () => {
    if (loading.value || !hasMore.value) return;

    try {
      loading.value = true;
      error.value = null;
      currentPage.value++;

      const result = await fetchVideos({
        page: currentPage.value,
        pageSize: 12,
        query: searchQuery.value,
      });

      videos.value.push(...result);
      hasMore.value = result.length === 12;
    } catch (err) {
      error.value = '加载更多失败';
      console.error('加载更多失败:', err);
    } finally {
      loading.value = false;
    }
  };

  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  // 初始化
  onMounted(async () => {
    try {
      loading.value = true;
      error.value = null;

      // 并行加载数据
      const [videosData, categoriesData, tagsData] = await Promise.all([
        fetchVideos({ page: 1, pageSize: 12 }),
        fetchCategories(),
        fetchPopularTags(),
      ]);

      videos.value = videosData;
      categories.value = categoriesData;
      popularTags.value = tagsData;
      hasMore.value = videosData.length === 12;
    } catch (err) {
      error.value = '加载数据失败';
      console.error('加载数据失败:', err);
    } finally {
      loading.value = false;
    }
  });
</script>

<style scoped>
  .explore {
    padding: 2rem;
  }

  .filter-section {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .loading-container,
  .error-container,
  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  @media (max-width: 768px) {
    .explore {
      padding: 1rem;
    }

    .video-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
    }
  }
</style>