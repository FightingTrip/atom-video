<template>
  <div class="py-4">
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <n-spin size="large" />
    </div>

    <div v-else-if="error" class="flex justify-center items-center min-h-[400px]">
      <n-result status="error" :title="error" />
    </div>

    <div v-else class="flex flex-col lg:flex-row gap-6">
      <!-- 视频播放区域 -->
      <div class="flex-grow lg:w-2/3">
        <div class="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video ref="videoRef" class="w-full h-full"
            :src="video?.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'" controls
            @timeupdate="handleTimeUpdate"></video>
        </div>

        <!-- 视频信息 -->
        <div class="mt-4">
          <h1 class="text-2xl font-bold">{{ video?.title }}</h1>
          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center gap-4">
              <router-link v-if="video?.author" :to="`/user/${video.author.id}`" class="flex items-center gap-3">
                <n-avatar :src="video.author.avatar" :round="true" />
                <div>
                  <h3 class="font-medium">{{ video.author.name }}</h3>
                  <p class="text-sm text-gray-500">{{ video.author.verified ? '已认证' : '未认证' }}</p>
                </div>
              </router-link>
              <n-button v-if="video?.author && currentUser?.id !== video.author.id" type="primary"
                :loading="subscribing" @click="toggleSubscribe">
                {{ isSubscribed ? '已订阅' : '订阅' }}
              </n-button>
            </div>
            <div class="flex items-center gap-2">
              <n-button-group>
                <n-button>
                  <template #icon><i class="fas fa-thumbs-up"></i></template>
                  {{ video?.likes || 0 }}
                </n-button>
                <n-button>
                  <template #icon><i class="fas fa-thumbs-down"></i></template>
                  {{ video?.dislikes || 0 }}
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
              <span>{{ video?.views || 0 }} 次观看</span>
              <span>·</span>
              <span>{{ video?.publishTime }}</span>
            </div>
            <p class="whitespace-pre-wrap">{{ video?.description }}</p>
          </div>
        </div>

        <!-- 评论区 -->
        <div class="mt-6">
          <h3 class="text-xl font-bold mb-4">评论 ({{ comments.length }})</h3>
          <div class="space-y-4">
            <div v-for="comment in comments" :key="comment.id" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="flex items-start gap-3">
                <n-avatar :src="comment.user.avatar" :round="true" />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ comment.user.nickname }}</span>
                    <span class="text-sm text-gray-500">{{ comment.createdAt }}</span>
                  </div>
                  <p class="mt-2">{{ comment.content }}</p>
                  <div class="mt-2 flex items-center gap-4">
                    <n-button text>
                      <template #icon><i class="fas fa-thumbs-up"></i></template>
                      {{ comment.likes }}
                    </n-button>
                    <n-button text>回复</n-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 推荐视频列表 -->
      <div class="lg:w-1/3">
        <h3 class="text-lg font-bold mb-4">推荐视频</h3>
        <div class="space-y-4">
          <video-card v-for="recommendedVideo in recommendedVideos" :key="recommendedVideo.id"
            :video="recommendedVideo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { useToast } from '@/composables/useToast';
  import { mockVideosApi } from '@/mock/videos';
  // 导入 Naive UI 组件
  import {
    NButton,
    NButtonGroup,
    NSpin,
    NResult,
    NAvatar,
    NSpace
  } from 'naive-ui';
  // 导入 VideoCard 组件
  import VideoCard from '@/components/VideoCard.vue';

  const route = useRoute();
  const authStore = useAuthStore();
  const toast = useToast();
  const currentUser = authStore.user;

  const video = ref<any>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const subscribing = ref(false);
  const isSubscribed = ref(false);
  const comments = ref<any[]>([]);
  const recommendedVideos = ref<any[]>([]);

  const fetchVideo = async () => {
    loading.value = true;
    error.value = null;

    try {
      // 获取视频数据
      const videoData = await mockVideosApi.getVideoById(route.params.id as string);
      if (!videoData) {
        throw new Error('视频不存在');
      }
      video.value = videoData;

      // 获取评论数据
      const commentsData = await mockVideosApi.getVideoComments(route.params.id as string);
      comments.value = commentsData.comments;

      // 获取推荐视频
      const { videos } = await mockVideosApi.getVideos({ page: 1, pageSize: 5 });
      recommendedVideos.value = videos.filter(v => v.id !== route.params.id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取视频详情失败';
      console.error('获取视频详情失败:', err);
      toast.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const toggleSubscribe = async () => {
    if (!currentUser) {
      toast.warning('请先登录');
      return;
    }

    if (!video.value?.author) {
      toast.error('视频作者信息不存在');
      return;
    }

    try {
      subscribing.value = true;
      // 模拟订阅操作
      await new Promise(resolve => setTimeout(resolve, 500));
      isSubscribed.value = !isSubscribed.value;
      toast.success(isSubscribed.value ? '订阅成功' : '已取消订阅');
    } catch (error) {
      console.error('订阅操作失败:', error);
      toast.error('订阅操作失败');
    } finally {
      subscribing.value = false;
    }
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
  });
</script>