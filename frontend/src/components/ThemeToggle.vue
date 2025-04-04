<template>
  <n-tooltip :content="$t(`theme.${isDark ? 'light' : 'dark'}`)" placement="bottom">
    <button class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" @click="toggleTheme">
      <i :class="['fas', isDark ? 'fa-sun' : 'fa-moon', 'text-lg']"></i>
    </button>
  </n-tooltip>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useThemeStore } from '@/stores/theme';

  const themeStore = useThemeStore();
  const isDark = computed(() => themeStore.isDark);

  const toggleTheme = () => {
    themeStore.toggleTheme();
  };
</script>

<style scoped>
  .rotate-[-20deg] {
    transform: rotate(-20deg);
  }
</style>