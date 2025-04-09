<!--
 * @file ChannelPage.vue
 * @description 用户频道页面，展示用户视频内容和频道信息
 * @created 2024-04-06
 * @last-modified 2024-04-07
 -->

<template>
  <div class="channel-page">
    <!-- 频道头部 -->
    <div class="channel-header">
      <div class="channel-cover" :style="{ backgroundImage: `url(${channel.coverUrl || defaultCover})` }">
        <div class="channel-actions">
          <n-button v-if="isOwner" @click="handleEditChannel" type="primary" ghost>
            <template #icon>
              <n-icon>
                <EditOutline />
              </n-icon>
            </template>
            编辑频道
          </n-button>
        </div>
      </div>

      <div class="channel-info">
        <div class="channel-avatar">
          <n-avatar round size="large" :src="channel.avatarUrl || defaultAvatar" />
        </div>

        <div class="channel-details">
          <h1 class="channel-name">{{ channel.name }}</h1>
          <p class="channel-handle">@{{ channel.handle }}</p>
          <div class="channel-stats">
            <div class="stat-item">
              <span class="stat-value">{{ formatNumber(channel.videoCount) }}</span>
              <span class="stat-label">视频</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ formatNumber(channel.subscriberCount) }}</span>
              <span class="stat-label">订阅者</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ formatNumber(channel.totalViews) }}</span>
              <span class="stat-label">总观看量</span>
            </div>
          </div>
        </div>

        <div class="channel-actions-desktop">
          <n-button v-if="!isOwner" @click="handleSubscribe" :type="isSubscribed ? 'default' : 'primary'"
            :ghost="isSubscribed">
            {{ isSubscribed ? '已订阅' : '订阅' }}
          </n-button>
          <n-button v-if="isOwner" @click="handleUploadVideo" type="primary">
            <template #icon>
              <n-icon>
                <CloudUploadOutline />
              </n-icon>
            </template>
            上传视频
          </n-button>
        </div>
      </div>
    </div>

    <!-- 频道导航 -->
    <div class="channel-tabs">
      <n-tabs v-model:value="activeTab" type="line" animated>
        <n-tab-pane name="videos" tab="视频">
          <div class="tab-content">
            <!-- 过滤器 -->
            <div class="filter-bar">
              <n-select v-model:value="sort" :options="sortOptions" size="small" class="sort-select" />
              <n-input-group size="small" class="search-input">
                <n-input v-model:value="searchQuery" placeholder="在此频道中搜索" />
                <n-button type="primary">
                  <template #icon>
                    <n-icon>
                      <SearchOutline />
                    </n-icon>
                  </template>
                </n-button>
              </n-input-group>
            </div>

            <!-- 视频列表 -->
            <div v-if="loading" class="loading-container">
              <n-spin size="large" />
            </div>
            <div v-else-if="videos.length === 0" class="empty-container">
              <n-empty description="没有找到视频">
                <template #extra>
                  <n-button v-if="isOwner" @click="handleUploadVideo" type="primary">上传视频</n-button>
                </template>
              </n-empty>
            </div>
            <div v-else class="video-grid">
              <VideoCardComponent v-for="video in videos" :key="video.id" :video="video"
                @click="handleVideoClick(video)" />
            </div>

            <!-- 加载更多 -->
            <div v-if="hasMore && !loading" class="load-more">
              <n-button @click="loadMore" :loading="loadingMore">加载更多</n-button>
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="about" tab="简介">
          <div class="about-content">
            <div class="about-section">
              <h3 class="section-title">频道简介</h3>
              <p class="section-content">{{ channel.description || '暂无频道简介' }}</p>
            </div>

            <div class="about-section">
              <h3 class="section-title">创建于</h3>
              <p class="section-content">{{ formatDate(channel.createdAt, 'YYYY年MM月DD日') }}</p>
            </div>

            <div class="about-section">
              <h3 class="section-title">所在地区</h3>
              <p class="section-content">{{ channel.location || '未设置' }}</p>
            </div>

            <div class="about-section">
              <h3 class="section-title">社交链接</h3>
              <div v-if="channel.socialLinks && channel.socialLinks.length > 0" class="social-links">
                <a v-for="link in channel.socialLinks" :key="link.platform" :href="link.url" target="_blank"
                  class="social-link">
                  <n-icon>
                    <component :is="getSocialIcon(link.platform)" />
                  </n-icon>
                  <span>{{ link.platform }}</span>
                </a>
              </div>
              <p v-else class="section-content">暂无社交链接</p>
            </div>
          </div>
        </n-tab-pane>

        <n-tab-pane name="playlists" tab="播放列表">
          <div class="tab-content">
            <div v-if="loading" class="loading-container">
              <n-spin size="large" />
            </div>
            <div v-else-if="playlists.length === 0" class="empty-container">
              <n-empty description="没有找到播放列表">
                <template #extra>
                  <n-button v-if="isOwner" @click="handleCreatePlaylist" type="primary">创建播放列表</n-button>
                </template>
              </n-empty>
            </div>
            <div v-else class="playlist-grid">
              <div v-for="playlist in playlists" :key="playlist.id" class="playlist-card"
                @click="navigateToPlaylist(playlist.id)">
                <div class="playlist-thumbnail">
                  <img :src="playlist.thumbnailUrl" alt="播放列表缩略图" />
                  <div class="playlist-count">
                    <n-icon>
                      <ListOutline />
                    </n-icon>
                    {{ playlist.videoCount }}个视频
                  </div>
                </div>
                <div class="playlist-info">
                  <h3 class="playlist-title">{{ playlist.title }}</h3>
                  <p class="playlist-meta">{{ formatDate(playlist.updatedAt) }}更新</p>
                </div>
              </div>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { NAvatar, NButton, NIcon, NEmpty, NSpin, NTabs, NTabPane, NSelect, NInputGroup, NInput } from 'naive-ui';
  import {
    EditOutline,
    CloudUploadOutline,
    SearchOutline,
    ListOutline,
    LogoGithub,
    LogoTwitter,
    LogoYoutube,
    LogoFacebook
  } from '@vicons/ionicons5';
  import VideoCardComponent from '@/components/business/video/VideoCardComponent.vue';
  import { useUserStore } from '@/stores/user';
  import type { Video } from '@/types';
  import dayjs from 'dayjs';

  // 路由
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();

  // 状态
  const channelId = ref(route.params.id as string);
  const activeTab = ref('videos');
  const loading = ref(true);
  const loadingMore = ref(false);
  const hasMore = ref(true);
  const sort = ref('newest');
  const searchQuery = ref('');
  const page = ref(1);
  const pageSize = ref(12);
  const isSubscribed = ref(false);

  // 排序选项
  const sortOptions = [
    { label: '最新上传', value: 'newest' },
    { label: '最多观看', value: 'popular' },
    { label: '最早上传', value: 'oldest' }
  ];

  // 默认图片
  const defaultAvatar = 'https://api.dicebear.com/7.x/initials/svg?seed=AV';
  const defaultCover = 'https://picsum.photos/1200/300?blur=4';

  // 模拟数据
  const channel = ref({
    id: channelId.value,
    name: 'Atom 视频频道',
    handle: 'atomvideo',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=AV&backgroundColor=4355db',
    coverUrl: 'https://picsum.photos/1200/300?random=1',
    description: '这是一个专注于分享编程和技术内容的频道，主要涵盖前端、后端、人工智能等多个领域的知识分享。欢迎订阅！',
    subscriberCount: 12500,
    videoCount: 87,
    totalViews: 1250000,
    createdAt: '2022-01-15T08:00:00Z',
    location: '中国',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com' },
      { platform: 'Twitter', url: 'https://twitter.com' },
      { platform: 'Youtube', url: 'https://youtube.com' }
    ]
  });

  const videos = ref<Video[]>([]);
  const playlists = ref([
    {
      id: 'pl-1',
      title: '前端系列课程',
      thumbnailUrl: 'https://picsum.photos/400/225?random=10',
      videoCount: 24,
      updatedAt: '2024-03-15T10:30:00Z'
    },
    {
      id: 'pl-2',
      title: 'Vue.js教程',
      thumbnailUrl: 'https://picsum.photos/400/225?random=11',
      videoCount: 16,
      updatedAt: '2024-02-28T14:45:00Z'
    },
    {
      id: 'pl-3',
      title: '后端开发实战',
      thumbnailUrl: 'https://picsum.photos/400/225?random=12',
      videoCount: 18,
      updatedAt: '2024-01-10T09:20:00Z'
    }
  ]);

  // 计算属性
  const isOwner = computed(() => {
    return userStore.currentUser?.id === channel.value.id;
  });

  // 加载视频数据
  const fetchVideos = async (reset = false) => {
    try {
      if (reset) {
        loading.value = true;
        page.value = 1;
        videos.value = [];
      } else {
        loadingMore.value = true;
      }

      // 模拟API调用
      await new Promise(r => setTimeout(r, 800));

      // 模拟视频数据
      const newVideos = Array.from({ length: 8 }, (_, i) => ({
        id: `video-${Date.now()}-${i}`,
        title: `视频标题 ${page.value}-${i + 1}`,
        description: '这是一个视频描述',
        coverUrl: `https://picsum.photos/300/168?random=${page.value}${i}`,
        duration: Math.floor(Math.random() * 600) + 60,
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        favorites: Math.floor(Math.random() * 500),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        author: {
          id: channel.value.id,
          nickname: channel.value.name,
          avatar: channel.value.avatarUrl,
          followers: channel.value.subscriberCount,
          isFollowed: false
        },
        tags: ['标签1', '标签2']
      }));

      videos.value = [...videos.value, ...newVideos];
      hasMore.value = page.value < 3; // 模拟最多3页数据
      page.value++;
    } catch (error) {
      console.error('获取视频失败', error);
    } finally {
      loading.value = false;
      loadingMore.value = false;
    }
  };

  // 加载更多视频
  const loadMore = () => {
    if (!loadingMore.value && hasMore.value) {
      fetchVideos(false);
    }
  };

  // 处理视频点击
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };

  // 处理订阅
  const handleSubscribe = () => {
    isSubscribed.value = !isSubscribed.value;
    // 实际项目中这里应该调用API
  };

  // 处理编辑频道
  const handleEditChannel = () => {
    router.push(`/user/settings/channel`);
  };

  // 处理上传视频
  const handleUploadVideo = () => {
    router.push('/video/upload');
  };

  // 处理创建播放列表
  const handleCreatePlaylist = () => {
    // 实际项目中这里应该打开创建播放列表的模态框
    console.log('创建播放列表');
  };

  // 导航到播放列表
  const navigateToPlaylist = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    return num.toString();
  };

  // 格式化日期
  const formatDate = (date: string, format?: string) => {
    if (!date) return '';
    return format
      ? dayjs(date).format(format)
      : dayjs(date).fromNow();
  };

  // 获取社交平台图标
  const getSocialIcon = (platform: string) => {
    const icons: Record<string, any> = {
      'GitHub': LogoGithub,
      'Twitter': LogoTwitter,
      'Youtube': LogoYoutube,
      'Facebook': LogoFacebook
    };
    return icons[platform] || null;
  };

  // 监听路由变化
  watch(() => route.params.id, (newId) => {
    if (newId && newId !== channelId.value) {
      channelId.value = newId as string;
      fetchVideos(true);
      // 实际项目中应该重新获取频道信息
    }
  });

  // 组件挂载时加载数据
  onMounted(() => {
    fetchVideos(true);
  });
</script>

<style scoped>
  .channel-page {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .channel-header {
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background-color: var(--primary-bg);
    box-shadow: var(--shadow-sm);
  }

  .channel-cover {
    height: 200px;
    background-size: cover;
    background-position: center;
    position: relative;
  }

  .channel-actions {
    position: absolute;
    bottom: var(--spacing-md);
    right: var(--spacing-md);
  }

  .channel-info {
    padding: var(--spacing-lg);
    display: flex;
    gap: var(--spacing-lg);
    align-items: center;
    position: relative;
  }

  .channel-avatar {
    margin-top: -60px;
    border: 4px solid var(--primary-bg);
    border-radius: 50%;
    background-color: var(--primary-bg);
  }

  .channel-details {
    flex: 1;
  }

  .channel-name {
    font-size: var(--text-2xl);
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
  }

  .channel-handle {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-top: var(--spacing-xs);
  }

  .channel-stats {
    display: flex;
    gap: var(--spacing-lg);
    margin-top: var(--spacing-md);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-weight: 600;
    color: var(--text-primary);
  }

  .stat-label {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .channel-actions-desktop {
    display: flex;
    gap: var(--spacing-md);
  }

  .channel-tabs {
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-sm);
  }

  .tab-content {
    padding: var(--spacing-md) 0;
  }

  .filter-bar {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    justify-content: space-between;
  }

  .sort-select {
    width: 180px;
  }

  .search-input {
    width: 300px;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }

  .playlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-lg);
  }

  .playlist-card {
    background-color: var(--secondary-bg);
    border-radius: var(--radius-md);
    overflow: hidden;
    cursor: pointer;
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  }

  .playlist-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .playlist-thumbnail {
    position: relative;
    aspect-ratio: 16 / 9;
  }

  .playlist-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .playlist-count {
    position: absolute;
    bottom: var(--spacing-sm);
    right: var(--spacing-sm);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .playlist-info {
    padding: var(--spacing-md);
  }

  .playlist-title {
    margin: 0;
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--text-primary);
  }

  .playlist-meta {
    margin-top: var(--spacing-xs);
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .about-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .about-section {
    padding: var(--spacing-md) 0;
    border-bottom: 1px solid var(--border-light);
  }

  .about-section:last-child {
    border-bottom: none;
  }

  .section-title {
    font-size: var(--text-lg);
    font-weight: 600;
    margin: 0 0 var(--spacing-md) 0;
    color: var(--text-primary);
  }

  .section-content {
    line-height: 1.6;
    color: var(--text-secondary);
    white-space: pre-line;
  }

  .social-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--primary-color);
    text-decoration: none;
  }

  .loading-container,
  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: var(--spacing-xl);
  }

  /* 响应式布局 */
  @media (max-width: 768px) {
    .channel-info {
      flex-direction: column;
      align-items: flex-start;
      text-align: center;
    }

    .channel-avatar {
      margin: -40px auto 0;
    }

    .channel-details {
      width: 100%;
      text-align: center;
    }

    .channel-stats {
      justify-content: center;
    }

    .channel-actions-desktop {
      width: 100%;
      justify-content: center;
      margin-top: var(--spacing-md);
    }

    .filter-bar {
      flex-direction: column;
    }

    .sort-select,
    .search-input {
      width: 100%;
    }

    .video-grid,
    .playlist-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
  }
</style>