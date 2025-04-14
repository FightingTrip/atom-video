/**
* @file Trending.vue
* @description 热门视频列表组件，展示当前热门的视频内容
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="trending-container">
    <h1 class="trending-title">热门视频</h1>

    <div v-if="loading" class="loading-state">
      <a-spin size="large" />
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <a-alert type="error" :message="error" show-icon />
    </div>

    <div v-else-if="videos.length === 0" class="empty-state">
      <a-empty description="暂无热门视频" />
    </div>

    <div v-else class="trending-videos">
      <!-- 使用Grid布局展示视频列表 -->
      <div class="video-grid">
        <div v-for="video in videos" :key="video.id" class="video-card-wrapper">
          <VideoCard :video="video" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Spin as ASpin, Alert as AAlert, Empty as AEmpty } from 'ant-design-vue';
  import VideoCard from '@/components/business/video/VideoCard.vue';
  import { useVideoStore } from '@/stores/video';

  // 数据状态
  const loading = ref(true);
  const error = ref('');
  const videos = ref<any[]>([]);

  // 获取视频store
  const videoStore = useVideoStore();

  // 获取热门视频
  const fetchTrendingVideos = async () => {
    try {
      loading.value = true;
      // 调用视频store获取热门视频
      const result = await videoStore.getTrendingVideos();
      videos.value = result;
    } catch (err: any) {
      error.value = '无法加载热门视频: ' + (err.message || '未知错误');
      console.error('获取热门视频失败', err);
    } finally {
      loading.value = false;
    }
  };

  // 组件挂载时获取数据
  onMounted(() => {
    fetchTrendingVideos();
  });
</script>

<style scoped>
  .trending-container {
    padding: 24px 16px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .trending-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 24px;
    color: var(--text-primary);
  }

  .loading-state,
  .error-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    width: 100%;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  @media (max-width: 768px) {
    .video-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }

    .trending-title {
      font-size: 24px;
    }
  }
</style>