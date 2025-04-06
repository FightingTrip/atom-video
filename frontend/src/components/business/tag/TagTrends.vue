/**
* @file TagTrends.vue
* @description 标签趋势组件，用于展示标签的使用趋势
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 趋势数据展示
* - 趋势图标显示
* - 趋势排序功能
* - 标签点击交互
* - 响应式布局
* - 黑白主题适配
*/

<template>
  <div class="tag-trends">
    <h2 class="text-xl font-bold mb-4">标签趋势</h2>
    <div class="chart-container">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import api from '@/utils/api';
  import { Chart, registerables } from 'chart.js';
  import { TechTag } from '@/types/tags';

  Chart.register(...registerables);

  interface TagTrend {
    tag: TechTag;
    counts: {
      date: string;
      count: number;
    }[];
  }

  const chartRef = ref<HTMLCanvasElement | null>(null);
  const chart = ref<Chart | null>(null);
  const trends = ref<TagTrend[]>([]);

  const fetchTrends = async () => {
    try {
      const response = await api.get('/api/tags/trends');
      if (response.data.success) {
        trends.value = response.data.data;
        updateChart();
      }
    } catch (error) {
      console.error('获取标签趋势失败:', error);
    }
  };

  const updateChart = () => {
    if (!chartRef.value) return;

    // 销毁现有图表
    if (chart.value) {
      chart.value.destroy();
    }

    const ctx = chartRef.value.getContext('2d');
    if (!ctx) return;

    // 准备数据
    const labels = trends.value[0]?.counts.map(item => item.date) || [];
    const datasets = trends.value.map(trend => ({
      label: formatTagName(trend.tag),
      data: trend.counts.map(item => item.count),
      borderColor: getRandomColor(),
      tension: 0.1
    }));

    // 创建新图表
    chart.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  };

  const formatTagName = (tag: string) => {
    return tag.toLowerCase().replace(/_/g, ' ');
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
  };

  onMounted(() => {
    fetchTrends();
  });

  onUnmounted(() => {
    if (chart.value) {
      chart.value.destroy();
    }
  });
</script>

<style scoped>
  .tag-trends {
    padding: var(--spacing-md);
    background-color: var(--primary-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }

  .chart-container {
    height: 16rem;
  }
</style>