<!-- 频道组件 -->
<template>
  <div class="channel">
    <div class="channel-header">
      <div class="channel-banner">
        <img :src="channel.banner" :alt="channel.name" />
      </div>
      <div class="channel-info">
        <div class="channel-avatar">
          <img :src="channel.avatar" :alt="channel.name" />
        </div>
        <div class="channel-details">
          <h1 class="channel-name">{{ channel.name }}</h1>
          <div class="channel-stats">
            <span class="subscribers">{{ formatNumber(channel.subscribers) }} 订阅者</span>
            <span class="videos">{{ channel.videos }} 个视频</span>
            <span class="views">{{ formatNumber(channel.views) }} 次观看</span>
          </div>
          <p class="channel-description">{{ channel.description }}</p>
          <div class="channel-actions">
            <el-button type="primary" @click="handleSubscribe" :loading="isSubscribing">
              {{ isSubscribed ? '已订阅' : '订阅' }}
            </el-button>
            <el-button @click="handleShare">分享</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="channel-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="视频" name="videos">
          <div class="video-filters">
            <el-select v-model="sortBy" placeholder="排序方式" @change="handleSortChange">
              <el-option label="最新" value="latest" />
              <el-option label="最热" value="hot" />
              <el-option label="最受欢迎" value="popular" />
            </el-select>
          </div>
          <VideoList :videos="filteredVideos" @video-click="handleVideoClick" />
        </el-tab-pane>
        <el-tab-pane label="播放列表" name="playlists">
          <div class="playlist-grid">
            <div v-for="playlist in playlists" :key="playlist.id" class="playlist-card"
              @click="handlePlaylistClick(playlist)">
              <div class="playlist-thumbnail">
                <img :src="playlist.thumbnail" :alt="playlist.title" />
                <div class="video-count">{{ playlist.videoCount }} 个视频</div>
              </div>
              <div class="playlist-info">
                <h3 class="playlist-title">{{ playlist.title }}</h3>
                <p class="playlist-description">{{ playlist.description }}</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="关于" name="about">
          <div class="about-section">
            <h2>关于频道</h2>
            <p class="about-description">{{ channel.about }}</p>
            <div class="about-details">
              <div class="detail-item">
                <span class="detail-label">加入日期</span>
                <span class="detail-value">{{ formatDate(channel.joinDate) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">位置</span>
                <span class="detail-value">{{ channel.location }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">链接</span>
                <div class="detail-links">
                  <a v-for="link in channel.links" :key="link.url" :href="link.url" target="_blank" class="link-item">
                    {{ link.name }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="channel-pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
        :page-sizes="[12, 24, 36, 48]" layout="total, sizes, prev, pager, next" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type { IVideo } from '@atom-video/shared-types';
  import VideoList from '@/components/business/video/VideoList.vue';
  import { mockVideos } from '@/mock/video';

  const route = useRoute();
  const router = useRouter();

  // 状态
  const activeTab = ref('videos');
  const sortBy = ref('latest');
  const currentPage = ref(1);
  const pageSize = ref(12);
  const total = ref(100);
  const isSubscribed = ref(false);
  const isSubscribing = ref(false);

  // 模拟频道数据
  const channel = ref({
    id: '1',
    name: '示例频道',
    avatar: 'https://picsum.photos/200/200?random=1',
    banner: 'https://picsum.photos/1200/300?random=1',
    subscribers: 10000,
    videos: 50,
    views: 1000000,
    description: '这是一个示例频道的描述。这里可以包含频道的简介、特色等内容。',
    about: '这是一个示例频道的详细介绍。这里可以包含频道的创建背景、目标、特色等内容。',
    joinDate: '2023-01-01',
    location: '中国',
    links: [
      { name: '网站', url: 'https://example.com' },
      { name: '微博', url: 'https://weibo.com/example' },
      { name: 'GitHub', url: 'https://github.com/example' }
    ]
  });

  // 模拟播放列表数据
  const playlists = ref([
    {
      id: '1',
      title: '示例播放列表 1',
      thumbnail: 'https://picsum.photos/300/168?random=1',
      videoCount: 10,
      description: '这是一个示例播放列表的描述'
    },
    {
      id: '2',
      title: '示例播放列表 2',
      thumbnail: 'https://picsum.photos/300/168?random=2',
      videoCount: 20,
      description: '这是另一个示例播放列表的描述'
    }
  ]);

  // 计算属性
  const filteredVideos = computed(() => {
    let videos = [...mockVideos];

    // 根据排序方式排序
    switch (sortBy.value) {
      case 'latest':
        videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'hot':
        videos.sort((a, b) => b.views - a.views);
        break;
      case 'popular':
        videos.sort((a, b) => b.likes - a.likes);
        break;
    }

    // 分页
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return videos.slice(start, end);
  });

  // 方法
  const handleVideoClick = (video: IVideo) => {
    router.push(`/video/${video.id}`);
  };

  const handlePlaylistClick = (playlist: any) => {
    router.push(`/playlist/${playlist.id}`);
  };

  const handleSubscribe = async () => {
    isSubscribing.value = true;
    try {
      // 模拟订阅操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      isSubscribed.value = !isSubscribed.value;
    } finally {
      isSubscribing.value = false;
    }
  };

  const handleShare = () => {
    // 实现分享功能
    const shareUrl = `${window.location.origin}/channel/${channel.value.id}`;
    window.navigator.clipboard.writeText(shareUrl);
    // 显示成功提示
    console.log('已复制频道链接');
  };

  const handleSortChange = () => {
    // 重新加载数据
    loadChannelData();
  };

  const handleSizeChange = (val: number) => {
    pageSize.value = val;
    loadChannelData();
  };

  const handleCurrentChange = (val: number) => {
    currentPage.value = val;
    loadChannelData();
  };

  const loadChannelData = () => {
    // 加载频道数据
    console.log('加载频道数据:', {
      channelId: channel.value.id,
      tab: activeTab.value,
      sortBy: sortBy.value,
      page: currentPage.value,
      pageSize: pageSize.value
    });
  };

  // 工具方法
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    return num.toString();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
</script>

<style scoped>
  .channel {
    min-height: 100vh;
    background-color: var(--primary-bg);
    color: var(--text-primary);
  }

  .channel-header {
    position: relative;
  }

  .channel-banner {
    height: 200px;
    overflow: hidden;
  }

  .channel-banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .channel-info {
    display: flex;
    gap: 24px;
    padding: 24px;
    background-color: var(--primary-bg);
  }

  .channel-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid var(--primary-bg);
    margin-top: -60px;
  }

  .channel-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .channel-details {
    flex: 1;
  }

  .channel-name {
    margin: 0 0 8px;
    font-size: 24px;
    font-weight: 600;
  }

  .channel-stats {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    color: var(--text-secondary);
  }

  .channel-description {
    margin: 0 0 16px;
    color: var(--text-secondary);
  }

  .channel-actions {
    display: flex;
    gap: 12px;
  }

  .channel-content {
    padding: 24px;
  }

  .video-filters {
    margin-bottom: 16px;
  }

  .playlist-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .playlist-card {
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s;
  }

  .playlist-card:hover {
    transform: translateY(-4px);
  }

  .playlist-thumbnail {
    position: relative;
    aspect-ratio: 16/9;
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
    border-radius: 4px;
    font-size: 12px;
  }

  .playlist-info {
    padding: 12px;
  }

  .playlist-title {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
  }

  .playlist-description {
    margin: 0;
    color: var(--text-secondary);
    font-size: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .about-section {
    max-width: 800px;
  }

  .about-section h2 {
    margin: 0 0 16px;
    font-size: 20px;
    font-weight: 600;
  }

  .about-description {
    margin: 0 0 24px;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .about-details {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .detail-item {
    display: flex;
    gap: 16px;
  }

  .detail-label {
    width: 80px;
    color: var(--text-secondary);
  }

  .detail-value {
    flex: 1;
  }

  .detail-links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .link-item {
    color: var(--primary-color);
    text-decoration: none;
    transition: color 0.3s;
  }

  .link-item:hover {
    color: var(--primary-color-hover);
  }

  .channel-pagination {
    display: flex;
    justify-content: center;
    padding: 24px;
  }

  @media screen and (max-width: 768px) {
    .channel-info {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .channel-avatar {
      margin-top: -80px;
    }

    .channel-stats {
      justify-content: center;
    }

    .channel-actions {
      justify-content: center;
    }
  }
</style>