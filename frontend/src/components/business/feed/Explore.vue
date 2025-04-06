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
      <n-tabs type="line" animated @update:value="handleCategoryChange">
        <n-tab-pane v-for="category in categories" :key="category.id" :name="category.id" :tab="category.name">
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
                      <n-avatar round :size="24" :src="video.author.avatar" class="author-avatar" />
                      <span class="author-name">{{ video.author.nickname }}</span>
                    </div>
                    <div class="video-stats">
                      <span class="stat-item">
                        <n-icon>
                          <EyeOutline />
                        </n-icon>
                        {{ formatNumber(video.views) }}
                      </span>
                      <span class="stat-item">
                        <n-icon>
                          <HeartOutline />
                        </n-icon>
                        {{ formatNumber(video.likes) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 加载更多 -->
            <div v-if="hasMore" ref="loadMoreRef" class="load-more">
              <n-spin v-if="loading" />
              <n-button v-else text @click="handleLoadMore" class="load-more-button">
                加载更多
              </n-button>
            </div>

            <!-- 空状态 -->
            <div v-else-if="!loading && videos.length === 0" class="empty-state">
              <n-empty :description="`暂无${currentCategory?.name || ''}视频`" />
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useIntersectionObserver } from '@vueuse/core';
  import { NTabs, NTabPane, NButton, NAvatar, NIcon, NSpin, NEmpty } from 'naive-ui';
  import { EyeOutline, HeartOutline } from '@vicons/ionicons5';
  import type { Video, Category } from '@/types';

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

  // 加载更多元素引用
  const loadMoreRef = ref<HTMLElement | null>(null);

  // 设置交叉观察
  useIntersectionObserver(
    loadMoreRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting && !loading.value && hasMore.value) {
        handleLoadMore();
      }
    },
    { threshold: 0.5 }
  );

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
      // TODO: 实现获取分类视频的API调用
      const result = await fetch(`/api/videos/category/${currentCategoryId.value}?page=${currentPage.value}`);
      const data = await result.json();
      videos.value.push(...data.videos);
      hasMore.value = data.hasMore;
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
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
  }

  .category-tabs {
    background-color: var(--secondary-bg);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
  }

  .category-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg) 0;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }

  .video-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    cursor: pointer;
    transition: transform var(--transition-normal);
  }

  .video-card:hover {
    transform: translateY(-4px);
  }

  .video-thumbnail {
    position: relative;
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-duration {
    position: absolute;
    bottom: var(--spacing-xs);
    right: var(--spacing-xs);
    padding: 2px 4px;
    background-color: rgba(0, 0, 0, 0.8);
    color: var(--text-inverse);
    font-size: var(--text-xs);
    border-radius: var(--radius-sm);
  }

  .video-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .video-title {
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .video-meta {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .author-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .author-name {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .video-stats {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .load-more {
    display: flex;
    justify-content: center;
    padding: var(--spacing-md) 0;
  }

  .load-more-button {
    color: var(--primary-color);
    background: none;
    border: none;
    transition: color var(--transition-normal);
  }

  .load-more-button:hover {
    color: var(--primary-color-dark);
  }

  .empty-state {
    <div class="explore">< !-- 搜索和筛选区域 --><section class="filter-section"><SearchBar v-model="searchQuery" placeholder="搜索视频、用户或标签"@search="handleSearch" /><FilterPanel :categories="categories" :tags="popularTags"@filter="handleFilter" /></section>< !-- 视频网格 --><section class="video-grid"><VideoCard v-for="video in videos" :key="video.id" :video="video"@click="handleVideoClick(video)" /></section>< !-- 加载更多按钮 --><div v-if="hasMore" class="load-more"><Button :loading="loading"@click="loadMore">加载更多 </Button></div>< !-- 加载状态 --><div v-if="loading && !videos.length" class="loading-container"><LoadingSpinner /></div>< !-- 错误提示 --><div v-if="error" class="error-container"><ErrorMessage :message="error" /></div>< !-- 空状态 --><div v-if="!loading && !error && !videos.length" class="empty-container"><EmptyState message="暂无视频" /></div></div></template><script setup lang="ts">import {
      ref,
      onMounted
    }

    from 'vue';

    import {
      useRouter
    }

    from 'vue-router';

    import {
      useVideo
    }

    from '@/composables/useVideo';

    import {
      useCategory
    }

    from '@/composables/useCategory';

    import {
      useTag
    }

    from '@/composables/useTag';
    import SearchBar from '@/components/common/search/SearchBar.vue';
    import FilterPanel from '@/components/common/filter/FilterPanel.vue';
    import VideoCard from '@/components/common/video/VideoCard.vue';
    import Button from '@/components/common/button/Button.vue';
    import LoadingSpinner from '@/components/common/loading/LoadingSpinner.vue';
    import ErrorMessage from '@/components/common/feedback/ErrorMessage.vue';
    import EmptyState from '@/components/common/feedback/EmptyState.vue';

    import type {
      Video,
      Category,
      Tag
    }

    from '@/types';

    const router=useRouter();

    // 状态
    const loading=ref(false);
    const error=ref<string | null>(null);
    const videos=ref<Video[]>([]);
    const categories=ref<Category[]>([]);
    const popularTags=ref<Tag[]>([]);
    const searchQuery=ref('');
    const currentPage=ref(1);
    const hasMore=ref(true);

    // 组合式函数
    const {
      fetchVideos
    }

    =useVideo();

    const {
      fetchCategories
    }

    =useCategory();

    const {
      fetchPopularTags
    }

    =useTag();

    // 方法
    const handleSearch=async ()=> {
      try {
        loading.value=true;
        error.value=null;
        currentPage.value=1;
        videos.value=[];
        hasMore.value=true;

        const result=await fetchVideos({
          page: 1,
          pageSize: 12,
          query: searchQuery.value,
        });

      videos.value=result;
      hasMore.value=result.length===12;
    }

    catch (err) {
      error.value='搜索失败';
      console.error('搜索失败:', err);
    }

    finally {
      loading.value=false;
    }
  }

  ;

  const handleFilter=async (filters: {
      categories?: string[];
      tags?: string[];

    })=> {
    try {
      loading.value=true;
      error.value=null;
      currentPage.value=1;
      videos.value=[];
      hasMore.value=true;

      const result=await fetchVideos({
        page: 1,
        pageSize: 12,
        ...filters,
      });

    videos.value=result;
    hasMore.value=result.length===12;
  }

  catch (err) {
    error.value='筛选失败';
    console.error('筛选失败:', err);
  }

  finally {
    loading.value=false;
  }
}

;

const loadMore=async ()=> {
  if (loading.value || !hasMore.value) return;

  try {
    loading.value=true;
    error.value=null;
    currentPage.value++;

    const result=await fetchVideos({
      page: currentPage.value,
      pageSize: 12,
      query: searchQuery.value,
    });

  videos.value.push(...result);
  hasMore.value=result.length===12;
}

catch (err) {
  error.value='加载更多失败';
  console.error('加载更多失败:', err);
}

finally {
  loading.value=false;
}
}

;

const handleVideoClick=(video: Video)=> {
  router.push(`/video/$ {
      video.id
    }

    `);
}

;

// 初始化
onMounted(async ()=> {
    try {
      loading.value=true;
      error.value=null;

      // 并行加载数据
      const [videosData, categoriesData, tagsData]=await Promise.all([ fetchVideos({
          page: 1, pageSize: 12
        }),
      fetchCategories(),
      fetchPopularTags(),
      ]);

    videos.value=videosData;
    categories.value=categoriesData;
    popularTags.value=tagsData;
    hasMore.value=videosData.length===12;
  }

  catch (err) {
    error.value='加载数据失败';
    console.error('加载数据失败:', err);
  }

  finally {
    loading.value=false;
  }
});

</script><style scoped>.explore {
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