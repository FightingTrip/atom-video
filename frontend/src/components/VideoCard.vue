<template>
  <div class="group cursor-pointer" @click="$emit('click')">
    <!-- 视频缩略图容器 -->
    <div class="relative aspect-video rounded-xl overflow-hidden mb-3">
      <img :src="video.thumbnail" :alt="video.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <!-- 时长标签 -->
      <div class="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs">
        {{ video.duration }}
      </div>
      <!-- 悬停时显示的播放按钮 -->
      <div
        class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
        <i class="fas fa-play text-white text-4xl"></i>
      </div>
    </div>

    <!-- 视频信息 -->
    <div class="flex gap-3">
      <!-- 作者头像 -->
      <div class="flex-shrink-0">
        <img :src="video.author.avatar" :alt="video.author.name" class="w-9 h-9 rounded-full" />
      </div>

      <!-- 视频标题和作者信息 -->
      <div class="flex-1 min-w-0">
        <h3 class="text-base font-medium text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-500">
          {{ video.title }}
        </h3>
        <div class="flex flex-col text-sm text-gray-600 dark:text-gray-400">
          <span class="hover:text-gray-900 dark:hover:text-gray-200">
            {{ video.author.name }}
            <span v-if="video.author.verified" class="ml-1">
              <i class="fas fa-check-circle text-blue-500"></i>
            </span>
          </span>
          <div class="flex items-center">
            <span>{{ video.views }}次观看</span>
            <span class="mx-1">•</span>
            <span>{{ video.publishTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    video: {
      id: string
      title: string
      thumbnail: string
      duration: string
      author: {
        name: string
        avatar: string
        verified?: boolean
      }
      views: string
      publishTime: string
    }
  }>()
</script>

<style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>