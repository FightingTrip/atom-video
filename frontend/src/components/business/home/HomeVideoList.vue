/**
* @file HomeVideoList.vue
* @description 首页视频列表组件
* @created 2025-04-12
*/

<template>
  <div class="home-video-list">
    <!-- 分类筛选 -->
    <div class="category-filters">
      <n-space>
        <n-button v-for="category in categories" :key="category"
          :type="selectedCategory === category ? 'primary' : 'default'" @click="selectCategory(category)" quaternary
          class="category-btn">
          {{ category }}
        </n-button>
      </n-space>
    </div>

    <!-- 视频列表 -->
    <div v-if="loading" class="loading-container">
      <n-spin size="large" />
      <p>加载中...</p>
    </div>

    <template v-else>
      <div v-if="videos.length" class="videos-grid">
        <VideoCard v-for="video in videos" :key="video.id" :video="video" @click="onVideoClick(video)" />
      </div>

      <div v-else class="empty-state">
        <n-empty description="暂无视频" />
      </div>
    </template>

    <!-- 加载更多 -->
    <div v-if="hasMoreVideos" class="load-more">
      <n-button @click="loadMoreVideos" :loading="loadingMore">加载更多</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { NSpin, NEmpty, NButton, NSpace } from 'naive-ui';
  import VideoCard from '@/components/common/VideoCard.vue';
  import { useVideoStore } from '@/stores/video';
  import type { Video } from '@/types';
  import videoService from '@/services/videoService';

  // 路由
  const router = useRouter();

  // 视频存储
  const videoStore = useVideoStore();

  // 本地状态
  const categories = ref<string[]>(['全部']);
  const loadingMore = ref(false);

  // 计算属性
  const videos = computed(() => videoStore.videos);
  const loading = computed(() => videoStore.loading);
  const hasMoreVideos = computed(() => videoStore.hasMoreVideos);
  const selectedCategory = computed(() => videoStore.selectedCategory);

  // 加载视频类别
  async function loadCategories() {
    try {
      const categoriesList = await videoService.getVideoCategories();
      categories.value = categoriesList;
    } catch (error) {
      console.error('加载视频类别失败:', error);
    }
  }

  // 选择分类
  function selectCategory(category: string) {
    videoStore.filterByCategory(category);
  }

  // 加载更多视频
  async function loadMoreVideos() {
    if (loadingMore.value || !hasMoreVideos.value) return;

    loadingMore.value = true;
    try {
      // 假设Store中已经实现了加载更多的逻辑
      // 实际应用中需要传递当前页码或者上一批视频的最后一个ID等
      await videoStore.fetchVideos();
    } catch (error) {
      console.error('加载更多视频失败:', error);
    } finally {
      loadingMore.value = false;
    }
  }

  // 视频点击处理
  function onVideoClick(video: Video) {
    router.push(`/video/${video.id}`);
  }

  // 生命周期钩子
  onMounted(async () => {
    // 加载类别
    await loadCategories();

    // 加载视频
    await videoStore.fetchVideos();
  });

  // 监听搜索关键词变化
  watch(() => videoStore.searchKeyword, (newKeyword) => {
    if (newKeyword) {
      videoStore.searchVideos(newKeyword);
    }
  });
</script>

<style scoped>
  .home-video-list {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .category-filters {
    margin-bottom: 24px;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 8px;
  }

  .category-btn {
    margin-right: 8px;
    padding: 4px 12px;
    border-radius: 16px;
  }

  .videos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .loading-container {
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

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }

  @media (max-width: 768px) {
    .videos-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
    }
  }
</style>