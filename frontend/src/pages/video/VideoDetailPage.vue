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
    <div v-if="isOfflineMode" class="offline-alert">
      <n-icon>
        <CloudOfflineOutline />
      </n-icon>
      <span>网络连接不可用，当前处于离线模式。历史记录和互动功能将仅在本地保存，无法与服务器同步。</span>
      <n-button text type="warning" @click="checkNetworkAndRefresh">
        重新连接
      </n-button>
    </div>

    <div v-else-if="video" class="video-content">
      <div class="primary-column">
        <VideoPlayerComponent :video="video" :current-time="savedProgress" @time-update="handleTimeUpdate"
          @play="handlePlay" @pause="handlePause" @ended="handleEnded" class="video-player" />

        <VideoDetailComponent :video="video" :is-liked="isLiked" :is-favorited="isFavorited"
          :is-subscribed="isSubscribed" :offline-mode="isOfflineMode" @like="handleLike" @favorite="handleFavorite"
          @subscribe="handleSubscribe" @comment="handleComment" @load-more-comments="loadMoreComments"
          class="video-detail" />
      </div>
      <div class="secondary-column">
        <div class="related-videos">
          <h3 class="related-title">推荐视频</h3>

          <!-- 推荐视频加载状态 -->
          <template v-if="!relatedVideos.length">
            <!-- 骨架屏加载效果 -->
            <n-skeleton v-if="loading" text :repeat="5" />

            <!-- 无推荐视频时的空状态 -->
            <div v-else class="empty-state">
              <n-icon size="48">
                <VideocamOutline />
              </n-icon>
              <p>暂无推荐视频</p>
            </div>
          </template>

          <!-- 推荐视频列表 -->
          <div v-else class="video-suggestions">
            <video-card-small v-for="video in relatedVideos" :key="video.id" :video="video"
              @click="$router.push(`/video/${video.id}`)" />
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
  import { WarningOutline, CloudOfflineOutline, VideocamOutline } from '@vicons/ionicons5';
  import { videoService } from '@/services/video';
  import { useHistoryStore } from '@/stores/history';
  import { useUserStore } from '@/stores/user';
  import { isMockMode } from '@/services/api';
  import { checkAndEnableOfflineMode, isOfflineMode as checkOfflineMode, checkNetworkAndReconnect } from '@/services/api/errorHandler';
  import VideoPlayerComponent from '@/components/business/video/VideoPlayerComponent.vue';
  import VideoDetailComponent from '@/components/business/video/VideoDetailComponent.vue';
  import VideoCardSmall from '@/components/common/video/VideoCardSmall.vue';
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
      // 检查网络连接状态和mock模式
      if (!navigator.onLine && !isMockMode) {
        localStorage.setItem('offline_mode', 'true');
        error.value = '网络连接已断开，显示离线模式';
        loading.value = false;
        return;
      }

      // 获取视频详情
      const response = await videoService.getVideoById(videoId as string);

      if (response.success && response.data) {
        video.value = response.data;

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

        // 加载相关视频
        try {
          const recResponse = await videoService.getRecommendedVideos(videoId as string, 5);
          if (recResponse.success && recResponse.data) {
            relatedVideos.value = recResponse.data;
          }
        } catch (err) {
          console.warn('获取推荐视频失败:', err);
        }

        // 非模拟模式下更新播放量
        if (!isMockMode) {
          updateVideoViews();
        }
      } else {
        // API请求失败，如果在mock模式下使用模拟数据
        if (isMockMode) {
          console.warn('Mock模式：API请求失败，使用模拟数据');
          // 从videoService中直接获取模拟数据
          const { getMockVideo } = await import('@/services/mockData');
          video.value = getMockVideo(videoId as string);

          // 获取模拟的互动状态
          const { getMockVideoInteraction } = await import('@/services/mockData');
          const interaction = getMockVideoInteraction(videoId as string);
          isLiked.value = interaction.isLiked;
          isFavorited.value = interaction.isFavorited;
          isSubscribed.value = interaction.isSubscribed;

          // 获取模拟的推荐视频
          const { getMockRecommendedVideos } = await import('@/services/mockData');
          relatedVideos.value = getMockRecommendedVideos(videoId as string, 5);

          // 加载模拟评论
          const { getMockComments } = await import('@/services/mockData');
          comments.value = getMockComments(videoId as string);

          // 记录到历史
          if (video.value) {
            try {
              historyStore.addToHistory(video.value);
              savedProgress.value = historyStore.getVideoProgress(videoId as string);
            } catch (err) {
              console.error('添加到历史记录失败:', err);
            }
          }
        } else {
          // 非mock模式下显示错误
          console.warn('API请求失败:', response.message);
          error.value = response.message || '加载视频失败，请稍后重试';

          // 检查是否为网络错误
          if (error.value && (error.value.includes('Network Error') || error.value.includes('Failed to fetch'))) {
            checkAndEnableOfflineMode(new Error(error.value));
          }
        }
      }
    } catch (err) {
      console.error('加载视频失败:', err);

      // 在mock模式下使用模拟数据即使出现错误
      if (isMockMode) {
        console.warn('Mock模式：错误处理中，使用模拟数据');
        const { getMockVideo, getMockVideoInteraction, getMockRecommendedVideos, getMockComments } = await import('@/services/mockData');

        video.value = getMockVideo(videoId as string);

        const interaction = getMockVideoInteraction(videoId as string);
        isLiked.value = interaction.isLiked;
        isFavorited.value = interaction.isFavorited;
        isSubscribed.value = interaction.isSubscribed;

        relatedVideos.value = getMockRecommendedVideos(videoId as string, 5);
        comments.value = getMockComments(videoId as string);

        if (video.value) {
          try {
            historyStore.addToHistory(video.value);
            savedProgress.value = historyStore.getVideoProgress(videoId as string);
          } catch (histErr) {
            console.error('添加到历史记录失败:', histErr);
          }
        }
      } else {
        error.value = err instanceof Error ? err.message : '加载视频失败，请稍后重试';
        // 设置离线模式标记
        checkAndEnableOfflineMode(err);
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
        // 本地保存播放进度
        historyStore.saveVideoProgress(video.value.id, time);

        // 如果不是离线模式，同时保存到服务器
        if (!isOfflineMode.value && time % 5 < 1) { // 每5秒左右同步一次进度
          // 使用刚才添加的服务器端历史记录保存方法
          videoService.saveWatchHistory(video.value.id, time).catch(err => {
            console.warn('[VideoDetailPage] 同步播放进度到服务器失败:', err);
            // 失败时不需要显示给用户，因为本地已保存
          });
        }
      } catch (err) {
        console.error('[VideoDetailPage] 保存播放进度失败:', err);
      }
    }
  };

  // 处理播放开始事件
  const handlePlay = () => {
    console.log('视频开始播放');
    // 如果需要可以在这里添加更多逻辑
  };

  // 处理暂停事件
  const handlePause = () => {
    console.log('视频已暂停');
    // 如果需要可以在这里添加更多逻辑
  };

  // 处理播放结束事件
  const handleEnded = () => {
    console.log('视频播放结束');
    // 如果需要可以在这里添加逻辑，例如自动播放下一个视频等
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

  // 在组件挂载时获取视频数据
  onMounted(async () => {
    console.log('[VideoDetailPage] 组件开始挂载');

    // 先检查是否有videoId
    const videoId = route.params.id;
    if (!videoId) {
      router.push('/');
      return;
    }

    // 检查是否处于mock模式
    const isMock = isMockMode;
    console.log(`[VideoDetailPage] 当前模式: ${isMock ? 'Mock模式' : '正常模式'}`);

    // 检查网络状态
    if (!navigator.onLine && !isMock) {
      console.warn('[VideoDetailPage] 网络离线，将使用离线模式');
      localStorage.setItem('offline_mode', 'true');
    }

    // 获取视频数据
    await fetchVideoData();

    // 路由参数变化时重新加载数据
    watch(() => route.params.id, () => {
      // 只有当路由ID实际变化时才重新获取
      if (route.params.id !== videoId) {
        console.log('[VideoDetailPage] 视频ID变化，重新加载数据');
        fetchVideoData();
      }
    });

    // 如果处于模拟数据模式，加载推荐视频
    if (isMock) {
      const currentVideoId = route.params.id as string;
      if (currentVideoId) {
        console.log('[VideoDetailPage] 加载模拟推荐视频');
        videoService.getRecommendedVideos(currentVideoId)
          .then(res => {
            if (res.success && res.data) {
              relatedVideos.value = res.data;
            }
          })
          .catch(err => console.error('[VideoDetailPage] 加载推荐视频失败:', err));
      }
    }

    console.log('[VideoDetailPage] 组件已挂载完成');

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
    color: var(--text-primary);
    background-color: var(--primary-bg);
    transition: background-color var(--transition-normal), color var(--transition-normal);
  }

  .offline-alert {
    margin-bottom: 16px;
    border-radius: var(--radius-lg);
    background-color: #fff7e6;
    /* 保持警告色不变 */
    border: 1px solid #ffe58f;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .offline-alert .n-icon {
    color: #faad14;
    font-size: 20px;
  }

  .offline-alert span {
    flex: 1;
    color: #d48806;
  }

  .offline-alert .n-button {
    margin-left: auto;
  }

  .loading-card,
  .error-card {
    border-radius: var(--radius-lg);
    margin-bottom: 16px;
    background-color: var(--card-bg);
    border: 1px solid var(--border-medium);
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
    transition: background-color var(--transition-normal), border-color var(--transition-normal);
  }

  .video-player {
    margin-bottom: 16px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background-color: var(--video-player-bg);
  }

  .video-detail {
    border-radius: var(--radius-lg);
    background-color: var(--card-bg);
    border: 1px solid var(--border-medium);
  }

  .related-videos {
    background-color: var(--related-videos-bg);
    border: 1px solid var(--related-videos-border);
    border-radius: var(--radius-lg);
    padding: 16px;
    transition: background-color var(--transition-normal), border-color var(--transition-normal);
    height: 100%;
  }

  .related-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 16px;
    color: var(--text-primary);
  }

  /* 添加空状态样式 */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    background-color: var(--empty-state-bg);
    border-radius: var(--radius-lg);
    text-align: center;
    height: 200px;
  }

  .empty-state .n-icon {
    color: var(--empty-state-icon);
    margin-bottom: 16px;
  }

  .empty-state p {
    color: var(--empty-state-text);
    font-size: 14px;
  }

  /* 推荐视频列表样式 */
  .video-suggestions {
    display: flex;
    flex-direction: column;
    gap: 16px;
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