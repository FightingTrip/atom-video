<template>
  <div class="p-4 lg:p-6">
    <!-- 视频网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <template v-if="videoStore.loading && !videoStore.videos.length">
        <VideoCardSkeleton v-for="i in 12" :key="i" />
      </template>

      <template v-else>
        <VideoCard v-for="video in videoStore.filteredVideos" :key="video.id" :video="video"
          @click="$router.push(`/video/${video.id}`)" />
      </template>
    </div>

    <!-- 加载更多 -->
    <div v-if="videoStore.hasMore" class="text-center py-8">
      <n-button :loading="videoStore.loading" @click="videoStore.loadMore" type="primary" size="large">
        {{ videoStore.loading ? '加载中...' : '加载更多' }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useVideoStore } from '@/stores/video'
  import VideoCard from '@/components/VideoCard.vue'
  import VideoCardSkeleton from '@/components/VideoCardSkeleton.vue'

  const videoStore = useVideoStore()

  onMounted(() => {
    videoStore.initialize()
    videoStore.fetchVideos()
  })
</script>

<style scoped>
  .mask-edges {
    mask-image: linear-gradient(90deg, transparent, #000 1%, #000 99%, transparent);
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 1%, #000 99%, transparent);
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .video-card-wrapper {
    @apply transition-transform duration-200;
  }

  .video-card-wrapper:hover {
    @apply -translate-y-1;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>