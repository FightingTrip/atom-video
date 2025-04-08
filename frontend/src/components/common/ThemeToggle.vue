<template>
  <button class="theme-toggle-btn" @click="toggleTheme" :title="isDark ? '切换到亮色模式' : '切换到暗色模式'">
    <div class="icon-container">
      <div v-if="isDark" class="sun-icon">
        <i class="fas fa-sun"></i>
      </div>
      <div v-else class="moon-icon">
        <i class="fas fa-moon"></i>
      </div>
    </div>
  </button>
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
  .theme-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .theme-toggle-btn:hover {
    background-color: rgba(128, 128, 128, 0.1);
  }

  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .sun-icon {
    color: #fbbf24;
  }

  .moon-icon {
    color: #6b7280;
  }

  .dark .theme-toggle-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .dark .moon-icon {
    color: #d1d5db;
  }
</style>