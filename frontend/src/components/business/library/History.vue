/**
* @file History.vue
* @description 用户观看历史组件
* @author Atom Video Team
* @date 2025-04-08
*/

<template>
  <div class="history-container">
    <div class="history-header">
      <h1 class="history-title">观看历史</h1>
      <div class="history-actions">
        <n-button @click="refreshHistory" :loading="loading">
          <template #icon>
            <n-icon>
              <RefreshIcon />
            </n-icon>
          </template>
          刷新
        </n-button>
        <n-button v-if="history.length > 0" @click="showClearConfirm" type="error" ghost>
          <template #icon>
            <n-icon>
              <TrashIcon />
            </n-icon>
          </template>
          清空历史
        </n-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <n-spin size="large" />
      <p>加载历史记录中...</p>
    </div>

    <div v-else-if="history.length === 0" class="empty-container">
      <n-empty description="暂无观看历史">
        <template #icon>
          <div class="empty-icon">🕒</div>
        </template>
        <template #extra>
          <n-button type="primary" @click="goToExplore">浏览视频</n-button>
        </template>
      </n-empty>
    </div>

    <div v-else class="history-list">
      <div v-for="item in history" :key="item.video.id" class="history-item">
        <div class="video-card" @click="goToVideo(item.video.id)">
          <div class="thumbnail-container">
            <img :src="item.video.coverUrl" :alt="item.video.title" class="thumbnail" />
            <div class="progress-bar" :style="{ width: `${item.progress.percentage}%` }"></div>
            <div class="duration">{{ formatDuration(item.video.duration) }}</div>
          </div>
          <div class="video-info">
            <h3 class="video-title">{{ item.video.title }}</h3>
            <div class="video-meta">
              <p class="channel-name">{{ item.video.author.nickname }}</p>
              <p class="video-stats">
                {{ formatNumber(item.video.views) }}次观看 · {{ formatTimeAgo(item.progress.lastPlayedAt) }}
              </p>
            </div>
            <div class="progress-text">
              观看至 {{ formatTime(item.progress.currentTime) }} / {{ formatTime(item.progress.duration) }}
            </div>
          </div>
        </div>
        <div class="item-actions">
          <n-dropdown :options="getItemActions(item)" @select="handleAction($event, item)" placement="bottom-end">
            <n-button circle quaternary>
              <template #icon>
                <n-icon>
                  <MoreIcon />
                </n-icon>
              </template>
            </n-button>
          </n-dropdown>
        </div>
      </div>

      <div v-if="hasMore" class="load-more">
        <n-button @click="loadMore" :loading="loadingMore" :disabled="loadingMore">加载更多</n-button>
      </div>
    </div>

    <!-- 确认对话框 -->
    <n-modal v-model:show="showConfirmModal" preset="dialog" title="确认清空观看历史" content="该操作不可撤销，确定要清空所有观看历史记录吗？"
      positive-text="确认" negative-text="取消" @positive-click="clearHistory" @negative-click="showConfirmModal = false" />

  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { NButton, NSpin, NEmpty, NIcon, NDropdown, NModal } from 'naive-ui';
  import { getWatchHistory, getAllVideoProgresses, clearWatchHistory, deleteVideoProgress } from '@/services/video/videoProgress';
  import type { VideoProgress, Video } from '@/types';
  import { RefreshOutline as RefreshIcon, TrashOutline as TrashIcon, EllipsisHorizontal as MoreIcon } from '@vicons/ionicons5';

  // 单条历史记录数据结构
  interface HistoryItem {
    video: Video;
    progress: VideoProgress;
  }

  // 路由
  const router = useRouter();

  // 页面状态
  const loading = ref(true);
  const loadingMore = ref(false);
  const history = ref<HistoryItem[]>([]);
  const hasMore = ref(false);
  const page = ref(1);
  const pageSize = 10;
  const showConfirmModal = ref(false);

  // 当前用户ID (在实际应用中应从身份验证服务获取)
  const currentUserId = '1'; // 假设当前登录用户ID为1

  // 从服务获取观看历史和进度信息
  const fetchHistory = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        loading.value = true;
        page.value = 1;
        history.value = [];
      } else {
        loadingMore.value = true;
      }

      // 获取当前页码的观看历史
      const videoIds = await getWatchHistory(currentUserId);
      const progresses = await getAllVideoProgresses(currentUserId);

      // 创建视频ID到进度的映射
      const progressMap = new Map<string, VideoProgress>();
      progresses.forEach(progress => {
        progressMap.set(progress.videoId, progress);
      });

      // 计算当前页的起始和结束索引
      const startIndex = (page.value - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, videoIds.length);
      const currentPageIds = videoIds.slice(startIndex, endIndex);

      // 模拟从服务获取视频数据
      const mockVideos: Video[] = [
        {
          id: 'v1',
          title: '2025年最值得学习的编程语言',
          description: '本视频探讨了2025年最热门、最有前景的编程语言，包括就业前景、薪资水平和技术趋势分析。',
          coverUrl: 'https://picsum.photos/id/1/640/360',
          videoUrl: 'https://example.com/videos/v1',
          duration: 925,
          views: 45280,
          likes: 3840,
          favorites: 1220,
          comments: 342,
          createdAt: '2025-01-10T08:30:00Z',
          author: {
            id: '3',
            username: 'creator',
            nickname: '内容创作者',
            avatar: 'https://i.pravatar.cc/150?u=3',
            verified: true,
          },
          tags: ['编程', '技术', '教育'],
          sources: [],
          subtitles: [],
        },
        {
          id: 'v2',
          title: '人工智能初学者完全指南',
          description: '这是一个为初学者设计的人工智能入门教程，从基础概念到实际应用，循序渐进地介绍AI领域的核心知识。',
          coverUrl: 'https://picsum.photos/id/2/640/360',
          videoUrl: 'https://example.com/videos/v2',
          duration: 1845,
          views: 32150,
          likes: 2870,
          favorites: 1560,
          comments: 286,
          createdAt: '2025-01-05T10:15:00Z',
          author: {
            id: '3',
            username: 'creator',
            nickname: '内容创作者',
            avatar: 'https://i.pravatar.cc/150?u=3',
            verified: true,
          },
          tags: ['人工智能', 'AI', '技术'],
          sources: [],
          subtitles: [],
        },
        {
          id: 'v3',
          title: '5分钟学会Vue 3核心概念',
          description: '这个简短的教程让你快速掌握Vue 3的核心概念，包括组合式API、响应式系统和生命周期钩子。',
          coverUrl: 'https://picsum.photos/id/3/640/360',
          videoUrl: 'https://example.com/videos/v3',
          duration: 312,
          views: 18720,
          likes: 1530,
          favorites: 875,
          comments: 124,
          createdAt: '2025-01-15T14:20:00Z',
          author: {
            id: '3',
            username: 'creator',
            nickname: '内容创作者',
            avatar: 'https://i.pravatar.cc/150?u=3',
            verified: true,
          },
          tags: ['Vue', '前端开发', 'JavaScript'],
          sources: [],
          subtitles: [],
        },
      ];

      // 创建视频ID到视频数据的映射
      const videoMap = new Map<string, Video>();
      mockVideos.forEach(video => {
        videoMap.set(video.id, video);
      });

      // 组合历史记录数据
      const historyItems = currentPageIds.map(videoId => {
        // 使用模拟视频数据，如果没有对应ID的视频则使用第一个视频的数据并修改ID
        let video = videoMap.get(videoId);
        if (!video) {
          // 创建一个基于第一个视频的新视频对象
          const randomIndex = Math.floor(Math.random() * mockVideos.length);
          const baseVideo = mockVideos[randomIndex];
          video = {
            ...baseVideo,
            id: videoId,
            title: `视频 ${videoId}`,
            coverUrl: `https://picsum.photos/seed/${videoId}/640/360`,
            duration: Math.floor(Math.random() * 1200) + 300, // 5-25分钟
            views: Math.floor(Math.random() * 50000),
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          };
        }

        // 使用真实进度数据，如果没有则创建一个模拟进度
        let progress = progressMap.get(videoId);
        if (!progress) {
          const duration = video.duration;
          const currentTime = Math.floor(Math.random() * duration * 0.9); // 观看到0-90%
          progress = {
            videoId,
            currentTime,
            duration,
            percentage: Math.floor((currentTime / duration) * 100),
            lastPlayedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          };
        }

        return { video, progress };
      });

      // 更新历史记录
      if (isRefresh) {
        history.value = historyItems;
      } else {
        history.value = [...history.value, ...historyItems];
      }

      // 检查是否还有更多数据
      hasMore.value = endIndex < videoIds.length;

      // 增加页码
      if (!isRefresh) {
        page.value++;
      }
    } catch (error) {
      console.error('获取观看历史失败:', error);
    } finally {
      loading.value = false;
      loadingMore.value = false;
    }
  };

  // 刷新历史
  const refreshHistory = () => {
    fetchHistory(true);
  };

  // 加载更多
  const loadMore = () => {
    if (!loadingMore.value && hasMore.value) {
      fetchHistory(false);
    }
  };

  // 显示清空确认对话框
  const showClearConfirm = () => {
    showConfirmModal.value = true;
  };

  // 清空历史
  const clearHistory = async () => {
    try {
      loading.value = true;
      await clearWatchHistory(currentUserId);
      history.value = [];
      hasMore.value = false;
    } catch (error) {
      console.error('清空历史失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 从观看历史中移除单个视频
  const removeFromHistory = async (item: HistoryItem) => {
    try {
      await deleteVideoProgress(currentUserId, item.video.id);
      history.value = history.value.filter(h => h.video.id !== item.video.id);
    } catch (error) {
      console.error('移除历史记录失败:', error);
    }
  };

  // 获取下拉菜单选项
  const getItemActions = (item: HistoryItem) => {
    return [
      {
        label: '从历史记录中移除',
        key: 'remove',
      },
      {
        label: '稍后观看',
        key: 'watchLater',
      },
      {
        label: '分享',
        key: 'share',
      },
    ];
  };

  // 处理下拉菜单操作
  const handleAction = (key: string, item: HistoryItem) => {
    switch (key) {
      case 'remove':
        removeFromHistory(item);
        break;
      case 'watchLater':
        console.log('添加到稍后观看:', item.video.id);
        break;
      case 'share':
        console.log('分享视频:', item.video.id);
        break;
    }
  };

  // 格式化时长
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 格式化数字
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  // 格式化相对时间
  const formatTimeAgo = (timeString?: string): string => {
    if (!timeString) return '未知时间';

    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return '刚刚';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}分钟前`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}小时前`;
    if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)}天前`;
    if (diffSec < 31536000) return `${Math.floor(diffSec / 2592000)}个月前`;
    return `${Math.floor(diffSec / 31536000)}年前`;
  };

  // 导航到探索页面
  const goToExplore = () => {
    router.push('/feed/explore');
  };

  // 导航到视频页面
  const goToVideo = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  // 组件挂载时获取数据
  onMounted(() => {
    fetchHistory(true);
  });
</script>

<style scoped>
  .history-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .history-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
  }

  .history-actions {
    display: flex;
    gap: 12px;
  }

  .loading-container,
  .empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    text-align: center;
  }

  .loading-container p {
    margin-top: 16px;
    color: var(--text-secondary);
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .history-item {
    display: flex;
    background-color: var(--card-bg);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .history-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .video-card {
    display: flex;
    flex: 1;
    cursor: pointer;
  }

  .thumbnail-container {
    position: relative;
    width: 240px;
    min-width: 240px;
    height: 135px;
  }

  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background-color: var(--primary-color);
  }

  .duration {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
  }

  .video-info {
    flex: 1;
    padding: 12px 16px;
    overflow: hidden;
  }

  .video-title {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 8px 0;
    color: var(--text-color);
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .video-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .channel-name {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
  }

  .video-stats {
    margin: 0;
    font-size: 12px;
    color: var(--text-tertiary);
  }

  .progress-text {
    margin-top: 8px;
    font-size: 12px;
    color: var(--text-secondary);
  }

  .item-actions {
    display: flex;
    align-items: flex-start;
    padding: 12px;
  }

  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 24px;
  }

  @media (max-width: 768px) {
    .history-container {
      padding: 16px;
    }

    .history-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .video-card {
      flex-direction: column;
    }

    .thumbnail-container {
      width: 100%;
      height: 0;
      padding-top: 56.25%;
      /* 16:9 aspect ratio */
      min-width: unset;
    }

    .thumbnail {
      position: absolute;
      top: 0;
      left: 0;
    }

    .video-info {
      padding: 12px;
    }
  }
</style>