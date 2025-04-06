/**
* @file TagList.vue
* @description 标签列表组件，用于展示和管理标签列表
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 标签列表展示
* - 标签搜索功能
* - 标签排序功能
* - 标签点击交互
* - 响应式布局
* - 黑白主题适配
*/

<template>
  <div class="tag-list">
    <!-- 标签分类 -->
    <div v-for="category in categories" :key="category.id" class="mb-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">{{ category.name }}</h3>
      <div class="flex flex-wrap gap-2">
        <n-tag v-for="tag in category.tags" :key="tag.id" :type="isTagSelected(tag.id) ? 'primary' : 'default'"
          :bordered="false" size="medium" round clickable @click="toggleTag(tag.id)"
          class="cursor-pointer transition-all duration-200 hover:scale-105">
          {{ tag.name }}
          <template #avatar>
            <n-avatar v-if="tag.icon" :src="tag.icon" round size="small" />
          </template>
        </n-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { NTag, NAvatar } from 'naive-ui'
  import { useVideoStore } from '@/stores/video'

  const videoStore = useVideoStore()

  // 选中的标签
  const selectedTags = ref<string[]>([])

  interface Tag {
    id: string;
    name: string;
    icon?: string;
  }

  interface Category {
    id: string;
    name: string;
    tags: Tag[];
  }

  // 标签分类数据
  const categories: Category[] = [
    {
      id: 'languages',
      name: '编程语言',
      tags: [
        { id: 'javascript', name: 'JavaScript', icon: '/icons/javascript.svg' },
        { id: 'typescript', name: 'TypeScript', icon: '/icons/typescript.svg' },
        { id: 'python', name: 'Python', icon: '/icons/python.svg' },
        { id: 'java', name: 'Java', icon: '/icons/java.svg' },
        { id: 'cpp', name: 'C++', icon: '/icons/cpp.svg' }
      ]
    },
    {
      id: 'frameworks',
      name: '框架',
      tags: [
        { id: 'vue', name: 'Vue.js', icon: '/icons/vue.svg' },
        { id: 'react', name: 'React', icon: '/icons/react.svg' },
        { id: 'angular', name: 'Angular', icon: '/icons/angular.svg' },
        { id: 'node', name: 'Node.js', icon: '/icons/nodejs.svg' },
        { id: 'spring', name: 'Spring', icon: '/icons/spring.svg' }
      ]
    },
    {
      id: 'topics',
      name: '主题',
      tags: [
        { id: 'frontend', name: '前端开发' },
        { id: 'backend', name: '后端开发' },
        { id: 'database', name: '数据库' },
        { id: 'devops', name: 'DevOps' },
        { id: 'security', name: '安全' }
      ]
    },
    {
      id: 'level',
      name: '难度',
      tags: [
        { id: 'beginner', name: '入门' },
        { id: 'intermediate', name: '中级' },
        { id: 'advanced', name: '高级' }
      ]
    }
  ]

  // 检查标签是否被选中
  const isTagSelected = (tagId: string) => selectedTags.value.includes(tagId)

  // 切换标签选中状态
  const toggleTag = (tagId: string) => {
    const index = selectedTags.value.indexOf(tagId)
    if (index === -1) {
      selectedTags.value.push(tagId)
    } else {
      selectedTags.value.splice(index, 1)
    }
    // 更新视频列表
    videoStore.filterByTags(selectedTags.value)
  }
</script>

<style scoped>
  .tag-list {
    padding: var(--spacing-md);
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
</style>