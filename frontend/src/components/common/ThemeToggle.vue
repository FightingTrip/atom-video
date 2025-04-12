<template>
  <div class="theme-toggle">
    <n-tooltip :show-arrow="false">
      <template #trigger>
        <n-button size="small" text circle @click="toggleTheme" class="theme-button">
          <n-icon size="20" class="theme-icon">
            <component :is="isDarkMode ? SunnyOutline : MoonOutline" />
          </n-icon>
        </n-button>
      </template>
      {{ isDarkMode ? '切换到亮色模式' : '切换到暗色模式' }}
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { NButton, NIcon, NTooltip } from 'naive-ui';
  import { SunnyOutline, MoonOutline } from '@vicons/ionicons5';

  const isDarkMode = ref(false);

  // 在组件挂载时检查当前主题
  onMounted(() => {
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    // 检查系统首选颜色方案
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // 如果有保存的主题，使用保存的主题，否则使用系统首选
    isDarkMode.value = savedTheme === 'dark' || (!savedTheme && prefersDark);

    // 应用当前主题
    applyTheme();
  });

  // 切换主题
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    applyTheme();
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
  };

  // 应用主题到DOM
  const applyTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
</script>

<style scoped>
  .theme-toggle {
    margin-left: 8px;
  }

  .theme-button {
    opacity: 0.8;
    transition: all 0.3s ease;
  }

  .theme-button:hover {
    opacity: 1;
    transform: rotate(15deg);
  }

  .theme-icon {
    color: var(--text-primary, rgba(230, 237, 243, 0.9));
  }

  :root:not(.dark) .theme-icon {
    color: var(--text-primary, #24292e);
  }
</style>