<template>
  <div class="video-card-skeleton">
    <div class="aspect-video relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse">
    </div>
    <div class="mt-3 flex">
      <div class="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse mr-3">
      </div>
      <div class="flex-1">
        <div class="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded w-1/2"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    layout: {
      type: String,
      default: 'grid'
    }
  });
</script>