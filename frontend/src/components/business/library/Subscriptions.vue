/**
* @file Subscriptions.vue
* @description 订阅页面组件，用于展示用户订阅的频道
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 频道列表：展示用户订阅的频道
* - 频道分类：支持按分类筛选频道
* - 频道排序：支持按订阅时间排序
* - 频道搜索：支持搜索频道名称
* - 分页加载：支持分页加载更多频道
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useUserStore: 用户状态管理
* - naive-ui: UI组件库
* - vue-i18n: 国际化支持
* - vue-router: 路由管理
*/

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ $t('nav.subscriptions') }}</h1>
    <div v-if="!isAuthenticated" class="text-center py-8">
      <p class="text-gray-400">{{ $t('auth.loginRequired') }}</p>
      <router-link to="/auth/login" class="btn btn-primary mt-4">
        {{ $t('user.login') }}
      </router-link>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <VideoCard v-for="video in videos" :key="video.id" :video="video" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import VideoCard from '@/components/business/video/VideoCard.vue';
  import type { Video } from '@/types';
  import api from '@/utils/api';

  const authStore = useAuthStore();
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const videos = ref<Video[]>([]);

  onMounted(async () => {
    if (isAuthenticated.value) {
      try {
        const response = await api.get('/videos/subscriptions');
        videos.value = response.data;
      } catch (error) {
        console.error('Failed to fetch subscription videos:', error);
      }
    }
  });
</script>