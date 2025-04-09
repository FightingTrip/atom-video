/**
* @file ExploreComponent.vue
* @description 探索页面组件 - 展示分类内容和发现功能的业务组件
* @author Atom Video Team
* @date 2025-04-09
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
        <!-- 使用VideoGridComponent组件 -->
        <VideoGridComponent :videos="videos" :loading="loading"
          :empty-text="'暂无' + (currentCategory?.name || '') + '视频'" @video-click="handleVideoClick" />

        <!-- 加载更多 -->
        <div v-if="hasMore && !loading && videos.length > 0" class="load-more">
          <button class="load-more-button" @click="handleLoadMore">
            加载更多
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import VideoGridComponent from '@/components/common/video/VideoGridComponent.vue';
  import { Video } from '@/types/video';

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
        thumbnailUrl: `https://picsum.photos/seed/${currentCategoryId.value}${currentPage.value}${index}/400/225`,
        duration: Math.floor(Math.random() * 600),
        views: Math.floor(Math.random() * 100000),
        likes: Math.floor(Math.random() * 10000),
        publishedAt: new Date().toISOString(),
        author: {
          id: `author-${index % 5}`,
          name: `创作者 ${index % 5}`,
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
    background-color: var(--bg-color);
  }

  .category-tabs {
    background-color: var(--bg-color-secondary);
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
    background-color: var(--bg-color-tertiary);
    color: var(--text-color-secondary);
    border-radius: 20px;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.2s, color 0.2s;
  }

  .tab-button:hover {
    background-color: var(--hover-color);
    color: var(--text-color);
  }

  .tab-button.active {
    background-color: var(--accent-primary);
    color: white;
  }

  .category-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  .load-more-button {
    padding: 8px 24px;
    background-color: var(--accent-primary);
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }

  .load-more-button:hover {
    background-color: var(--accent-primary-hover);
  }

  /* 暗色模式特定样式 */
  :root.dark .explore-section,
  .dark-mode .explore-section {
    background-color: var(--bg-color-dark);
  }

  :root.dark .category-tabs,
  .dark-mode .category-tabs {
    background-color: var(--bg-color-darker);
  }

  :root.dark .tab-button,
  .dark-mode .tab-button {
    background-color: var(--bg-color-darkest);
    color: var(--text-color-secondary-dark);
  }

  :root.dark .tab-button:hover,
  .dark-mode .tab-button:hover {
    background-color: var(--hover-color-dark);
    color: var(--text-color-dark);
  }

  :root.dark .tab-button.active,
  .dark-mode .tab-button.active {
    background-color: var(--accent-primary-dark);
    color: var(--text-color-dark);
  }

  :root.dark .load-more-button,
  .dark-mode .load-more-button {
    background-color: var(--accent-primary-dark);
  }

  :root.dark .load-more-button:hover,
  .dark-mode .load-more-button:hover {
    background-color: var(--accent-primary-hover-dark);
  }

  @media (max-width: 768px) {
    .explore-section {
      padding: 16px;
    }

    .category-tabs {
      padding: 12px;
    }

    .tabs-container {
      gap: 8px;
      margin-bottom: 16px;
    }

    .tab-button {
      padding: 6px 12px;
      font-size: 14px;
    }
  }
</style>