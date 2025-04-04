<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.history') }}</h1>
    <div v-if="!isAuthenticated" class="text-center py-8">
      <p class="text-gray-400">{{ $t('auth.loginRequired') }}</p>
      <router-link to="/auth/login" class="btn btn-primary mt-4">
        {{ $t('user.login') }}
      </router-link>
    </div>
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <VideoCard v-for="video in videos" :key="video.id" :video="video" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import VideoCard from '@/components/VideoCard.vue';
  import type { Video } from '@/types';
  import api from '@/utils/api';

  const authStore = useAuthStore();
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const videos = ref<Video[]>([]);

  onMounted(async () => {
    if (isAuthenticated.value) {
      try {
        const response = await api.get('/videos/history');
        videos.value = response.data;
      } catch (error) {
        console.error('Failed to fetch history videos:', error);
      }
    }
  });
</script>