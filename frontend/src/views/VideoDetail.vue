<template>
  <div class="py-4">
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- 视频播放区域 -->
      <div class="flex-grow lg:w-2/3">
        <div class="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video ref="videoRef" class="w-full h-full" :src="video?.videoUrl" controls
            @timeupdate="handleTimeUpdate"></video>
        </div>

        <!-- 视频信息 -->
        <div class="mt-4">
          <h1 class="text-2xl font-bold">{{ video?.title }}</h1>
          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center gap-4">
              <router-link :to="`/user/${video?.user.id}`" class="flex items-center gap-3">
                <n-avatar :src="video?.user.avatar" :round="true" />
                <div>
                  <h3 class="font-medium">{{ video?.user.nickname }}</h3>
                  <p class="text-sm text-gray-500">{{ formatNumber(video?.user.subscribers) }} 位订阅者</p>
                </div>
              </router-link>
              <n-button type="primary" :loading="subscribing">
                {{ isSubscribed ? '已订阅' : '订阅' }}
              </n-button>
            </div>
            <div class="flex items-center gap-2">
              <n-button-group>
                <n-button>
                  <template #icon><i class="fas fa-thumbs-up"></i></template>
                  {{ formatNumber(video?.likes) }}
                </n-button>
                <n-button>
                  <template #icon><i class="fas fa-thumbs-down"></i></template>
                  {{ formatNumber(video?.dislikes) }}
                </n-button>
              </n-button-group>
              <n-button>
                <template #icon><i class="fas fa-share"></i></template>
                分享
              </n-button>
              <n-button>
                <template #icon><i class="fas fa-ellipsis-h"></i></template>
              </n-button>
            </div>
          </div>

          <!-- 视频描述 -->
          <div class="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>{{ formatNumber(video?.views) }} 次观看</span>
              <span>·</span>
              <span>{{ formatTime(video?.createdAt) }}</span>
            </div>
            <p class="whitespace-pre-wrap">{{ video?.description }}</p>
          </div>
        </div>

        <!-- 评论区 -->
        <div class="mt-6">
          <h3 class="text-xl font-bold mb-4">评论</h3>
          <CommentSection :videoId="videoId" />
        </div>
      </div>

      <!-- 推荐视频列表 -->
      <div class="lg:w-1/3">
        <h3 class="text-lg font-bold mb-4">推荐视频</h3>
        <div class="space-y-4">
          <VideoCard v-for="video in recommendedVideos" :key="video.id" :video="video" layout="horizontal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import VideoPlayer from '@/components/VideoPlayer.vue';
  import { useAuthStore } from '@/stores/auth';
  import { useToast } from '@/composables/useToast';

  const route = useRoute();
  const authStore = useAuthStore();
  const toast = useToast();
  const currentUser = authStore.user;

  const video = ref<any>({});
  const comments = ref<any[]>([]);
  const isLiked = ref(false);
  const isSubscribed = ref(false);
  const commentText = ref('');

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`/api/videos/${route.params.id}`);
      video.value = response.data.data;
      isLiked.value = video.value.likes.some(
        (like: any) => like.userId === currentUser?.id
      );
    } catch (error) {
      console.error('获取视频详情失败:', error);
      toast.error('获取视频详情失败');
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/videos/${route.params.id}/comments`);
      comments.value = response.data.data;
    } catch (error) {
      console.error('获取评论失败:', error);
      toast.error('获取评论失败');
    }
  };

  const toggleLike = async () => {
    if (!currentUser) {
      toast.warning('请先登录');
      return;
    }

    try {
      const response = await axios.post(`/api/videos/${route.params.id}/like`);
      isLiked.value = response.data.data.isLiked;
      await fetchVideo();
    } catch (error) {
      console.error('点赞操作失败:', error);
      toast.error('点赞操作失败');
    }
  };

  const toggleSubscribe = async () => {
    if (!currentUser) {
      toast.warning('请先登录');
      return;
    }

    try {
      const response = await axios.post(
        `/api/users/${video.value.user.id}/subscribe`
      );
      isSubscribed.value = response.data.data.isSubscribed;
      toast.success(isSubscribed.value ? '订阅成功' : '已取消订阅');
    } catch (error) {
      console.error('订阅操作失败:', error);
      toast.error('订阅操作失败');
    }
  };

  const submitComment = async () => {
    if (!currentUser) {
      toast.warning('请先登录');
      return;
    }

    if (!commentText.value.trim()) {
      toast.warning('请输入评论内容');
      return;
    }

    try {
      await axios.post(`/api/videos/${route.params.id}/comments`, {
        content: commentText.value,
      });
      commentText.value = '';
      await fetchComments();
      toast.success('评论发表成功');
    } catch (error) {
      console.error('发表评论失败:', error);
      toast.error('发表评论失败');
    }
  };

  const shareVideo = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('链接已复制到剪贴板');
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  onMounted(() => {
    fetchVideo();
    fetchComments();
  });
</script>