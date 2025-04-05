<!--
 * @description 探索页面
 * @features
 * - 分类展示
 * - 热门标签
 * - 推荐内容
 * - 响应式布局
 * - 主题适配
 * - 国际化支持
 -->
<template>
  <div class="explore-container">
    <!-- 页面标题 -->
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold">{{ t('explore.title') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        {{ t('explore.description') }}
      </p>
    </div>

    <!-- 主要内容区域 -->
    <main class="max-w-screen-2xl mx-auto">
      <!-- 热门标签 -->
      <section class="px-4 mb-8">
        <h2 class="text-xl font-semibold mb-4">{{ t('explore.popularTags') }}</h2>
        <div class="flex flex-wrap gap-2">
          <n-tag v-for="tag in popularTags" :key="tag.id" :type="tag.type" round @click="handleTagClick(tag)"
            class="cursor-pointer hover:opacity-80 transition-opacity">
            <template #icon>
              <n-icon>
                <component :is="tag.icon" />
              </n-icon>
            </template>
            {{ tag.name }}
          </n-tag>
        </div>
      </section>

      <!-- 分类展示 -->
      <section class="px-4 mb-8">
        <h2 class="text-xl font-semibold mb-4">{{ t('explore.categories') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <n-card v-for="category in categories" :key="category.id"
            class="category-card cursor-pointer hover:shadow-lg transition-shadow"
            @click="handleCategoryClick(category)">
            <template #header>
              <div class="flex items-center">
                <n-icon size="24" class="mr-2">
                  <component :is="category.icon" />
                </n-icon>
                <span class="text-lg font-medium">{{ category.name }}</span>
              </div>
            </template>
            <p class="text-gray-600 dark:text-gray-400">{{ category.description }}</p>
            <template #footer>
              <div class="flex justify-between items-center text-sm text-gray-500">
                <span>{{ category.videoCount }} {{ t('explore.videos') }}</span>
                <n-button text>
                  {{ t('explore.exploreMore') }}
                  <template #icon>
                    <n-icon>
                      <ArrowForwardOutline />
                    </n-icon>
                  </template>
                </n-button>
              </div>
            </template>
          </n-card>
        </div>
      </section>

      <!-- 推荐内容 -->
      <section class="px-4">
        <h2 class="text-xl font-semibold mb-4">{{ t('explore.recommended') }}</h2>
        <n-virtual-list :items="recommendedVideos" :item-size="300" :container-style="{ height: 'calc(100vh - 600px)' }"
          :grid="{ cols: gridCols, itemSize: 300 }">
          <template #default="{ item }">
            <VideoCard :video="item" class="video-card-hover" />
          </template>
        </n-virtual-list>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <n-spin size="large" />
        </div>

        <!-- 无数据提示 -->
        <div v-if="!loading && recommendedVideos.length === 0" class="flex flex-col items-center justify-center py-16">
          <n-empty :description="t('common.noData')" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import {
    NCard,
    NIcon,
    NButton,
    NTag,
    NSpin,
    NEmpty,
    NVirtualList
  } from 'naive-ui';
  import {
    CodeSlashOutline,
    PhonePortraitOutline,
    BarChartOutline,
    ServerOutline,
    GameControllerOutline,
    BrainOutline,
    ArrowForwardOutline,
    VideocamOutline,
    MusicalNotesOutline,
    HeartOutline,
    SchoolOutline,
    HappyOutline,
    FootballOutline
  } from '@vicons/ionicons5';
  import VideoCard from '@/components/video/VideoCard.vue';
  import { useVideoStore } from '@/stores/video';
  import { useBreakpoint } from '@/composables/useBreakpoint';
  import type { Video } from '@/types';

  const router = useRouter();
  const { t } = useI18n();
  const videoStore = useVideoStore();
  const { breakpoint } = useBreakpoint();

  // 状态
  const loading = ref(false);
  const recommendedVideos = ref<Video[]>([]);

  // 响应式网格列数
  const gridCols = computed(() => {
    switch (breakpoint.value) {
      case 'xs': return 1;
      case 'sm': return 2;
      case 'md': return 3;
      case 'lg': return 4;
      default: return 4;
    }
  });

  // 热门标签
  const popularTags = [
    { id: 1, name: t('explore.tags.programming'), icon: CodeSlashOutline, type: 'info' },
    { id: 2, name: t('explore.tags.gaming'), icon: GameControllerOutline, type: 'success' },
    { id: 3, name: t('explore.tags.music'), icon: MusicalNotesOutline, type: 'warning' },
    { id: 4, name: t('explore.tags.lifestyle'), icon: HeartOutline, type: 'error' },
    { id: 5, name: t('explore.tags.education'), icon: SchoolOutline, type: 'info' },
    { id: 6, name: t('explore.tags.entertainment'), icon: HappyOutline, type: 'success' },
    { id: 7, name: t('explore.tags.sports'), icon: FootballOutline, type: 'warning' }
  ];

  // 分类数据
  const categories = [
    {
      id: 1,
      name: t('explore.categories.webDev'),
      icon: CodeSlashOutline,
      description: t('explore.categories.webDevDesc'),
      videoCount: 1234
    },
    {
      id: 2,
      name: t('explore.categories.mobileDev'),
      icon: PhonePortraitOutline,
      description: t('explore.categories.mobileDevDesc'),
      videoCount: 856
    },
    {
      id: 3,
      name: t('explore.categories.dataScience'),
      icon: BarChartOutline,
      description: t('explore.categories.dataScienceDesc'),
      videoCount: 567
    },
    {
      id: 4,
      name: t('explore.categories.devOps'),
      icon: ServerOutline,
      description: t('explore.categories.devOpsDesc'),
      videoCount: 432
    },
    {
      id: 5,
      name: t('explore.categories.gameDev'),
      icon: GameControllerOutline,
      description: t('explore.categories.gameDevDesc'),
      videoCount: 789
    },
    {
      id: 6,
      name: t('explore.categories.machineLearning'),
      icon: BrainOutline,
      description: t('explore.categories.machineLearningDesc'),
      videoCount: 345
    }
  ];

  // 获取推荐视频
  const fetchRecommendedVideos = async () => {
    if (loading.value) return;

    try {
      loading.value = true;
      const response = await videoStore.getRecommendedVideos();
      recommendedVideos.value = response;
    } catch (err) {
      console.error('Failed to fetch recommended videos:', err);
    } finally {
      loading.value = false;
    }
  };

  // 处理标签点击
  const handleTagClick = (tag: typeof popularTags[0]) => {
    router.push({
      name: 'tag-detail',
      params: { id: tag.id }
    });
  };

  // 处理分类点击
  const handleCategoryClick = (category: typeof categories[0]) => {
    router.push({
      name: 'category',
      params: { id: category.id }
    });
  };

  // 生命周期钩子
  onMounted(() => {
    fetchRecommendedVideos();
  });

  onUnmounted(() => {
    // 清理工作
    recommendedVideos.value = [];
  });
</script>

<style scoped>
  .explore-container {
    @apply min-h-screen bg-gray-50 dark:bg-gray-900;
  }

  .category-card {
    @apply transition-all duration-300;
  }

  .category-card:hover {
    @apply transform -translate-y-1;
  }

  /* 视频卡片悬停效果 */
  .video-card-hover {
    @apply transition-all duration-300 ease-in-out;
  }

  .video-card-hover:hover {
    @apply transform scale-105 shadow-lg;
  }
</style>