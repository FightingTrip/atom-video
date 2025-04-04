<template>
  <div class="tag-search">
    <div class="search-input">
      <input 
        type="text" 
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="搜索标签..."
        class="input"
      >
    </div>
    <div v-if="tags.length > 0" class="tags-list">
      <button 
        v-for="tag in tags" 
        :key="tag.id"
        @click="selectTag(tag)"
        class="tag"
      >
        {{ tag.name }}
        <span class="count">({{ tag.count }})</span>
      </button>
    </div>
    <div v-else class="no-results">
      没有找到相关标签
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Tag {
  id: number;
  name: string;
  count: number;
}

const searchQuery = ref('');
const tags = ref<Tag[]>([
  { id: 1, name: '音乐', count: 1200 },
  { id: 2, name: '游戏', count: 850 },
  { id: 3, name: '教育', count: 650 },
  { id: 4, name: '科技', count: 450 },
  { id: 5, name: '生活', count: 350 }
]);

const handleSearch = () => {
  // 实现搜索逻辑
  console.log('搜索标签:', searchQuery.value);
};

const selectTag = (tag: Tag) => {
  // 实现标签选择逻辑
  console.log('选择标签:', tag);
};
</script>

<style scoped>
.tag-search {
  @apply w-full max-w-md mx-auto;
}

.search-input {
  @apply mb-4;
}

.input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.tags-list {
  @apply flex flex-wrap gap-2;
}

.tag {
  @apply px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors duration-200;
}

.count {
  @apply text-gray-500 ml-1;
}

.no-results {
  @apply text-center text-gray-500 py-4;
}
</style>
