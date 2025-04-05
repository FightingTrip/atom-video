/**
* @file Library.vue
* @description 视频库页面组件，用于展示用户收藏的视频
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 视频列表：展示用户收藏的视频
* - 视频分类：支持按分类筛选视频
* - 视频排序：支持按时间、热度等排序
* - 视频搜索：支持搜索视频标题和描述
* - 分页加载：支持分页加载更多视频
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useVideoStore: 视频状态管理
* - useUserStore: 用户状态管理
* - naive-ui: UI组件库
* - vue-i18n: 国际化支持
* - vue-router: 路由管理
*/
<template>
  <div class="library-container">
    <!-- 页面标题 -->
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold">{{ t('nav.library') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        {{ t('library.description') }}
      </p>
    </div>

    <!-- 未登录提示 -->
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center py-16">
      <n-empty :description="t('auth.loginRequired')">
        <template #extra>
          <n-button type="primary" @click="router.push('/auth/login')">
            {{ t('user.login') }}
          </n-button>
        </template>
      </n-empty>
    </div>

    <!-- 主要内容区域 -->
    <main v-else class="max-w-screen-2xl mx-auto">
      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" class="mx-4 my-4" closable @close="error = null">
        {{ error }}
      </n-alert>

      <!-- 分类筛选 -->
      <div class="px-4 mb-6">
        <n-tabs v-model:value="activeTab" type="line" animated @update:value="handleTabChange">
          <n-tab-pane name="favorites" :tab="t('library.favorites')">
            <!-- 收藏视频列表 -->
          </n-tab-pane>
          <n-tab-pane name="playlists" :tab="t('library.playlists')">
            <!-- 播放列表 -->
          </n-tab-pane>
        </n-tabs>
      </div>

      <!-- 视频列表 -->
      <div class="px-4">
        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <n-spin size="large" />
        </div>

        <!-- 视频网格 -->
        <template v-else>
          <n-virtual-list :items="filteredVideos" :item-size="300" :container-style="{ height: 'calc(100vh - 300px)' }"
            :grid="{ cols: gridCols, itemSize: 300 }" @scroll="handleScroll">
            <template #default="{ item }">
              <VideoCard :video="item" class="video-card-hover" @like="handleLike" @error="handleError" />
            </template>
          </n-virtual-list>

          <!-- 无数据提示 -->
          <div v-if="!loading && filteredVideos.length === 0" class="flex flex-col items-center justify-center py-16">
            <n-empty :description="t('common.noData')">
              <template #extra>
                <n-button @click="router.push('/explore')">
                  {{ t('library.exploreVideos') }}
                </n-button>
              </template>
            </n-empty>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import {
    NButton,
    NEmpty,
    NAlert,
    NSpin,
    NVirtualList,
    NTabs,
    NTabPane,
    NIcon,
    NInput,
    NInputGroup
  } from 'naive-ui';
  import {
    VideocamOutline,
    GameControllerOutline,
    MusicalNotesOutline,
    FastFoodOutline,
    HeartOutline,
    SchoolOutline,
    HappyOutline,
    FootballOutline,
    Search
  } from '@vicons/ionicons5';
  import { useAuthStore } from '@/stores/auth';
  import { useVideoStore } from '@/stores/video';
  import { useBreakpoint } from '@/composables/useBreakpoint';
  import VideoCard from '@/components/business/video/VideoCard.vue';
  import type { Video } from '@/types';

  const router = useRouter();
  const { t } = useI18n();
  const authStore = useAuthStore();
  const videoStore = useVideoStore();
  const { breakpoint } = useBreakpoint();

  // 状态
  const videos = ref<Video[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const hasMore = ref(true);
  const activeTab = ref('favorites');
  const searchQuery = ref('');

  // 计算属性
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const filteredVideos = computed(() => {
    let result = videos.value;

    // 分类过滤
    if (activeTab.value !== 'all') {
      result = result.filter(video => video.category === activeTab.value);
    }

    // 搜索过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(video =>
        video.title.toLowerCase().includes(query) ||
        video.description?.toLowerCase().includes(query)
      );
    }

    return result;
  });

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

  // 分类配置
  const categories = [
    { label: t('categories.all'), value: 'all', icon: VideocamOutline },
    { label: t('categories.gaming'), value: 'gaming', icon: GameControllerOutline },
    { label: t('categories.music'), value: 'music', icon: MusicalNotesOutline },
    { label: t('categories.food'), value: 'food', icon: FastFoodOutline },
    { label: t('categories.lifestyle'), value: 'lifestyle', icon: HeartOutline },
    { label: t('categories.education'), value: 'education', icon: SchoolOutline },
    { label: t('categories.entertainment'), value: 'entertainment', icon: HappyOutline },
    { label: t('categories.sports'), value: 'sports', icon: FootballOutline }
  ];

  // 获取收藏视频
  const fetchLibraryVideos = async () => {
    try {
      await videoStore.getLibraryVideos();
    } catch (err) {
      console.error('获取收藏视频失败:', err);
    }
  };

  // 切换收藏状态
  const handleToggleFavorite = async (videoId: string) => {
    try {
      await videoStore.toggleFavorite(videoId);
    } catch (err) {
      console.error('切换收藏状态失败:', err);
    }
  };

  // 处理搜索
  const handleSearch = () => {
    currentPage.value = 1;
    fetchLibraryVideos();
  };

  // 处理滚动加载
  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (scrollHeight - scrollTop - clientHeight < 100 && !loading.value && hasMore.value) {
      currentPage.value++;
      fetchLibraryVideos();
    }
  };

  // 处理点赞
  const handleLike = (videoId: string) => {
    const video = videos.value.find(v => v.id === videoId);
    if (video) {
      video.isLiked = !video.isLiked;
      video.likes += video.isLiked ? 1 : -1;
    }
  };

  // 处理错误
  const handleError = (err: Error) => {
    error.value = err.message;
  };

  // 切换标签
  const handleTabChange = (tab: string) => {
    activeTab.value = tab;
    fetchLibraryVideos();
  };

  // 生命周期钩子
  onMounted(() => {
    if (authStore.isAuthenticated) {
      fetchLibraryVideos();
    }
  });

  onUnmounted(() => {
    // 清理工作
    videos.value = [];
    currentPage.value = 1;
    hasMore.value = true;
    searchQuery.value = '';
  });
</script>

<style scoped>
  .library-container {
    @apply min-h-screen bg-gray-50 dark:bg-gray-900;
  }

  /* 视频卡片悬停效果 */
  .video-card-hover {
    @apply transition-all duration-300 ease-in-out;
  }

  .video-card-hover:hover {
    @apply transform scale-105 shadow-lg;
  }
</style>