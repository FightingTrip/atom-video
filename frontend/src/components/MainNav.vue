<template>
  <nav class="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
    <div class="max-w-screen-2xl mx-auto px-4">
      <div class="flex items-center justify-between h-12 overflow-x-auto no-scrollbar">
        <!-- 左侧固定项 -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <n-button
            quaternary
            :type="selectedCategory === 'all' ? 'primary' : 'default'"
            @click="selectCategory('all')"
          >
            全部
          </n-button>
        </div>

        <!-- 中间滚动项 -->
        <div class="flex items-center gap-2 overflow-x-auto flex-grow px-4 no-scrollbar">
          <n-button
            v-for="category in categories"
            :key="category.id"
            quaternary
            :type="selectedCategory === category.id ? 'primary' : 'default'"
            @click="selectCategory(category.id)"
            class="whitespace-nowrap"
          >
            <template #icon>
              <i :class="['fas', category.icon]"></i>
            </template>
            {{ category.name }}
          </n-button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedCategory = ref('all');

const categories = [
  { id: 'javascript', name: 'JavaScript', icon: 'fa-js' },
  { id: 'typescript', name: 'TypeScript', icon: 'fa-code' },
  { id: 'vue', name: 'Vue', icon: 'fa-vuejs' },
  { id: 'react', name: 'React', icon: 'fa-react' },
  { id: 'nodejs', name: 'Node.js', icon: 'fa-node' },
  { id: 'python', name: 'Python', icon: 'fa-python' },
  { id: 'java', name: 'Java', icon: 'fa-java' },
  { id: 'go', name: 'Go', icon: 'fa-code' },
];

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId;
};
</script>

<style scoped>
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style> 