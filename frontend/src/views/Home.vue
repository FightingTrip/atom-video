<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 视频列表 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <template v-if="videoStore.loading && !videoStore.videos.length">
        <VideoCardSkeleton v-for="i in 12" :key="i" />
      </template>

      <template v-else-if="videoStore.videos.length > 0">
        <VideoCard v-for="video in videoStore.filteredVideos" :key="video.id" :video="video"
          @click="$router.push(`/video/${video.id}`)" />
      </template>

      <!-- 空状态 -->
      <template v-else>
        <div class="col-span-full text-center py-8">
          <n-empty :description="t('common.noVideos')" />
        </div>
      </template>
    </div>

    <!-- 加载更多 -->
    <div v-if="videoStore.hasMore" class="text-center py-8">
      <n-button :loading="videoStore.loading" @click="videoStore.loadMore" type="primary" size="large">
        {{ videoStore.loading ? t('common.loading') : t('common.loadMore') }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useVideoStore } from '@/stores/video'
  import VideoCard from '@/components/VideoCard.vue'
  import VideoCardSkeleton from '@/components/VideoCardSkeleton.vue'
  import { NButton, NEmpty } from 'naive-ui'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const videoStore = useVideoStore()

  onMounted(async () => {
    await videoStore.fetchVideos()
  })
</script>

<style scoped>
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

  .text-secondary {
    color: var(--text-secondary);
  }

  .text-muted {
    color: var(--text-muted);
  }

  .load-more-button {
    background-color: var(--primary-color) !important;
    color: white !important;
    transition: all 0.3s !important;
  }

  .load-more-button:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
</style>