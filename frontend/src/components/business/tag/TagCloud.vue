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
    @apply p-4 bg-white rounded-lg shadow;
  }

  .tag-item {
    @apply px-3 py-1 rounded-full text-sm transition-all duration-200;
    @apply hover:shadow-md hover:scale-105;
  }

  .tag-small {
    @apply bg-blue-100 text-blue-800;
  }

  .tag-medium {
    @apply bg-green-100 text-green-800;
  }

  .tag-large {
    @apply bg-purple-100 text-purple-800;
  }

  .tag-count {
    @apply text-xs ml-1 opacity-75;
  }
</style>