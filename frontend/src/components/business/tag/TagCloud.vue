/**
* @file TagCloud.vue
* @description 标签云组件，用于展示标签的视觉化分布
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 标签云布局
* - 标签大小动态调整
* - 标签点击交互
* - 响应式布局
* - 黑白主题适配
*/

<template>
  <div class="tag-cloud">
    <h2 class="text-xl font-bold mb-4">热门标签</h2>
    <div class="flex flex-wrap gap-2">
      <router-link v-for="tag in tags" :key="tag.tag" :to="`/tags/${tag.tag}`" class="tag-item"
        :class="getTagClass(tag.count)" @click="handleTagClick(tag.tag)">
        {{ formatTagName(tag.tag) }}
        <span class="tag-count">({{ tag.count }})</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '@/utils/api';

  interface Tag {
    tag: string;
    count: number;
  }

  const router = useRouter();
  const tags = ref<Tag[]>([]);

  const fetchTags = async () => {
    try {
      const response = await api.get('/api/tags/popular');
      if (response.data.success) {
        tags.value = response.data.data;
      }
    } catch (error) {
      console.error('获取标签失败:', error);
    }
  };

  const getTagClass = (count: number) => {
    if (count > 100) return 'tag-large';
    if (count > 50) return 'tag-medium';
    return 'tag-small';
  };

  const formatTagName = (tag: string) => {
    return tag.toLowerCase().replace(/_/g, ' ');
  };

  const handleTagClick = (tag: string) => {
    router.push(`/tags/${tag}`);
  };

  onMounted(() => {
    fetchTags();
  });
</script>

<style scoped>
  .tag-cloud {
    padding: var(--spacing-md);
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
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
</style>