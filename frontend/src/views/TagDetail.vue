<template>
  <div class="tag-detail">
    <div class="tag-header">
      <h1 class="text-2xl font-bold">{{ formatTagName(tag) }}</h1>
      <p class="text-gray-600 mt-2">共 {{ total }} 个视频</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <!-- 视频列表 -->
      <div class="lg:col-span-2">
        <div class="video-grid">
          <VideoCard v-for="video in videos" :key="video.id" :video="video" class="video-card" />
        </div>

        <div class="pagination mt-8" v-if="totalPages > 1">
          <button v-for="page in totalPages" :key="page" @click="handlePageChange(page)" class="page-button"
            :class="{ active: currentPage === page }">
            {{ page }}
          </button>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="space-y-8">
        <!-- 标签统计 -->
        <TagStats />

        <!-- 相关标签 -->
        <div class="related-tags">
          <h2 class="text-xl font-bold mb-4">相关标签</h2>
          <div class="flex flex-wrap gap-2">
            <router-link v-for="relatedTag in relatedTags" :key="relatedTag.tag" :to="`/tags/${relatedTag.tag}`"
              class="tag-item" :class="getTagClass(relatedTag.count)">
              {{ formatTagName(relatedTag.tag) }}
              <span class="tag-count">({{ relatedTag.count }})</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { api } from '@/utils/api';
  import VideoCard from '@/components/VideoCard.vue';
  import TagStats from '@/components/TagStats.vue';

  interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: number;
    views: number;
    user: {
      id: string;
      username: string;
      nickname: string;
      avatar: string;
    };
  }

  interface RelatedTag {
    tag: string;
    count: number;
  }

  const route = useRoute();
  const tag = ref<string>('');
  const videos = ref<Video[]>([]);
  const currentPage = ref(1);
  const total = ref(0);
  const totalPages = ref(0);
  const relatedTags = ref<RelatedTag[]>([]);

  const fetchTagVideos = async () => {
    try {
      const response = await api.get(`/api/tags/${tag.value}/videos`, {
        params: {
          page: currentPage.value,
          limit: 12
        }
      });

      if (response.data.success) {
        videos.value = response.data.data.videos;
        total.value = response.data.data.total;
        totalPages.value = response.data.data.totalPages;
      }
    } catch (error) {
      console.error('获取标签视频失败:', error);
    }
  };

  const fetchRelatedTags = async () => {
    try {
      const response = await api.get('/api/tags/popular');
      if (response.data.success) {
        // 过滤掉当前标签，并取前5个相关标签
        relatedTags.value = response.data.data
          .filter((t: RelatedTag) => t.tag !== tag.value)
          .slice(0, 5);
      }
    } catch (error) {
      console.error('获取相关标签失败:', error);
    }
  };

  const formatTagName = (tag: string) => {
    return tag.toLowerCase().replace(/_/g, ' ');
  };

  const getTagClass = (count: number) => {
    if (count > 100) return 'tag-large';
    if (count > 50) return 'tag-medium';
    return 'tag-small';
  };

  const handlePageChange = (page: number) => {
    currentPage.value = page;
  };

  watch([() => route.params.tag, currentPage], () => {
    tag.value = route.params.tag as string;
    fetchTagVideos();
    fetchRelatedTags();
  });

  onMounted(() => {
    tag.value = route.params.tag as string;
    fetchTagVideos();
    fetchRelatedTags();
  });
</script>

<style scoped>
  .tag-detail {
    @apply container mx-auto px-4 py-8;
  }

  .tag-header {
    @apply text-center mb-8;
  }

  .video-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 gap-6;
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

  .tag-item {
    @apply px-3 py-1 rounded-full text-sm transition-all duration-200;
    @apply hover:shadow-md hover:scale-105;
  }

  .tag-small {
    @apply bg-blue-100 text-blue-800;
  }

  .tag-medium {
    @apply bg-green-100 text-green-800;
  }

  .tag-large {
    @apply bg-purple-100 text-purple-800;
  }

  .tag-count {
    @apply text-xs ml-1 opacity-75;
  }

  .related-tags {
    @apply p-4 bg-white rounded-lg shadow;
  }
</style>