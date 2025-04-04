<template>
  <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" @click="toggleTheme"
    :title="isDark ? '切换到浅色模式' : '切换到深色模式'">
    <i class="fas" :class="isDark ? 'fa-sun' : 'fa-moon'"></i>
  </button>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useThemeStore } from '@/stores/theme';

  const themeStore = useThemeStore();
  const isDark = computed(() => themeStore.isDark);
  const toggleTheme = () => themeStore.toggleTheme();
</script>