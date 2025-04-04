<template>
  <div class="py-4">
    <!-- 分类标签 -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
      <button v-for="tag in tags" :key="tag.id" class="px-4 py-1 rounded-full transition-colors whitespace-nowrap"
        :class="[
          selectedTag === tag.id
            ? 'bg-white text-black font-medium'
            : 'bg-[#272727] hover:bg-[#3f3f3f]',
        ]" @click="selectTag(tag.id)">
        <i v-if="tag.icon" :class="['fas', tag.icon, 'mr-2']"></i>
        {{ tag.name }}
      </button>
    </div>

    <!-- 视频网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <template v-if="!loading">
        <VideoCard v-for="video in videos" :key="video.id" :video="video" @click="navigateToVideo(video.id)" />
      </template>
      <template v-else>
        <VideoCard v-for="i in 12" :key="i" :loading="true" />
      </template>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore && !loading" class="mt-8 text-center">
      <button class="px-6 py-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] transition-colors" @click="loadMore">
        {{ $t('common.loadMore') }}
      </button>
    </div>

    <!-- 加载中 -->
    <div v-if="loading && hasMore" class="mt-8 text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import type { Video, Tag } from '@/types';
  import { apiClient } from '@/services/api';
  import VideoCard from '@/components/VideoCard.vue';

  const router = useRouter();
  const { t } = useI18n();

  const loading = ref(true);
  const videos = ref<Video[]>([]);
  const tags = ref<Tag[]>([
    { id: 'all', name: '全部', slug: 'all' },
    { id: 'javascript', name: 'JavaScript', slug: 'javascript', icon: 'fa-js' },
    { id: 'typescript', name: 'TypeScript', slug: 'typescript', icon: 'fa-code' },
    { id: 'vue', name: 'Vue', slug: 'vue', icon: 'fa-vuejs' },
    { id: 'react', name: 'React', slug: 'react', icon: 'fa-react' },
    { id: 'nodejs', name: 'Node.js', slug: 'nodejs', icon: 'fa-node' },
    { id: 'python', name: 'Python', slug: 'python', icon: 'fa-python' },
    { id: 'java', name: 'Java', slug: 'java', icon: 'fa-java' },
    { id: 'go', name: 'Go', slug: 'go', icon: 'fa-code' },
    { id: 'rust', name: 'Rust', slug: 'rust', icon: 'fa-cogs' },
  ]);

  const selectedTag = ref('all');
  const page = ref(1);
  const hasMore = ref(true);

  const fetchVideos = async (reset = false) => {
    if (reset) {
      page.value = 1;
      videos.value = [];
      hasMore.value = true;
    }

    try {
      loading.value = true;
      const response = await apiClient.get<{
        videos: Video[];
        totalPages: number;
      }>('/videos', {
        page: page.value,
        limit: 12,
        tag: selectedTag.value === 'all' ? undefined : selectedTag.value,
      });

      if (reset) {
        videos.value = response.data.videos;
      } else {
        videos.value.push(...response.data.videos);
      }

      hasMore.value = page.value < response.data.totalPages;
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      loading.value = false;
    }
  };

  const selectTag = (tagId: string) => {
    selectedTag.value = tagId;
    fetchVideos(true);
  };

  const loadMore = () => {
    if (!loading.value && hasMore.value) {
      page.value++;
      fetchVideos();
    }
  };

  const navigateToVideo = (videoId: string) => {
    router.push(`/video/${videoId}`);
  };

  onMounted(() => {
    fetchVideos();
  });
</script>

<style scoped>
  .no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
