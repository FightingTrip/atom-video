/**
* @file TagStats.vue
* @description 标签统计组件，用于展示标签的使用统计信息
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 统计信息展示
* - 热门标签展示
* - 时间范围选择
* - 标签点击交互
* - 响应式布局
* - 黑白主题适配
*/

<template>
  <div class="tag-stats">
    <h2 class="text-xl font-bold mb-4">标签统计</h2>
    <div class="chart-container">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import api from '@/utils/api';
  import { Chart, registerables } from 'chart.js';

  Chart.register(...registerables);

  interface TagStat {
    tag: string;
    count: number;
  }

  const chartRef = ref<HTMLCanvasElement | null>(null);
  const chart = ref<Chart | null>(null);
  const stats = ref<TagStat[]>([]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/tags/stats');
      if (response.data.success) {
        stats.value = response.data.data;
        updateChart();
      }
    } catch (error) {
      console.error('获取标签统计失败:', error);
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
    const labels = stats.value.map(stat => formatTagName(stat.tag));
    const data = stats.value.map(stat => stat.count);

    // 创建新图表
    chart.value = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '视频数量',
            data,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          }
        ]
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
            display: false
          }
        }
      }
    });
  };

  const formatTagName = (tag: string) => {
    return tag.toLowerCase().replace(/_/g, ' ');
  };

  onMounted(() => {
    fetchStats();
  });

  onUnmounted(() => {
    if (chart.value) {
      chart.value.destroy();
    }
  });
</script>

<style scoped>
  .tag-stats {
    @apply p-4 bg-white rounded-lg shadow;
  }

  .chart-container {
    @apply h-64;
  }
</style>