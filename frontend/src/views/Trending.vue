<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.trending') }}</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <VideoCard v-for="video in videos" :key="video.id" :video="video" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import VideoCard from '@/components/VideoCard.vue';
  import type { Video } from '@/types';
  import api from '@/utils/api';

  const videos = ref<Video[]>([]);

  onMounted(async () => {
    try {
      const response = await api.get('/videos/trending');
      videos.value = response.data;
    } catch (error) {
      console.error('Failed to fetch trending videos:', error);
    }
  });
</script>