<template>
  <div class="feed-container">
    <div v-if="loading" class="feed-loading">
      <div class="loading-spinner"></div>
      <p>{{ $t('common.loading') }}</p>
    </div>
    <div v-else-if="error" class="feed-error">
      <p>{{ $t('common.error') }}</p>
      <button @click="loadVideos">{{ $t('common.retry') }}</button>
    </div>
    <div v-else-if="videos.length === 0" class="feed-empty">
      <p>{{ $t('common.noVideos') }}</p>
    </div>
    <div v-else class="feed-videos">
      <div class="video-grid">
        <div v-for="video in videos" :key="video.id" class="video-card">
          <div class="video-thumbnail">
            <img :src="video.thumbnail" :alt="video.title" />
            <span class="video-duration">{{ formatDuration(video.duration) }}</span>
          </div>
          <div class="video-info">
            <div class="video-channel">
              <img :src="video.channel.avatar" :alt="video.channel.name" class="channel-avatar" />
            </div>
            <div class="video-details">
              <h3 class="video-title">{{ video.title }}</h3>
              <p class="channel-name">{{ video.channel.name }}</p>
              <p class="video-meta">
                {{ formatViews(video.views) }} · {{ formatDate(video.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="hasMoreVideos" class="load-more">
        <button @click="loadMore">{{ $t('common.loadMore') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  // 模拟数据
  interface Video {
    id: string;
    title: string;
    thumbnail: string;
    views: number;
    createdAt: string;
    duration: number;
    channel: {
      id: string;
      name: string;
      avatar: string;
    };
  }

  const videos = ref<Video[]>([]);
  const loading = ref(true);
  const error = ref(false);
  const page = ref(1);
  const hasMoreVideos = ref(true);

  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function formatViews(views: number): string {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M ${t('common.views')}`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K ${t('common.views')}`;
    } else {
      return `${views} ${t('common.views')}`;
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return '今天';
    } else if (diffDays < 30) {
      return `${diffDays} ${t('common.daysAgo')}`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} ${t('common.monthsAgo')}`;
    }
  }

  async function loadVideos() {
    loading.value = true;
    error.value = false;

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟响应
      const mockVideos: Video[] = Array(10).fill(0).map((_, index) => ({
        id: `video-${index}`,
        title: `示例视频标题 ${index}`,
        thumbnail: `https://picsum.photos/seed/${index}/400/225`,
        views: Math.floor(Math.random() * 1000000),
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        duration: Math.floor(Math.random() * 600),
        channel: {
          id: `channel-${index % 5}`,
          name: `频道 ${index % 5}`,
          avatar: `https://i.pravatar.cc/150?u=${index % 5}`,
        }
      }));

      videos.value = mockVideos;
      hasMoreVideos.value = page.value < 3; // 模拟分页
    } catch (e) {
      console.error('加载视频失败', e);
      error.value = true;
    } finally {
      loading.value = false;
    }
  }

  async function loadMore() {
    if (loading.value || !hasMoreVideos.value) return;

    loading.value = true;
    page.value++;

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟响应
      const mockVideos: Video[] = Array(10).fill(0).map((_, index) => ({
        id: `video-${page.value}-${index}`,
        title: `示例视频标题 ${page.value}-${index}`,
        thumbnail: `https://picsum.photos/seed/${page.value}${index}/400/225`,
        views: Math.floor(Math.random() * 1000000),
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        duration: Math.floor(Math.random() * 600),
        channel: {
          id: `channel-${index % 5}`,
          name: `频道 ${index % 5}`,
          avatar: `https://i.pravatar.cc/150?u=${index % 5}`,
        }
      }));

      videos.value = [...videos.value, ...mockVideos];
      hasMoreVideos.value = page.value < 3; // 模拟分页
    } catch (e) {
      console.error('加载更多视频失败', e);
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    loadVideos();
  });
</script>

<style scoped>
  .feed-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  .feed-loading,
  .feed-error,
  .feed-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    text-align: center;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: var(--color-accent-primary);
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .feed-error button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: var(--color-accent-primary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .video-card {
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--color-bg-surface);
    transition: transform 0.2s;
  }

  .video-card:hover {
    transform: translateY(-4px);
  }

  .video-thumbnail {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    /* 16:9 比例 */
    overflow: hidden;
  }

  .video-thumbnail img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 12px;
  }

  .video-info {
    display: flex;
    padding: 12px;
  }

  .video-channel {
    margin-right: 12px;
  }

  .channel-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .video-details {
    flex: 1;
    min-width: 0;
  }

  .video-title {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.4;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .channel-name {
    margin: 0 0 4px;
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  .video-meta {
    margin: 0;
    font-size: 12px;
    color: var(--color-text-muted);
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    margin-bottom: 2rem;
  }

  .load-more button {
    padding: 0.75rem 2rem;
    background-color: var(--color-accent-primary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .video-grid {
      grid-template-columns: 1fr;
    }
  }
</style>