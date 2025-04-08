/**
* @file Trending.vue
* @description 热门视频业务组件，展示平台热门内容
* @author Atom Video Team
* @date 2025-04-06
*/

<template>
  <div class="trending-section">
    <div class="section-header">
      <h2 class="section-title">热门趋势</h2>
      <n-button text @click="refreshTrending" class="refresh-button">
        <template #icon>
          <n-icon>
            <RefreshOutline />
          </n-icon>
        </template>
        刷新
      </n-button>
    </div>

    <div class="trending-list">
      <div v-for="(item, index) in trendingItems" :key="item.id" class="trending-item">
        <div class="trending-rank" :class="{ 'top-rank': index < 3 }">{{ index + 1 }}</div>
        <div class="trending-content">
          <div class="trending-info">
            <h3 class="trending-title">{{ item.title }}</h3>
            <p class="trending-stats">
              <span class="stat-item">
                <n-icon>
                  <EyeOutline />
                </n-icon>
                {{ formatNumber(item.views) }}
              </span>
              <span class="stat-item">
                <n-icon>
                  <HeartOutline />
                </n-icon>
                {{ formatNumber(item.likes) }}
              </span>
            </p>
          </div>
          <n-avatar round :size="40" :src="item.author.avatar" class="author-avatar" />
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <n-spin />
    </div>

    <div v-else-if="trendingItems.length === 0" class="empty-state">
      <n-empty description="暂无热门内容" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { NButton, NAvatar, NIcon, NSpin, NEmpty } from 'naive-ui';
  import { RefreshOutline, EyeOutline, HeartOutline } from '@vicons/ionicons5';
  import type { TrendingItem } from '@/types';

  const loading = ref(false);
  const trendingItems = ref<TrendingItem[]>([]);

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toString();
  };

  const fetchTrending = async () => {
    loading.value = true;
    try {
      // TODO: 实现获取热门内容的API调用
      trendingItems.value = [];
    } catch (error) {
      console.error('获取热门内容失败:', error);
    } finally {
      loading.value = false;
    }
  };

  const refreshTrending = () => {
    fetchTrending();
  };

  onMounted(() => {
    fetchTrending();
  });
</script>

<style scoped>
  .trending-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background-color: var(--secondary-bg);
    border-radius: var(--radius-lg);
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .section-title {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .refresh-button {
    color: var(--text-secondary);
    background: none;
    border: none;
    transition: color var(--transition-normal);
  }

  .refresh-button:hover {
    color: var(--text-primary);
  }

  .trending-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .trending-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--primary-bg);
    border-radius: var(--radius-md);
    transition: transform var(--transition-normal);
  }

  .trending-item:hover {
    transform: translateX(var(--spacing-sm));
  }

  .trending-rank {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-secondary);
    width: 24px;
    text-align: center;
  }

  .top-rank {
    color: var(--primary-color);
  }

  .trending-content {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
  }

  .trending-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .trending-title {
    font-size: var(--text-base);
    font-weight: 500;
    color: var(--text-primary);
    margin: 0;
  }

  .trending-stats {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin: 0;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .author-avatar {
    flex-shrink: 0;
  }

  .loading-state {
    display: flex;
    justify-content: center;
    padding: var(--spacing-xl) 0;
  }

  .empty-state {
    padding: var(--spacing-xl) 0;
  }
</style>