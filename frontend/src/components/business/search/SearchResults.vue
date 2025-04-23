<!-- 搜索结果组件 -->
<template>
  <div class="search-results">
    <div class="search-header">
      <h2>搜索结果: "{{ searchQuery }}"</h2>
      <n-button quaternary @click="showAdvancedSearch = !showAdvancedSearch">
        {{ showAdvancedSearch ? '收起' : '高级搜索' }}
        <template #icon>
          <n-icon>
            <SettingsOutline />
          </n-icon>
        </template>
      </n-button>
    </div>

    <!-- 高级搜索面板 -->
    <n-collapse-transition :show="showAdvancedSearch">
      <div class="advanced-search-panel">
        <div class="filter-grid">
          <div class="filter-section">
            <h3 class="filter-title">内容类型</h3>
            <n-radio-group v-model:value="filterType" name="filterType">
              <n-space>
                <n-radio value="all">全部</n-radio>
                <n-radio value="video">视频</n-radio>
                <n-radio value="channel">频道</n-radio>
                <n-radio value="playlist">播放列表</n-radio>
              </n-space>
            </n-radio-group>
          </div>

          <div class="filter-section">
            <h3 class="filter-title">发布日期</h3>
            <n-radio-group v-model:value="dateFilter" name="dateFilter">
              <n-space>
                <n-radio value="any">所有时间</n-radio>
                <n-radio value="today">今天</n-radio>
                <n-radio value="week">本周</n-radio>
                <n-radio value="month">本月</n-radio>
                <n-radio value="year">今年</n-radio>
                <n-radio value="custom">自定义</n-radio>
              </n-space>
            </n-radio-group>
            <div v-if="dateFilter === 'custom'" class="date-range mt-2">
              <n-date-picker v-model:value="dateRange" type="daterange" clearable />
            </div>
          </div>

          <div class="filter-section">
            <h3 class="filter-title">时长</h3>
            <n-radio-group v-model:value="durationFilter" name="durationFilter">
              <n-space>
                <n-radio value="any">所有时长</n-radio>
                <n-radio value="short">短片（< 5分钟）</n-radio>
                    <n-radio value="medium">中等（5-20分钟）</n-radio>
                    <n-radio value="long">长片（> 20分钟）</n-radio>
              </n-space>
            </n-radio-group>
          </div>

          <div class="filter-section">
            <h3 class="filter-title">排序方式</h3>
            <n-select v-model:value="sortBy" :options="sortOptions" />
          </div>

          <div class="filter-section" v-if="filterType === 'video' || filterType === 'all'">
            <h3 class="filter-title">分类</h3>
            <n-select v-model:value="selectedCategories" :options="categoryOptions" multiple placeholder="选择分类" />
          </div>

          <div class="filter-section" v-if="filterType === 'video' || filterType === 'all'">
            <h3 class="filter-title">标签</h3>
            <n-dynamic-tags v-model:value="selectedTags" />
          </div>
        </div>

        <div class="filter-actions">
          <n-button type="primary" @click="applyAdvancedSearch">应用筛选</n-button>
          <n-button @click="resetFilters">重置</n-button>
        </div>
      </div>
    </n-collapse-transition>

    <div class="search-content">
      <n-tabs v-model:value="activeTab" type="line" animated>
        <n-tab-pane name="videos" tab="视频">
          <div v-if="loading" class="loading-state">
            <n-spin size="large" />
          </div>
          <div v-else-if="filteredVideos.length === 0" class="empty-state">
            <n-empty description="没有找到相关视频" />
          </div>
          <div v-else class="video-grid">
            <div v-for="video in filteredVideos" :key="video.id" class="video-card" @click="handleVideoClick(video)">
              <div class="video-thumbnail">
                <img :src="video.coverUrl" :alt="video.title" />
                <div class="video-duration">{{ formatDuration(video.duration) }}</div>
              </div>
              <div class="video-info">
                <h3 class="video-title">{{ video.title }}</h3>
                <div class="video-meta">
                  <span class="video-author">{{ video.author.nickname }}</span>
                  <span class="video-stats">{{ formatNumber(video.views) }}次观看 · {{ formatTimeAgo(video.createdAt)
                  }}</span>
                </div>
                <p class="video-description">{{ truncateText(video.description, 100) }}</p>
              </div>
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="channels" tab="频道">
          <div v-if="loading" class="loading-state">
            <n-spin size="large" />
          </div>
          <div v-else-if="channels.length === 0" class="empty-state">
            <n-empty description="没有找到相关频道" />
          </div>
          <div v-else class="channel-list">
            <div v-for="channel in channels" :key="channel.id" class="channel-item"
              @click="handleChannelClick(channel)">
              <img :src="channel.avatar" :alt="channel.name" class="channel-avatar" />
              <div class="channel-info">
                <h3 class="channel-name">{{ channel.name }}</h3>
                <p class="channel-stats">{{ formatNumber(channel.subscribers) }} 订阅者 · {{ channel.videos }} 个视频</p>
                <p class="channel-description">{{ truncateText(channel.description, 150) }}</p>
              </div>
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="playlists" tab="播放列表">
          <div v-if="loading" class="loading-state">
            <n-spin size="large" />
          </div>
          <div v-else-if="playlists.length === 0" class="empty-state">
            <n-empty description="没有找到相关播放列表" />
          </div>
          <div v-else class="playlist-grid">
            <div v-for="playlist in playlists" :key="playlist.id" class="playlist-card"
              @click="handlePlaylistClick(playlist)">
              <div class="playlist-thumbnail">
                <img :src="playlist.thumbnail" :alt="playlist.title" />
                <div class="video-count">{{ playlist.videoCount }} 个视频</div>
              </div>
              <div class="playlist-info">
                <h3 class="playlist-title">{{ playlist.title }}</h3>
                <p class="playlist-creator">由 {{ playlist.creator }} 创建</p>
                <p class="playlist-description">{{ truncateText(playlist.description, 100) }}</p>
              </div>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>

    <div class="search-pagination">
      <n-pagination v-model:page="currentPage" v-model:page-size="pageSize" :page-count="totalPages"
        :page-sizes="[12, 24, 36, 48]" show-size-picker @update:page="handlePageChange"
        @update:page-size="handleSizeChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type { Video } from '@/types'; // 使用前端定义的Video类型
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import 'dayjs/locale/zh-cn';
  import { mockVideos } from '@/mock/video';
  import { useHistoryStore } from '@/stores/history';
  import { useVideoStore } from '@/stores/video';
  import {
    NButton,
    NIcon,
    NTabs,
    NTabPane,
    NRadioGroup,
    NRadio,
    NSpace,
    NSelect,
    NDatePicker,
    NPagination,
    NSpin,
    NEmpty,
    NCollapseTransition,
    NDynamicTags
  } from 'naive-ui';
  import { SettingsOutline } from '@vicons/ionicons5';

  dayjs.extend(relativeTime);
  dayjs.locale('zh-cn');

  const route = useRoute();
  const router = useRouter();
  const historyStore = useHistoryStore();
  const videoStore = useVideoStore();

  // 状态
  const searchQuery = ref(route.query.q as string || '');
  const filterType = ref('all');
  const sortBy = ref('relevance');
  const activeTab = ref('videos');
  const currentPage = ref(1);
  const pageSize = ref(12);
  const totalResults = ref(100);
  const loading = ref(false);
  const showAdvancedSearch = ref(false);

  // 高级搜索选项
  const dateFilter = ref('any');
  const dateRange = ref<[number, number] | null>(null);
  const durationFilter = ref('any');
  const selectedCategories = ref<string[]>([]);
  const selectedTags = ref<string[]>([]);

  // 计算属性
  const totalPages = computed(() => Math.ceil(totalResults.value / pageSize.value));

  // 选项数据
  const sortOptions = [
    { label: '相关度', value: 'relevance' },
    { label: '上传日期（最新）', value: 'date_desc' },
    { label: '上传日期（最早）', value: 'date_asc' },
    { label: '观看次数（最多）', value: 'views_desc' },
    { label: '观看次数（最少）', value: 'views_asc' },
    { label: '评分（最高）', value: 'rating_desc' },
    { label: '评分（最低）', value: 'rating_asc' },
  ];

  const categoryOptions = [
    { label: '教育', value: 'education' },
    { label: '科技', value: 'technology' },
    { label: '娱乐', value: 'entertainment' },
    { label: '游戏', value: 'gaming' },
    { label: '音乐', value: 'music' },
    { label: '电影', value: 'film' },
    { label: '动画', value: 'animation' },
    { label: '体育', value: 'sports' },
    { label: '美食', value: 'food' },
    { label: '旅行', value: 'travel' },
  ];

  // 模拟数据
  const channels = ref([
    {
      id: '1',
      name: '示例频道 1',
      avatar: 'https://picsum.photos/100/100?random=1',
      subscribers: 1000,
      videos: 50,
      description: '这是一个示例频道的描述'
    },
    {
      id: '2',
      name: '示例频道 2',
      avatar: 'https://picsum.photos/100/100?random=2',
      subscribers: 2000,
      videos: 100,
      description: '这是另一个示例频道的描述'
    }
  ]);

  const playlists = ref([
    {
      id: '1',
      title: '示例播放列表 1',
      thumbnail: 'https://picsum.photos/300/168?random=1',
      videoCount: 10,
      creator: '创建者 1',
      description: '这是一个示例播放列表的描述'
    },
    {
      id: '2',
      title: '示例播放列表 2',
      thumbnail: 'https://picsum.photos/300/168?random=2',
      videoCount: 20,
      creator: '创建者 2',
      description: '这是另一个示例播放列表的描述'
    }
  ]);

  // 自定义视频标签类别映射
  const videoCategories = {
    'video-1': 'frontend',
    'video-2': 'frontend',
    'video-3': 'devops',
    'video-4': 'backend',
    // 为其他可能的视频添加映射
  };

  // 计算属性
  const filteredVideos = computed(() => {
    let videos = [...mockVideos];

    // 根据搜索查询过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      videos = videos.filter(video =>
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query)
      );
    }

    // 根据时长过滤
    if (durationFilter.value !== 'any') {
      videos = videos.filter(video => {
        const duration = video.duration;
        if (durationFilter.value === 'short') return duration < 300; // 5分钟 = 300秒
        if (durationFilter.value === 'medium') return duration >= 300 && duration <= 1200; // 5-20分钟
        if (durationFilter.value === 'long') return duration > 1200; // 超过20分钟
        return true;
      });
    }

    // 根据日期过滤
    if (dateFilter.value !== 'any') {
      const now = dayjs();
      videos = videos.filter(video => {
        const videoDate = dayjs(video.createdAt);
        if (dateFilter.value === 'today') return now.diff(videoDate, 'day') < 1;
        if (dateFilter.value === 'week') return now.diff(videoDate, 'week') < 1;
        if (dateFilter.value === 'month') return now.diff(videoDate, 'month') < 1;
        if (dateFilter.value === 'year') return now.diff(videoDate, 'year') < 1;
        if (dateFilter.value === 'custom' && dateRange.value) {
          const [start, end] = dateRange.value;
          return videoDate.isAfter(dayjs(start)) && videoDate.isBefore(dayjs(end));
        }
        return true;
      });
    }

    // 根据自定义分类映射过滤
    if (selectedCategories.value.length > 0) {
      videos = videos.filter(video => {
        // 使用自定义映射来处理分类
        const category = videoCategories[video.id as keyof typeof videoCategories];
        return category && selectedCategories.value.includes(category);
      });
    }

    // 根据标签过滤
    if (selectedTags.value.length > 0) {
      videos = videos.filter(video =>
        video.tags && selectedTags.value.some(tag => video.tags.includes(tag))
      );
    }

    // 根据排序方式排序
    switch (sortBy.value) {
      case 'relevance':
        // 默认相关度排序
        break;
      case 'date_desc':
        videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'date_asc':
        videos.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'views_desc':
        videos.sort((a, b) => b.views - a.views);
        break;
      case 'views_asc':
        videos.sort((a, b) => a.views - b.views);
        break;
      case 'rating_desc':
        // 使用likes作为评分的替代
        videos.sort((a, b) => b.likes - a.likes);
        break;
      case 'rating_asc':
        // 使用likes作为评分的替代
        videos.sort((a, b) => a.likes - b.likes);
        break;
    }

    // 更新总结果数
    totalResults.value = videos.length;

    // 分页
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return videos.slice(start, end);
  });

  // 监听器
  watch(() => route.query.q, (newQuery) => {
    if (newQuery && typeof newQuery === 'string') {
      searchQuery.value = newQuery;
      loadSearchResults();
    }
  });

  // 方法
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  const handleChannelClick = (channel: any) => {
    router.push(`/channel/${channel.id}`);
  };

  const handlePlaylistClick = (playlist: any) => {
    router.push(`/playlist/${playlist.id}`);
  };

  const applyAdvancedSearch = () => {
    currentPage.value = 1;
    loadSearchResults();
  };

  const resetFilters = () => {
    filterType.value = 'all';
    sortBy.value = 'relevance';
    dateFilter.value = 'any';
    dateRange.value = null;
    durationFilter.value = 'any';
    selectedCategories.value = [];
    selectedTags.value = [];
    loadSearchResults();
  };

  const handlePageChange = (page: number) => {
    currentPage.value = page;
    loadSearchResults();
  };

  const handleSizeChange = (size: number) => {
    currentPage.value = 1;
    pageSize.value = size;
    loadSearchResults();
  };

  const loadSearchResults = async () => {
    // 避免空查询
    if (!searchQuery.value) return;

    loading.value = true;

    try {
      // 添加到搜索历史
      if (searchQuery.value.trim()) {
        await historyStore.addToSearchHistory(searchQuery.value);
      }

      // 在实际应用中，这里会调用API获取搜索结果
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 使用filteredVideos计算属性获取结果
      console.log('搜索结果加载完成:', {
        count: filteredVideos.value.length,
        totalResults: totalResults.value
      });
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 格式化方法
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTimeAgo = (date: string): string => {
    return dayjs(date).fromNow();
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // 生命周期钩子
  onMounted(() => {
    if (searchQuery.value) {
      loadSearchResults();
    }
  });
</script>

<style scoped>
  .search-results {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .search-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  .advanced-search-panel {
    background-color: var(--card-bg);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  .filter-section {
    margin-bottom: 16px;
  }

  .filter-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .filter-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
  }

  .search-content {
    margin-bottom: 24px;
  }

  .search-pagination {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }

  .loading-state,
  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }

  /* 视频网格 */
  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .video-card {
    cursor: pointer;
    transition: transform 0.2s;
    border-radius: 8px;
    overflow: hidden;
  }

  .video-card:hover {
    transform: translateY(-4px);
  }

  .video-thumbnail {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
  }

  .video-thumbnail img {
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
    border-radius: 2px;
    font-size: 12px;
  }

  .video-info {
    padding: 12px;
  }

  .video-title {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.3;
  }

  .video-meta {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  .video-description {
    font-size: 14px;
    color: var(--text-secondary);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  /* 频道列表 */
  .channel-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .channel-item {
    display: flex;
    gap: 16px;
    padding: 16px;
    border-radius: 8px;
    background-color: var(--card-bg);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .channel-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .channel-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
  }

  .channel-info {
    flex: 1;
  }

  .channel-name {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 600;
  }

  .channel-stats {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: var(--text-secondary);
  }

  .channel-description {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
  }

  /* 播放列表网格 */
  .playlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  .playlist-card {
    cursor: pointer;
    transition: transform 0.2s;
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--card-bg);
  }

  .playlist-card:hover {
    transform: translateY(-4px);
  }

  .playlist-thumbnail {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
  }

  .playlist-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-count {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 2px;
    font-size: 12px;
  }

  .playlist-info {
    padding: 16px;
  }

  .playlist-title {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 500;
  }

  .playlist-creator {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: var(--text-secondary);
  }

  .playlist-description {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  /* 工具类 */
  .mt-2 {
    margin-top: 8px;
  }
</style>