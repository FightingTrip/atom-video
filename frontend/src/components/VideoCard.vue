<template>
  <div class="video-card">
    <div class="thumbnail">
      <img :src="video.thumbnail" :alt="video.title">
      <span class="duration">{{ video.duration }}</span>
    </div>
    <div class="info">
      <h3 class="title">{{ video.title }}</h3>
      <div class="meta">
        <span class="views">{{ video.views }} 次观看</span>
        <span class="date">{{ video.uploadDate }}</span>
      </div>
      <div class="creator">
        <img :src="video.creator.avatar" :alt="video.creator.name" class="avatar">
        <span class="name">{{ video.creator.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Creator {
  name: string;
  avatar: string;
}

interface Video {
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  uploadDate: string;
  creator: Creator;
}

defineProps<{
  video: Video;
}>();
</script>

<style scoped>
.video-card {
  @apply bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200;
}

.thumbnail {
  @apply relative aspect-video;
}

.thumbnail img {
  @apply w-full h-full object-cover;
}

.duration {
  @apply absolute bottom-2 right-2 bg-black/80 text-white text-sm px-1 rounded;
}

.info {
  @apply p-4;
}

.title {
  @apply text-lg font-semibold line-clamp-2 mb-2;
}

.meta {
  @apply flex items-center gap-2 text-sm text-gray-600 mb-2;
}

.creator {
  @apply flex items-center gap-2;
}

.avatar {
  @apply w-6 h-6 rounded-full;
}

.name {
  @apply text-sm text-gray-700;
}
</style> 