<template>
  <article class="group cursor-pointer" :class="{ 'animate-pulse': loading }">
    <!-- 视频缩略图 -->
    <div class="relative aspect-video rounded-xl overflow-hidden mb-3">
      <template v-if="!loading">
        <img :src="video.thumbnail" :alt="video.title"
          class="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
        <div class="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-sm">
          {{ formatDuration(video.duration) }}
        </div>
        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="absolute bottom-2 left-2 flex gap-2">
            <button class="p-1 rounded-full bg-black/80 hover:bg-black" :title="$t('video.watchLater')">
              <i class="fas fa-clock text-sm"></i>
            </button>
            <button class="p-1 rounded-full bg-black/80 hover:bg-black" :title="$t('video.addToPlaylist')">
              <i class="fas fa-list text-sm"></i>
            </button>
          </div>
        </div>
      </template>
      <SkeletonLoader v-else type="video" class="w-full h-full" />
    </div>

    <!-- 视频信息 -->
    <div class="flex gap-3">
      <!-- 用户头像 -->
      <div class="flex-shrink-0">
        <template v-if="!loading">
          <router-link :to="'/user/' + video.user.id"
            class="block w-9 h-9 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500">
            <img :src="video.user.avatar" :alt="video.user.nickname" class="w-full h-full object-cover"
              loading="lazy" />
          </router-link>
        </template>
        <SkeletonLoader v-else type="circle" width="36" height="36" />
      </div>

      <!-- 标题和元信息 -->
      <div class="flex-grow min-w-0">
        <template v-if="!loading">
          <h3 class="font-medium mb-1 line-clamp-2 group-hover:text-blue-500">
            {{ video.title }}
          </h3>
          <div class="text-sm text-gray-400">
            <router-link :to="'/user/' + video.user.id" class="hover:text-white">
              {{ video.user.nickname }}
            </router-link>
            <div class="flex items-center gap-1">
              <span>{{ formatViews(video.views) }}</span>
              <span>·</span>
              <span>{{ formatTime(video.createdAt) }}</span>
            </div>
          </div>
          <!-- 标签 -->
          <div class="mt-1 flex flex-wrap gap-1">
            <router-link v-for="tag in video.tags.slice(0, 3)" :key="tag.id" :to="'/tag/' + tag.slug"
              class="text-xs px-2 py-0.5 rounded-full bg-[#272727] hover:bg-[#3f3f3f] transition-colors"
              :style="tag.color ? { backgroundColor: tag.color } : {}">
              <i v-if="tag.icon" :class="['fas', tag.icon, 'mr-1']"></i>
              {{ tag.name }}
            </router-link>
          </div>
        </template>
        <template v-else>
          <SkeletonLoader class="h-6 mb-2 w-11/12" />
          <SkeletonLoader class="h-4 mb-1 w-1/3" />
          <SkeletonLoader class="h-4 w-2/3" />
        </template>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { Video } from '@/types';
  import SkeletonLoader from './SkeletonLoader.vue';
  import { formatDuration, formatViews, formatTime } from '@/utils/format';

  interface Props {
    video?: Video;
    loading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
  });

  const { t } = useI18n();
</script>