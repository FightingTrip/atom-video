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
  <div class="subscriptions-container">
    <h1 class="page-title">{{ $t('nav.subscriptions') }}</h1>
    <div v-if="!isAuthenticated" class="login-prompt">
      <p class="prompt-text">{{ $t('auth.loginRequired') }}</p>
      <router-link to="/auth/login" class="login-button">
        {{ $t('user.login') }}
      </router-link>
    </div>
    <div v-else class="subscriptions-grid">
      <VideoCardComponent v-for="video in videos" :key="video.id" :video="video" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import VideoCardComponent from '@/components/business/video/VideoCardComponent.vue';
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

<style scoped>
  .subscriptions-container {
    padding: var(--spacing-lg);
    background-color: var(--primary-bg);
    color: var(--text-primary);
    min-height: 100vh;
  }

  .page-title {
    font-size: var(--text-2xl);
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
  }

  .login-prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl) 0;
  }

  .prompt-text {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-md);
  }

  .login-button {
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-lg);
    background-color: var(--primary-color);
    color: var(--text-inverse);
    border-radius: var(--radius-md);
    font-weight: 500;
    transition: background-color var(--transition-normal);
  }

  .login-button:hover {
    background-color: var(--primary-color-dark);
  }

  .subscriptions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }

  @media (max-width: 768px) {
    .subscriptions-container {
      padding: var(--spacing-md);
    }

    .subscriptions-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--spacing-md);
    }
  }
</style>