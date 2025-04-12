/**
* @file CreatorStatsComponent.vue
* @description 创作者数据统计组件，显示频道关键数据指标
* @author Atom Video Team
* @date 2025-04-15
*/

<template>
  <div class="stats-container">
    <div class="stats-header">
      <h3 class="stats-title">{{ title }}</h3>
      <div v-if="showRefresh" class="refresh-button" @click="refreshData">
        <n-button size="small" quaternary circle>
          <template #icon>
            <n-icon>
              <RefreshOutline />
            </n-icon>
          </template>
        </n-button>
      </div>
    </div>

    <div class="stats-cards">
      <n-card v-for="stat in statsData" :key="stat.key" class="stat-card">
        <div class="stat-header">
          <div class="stat-icon" :style="{ backgroundColor: stat.color + '20', color: stat.color }">
            <n-icon>
              <component :is="stat.icon" />
            </n-icon>
          </div>
          <div v-if="stat.trend !== undefined" class="stat-trend" :class="getTrendClass(stat.trend)">
            {{ formatTrend(stat.trend) }}
          </div>
        </div>
        <div class="stat-value">{{ formatNumber(stat.value) }}</div>
        <div class="stat-label">{{ stat.label }}</div>
        <div v-if="stat.subLabel" class="stat-sublabel">{{ stat.subLabel }}</div>

        <div class="stat-progress" v-if="stat.progress !== undefined">
          <div class="progress-bar" :style="{ width: stat.progress + '%', backgroundColor: stat.color }"></div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { NCard, NIcon, NButton } from 'naive-ui';
  import {
    EyeOutline,
    PeopleOutline,
    ThumbsUpOutline,
    ChatbubbleOutline,
    TimeOutline,
    VideocamOutline,
    RefreshOutline
  } from '@vicons/ionicons5';

  const props = defineProps({
    title: {
      type: String,
      default: '频道统计'
    },
    showRefresh: {
      type: Boolean,
      default: true
    }
  });

  // 统计数据
  const statsData = ref([
    {
      key: 'views',
      label: '总观看量',
      value: 12580,
      trend: 5.2,
      icon: EyeOutline,
      color: '#58a6ff',
      progress: 75
    },
    {
      key: 'subscribers',
      label: '订阅者',
      value: 835,
      trend: 2.8,
      icon: PeopleOutline,
      color: '#3fb950',
      progress: 60
    },
    {
      key: 'likes',
      label: '获赞数',
      value: 3248,
      trend: 8.7,
      icon: ThumbsUpOutline,
      color: '#f78166',
      progress: 85
    },
    {
      key: 'comments',
      label: '评论数',
      value: 947,
      trend: 3.5,
      icon: ChatbubbleOutline,
      color: '#a371f7',
      progress: 45
    },
    {
      key: 'watchTime',
      label: '观看时长',
      value: 4235,
      subLabel: '分钟',
      trend: 7.2,
      icon: TimeOutline,
      color: '#e3b341',
      progress: 70
    },
    {
      key: 'videos',
      label: '视频数',
      value: 24,
      subLabel: '3个最近上传',
      icon: VideocamOutline,
      color: '#79c0ff',
      progress: 30
    }
  ]);

  // 格式化数字，超过1000显示为k
  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
  };

  // 格式化趋势
  const formatTrend = (trend: number) => {
    return trend > 0 ? `+${trend}%` : `${trend}%`;
  };

  // 获取趋势样式类
  const getTrendClass = (trend: number) => {
    return trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  };

  // 刷新数据
  const refreshData = () => {
    // 实际应用中会调用API获取最新数据
    console.log('刷新数据...');

    // 添加刷新动画效果
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card) => {
      card.classList.add('refreshing');
      setTimeout(() => {
        card.classList.remove('refreshing');
      }, 1000);
    });
  };

  // 组件挂载时获取数据
  onMounted(() => {
    // 实际应用中会调用API获取统计数据

    // 添加进入动画
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, 100 * index);
    });
  });
</script>

<style scoped>
  .stats-container {
    width: 100%;
  }

  .stats-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .stats-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary, #e6edf3);
    position: relative;
    display: inline-block;
  }

  .stats-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    height: 3px;
    width: 40px;
    background: linear-gradient(90deg, var(--primary-color, #58a6ff) 0%, var(--primary-color-light, #388bfd) 100%);
    border-radius: 3px;
  }

  .refresh-button {
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .refresh-button:hover {
    transform: rotate(30deg);
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .stat-card {
    text-align: center;
    position: relative;
    background: var(--bg-secondary, rgba(22, 27, 34, 0.6));
    border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 20px;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.3s ease,
      opacity 0.5s ease,
      background-color 0.3s ease;
    opacity: 0;
    transform: translateY(20px);
    overflow: hidden;
  }

  .stat-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    background: var(--bg-card-hover, rgba(36, 41, 47, 0.7));
  }

  .stat-card.refreshing {
    animation: pulse 1s ease;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-image: linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%);
    backdrop-filter: blur(4px);
    transition: transform 0.2s ease;
  }

  .stat-card:hover .stat-icon {
    transform: scale(1.1);
  }

  .stat-trend {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 6px;
    display: inline-block;
    font-weight: 600;
    background-image: linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%);
    backdrop-filter: blur(4px);
  }

  .stat-trend.up {
    background-color: rgba(59, 185, 80, 0.15);
    color: #3fb950;
  }

  .stat-trend.down {
    background-color: rgba(248, 81, 73, 0.15);
    color: #f85149;
  }

  .stat-trend.neutral {
    background-color: rgba(139, 148, 158, 0.15);
    color: #8b949e;
  }

  .stat-value {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 6px;
    color: #e6edf3;
    background: linear-gradient(90deg, #e6edf3 0%, #c9d1d9 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: transform 0.3s ease;
  }

  .stat-card:hover .stat-value {
    transform: scale(1.05);
  }

  .stat-label {
    font-size: 14px;
    font-weight: 500;
    color: rgba(230, 237, 243, 0.8);
    margin-bottom: 4px;
  }

  .stat-sublabel {
    font-size: 13px;
    color: rgba(230, 237, 243, 0.5);
    margin-top: 4px;
  }

  .stat-progress {
    height: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    margin-top: 16px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    border-radius: 2px;
    transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* 响应式调整 */
  @media (max-width: 1200px) {
    .stats-cards {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 992px) {
    .stats-cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .stats-cards {
      grid-template-columns: 1fr;
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }

    .stat-value {
      font-size: 28px;
    }
  }

  /* 浅色模式样式覆盖 */
  :root:not(.dark) .stats-title {
    color: var(--text-primary, #24292e);
  }

  :root:not(.dark) .stat-card {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  :root:not(.dark) .stat-card:hover {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  :root:not(.dark) .stat-label,
  :root:not(.dark) .stat-value {
    color: var(--text-primary, #24292e);
  }

  :root:not(.dark) .stat-sublabel {
    color: var(--text-secondary, rgba(36, 41, 46, 0.7));
  }

  :root:not(.dark) .sidebar-divider {
    background-color: rgba(0, 0, 0, 0.08);
  }
</style>