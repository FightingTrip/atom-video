/**
* @file Explore.vue
* @description 发现页业务组件
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="explore-section">
    <!-- 分类标签 -->
    <div class="category-tabs">
      <div class="tabs-container">
        <button v-for="category in categories" :key="category.id" class="tab-button"
          :class="{ active: currentCategoryId === category.id }" @click="handleCategoryChange(category.id)">
          {{ category.name }}
        </button>
      </div>

      <div class="category-content">
        <!-- 视频网格 -->
        <div class="video-grid">
          <div v-for="video in videos" :key="video.id" class="video-card" @click="handleVideoClick(video)">
            <div class="video-thumbnail">
              <img :src="video.thumbnail" :alt="video.title" class="thumbnail-image" />
              <div class="video-duration">{{ formatDuration(video.duration) }}</div>
            </div>
            <div class="video-info">
              <h3 class="video-title">{{ video.title }}</h3>
              <div class="video-meta">
                <div class="author-info">
                  <img :src="video.author.avatar" class="author-avatar" />
                  <span class="author-name">{{ video.author.nickname }}</span>
                </div>
                <div class="video-stats">
                  <span class="stat-item">
                    <span class="icon">👁️</span>
                    {{ formatNumber(video.views) }}
                  </span>
                  <span class="stat-item">
                    <span class="icon">❤️</span>
                    {{ formatNumber(video.likes) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMore" class="load-more">
          <div v-if="loading" class="loading-spinner"></div>
          <button v-else class="load-more-button" @click="handleLoadMore">
            加载更多
          </button>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!loading && videos.length === 0" class="empty-state">
          <div class="empty-icon">📺</div>
          <p class="empty-text">暂无{{ currentCategory?.name || '' }}视频</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  interface Video {
    id: string;
    title: string;
    thumbnail: string;
    duration: number;
    views: number;
    likes: number;
    author: {
      id: string;
      nickname: string;
      avatar: string;
    }
  }

  interface Category {
    id: string;
    name: string;
  }

  const router = useRouter();
  const loading = ref(false);
  const videos = ref<Video[]>([]);
  const hasMore = ref(true);
  const currentPage = ref(1);
  const currentCategoryId = ref<string>('');

  // 分类数据
  const categories = ref<Category[]>([
    { id: 'all', name: '全部' },
    { id: 'music', name: '音乐' },
    { id: 'gaming', name: '游戏' },
    { id: 'education', name: '教育' },
    { id: 'entertainment', name: '娱乐' },
    { id: 'sports', name: '体育' },
    { id: 'technology', name: '科技' },
    { id: 'lifestyle', name: '生活' }
  ]);

  // 当前分类
  const currentCategory = computed(() => {
    return categories.value.find(c => c.id === currentCategoryId.value);
  });

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 获取分类视频
  const fetchVideos = async () => {
    loading.value = true;
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟数据
      const mockVideos: Video[] = Array(8).fill(0).map((_, index) => ({
        id: `video-${currentCategoryId.value}-${currentPage.value}-${index}`,
        title: `${currentCategory.value?.name || ''}视频标题 ${currentPage.value}-${index}`,
        thumbnail: `https://picsum.photos/seed/${currentCategoryId.value}${currentPage.value}${index}/400/225`,
        duration: Math.floor(Math.random() * 600),
        views: Math.floor(Math.random() * 100000),
        likes: Math.floor(Math.random() * 10000),
        author: {
          id: `author-${index % 5}`,
          nickname: `创作者 ${index % 5}`,
          avatar: `https://i.pravatar.cc/150?u=${currentCategoryId.value}${index % 5}`,
        }
      }));

      videos.value = currentPage.value === 1 ? mockVideos : [...videos.value, ...mockVideos];
      hasMore.value = currentPage.value < 3; // 模拟只有3页数据
    } catch (error) {
      console.error('获取分类视频失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 处理分类切换
  const handleCategoryChange = (categoryId: string) => {
    currentCategoryId.value = categoryId;
    currentPage.value = 1;
    videos.value = [];
    hasMore.value = true;
    fetchVideos();
  };

  // 处理加载更多
  const handleLoadMore = () => {
    if (!loading.value && hasMore.value) {
      currentPage.value++;
      fetchVideos();
    }
  };

  // 处理视频点击
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  onMounted(() => {
    currentCategoryId.value = categories.value[0].id;
    fetchVideos();
  });
</script>

<style scoped>
  .explore-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .category-tabs {
    background-color: var(--color-bg-surface);
    border-radius: 8px;
    padding: 16px;
  }

  .tabs-container {
    display: flex;
    overflow-x: auto;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 8px;
  }

  .tab-button {
    padding: 8px 16px;
    border: none;
    background-color: var(--color-bg-subtle);
    color: var(--color-text-secondary);
    border-radius: 20px;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.2s, color 0.2s;
  }

  .tab-button.active {
    background-color: var(--color-accent-primary);
    color: white;
  }

  .category-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .video-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .video-card:hover {
    transform: translateY(-4px);
  }

  .video-thumbnail {
    position: relative;
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    overflow: hidden;
  }

  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    padding: 2px 4px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 12px;
    border-radius: 4px;
  }

  .video-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .video-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-text-primary);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .video-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .author-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .author-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }

  .author-name {
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  .video-stats {
    display: flex;
    gap: 12px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--color-text-muted);
  }

  .icon {
    font-size: 14px;
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }

  .loading-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: var(--color-accent-primary);
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .load-more-button {
    padding: 8px 24px;
    background-color: transparent;
    border: 1px solid var(--color-border-primary);
    color: var(--color-text-primary);
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .load-more-button:hover {
    background-color: var(--color-bg-subtle);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 0;
    color: var(--color-text-muted);
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    .video-grid {
      grid-template-columns: 1fr;
    }
  }
</style>