<template>
  <div class="feed-container">
    <!-- 加载中骨架屏 -->
    <div v-if="loading" class="feed-content">
      <!-- 视频分类标签骨架屏 -->
      <div class="feed-categories">
        <div v-for="i in 5" :key="i" class="category-chip skeleton"></div>
      </div>

      <!-- 视频网格骨架屏 -->
      <div class="video-grid">
        <div v-for="i in 12" :key="i" class="video-card skeleton-card">
          <div class="video-thumbnail skeleton-thumbnail"></div>
          <div class="video-info">
            <div class="channel-avatar">
              <div class="skeleton-avatar"></div>
            </div>
            <div class="video-details">
              <div class="skeleton-title"></div>
              <div class="skeleton-text"></div>
              <div class="skeleton-text skeleton-text-short"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="feed-error">
      <p>{{ $t('common.error') }}</p>
      <button @click="loadVideos">{{ $t('common.retry') }}</button>
    </div>

    <div v-else-if="videos.length === 0" class="feed-empty">
      <p>{{ $t('common.noVideos') }}</p>
    </div>

    <div v-else class="feed-content">
      <!-- 视频分类标签 -->
      <div class="feed-categories">
        <div v-for="(category, index) in categories" :key="category.id"
          :class="['category-chip', { active: selectedCategory === category.id }]" @click="selectCategory(category.id)">
          {{ category.name }}
        </div>
      </div>

      <!-- 视频网格 - 使用flex-wrap布局替代网格布局 -->
      <div class="video-container">
        <div v-for="video in filteredVideos" :key="video.id" class="video-card">
          <router-link :to="`/video/${video.id}`" class="video-link">
            <div class="video-thumbnail">
              <img :src="video.thumbnail" :alt="video.title" loading="lazy" />
              <span class="video-duration">{{ formatDuration(video.duration) }}</span>
            </div>
          </router-link>
          <div class="video-info">
            <div class="channel-avatar">
              <router-link :to="`/channel/${video.channel.id}`">
                <img :src="video.channel.avatar" :alt="video.channel.name" class="avatar-img" loading="lazy" />
              </router-link>
            </div>
            <div class="video-details">
              <router-link :to="`/video/${video.id}`" class="video-title-link">
                <h3 class="video-title">{{ video.title }}</h3>
              </router-link>
              <router-link :to="`/channel/${video.channel.id}`" class="channel-name">
                {{ video.channel.name }}
              </router-link>
              <p class="video-meta">
                {{ formatViews(video.views) }} · {{ formatDate(video.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- 添加占位卡片以确保最后一行的对齐 -->
        <div v-for="n in placeholderCount" :key="`placeholder-${n}`" class="video-card placeholder-card"></div>
      </div>

      <!-- 加载更多逻辑 - 改进的按钮设计 -->
      <div v-if="hasMoreVideos" class="load-more">
        <button @click="loadMore" :disabled="loadingMore" class="load-more-button">
          <span v-if="loadingMore" class="button-loading-spinner"></span>
          <span>{{ loadingMore ? '加载中...' : $t('common.loadMore') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
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
    category: string;
    channel: {
      id: string;
      name: string;
      avatar: string;
    };
  }

  const videos = ref<Video[]>([]);
  const loading = ref(true);
  const loadingMore = ref(false);
  const error = ref(false);
  const page = ref(1);
  const hasMoreVideos = ref(true);
  const selectedCategory = ref('all');
  const itemsPerRow = ref(4); // 默认每行视频卡片数量

  // 更新为开发者相关的视频分类
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'frontend', name: '前端开发' },
    { id: 'backend', name: '后端开发' },
    { id: 'ui', name: 'UI设计' },
    { id: 'mobile', name: '移动开发' },
    { id: 'devops', name: 'DevOps' },
    { id: 'database', name: '数据库' },
    { id: 'ai', name: '人工智能' },
    { id: 'architecture', name: '架构设计' },
    { id: 'security', name: '网络安全' }
  ];

  // 根据分类筛选视频
  const filteredVideos = computed(() => {
    if (selectedCategory.value === 'all') {
      return videos.value;
    }
    return videos.value.filter(video => video.category === selectedCategory.value);
  });

  // 计算需要多少个占位卡片来填满最后一行
  const placeholderCount = computed(() => {
    const videoCount = filteredVideos.value.length;
    if (videoCount === 0) return 0;

    const remainder = videoCount % itemsPerRow.value;
    return remainder === 0 ? 0 : itemsPerRow.value - remainder;
  });

  // 窗口大小变化时更新每行显示的视频数量
  const updateItemsPerRow = () => {
    if (window.innerWidth >= 1280) {
      itemsPerRow.value = 4;
    } else if (window.innerWidth >= 768) {
      itemsPerRow.value = 3;
    } else if (window.innerWidth >= 480) {
      itemsPerRow.value = 2;
    } else {
      itemsPerRow.value = 1;
    }
  };

  // 监听窗口大小变化
  onMounted(() => {
    updateItemsPerRow();
    window.addEventListener('resize', updateItemsPerRow);
  });

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('resize', updateItemsPerRow);
  });

  // 选择分类
  const selectCategory = (categoryId: string) => {
    selectedCategory.value = categoryId;
  };

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

      // 更真实的视频标题和描述
      const videoTitles = [
        "Vue 3 Composition API 完全指南",
        "React Hooks 实战教程",
        "TypeScript 高级类型系统详解",
        "Node.js 微服务架构实践",
        "Python 数据分析从入门到精通",
        "Flutter 跨平台开发实战",
        "前端性能优化最佳实践",
        "CSS Grid 布局完全指南",
        "GraphQL API 设计与实现",
        "WebAssembly 前端应用"
      ];

      const channelNames = [
        "前端开发者",
        "编程学院",
        "技术分享",
        "代码狂人",
        "全栈工程师"
      ];

      const categories = [
        'frontend', 'frontend', 'frontend',
        'backend', 'ai',
        'mobile', 'frontend',
        'ui', 'backend',
        'frontend'
      ];

      // 模拟响应 - 让我们确保有足够的视频来填充一个完整的网格
      const mockVideos: Video[] = Array(12).fill(0).map((_, index) => ({
        id: `video-${index}`,
        title: videoTitles[index % videoTitles.length],
        thumbnail: `https://picsum.photos/seed/${index}/400/225`,
        views: Math.floor(Math.random() * 1000000),
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        duration: Math.floor(Math.random() * 600) + 120,
        category: categories[index % categories.length],
        channel: {
          id: `channel-${index % 5}`,
          name: channelNames[index % 5],
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
    if (loadingMore.value || !hasMoreVideos.value) return;

    loadingMore.value = true;
    page.value++;

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 更多真实的视频标题
      const moreVideoTitles = [
        "Docker 容器化部署详解",
        "深入理解JavaScript闭包",
        "MongoDB 高级查询技巧",
        "React Native 动画实现",
        "Git 工作流最佳实践",
        "响应式设计与移动优先策略",
        "Jest 单元测试实战",
        "Redux 状态管理进阶",
        "CSS 动画与交互设计",
        "Web 安全防御指南"
      ];

      const channelNames = [
        "前端开发者",
        "编程学院",
        "技术分享",
        "代码狂人",
        "全栈工程师"
      ];

      const categories = [
        'devops', 'frontend', 'database',
        'mobile', 'devops',
        'ui', 'frontend',
        'frontend', 'ui',
        'backend'
      ];

      // 模拟响应 - 确保有足够的视频来填满一个完整的行
      const mockVideos: Video[] = Array(8).fill(0).map((_, index) => ({
        id: `video-${page.value}-${index}`,
        title: moreVideoTitles[index % moreVideoTitles.length],
        thumbnail: `https://picsum.photos/seed/${page.value}${index}/400/225`,
        views: Math.floor(Math.random() * 1000000),
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        duration: Math.floor(Math.random() * 600) + 120,
        category: categories[index % categories.length],
        channel: {
          id: `channel-${index % 5}`,
          name: channelNames[index % 5],
          avatar: `https://i.pravatar.cc/150?u=${index % 5}`,
        }
      }));

      videos.value = [...videos.value, ...mockVideos];
      hasMoreVideos.value = page.value < 3; // 模拟分页
    } catch (e) {
      console.error('加载更多视频失败', e);
    } finally {
      loadingMore.value = false;
    }
  }

  onMounted(() => {
    loadVideos();
  });
</script>

<style scoped>
  .feed-container {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
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

  .loading-spinner,
  .button-loading-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s linear infinite;
    margin-right: 8px;
    display: inline-block;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border-width: 4px;
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

  /* 骨架屏样式 */
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }

    100% {
      background-position: 1000px 0;
    }
  }

  .skeleton {
    background: linear-gradient(90deg,
        var(--bg-color-secondary) 8%,
        var(--hover-color) 18%,
        var(--bg-color-secondary) 33%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
  }

  .skeleton-card {
    display: flex;
    flex-direction: column;
  }

  .skeleton-thumbnail {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    /* 16:9 比例 */
    border-radius: 8px 8px 0 0;
    margin-bottom: 0;
    background-color: var(--bg-color-secondary);
  }

  .skeleton-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.05);
  }

  .skeleton-title,
  .skeleton-text {
    height: 0.9rem;
    margin-bottom: 8px;
    width: 90%;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .skeleton-text {
    height: 0.8rem;
    margin-bottom: 6px;
    width: 70%;
  }

  .skeleton-text-short {
    width: 40%;
  }

  /* 更新视频卡片骨架屏的信息区域 */
  .skeleton-card .video-info {
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 0 0 8px 8px;
    padding: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-top: none;
  }

  .feed-error button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  /* 分类标签 */
  .feed-categories {
    display: flex;
    overflow-x: auto;
    gap: 12px;
    padding-bottom: 16px;
    margin-bottom: 24px;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
    white-space: nowrap;
  }

  .feed-categories::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari */
  }

  .category-chip {
    padding: 8px 16px;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
    color: var(--text-color-secondary);
    position: relative;
    overflow: hidden;
  }

  .category-chip.skeleton {
    width: 90px;
    height: 32px;
    margin: 0;
    flex-shrink: 0;
  }

  .category-chip:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-color);
  }

  .category-chip.active {
    background-color: rgba(255, 255, 255, 0.15);
    color: white;
    border-color: transparent;
    font-weight: 500;
  }

  /* 视频容器 - 使用flex代替grid */
  .video-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 2.5rem;
  }

  .video-card {
    flex: 0 0 calc(25% - 15px);
    /* 每行4个视频卡片，考虑间隔 */
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease;
    margin-bottom: 10px;
    /* 确保每个卡片底部有间距 */
    height: auto;
    /* 自动高度 */
    background-color: transparent;
    /* 确保卡片背景是透明的 */
  }

  .video-card:hover {
    transform: translateY(-4px);
  }

  /* 占位卡片，不显示内容但占据空间 */
  .placeholder-card {
    visibility: hidden;
    height: 0;
    pointer-events: none;
  }

  .video-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .video-thumbnail {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    /* 16:9 比例 */
    overflow: hidden;
    background-color: var(--bg-color-secondary);
    border-radius: 8px 8px 0 0;
    margin-bottom: 0;
  }

  .video-thumbnail img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .video-card:hover .video-thumbnail img {
    transform: scale(1.05);
  }

  .video-duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 3px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .video-info {
    display: flex;
    gap: 12px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 0 0 8px 8px;
    padding: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-top: none;
    height: auto;
    /* 自动高度 */
    min-height: 80px;
    /* 设置最小高度确保一致性 */
  }

  .channel-avatar {
    flex-shrink: 0;
  }

  .avatar-img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.1);
  }

  .video-details {
    flex-grow: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .video-title-link {
    text-decoration: none;
    color: white;
  }

  .video-title {
    margin: 0 0 6px 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    color: white;
    max-height: 2.8em;
    /* 确保标题占用固定高度，即使内容少也保持空间 */
  }

  .channel-name {
    display: block;
    margin: 0 0 4px 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
  }

  .channel-name:hover {
    color: var(--primary-color);
  }

  .video-meta {
    margin: 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
    margin-bottom: 3rem;
    width: 100%;
    background-color: transparent;
    /* 确保背景透明 */
  }

  .load-more-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 40px;
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    backdrop-filter: blur(5px);
  }

  .load-more-button:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  .load-more-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .load-more-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* 响应式布局调整 */
  @media (max-width: 1280px) {
    .video-card {
      flex: 0 0 calc(33.333% - 13.333px);
      /* 每行3个视频卡片 */
    }
  }

  @media (max-width: 768px) {
    .video-card {
      flex: 0 0 calc(50% - 10px);
      /* 每行2个视频卡片 */
    }
  }

  @media (max-width: 480px) {
    .video-card {
      flex: 0 0 100%;
      /* 每行1个视频卡片 */
    }
  }
</style>