<template>
  <div class="py-2 border-b dark:border-gray-700">
    <div class="flex items-center h-12 px-4 overflow-x-auto no-scrollbar">
      <button 
        v-for="tag in tags" 
        :key="tag"
        class="px-4 py-1.5 mx-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
        :class="[
          selectedTag === tag
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
        ]"
        @click="selectTag(tag)"
      >
        {{ tag }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVideoStore } from '@/stores/video'

const videoStore = useVideoStore()
const selectedTag = ref('全部')

const tags = [
  '全部',
  'JavaScript',
  'TypeScript',
  'Vue',
  'React',
  'Node.js',
  'Python'
]

const selectTag = (tag: string) => {
  selectedTag.value = tag
  videoStore.setCategory(tag)
}
</script>

<style scoped>
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>