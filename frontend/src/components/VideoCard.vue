<template>
  <div class="video-card group">
    <div class="relative overflow-hidden rounded-lg mb-2">
      <img :src="video.thumbnail" :alt="video.title"
        class="w-full aspect-video object-cover transform transition hover:scale-105">
      <span class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
        {{ video.duration }}
      </span>
    </div>

    <div class="flex">
      <div class="mr-3 flex-shrink-0">
        <img :src="video.author.avatar" :alt="video.author.name" class="w-10 h-10 rounded-full object-cover">
      </div>

      <div class="flex-1 min-w-0">
        <h3 class="text-base font-medium text-gray-700 dark:text-gray-300 line-clamp-2 mb-1 group-hover:text-blue-500">
          {{ video.title }}
        </h3>
        <div class="flex flex-col text-sm text-gray-700 dark:text-gray-300">
          <span>
            {{ video.author.name }}
            <span v-if="video.author.verified" class="ml-1">
              <i class="fas fa-check-circle text-blue-500"></i>
            </span>
          </span>
          <span v-if="video.views">
            {{ formatViews(video.views) }} 次观看
            <template v-if="video.publishedAt">• {{ video.publishedAt }}</template>
            <template v-else-if="video.publishTime">• {{ video.publishTime }}</template>
            <template v-else-if="video.createdAt">• {{ video.createdAt }}</template>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    video: {
      type: Object,
      required: true
    }
  })

  // 格式化观看次数
  const formatViews = (views) => {
    if (typeof views === 'number') {
      if (views >= 10000) {
        return (views / 10000).toFixed(1) + '万'
      }
      return views.toString()
    }
    return views
  }

  // 调试属性
  console.log('Video object:', JSON.stringify(props.video, null, 2))
</script>

<style scoped>
  .video-card {
    transition: transform 0.2s ease;
  }

  .video-card:hover {
    transform: translateY(-4px);
  }

  /* 确保内容不溢出 */
  .video-card h3,
  .video-card span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 允许标题多行显示 */
  .video-card h3 {
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>