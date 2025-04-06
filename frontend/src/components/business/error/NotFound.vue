<template>
  <div class="not-found">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <p class="error-message">页面未找到</p>
      <p class="error-description">抱歉，您访问的页面不存在或已被移除</p>
      <n-button type="primary" @click="router.push('/')" class="home-button">
        返回首页
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { NButton } from 'naive-ui';

  const router = useRouter();
</script>

<style scoped>
  .not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: var(--primary-bg);
  }

  .error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    text-align: center;
  }

  .error-code {
    font-size: var(--text-4xl);
    font-weight: 700;
    color: var(--primary-color);
    margin: 0;
  }

  .error-message {
    font-size: var(--text-xl);
    font-weight: 500;
    color: var(--text-primary);
    margin: 0;
  }

  .error-description {
    font-size: var(--text-base);
    color: var(--text-secondary);
    margin: 0;
  }

  .home-button {
    margin-top: var(--spacing-md);
    color: var(--text-inverse);
    background-color: var(--primary-color);
    border: none;
    transition: background-color var(--transition-normal);
  }

  .home-button:hover {
    background-color: var(--primary-color-dark);
  }
</style>