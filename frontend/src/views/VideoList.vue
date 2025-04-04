<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900">视频列表</h1>
      <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        @click="showUploadModal = true">
        上传视频
      </button>
    </div>

    <div class="flex gap-4 mb-8">
      <div class="relative flex-1">
        <input type="text" v-model="searchQuery" placeholder="搜索视频..." @input="handleSearch"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>

      <select v-model="sortBy" @change="handleSort"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="newest">最新上传</option>
        <option value="oldest">最早上传</option>
        <option value="popular">最受欢迎</option>
      </select>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <div v-for="video in videos" :key="video.id"
        class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1">
        <router-link :to="`/videos/${video.id}`" class="block">
          <div class="relative aspect-video">
            <img :src="video.thumbnailUrl" :alt="video.title" class="w-full h-full object-cover" />
            <div class="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-sm rounded">
              {{ formatDuration(video.duration) }}
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-medium text-gray-900 mb-2 line-clamp-2">{{ video.title }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ video.description }}</p>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <i class="fas fa-eye"></i>
                {{ formatNumber(video.views) }}
              </span>
              <span class="flex items-center gap-1">
                <i class="fas fa-heart"></i>
                {{ formatNumber(video.likes.length) }}
              </span>
              <span>{{ formatDate(video.createdAt) }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <div class="flex items-center justify-center gap-4">
      <button
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        上一页
      </button>
      <span class="text-gray-600">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </span>
      <button
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        下一页
      </button>
    </div>

    <VideoUpload v-if="showUploadModal" @upload-success="handleUploadSuccess" @cancel="showUploadModal = false" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import VideoUpload from '@/components/VideoUpload.vue';
  import { useAuthStore } from '@/stores/auth';
  import { useToast } from '@/composables/useToast';

  const authStore = useAuthStore();
  const toast = useToast();
  const videos = ref<any[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const searchQuery = ref('');
  const sortBy = ref('newest');
  const showUploadModal = ref(false);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/videos', {
        params: {
          page: currentPage.value,
          limit: 12,
          search: searchQuery.value,
          sort: sortBy.value,
        },
      });

      videos.value = response.data.data.videos;
      totalPages.value = response.data.data.totalPages;
    } catch (error) {
      console.error('获取视频列表失败:', error);
      toast.error('获取视频列表失败');
    }
  };

  const handleSearch = () => {
    currentPage.value = 1;
    fetchVideos();
  };

  const handleSort = () => {
    currentPage.value = 1;
    fetchVideos();
  };

  const changePage = (page: number) => {
    currentPage.value = page;
    fetchVideos();
  };

  const handleUploadSuccess = () => {
    showUploadModal.value = false;
    fetchVideos();
    toast.success('视频上传成功');
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
    fetchVideos();
  });
</script>