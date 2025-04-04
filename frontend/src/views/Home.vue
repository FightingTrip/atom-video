<template>
  <div class="min-h-screen bg-gray-100">
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">欢迎来到 Atom Video</h1>
      <p class="text-lg text-gray-700">一个现代化的视频分享平台</p>
    </main>
  </div>
</template>

<script setup lang="ts">
  // 组件逻辑
</script>

<style scoped>
  .home {
    @apply min-h-screen bg-gray-50;
  }

  .video-section {
    @apply mb-8;
  }

  .video-grid {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6;
  }

  .pagination {
    @apply flex justify-center gap-2;
  }

  .page-button {
    @apply px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors;
  }

  .page-button.active {
    @apply bg-blue-500 text-white;
  }

  /* 隐藏滚动条但保持功能 */
  .overflow-x-auto {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .overflow-x-auto::-webkit-scrollbar {
    display: none;
  }
</style>
