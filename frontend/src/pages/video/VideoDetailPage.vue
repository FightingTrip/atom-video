/**
* @file VideoDetailPage.vue
* @description 视频详情页面，使用VideoPlayerComponent和评论组件
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="video-detail-page">
    <n-card v-if="loading" class="loading-card">
      <n-space justify="center" align="center" style="height: 400px">
        <n-spin size="large" />
        <p>加载视频信息...</p>
      </n-space>
    </n-card>

    <n-card v-else-if="error" class="error-card">
      <n-space vertical justify="center" align="center" style="height: 300px">
        <n-icon size="48" color="#d03050">
          <WarningOutline />
        </n-icon>
        <p>{{ error }}</p>
        <n-button @click="fetchVideoData" type="primary">重试</n-button>
      </n-space>
    </n-card>

    <!-- 离线模式提示 -->
    <n-alert v-if="isOfflineMode" type="warning" closable style="margin-bottom: 16px" class="offline-alert">
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px">
          <n-icon>
            <CloudOfflineOutline />
          </n-icon>
          <span>网络连接不可用，当前处于离线模式</span>
        </div>
      </template>
      历史记录和互动功能将仅在本地保存，无法与服务器同步。视频可以正常播放，但互动功能将受限。
      <template #action>
        <n-button text type="warning" @click="checkNetworkAndRefresh">
          重新连接
        </n-button>
      </template>
    </n-alert>

    <div v-else-if="video" class="video-content">
      <div class="primary-column">
        <VideoPlayerComponent :video="video" v-if="video" class="video-player" />
        <VideoDetailComponent :video="video" :current-time="savedProgress" :is-liked="isLiked"
          :is-favorited="isFavorited" :is-subscribed="isSubscribed" :offline-mode="isOfflineMode"
          @time-update="handleTimeUpdate" @like="handleLike" @favorite="handleFavorite" @subscribe="handleSubscribe"
          @comment="handleComment" @load-more-comments="loadMoreComments" class="video-detail" />
      </div>
      <div class="secondary-column">
        <div class="related-videos">
          <h3 class="related-title">推荐视频</h3>
          <!-- 这里可以加入推荐视频组件 -->
          <n-skeleton v-if="!relatedVideos.length" text :repeat="5" />
          <div v-else class="video-suggestions">
            <!-- 推荐视频内容 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { NCard, NSpace, NSpin, NButton, NIcon, NAlert, useMessage } from 'naive-ui';
  import { WarningOutline, CloudOfflineOutline } from '@vicons/ionicons5';
  import { videoService } from '@/services/video';
  import { useHistoryStore } from '@/stores/history';
  import { useUserStore } from '@/stores/user';
  import VideoPlayerComponent from '@/components/business/video/VideoPlayerComponent.vue';
  import VideoDetailComponent from '@/components/business/video/VideoDetailComponent.vue';
  import CommentListComponent from '@/components/business/comment/CommentListComponent.vue';
  import type { Video } from '@/types';

  const route = useRoute();
  const router = useRouter();
  const message = useMessage();
  const historyStore = useHistoryStore();
  const userStore = useUserStore();

  // 状态
  const loading = ref(true);
  const error = ref<string | null>(null);
  const video = ref<Video | null>(null);
  const savedProgress = ref(0);
  const isLiked = ref(false);
  const isFavorited = ref(false);
  const isSubscribed = ref(false);
  const comments = ref([]);
  const commentPage = ref(1);
  const hasMoreComments = ref(true);
  const loadingMoreComments = ref(false);
  const networkRetryTimer = ref<number | null>(null);
  const relatedVideos = ref<Video[]>([]);

  // 离线模式状态 
  const isOfflineMode = computed(() => {
    return localStorage.getItem('offline_mode') === 'true';
  });

  // 检查网络并刷新页面
  const checkNetworkAndRefresh = async () => {
    try {
      // 设置一个短超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch('/api/ping', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        localStorage.removeItem('offline_mode');
        message.success('网络已恢复，正在刷新页面');

        // 短暂延迟后刷新
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error('服务器响应异常');
      }
    } catch (err) {
      message.error('网络连接仍然不可用，请检查您的网络设置');
      console.error('网络检查失败:', err);

      // 定时自动重试
      if (networkRetryTimer.value === null) {
        networkRetryTimer.value = window.setInterval(() => {
          fetch('/api/ping')
            .then(response => {
              if (response.ok) {
                clearInterval(networkRetryTimer.value!);
                networkRetryTimer.value = null;
                localStorage.removeItem('offline_mode');
                message.success('网络已自动恢复，刷新页面获取最新数据');
              }
            })
            .catch(() => {
              // 静默失败，继续等待下次重试
            });
        }, 30000) as unknown as number; // 每30秒自动检测一次
      }
    }
  };

  // 获取视频信息
  const fetchVideoData = async () => {
    const videoId = route.params.id;
    if (!videoId) {
      router.push('/');
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      // 获取视频数据
      const res = await videoService.getVideoById(videoId as string);
      if (res.success) {
        video.value = res.data;

        // 获取视频互动状态
        if (userStore.isLoggedIn) {
          const interactionRes = await videoService.getVideoInteraction(videoId as string);
          if (interactionRes.success) {
            isLiked.value = interactionRes.data.isLiked;
            isFavorited.value = interactionRes.data.isFavorited;
            isSubscribed.value = interactionRes.data.isSubscribed;
          }
        }

        // 获取保存的播放进度
        savedProgress.value = historyStore.getVideoProgress(videoId as string);

        // 记录观看历史
        try {
          historyStore.addToHistory(res.data);
        } catch (err) {
          console.error('添加到历史记录失败:', err);
        }

        // 初始加载评论
        await loadComments();

        // 记录到历史
        try {
          historyStore.addToHistory(video.value);
        } catch (err) {
          console.error('添加到历史记录失败:', err);
        }
      } else {
        // 如果API请求失败，使用备用模拟数据
        console.warn('API请求失败，使用模拟数据', res.message);

        // 检查是否为网络错误，如果是，切换到离线模式
        if (error.value &&
          (error.value.includes('Network Error') || error.value.includes('Failed to fetch'))) {
          localStorage.setItem('offline_mode', 'true');
        }

        if (!video.value) {
          // 创建一个模拟视频对象
          video.value = {
            id: videoId as string,
            title: '测试视频 - ' + videoId,
            description: '这是一个模拟视频，用于测试播放功能。实际项目中，这里将显示从后端获取的真实视频数据。',
            thumbnail: `https://picsum.photos/seed/${videoId}/480/270`,
            duration: 60,
            views: 1000,
            likes: 100,
            favorites: 50,
            comments: 10,
            createdAt: new Date().toISOString(),
            tags: ['测试', '开发'],
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            coverUrl: `https://picsum.photos/seed/${videoId}/480/270`,
            author: {
              id: 'author-1',
              nickname: '测试用户',
              avatar: 'https://i.pravatar.cc/150',
              verified: true,
            },
            sources: [
              {
                url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                type: 'video/mp4',
                label: '720p',
                size: 720
              }
            ]
          };

          // 记录到历史
          try {
            // 只有在非离线模式时尝试添加到历史记录API
            if (!isOfflineMode.value) {
              historyStore.addToHistory(video.value);
            } else {
              // 如果是离线模式，仅在本地记录
              historyStore.watchHistory.unshift(video.value);
              localStorage.setItem('watch_history', JSON.stringify(historyStore.watchHistory.slice(0, 30)));
            }
          } catch (err) {
            console.error('添加到历史记录失败:', err);
          }
          message.warning('使用备用数据进行显示，请联系管理员处理API问题');
        }
      }
    } catch (err) {
      console.error('加载视频失败:', err);
      error.value = '加载视频失败，请稍后重试';

      // 使用备用模拟数据
      if (!video.value) {
        video.value = {
          id: videoId as string,
          title: '测试视频 (错误恢复) - ' + videoId,
          description: '这是一个模拟视频，用于错误恢复测试。在API请求失败时显示此内容。',
          thumbnail: `https://picsum.photos/seed/${videoId}/480/270`,
          duration: 60,
          views: 1000,
          likes: 100,
          favorites: 50,
          comments: 10,
          createdAt: new Date().toISOString(),
          tags: ['测试', '错误恢复'],
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          coverUrl: `https://picsum.photos/seed/${videoId}/480/270`,
          author: {
            id: 'author-1',
            nickname: '测试用户',
            avatar: 'https://i.pravatar.cc/150',
            verified: true,
          },
          sources: [
            {
              url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              type: 'video/mp4',
              label: '720p',
              size: 720
            }
          ]
        };

        try {
          historyStore.addToHistory(video.value);
        } catch (err) {
          console.error('添加到历史记录失败:', err);
        }
        message.warning('使用备用数据进行显示，请联系管理员处理API问题');
        error.value = null; // 清除错误，显示视频
      }
    } finally {
      loading.value = false;
    }
  };

  // 加载评论
  const loadComments = async () => {
    if (!video.value) return;

    try {
      const res = await videoService.getVideoComments(video.value.id, { page: 1, pageSize: 10 });
      if (res.success) {
        comments.value = res.data.comments;
        hasMoreComments.value = res.data.totalPages > 1;
      }
    } catch (err) {
      console.error('加载评论失败:', err);
      message.error('加载评论失败');
    }
  };

  // 加载更多评论
  const loadMoreComments = async () => {
    if (!video.value || loadingMoreComments.value) return;

    loadingMoreComments.value = true;
    try {
      commentPage.value += 1;
      const res = await videoService.getVideoComments(video.value.id, {
        page: commentPage.value,
        pageSize: 10
      });

      if (res.success) {
        comments.value = [...comments.value, ...res.data.comments];
        hasMoreComments.value = commentPage.value < res.data.totalPages;
      }
    } catch (err) {
      console.error('加载更多评论失败:', err);
      message.error('加载更多评论失败');
    } finally {
      loadingMoreComments.value = false;
    }
  };

  // 记录播放进度
  const handleTimeUpdate = (time: number) => {
    if (video.value) {
      try {
        // 无论是否在线都保存进度
        historyStore.saveVideoProgress(video.value.id, time);
      } catch (err) {
        console.error('保存播放进度失败:', err);
      }
    }
  };

  // 处理视频互动
  const handleLike = async () => {
    if (isOfflineMode.value) {
      message.info('离线模式下，点赞操作仅在本地显示，不会同步到服务器');
      isLiked.value = !isLiked.value;
      return;
    }

    if (!userStore.isLoggedIn) {
      message.info('请先登录');
      router.push('/login?redirect=' + route.fullPath);
      return;
    }

    if (!video.value) return;

    try {
      const action = isLiked.value ? 'unlike' : 'like';
      const res = await videoService.likeVideo(video.value.id, action);

      if (res.success) {
        isLiked.value = !isLiked.value;
        video.value.likes += isLiked.value ? 1 : -1;
        message.success(isLiked.value ? '点赞成功' : '已取消点赞');
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (err) {
      console.error('点赞操作失败:', err);
      message.error('操作失败，请重试');
    }
  };

  const handleFavorite = async () => {
    if (isOfflineMode.value) {
      message.info('离线模式下，收藏操作仅在本地显示，不会同步到服务器');
      isFavorited.value = !isFavorited.value;
      return;
    }

    if (!userStore.isLoggedIn) {
      message.info('请先登录');
      router.push('/login?redirect=' + route.fullPath);
      return;
    }

    if (!video.value) return;

    try {
      const action = isFavorited.value ? 'unfavorite' : 'favorite';
      const res = await videoService.favoriteVideo(video.value.id, action);

      if (res.success) {
        isFavorited.value = !isFavorited.value;
        video.value.favorites += isFavorited.value ? 1 : -1;
        message.success(isFavorited.value ? '收藏成功' : '已取消收藏');
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (err) {
      console.error('收藏操作失败:', err);
      message.error('操作失败，请重试');
    }
  };

  const handleSubscribe = async () => {
    if (isOfflineMode.value) {
      message.info('离线模式下，订阅操作仅在本地显示，不会同步到服务器');
      isSubscribed.value = !isSubscribed.value;
      return;
    }

    if (!userStore.isLoggedIn) {
      message.info('请先登录');
      router.push('/login?redirect=' + route.fullPath);
      return;
    }

    if (!video.value) return;

    try {
      const action = isSubscribed.value ? 'unsubscribe' : 'subscribe';
      const res = await videoService.subscribeAuthor(video.value.author.id, action);

      if (res.success) {
        isSubscribed.value = !isSubscribed.value;
        video.value.author.followersCount += isSubscribed.value ? 1 : -1;
        message.success(isSubscribed.value ? '关注成功' : '已取消关注');
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (err) {
      console.error('关注操作失败:', err);
      message.error('操作失败，请重试');
    }
  };

  const handleComment = async (content: string) => {
    if (isOfflineMode.value) {
      message.info('离线模式下无法发表评论');
      return;
    }

    if (!userStore.isLoggedIn) {
      message.info('请先登录');
      router.push('/login?redirect=' + route.fullPath);
      return;
    }

    if (!video.value) return;

    try {
      const res = await videoService.addComment(video.value.id, content);

      if (res.success) {
        message.success('评论成功');
        // 重新加载评论列表
        commentPage.value = 1;
        await loadComments();
      } else {
        message.error(res.message || '评论失败');
      }
    } catch (err) {
      console.error('发表评论失败:', err);
      message.error('评论失败，请重试');
    }
  };

  // 路由参数变化时重新获取数据
  watch(() => route.params.id, (newId, oldId) => {
    if (newId !== oldId) {
      fetchVideoData();
    }
  });

  onMounted(() => {
    fetchVideoData();
    console.log('[VideoDetailPage] 组件已挂载');

    // 如果处于离线模式，尝试定时检测网络
    if (isOfflineMode.value && networkRetryTimer.value === null) {
      checkNetworkAndRefresh();
    }
  });

  // 组件卸载时清除定时器
  onBeforeUnmount(() => {
    if (networkRetryTimer.value !== null) {
      clearInterval(networkRetryTimer.value);
      networkRetryTimer.value = null;
    }
  });
</script>

<style scoped>
  .video-detail-page {
    max-width: 1280px;
    margin: 0 auto;
    padding: 16px;
    color: var(--text-color-base);
  }

  .offline-alert {
    margin-bottom: 16px;
    border-radius: 8px;
  }

  .loading-card,
  .error-card {
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .video-content {
    display: flex;
    gap: 24px;
  }

  .primary-column {
    flex: 1;
    min-width: 0;
  }

  .secondary-column {
    width: 320px;
    flex-shrink: 0;
  }

  .video-player {
    margin-bottom: 16px;
    border-radius: 8px;
    overflow: hidden;
  }

  .video-detail {
    border-radius: 8px;
  }

  .related-videos {
    background-color: var(--color-bg-surface, #ffffff);
    border-radius: 8px;
    padding: 16px;
  }

  .related-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 16px;
    color: var(--color-text-primary);
  }

  @media (max-width: 1100px) {
    .video-content {
      flex-direction: column;
    }

    .secondary-column {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .video-detail-page {
      padding: 8px;
    }
  }
</style>