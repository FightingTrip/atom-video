<template>
  <div class="home">
    <div class="container mx-auto px-4 py-8">
      <!-- 搜索栏 -->
      <div class="mb-8">
        <TagSearch />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 左侧边栏 -->
        <div class="lg:col-span-1">
          <!-- 标签云 -->
          <div class="mb-8">
            <TagCloud />
          </div>

          <!-- 标签筛选 -->
          <div class="mb-8">
            <TagFilter v-model="selectedTags" />
          </div>
        </div>

        <!-- 主要内容 -->
        <div class="lg:col-span-3">
          <!-- 视频列表 -->
          <div class="video-section">
            <h2 class="text-2xl font-bold mb-4">最新视频</h2>
            <div class="video-grid">
              <VideoCard v-for="video in filteredVideos" :key="video.id" :video="video" class="video-card" />
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination mt-8" v-if="totalPages > 1">
            <button v-for="page in totalPages" :key="page" @click="handlePageChange(page)" class="page-button"
              :class="{ active: currentPage === page }">
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { api } from '@/utils/api';
  import VideoCard from '@/components/VideoCard.vue';
  import TagCloud from '@/components/TagCloud.vue';
  import TagSearch from '@/components/TagSearch.vue';
  import TagFilter from '@/components/TagFilter.vue';
  import { TechTag } from '@/types/tags';

  interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: number;
    views: number;
    tags: TechTag[];
    user: {
      id: string;
      username: string;
      nickname: string;
      avatar: string;
    };
  }

  const videos = ref<Video[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(0);
  const selectedTags = ref<TechTag[]>([]);

  const fetchVideos = async () => {
    try {
      const response = await api.get('/api/videos', {
        params: {
          page: currentPage.value,
          limit: 12,
          tags: selectedTags.value
        }
      });

      if (response.data.success) {
        videos.value = response.data.data.videos;
        totalPages.value = response.data.data.totalPages;
      }
    } catch (error) {
      console.error('获取视频失败:', error);
    }
  };

  const filteredVideos = computed(() => {
    if (selectedTags.value.length === 0) {
      return videos.value;
    }
    return videos.value.filter(video =>
      selectedTags.value.every(tag => video.tags.includes(tag))
    );
  });

  const handlePageChange = (page: number) => {
    currentPage.value = page;
    fetchVideos();
  };

  watch(selectedTags, () => {
    currentPage.value = 1;
    fetchVideos();
  });

  onMounted(() => {
    fetchVideos();
  });
</script>

<style scoped>
  .home {
    @apply min-h-screen bg-gray-50;
  }

  .video-section {
    @apply mb-8;
  }

  .video-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6;
  }

  .pagination {
    @apply flex justify-center gap-2;
  }

  .page-button {
    @apply px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors;
  }

  .page-button.active {
    @apply bg-blue-500 text-white;
  }
</style>
