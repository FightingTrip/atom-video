/**
* @file TagDetail.vue
* @description 标签详情页面，用于展示标签相关的视频和统计信息
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 标签信息：显示标签名称、描述、使用次数等基本信息
* - 视频列表：展示使用该标签的视频列表
* - 标签统计：显示标签使用趋势和统计数据
* - 相关标签：展示相关标签推荐
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useVideoStore: 视频状态管理
* - useTagStore: 标签状态管理
* - naive-ui: UI组件库
* - vue-i18n: 国际化支持
*/

<template>
  <div class="tag-detail">
    <div class="tag-header">
      <h1 class="text-2xl font-bold">{{ formatTagName(tag) }}</h1>
      <p class="text-gray-600 mt-2">共 {{ total }} 个视频</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <!-- 视频列表 -->
      <div class="lg:col-span-2">
        <div class="video-grid">
          <VideoCardComponent v-for="video in videos" :key="video.id" :video="video" class="video-card" />
        </div>

        <div class="pagination mt-8" v-if="totalPages > 1">
          <button v-for="page in totalPages" :key="page" @click="handlePageChange(page)" class="page-button"
            :class="{ active: currentPage === page }">
            {{ page }}
          </button>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="space-y-8">
        <!-- 标签统计 -->
        <TagStats />

        <!-- 相关标签 -->
        <div class="related-tags">
          <h2 class="text-xl font-bold mb-4">相关标签</h2>
          <div class="flex flex-wrap gap-2">
            <router-link v-for="relatedTag in relatedTags" :key="relatedTag.tag" :to="`/tags/${relatedTag.tag}`"
              class="tag-item" :class="getTagClass(relatedTag.count)">
              {{ formatTagName(relatedTag.tag) }}
              <span class="tag-count">({{ relatedTag.count }})</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import api from '@/utils/api';
  import type { Video, Tag } from '@/types';
  import VideoCardComponent from '@/components/business/video/VideoCardComponent.vue';
  import TagStats from '@/components/business/tag/TagStats.vue';

  interface RelatedTag {
    tag: string;
    count: number;
  }

  const route = useRoute();
  const videos = ref<Video[]>([]);
  const tag = ref<Tag | null>(null);
  const currentPage = ref(1);
  const total = ref(0);
  const totalPages = ref(0);
  const relatedTags = ref<RelatedTag[]>([]);

  const fetchTagVideos = async () => {
    try {
      const response = await api.get('/videos', {
        params: {
          tag: route.params.id,
          page: currentPage.value,
          limit: 12
        }
      });

      if (response.data.success) {
        videos.value = response.data.data.videos;
        total.value = response.data.data.total;
        totalPages.value = response.data.data.totalPages;
      }
    } catch (error) {
      console.error('获取标签视频失败:', error);
    }
  };

  const fetchRelatedTags = async () => {
    try {
      const response = await api.get('/api/tags/popular');
      if (response.data.success) {
        // 过滤掉当前标签，并取前5个相关标签
        relatedTags.value = response.data.data
          .filter((t: RelatedTag) => t.tag !== route.params.id)
          .slice(0, 5);
      }
    } catch (error) {
      console.error('获取相关标签失败:', error);
    }
  };

  const formatTagName = (tag: string) => {
    return tag.toLowerCase().replace(/_/g, ' ');
  };

  const getTagClass = (count: number) => {
    if (count > 100) return 'tag-large';
    if (count > 50) return 'tag-medium';
    return 'tag-small';
  };

  const handlePageChange = (page: number) => {
    currentPage.value = page;
  };

  onMounted(async () => {
    try {
      const [tagResponse, videosResponse] = await Promise.all([
        api.get(`/tags/${route.params.id}`),
        api.get('/videos', {
          params: {
            tag: route.params.id,
          },
        }),
      ]);

      tag.value = tagResponse.data;
      videos.value = videosResponse.data.videos;
      fetchTagVideos();
      fetchRelatedTags();
    } catch (error) {
      console.error('Failed to fetch tag details:', error);
    }
  });
</script>

<style scoped>
  .tag-detail {
    max-width: var(--container-lg);
    margin: 0 auto;
    padding: var(--spacing-lg);
  }

  .tag-header {
    text-align: center;
    margin-bottom: var(--spacing-lg);
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: var(--spacing-md);
  }

  @media (min-width: 640px) {
    .video-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
  }

  .page-button {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    background-color: var(--secondary-bg);
    color: var(--text-primary);
    transition: background-color var(--transition-normal);
  }

  .page-button:hover {
    background-color: var(--tertiary-bg);
  }

  .page-button.active {
    background-color: var(--primary-color);
    color: var(--text-inverse);
  }

  .tag-item {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    transition: all var(--transition-normal);
  }

  .tag-item:hover {
    box-shadow: var(--shadow-md);
    transform: scale(1.05);
  }

  .tag-small {
    background-color: var(--primary-bg);
    color: var(--text-primary);
    border: 1px solid var(--border-light);
  }

  .tag-medium {
    background-color: var(--secondary-bg);
    color: var(--text-primary);
  }

  .tag-large {
    background-color: var(--tertiary-bg);
    color: var(--text-primary);
  }

  .tag-count {
    font-size: var(--text-xs);
    margin-left: var(--spacing-xs);
    opacity: 0.75;
  }

  .related-tags {
    padding: var(--spacing-md);
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }
</style>
