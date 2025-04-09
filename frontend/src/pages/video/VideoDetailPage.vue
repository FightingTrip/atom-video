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
      <template #icon>
        <n-icon>
          <CloudOfflineOutline />
        </n-icon>
      </template>
      <span>网络连接不可用，当前处于离线模式。历史记录和互动功能将仅在本地保存，无法与服务器同步。</span>
      <template #footer>
        <div style="text-align: right;">
          <n-button text type="warning" @click="checkNetworkAndRefresh">
            重新连接
          </n-button>
        </div>
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
  import { NCard, NSpace, NSpin, NButton, NIcon, NAlert, NSkeleton, useMessage } from 'naive-ui';
  import { WarningOutline, CloudOfflineOutline } from '@vicons/ionicons5';
  import { videoService } from '@/services/video';
  import { useHistoryStore } from '@/stores/history';
  import { useUserStore } from '@/stores/user';
  import { isMockMode } from '@/services/api';
  import { checkAndEnableOfflineMode, isOfflineMode as checkOfflineMode, checkNetworkAndReconnect } from '@/services/api/errorHandler';
  import VideoPlayerComponent from '@/components/business/video/VideoPlayerComponent.vue';
  import VideoDetailComponent from '@/components/business/video/VideoDetailComponent.vue';
  import CommentListComponent from '@/components/business/comment/CommentListComponent.vue';
  import type { Video, VideoInteraction, Comment } from '@/types';

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
  const comments = ref<Comment[]>([]);
  const commentPage = ref(1);
  const hasMoreComments = ref(true);
  const loadingMoreComments = ref(false);
  const networkRetryTimer = ref<number | null>(null);
  const relatedVideos = ref<Video[]>([]);

  // 离线模式状态 
  const isOfflineMode = computed(() => checkOfflineMode());

  // 检查网络并刷新页面
  const checkNetworkAndRefresh = async () => {
    const isConnected = await checkNetworkAndReconnect();

    if (isConnected) {
      message.success('网络已恢复，正在刷新页面');

      // 短暂延迟后刷新
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      message.error('网络连接仍然不可用，请检查您的网络设置');

      // 定时自动重试
      if (networkRetryTimer.value === null) {
        networkRetryTimer.value = window.setInterval(async () => {
          const reconnected = await checkNetworkAndReconnect();
          if (reconnected) {
            clearInterval(networkRetryTimer.value!);
            networkRetryTimer.value = null;
            message.success('网络已自动恢复，刷新页面获取最新数据');
          }
        }, 30000) as unknown as number; // 每30秒自动检测一次
      }
    }
  };

  // 更新播放量
  const updateVideoViews = async () => {
    if (!video.value || isOfflineMode.value) return;

    try {
      await videoService.updateVideoViews(video.value.id);
    } catch (err) {
      console.warn('更新视频播放量失败:', err);
      // 非关键操作，失败可以忽略
    }
  };

  // 获取视频互动状态
  const fetchVideoInteraction = async () => {
    if (!video.value || !userStore.isLoggedIn) return;

    try {
      const response = await videoService.getVideoInteraction(video.value.id);
      if (response.success && response.data) {
        isLiked.value = response.data.isLiked ?? false;
        isFavorited.value = response.data.isFavorited ?? false;
        isSubscribed.value = response.data.isSubscribed ?? false;
      }
    } catch (err) {
      console.warn('获取视频互动状态失败:', err);
      // 非关键错误，可以继续显示视频
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
      // 检查网络连接状态
      if (!navigator.onLine) {
        localStorage.setItem('offline_mode', 'true');
        error.value = '网络连接已断开，显示离线模式';
        loading.value = false;
        return;
      }

      // 获取视频详情
      const response = await videoService.getVideoById(videoId as string);

      if (response.success) {
        video.value = response.data || null;

        // 获取视频互动状态
        if (userStore.isLoggedIn && video.value) {
          await fetchVideoInteraction();
        }

        // 获取保存的播放进度
        savedProgress.value = historyStore.getVideoProgress(videoId as string);

        // 记录观看历史
        try {
          if (video.value) {
            historyStore.addToHistory(video.value);
          }
        } catch (err) {
          console.error('添加到历史记录失败:', err);
        }

        // 初始加载评论
        await loadComments();

        // 非模拟模式下更新播放量
        if (!isMockMode) {
          updateVideoViews();
        }
      } else {
        // API请求失败，显示错误信息
        console.warn('API请求失败:', response.message);
        error.value = response.message || '加载视频失败，请稍后重试';

        // 检查是否为网络错误
        if (error.value && (error.value.includes('Network Error') || error.value.includes('Failed to fetch'))) {
          checkAndEnableOfflineMode(new Error(error.value));
        }
      }
    } catch (err) {
      console.error('加载视频失败:', err);
      error.value = err instanceof Error ? err.message : '加载视频失败，请稍后重试';

      // 设置离线模式标记
      checkAndEnableOfflineMode(err);
    } finally {
      loading.value = false;
    }
  };

  // 加载评论
  const loadComments = async () => {
    if (!video.value) return;

    try {
      const res = await videoService.getVideoComments(video.value.id, { page: 1, pageSize: 10 });
      if (res.success && res.data) {
        comments.value = res.data.comments || [];
        hasMoreComments.value = (res.data.totalPages || 0) > 1;
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

      if (res.success && res.data) {
        comments.value = [...comments.value, ...(res.data.comments || [])];
        hasMoreComments.value = commentPage.value < (res.data.totalPages || 0);
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

  // 执行需要登录权限的操作
  const requireLogin = (callback: () => void) => {
    if (isOfflineMode.value) {
      message.info('离线模式下，该操作仅在本地显示，不会同步到服务器');
      return callback();
    }

    if (!userStore.isLoggedIn) {
      message.info('请先登录');
      router.push('/login?redirect=' + route.fullPath);
      return;
    }

    return callback();
  };

  // 处理视频互动
  const handleLike = () => {
    requireLogin(() => {
      if (isOfflineMode.value) {
        isLiked.value = !isLiked.value;
        return;
      }

      if (!video.value) return;

      videoService.likeVideo(video.value.id, isLiked.value ? 'unlike' : 'like')
        .then(res => {
          if (res.success) {
            isLiked.value = !isLiked.value;
            message.success(isLiked.value ? '点赞成功' : '已取消点赞');

            // 更新点赞数
            if (video.value) {
              video.value.likes = isLiked.value
                ? (video.value.likes || 0) + 1
                : Math.max(0, (video.value.likes || 0) - 1);
            }
          } else {
            message.error(res.message || '操作失败，请稍后重试');
          }
        })
        .catch(err => {
          console.error('点赞失败:', err);
          message.error('点赞失败，请稍后重试');
        });
    });
  };

  // 处理收藏
  const handleFavorite = () => {
    requireLogin(() => {
      if (isOfflineMode.value) {
        isFavorited.value = !isFavorited.value;
        return;
      }

      if (!video.value) return;

      const action = isFavorited.value ? 'unfavorite' : 'favorite';
      videoService.favoriteVideo(video.value.id, action)
        .then(res => {
          if (res.success) {
            isFavorited.value = !isFavorited.value;
            if (video.value) {
              video.value.favorites += isFavorited.value ? 1 : -1;
            }
            message.success(isFavorited.value ? '收藏成功' : '已取消收藏');
          } else {
            message.error(res.message || '操作失败');
          }
        })
        .catch(err => {
          console.error('收藏操作失败:', err);
          message.error('操作失败，请重试');
        });
    });
  };

  // 处理订阅
  const handleSubscribe = () => {
    requireLogin(() => {
      if (isOfflineMode.value) {
        isSubscribed.value = !isSubscribed.value;
        return;
      }

      if (!video.value) return;

      const action = isSubscribed.value ? 'unsubscribe' : 'subscribe';
      videoService.subscribeAuthor(video.value.author.id, action)
        .then(res => {
          if (res.success) {
            isSubscribed.value = !isSubscribed.value;

            // 确保作者属性存在并安全地更新粉丝数
            if (video.value && 'author' in video.value) {
              const author = video.value.author as any;
              if (author && 'followersCount' in author) {
                author.followersCount = (author.followersCount || 0) + (isSubscribed.value ? 1 : -1);
              }
            }

            message.success(isSubscribed.value ? '关注成功' : '已取消关注');
          } else {
            message.error(res.message || '操作失败');
          }
        })
        .catch(err => {
          console.error('关注操作失败:', err);
          message.error('操作失败，请重试');
        });
    });
  };

  // 处理评论
  const handleComment = (content: string) => {
    requireLogin(() => {
      if (isOfflineMode.value) {
        message.info('离线模式下无法发表评论');
        return;
      }

      if (!video.value) return;

      videoService.addComment(video.value.id, content)
        .then(res => {
          if (res.success) {
            message.success('评论成功');
            // 重新加载评论列表
            commentPage.value = 1;
            loadComments();
          } else {
            message.error(res.message || '评论失败');
          }
        })
        .catch(err => {
          console.error('发表评论失败:', err);
          message.error('评论失败，请重试');
        });
    });
  };

  // 路由参数变化时重新获取数据
  watch(() => route.params.id, (newId, oldId) => {
    if (newId !== oldId) {
      fetchVideoData();
    }
  });

  onMounted(() => {
    fetchVideoData();

    // 如果处于模拟数据模式，加载推荐视频
    if (isMockMode) {
      const videoId = route.params.id as string;
      if (videoId) {
        videoService.getRecommendedVideos(videoId)
          .then(res => {
            if (res.success && res.data) {
              relatedVideos.value = res.data;
            }
          })
          .catch(err => console.error('加载推荐视频失败:', err));
      }
    }

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