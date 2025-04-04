<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <!-- 视频播放器 -->
    <div class="mb-8">
      <VideoPlayer :src="video.url" :poster="video.thumbnailUrl" />
    </div>

    <!-- 视频信息 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ video.title }}</h1>
        <div class="flex gap-3">
          <button class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            :class="isLiked ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="toggleLike">
            <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
            <span>{{ formatNumber(video.likes.length) }}</span>
          </button>
          <button
            class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            @click="shareVideo">
            <i class="fas fa-share"></i>
            <span>分享</span>
          </button>
        </div>
      </div>

      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
          <img :src="video.user.avatar" :alt="video.user.username" class="w-10 h-10 rounded-full object-cover" />
          <div>
            <router-link :to="`/users/${video.user.id}`"
              class="font-medium text-gray-900 hover:text-blue-600 transition-colors">
              {{ video.user.username }}
            </router-link>
            <p class="text-sm text-gray-500">{{ formatDate(video.createdAt) }}</p>
          </div>
          <button class="ml-4 px-4 py-2 rounded-lg transition-colors"
            :class="isSubscribed ? 'bg-gray-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'"
            @click="toggleSubscribe">
            {{ isSubscribed ? '已订阅' : '订阅' }}
          </button>
        </div>

        <div class="flex gap-6 text-gray-600">
          <span class="flex items-center gap-2">
            <i class="fas fa-eye"></i>
            {{ formatNumber(video.views) }} 次观看
          </span>
          <span class="flex items-center gap-2">
            <i class="fas fa-clock"></i>
            {{ formatDuration(video.duration) }}
          </span>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">视频描述</h3>
        <p class="text-gray-700 leading-relaxed">{{ video.description }}</p>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">评论区</h2>

      <!-- 评论输入框 -->
      <div class="flex gap-4 mb-6">
        <img :src="currentUser?.avatar" :alt="currentUser?.username" class="w-10 h-10 rounded-full object-cover" />
        <div class="flex-1 flex gap-2">
          <input type="text" v-model="commentText" placeholder="写下你的评论..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="submitComment" />
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            @click="submitComment">
            评论
          </button>
        </div>
      </div>

      <!-- 评论列表 -->
      <div class="space-y-6">
        <div v-for="comment in comments" :key="comment.id" class="flex gap-4">
          <img :src="comment.user.avatar" :alt="comment.user.username" class="w-10 h-10 rounded-full object-cover" />
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <router-link :to="`/users/${comment.user.id}`"
                class="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {{ comment.user.username }}
              </router-link>
              <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
            </div>
            <p class="text-gray-700">{{ comment.content }}</p>
          </div>
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

  onMounted(() => {
    fetchVideo();
    fetchComments();
  });
</script>