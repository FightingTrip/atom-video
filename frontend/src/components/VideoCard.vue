<template>
  <div class="video-card cursor-pointer transform hover:scale-105 transition-all duration-200" @click="$emit('click')">
    <div class="aspect-video relative overflow-hidden rounded-lg">
      <img :src="video.thumbnail" :alt="video.title" class="w-full h-full object-cover" loading="lazy" />
      <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
        {{ formatDuration(video.duration) }}
      </div>
    </div>
    <div class="mt-3 flex">
      <img :src="video.user.avatar" :alt="video.user.nickname" class="w-9 h-9 rounded-full mr-3" loading="lazy" />
      <div>
        <h3 class="text-base font-medium line-clamp-2 text-gray-900 dark:text-gray-100">
          {{ video.title }}
        </h3>
        <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          <span>{{ video.user.nickname }}</span>
          <span v-if="video.user.verified" class="ml-1 text-blue-500">
            <i class="fas fa-check-circle"></i>
          </span>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ formatNumber(video.views) }} 次观看 · {{ formatTime(video.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Video } from '@/types';
  import { formatNumber, formatTime } from '@/utils/format';

  defineProps<{
    video: Video;
  }>();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
</script>

<style scoped>
  @keyframes pulse {

    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: .5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>