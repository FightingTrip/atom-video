/**
* @file VideoDetailPage.vue
* @description 视频详情页面，使用VideoPlayerComponent和评论组件
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="video-detail-page">
    <n-card v-if="loading">
      <n-space justify="center" align="center" style="height: 400px">
        <n-spin size="large" />
        <p>加载视频信息...</p>
      </n-space>
    </n-card>

    <n-card v-else-if="error">
      <n-space vertical justify="center" align="center" style="height: 300px">
        <n-icon size="48" color="#d03050">
          <WarningOutline />
        </n-icon>
        <p>{{ error }}</p>
        <n-button @click="fetchVideoData">重试</n-button>
      </n-space>
    </n-card>

    <template v-else-if="video">
      <VideoPlayerComponent :video="video" v-if="video" />
      <VideoDetailComponent :video="video" :current-time="savedProgress" :is-liked="isLiked" :is-favorited="isFavorited"
        :is-subscribed="isSubscribed" @time-update="handleTimeUpdate" @like="handleLike" @favorite="handleFavorite"
        @subscribe="handleSubscribe" @comment="handleComment" @load-more-comments="loadMoreComments" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { NCard, NSpace, NSpin, NButton, NIcon, useMessage } from 'naive-ui';
  import { WarningOutline } from '@vicons/ionicons5';
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
        historyStore.addToHistory(res.data);

        // 初始加载评论
        await loadComments();
      } else {
        error.value = res.message || '无法加载视频';
      }
    } catch (err) {
      console.error('加载视频失败:', err);
      error.value = '加载视频失败，请稍后重试';
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

  // 处理视频互动
  const handleLike = async () => {
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

  // 记录播放进度
  const handleTimeUpdate = (time: number) => {
    if (video.value) {
      historyStore.saveVideoProgress(video.value.id, time);
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
  });
</script>

<style scoped>
  .video-detail-page {
    max-width: 1280px;
    margin: 0 auto;
    padding: 20px;
    color: var(--text-color-base);
  }

  @media (max-width: 768px) {
    .video-detail-page {
      padding: 10px;
    }
  }
</style>