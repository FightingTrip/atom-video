/**
* @file CreatorAnalyticsComponent.vue
* @description 创作者数据分析组件，提供视频性能数据可视化
* @author Atom Video Team
* @date 2025-04-15
*/

<template>
  <div class="analytics-container">
    <div class="analytics-header">
      <h3 class="analytics-title" v-if="title">{{ title }}</h3>
      <div class="analytics-controls">
        <n-space>
          <n-select v-model:value="selectedMetricType" :options="metricTypeOptions" size="small" />
          <n-select v-model:value="timeRange" :options="timeRangeOptions" size="small" />
        </n-space>
      </div>
    </div>

    <div class="analytics-content">
      <n-card class="chart-card">
        <template #header v-if="chartTitle">
          <div class="chart-header">
            <div class="chart-title">{{ chartTitle }}</div>
            <div class="chart-legend">
              <div v-for="metric in selectedMetrics" :key="metric.key" class="legend-item">
                <div class="legend-color" :style="{ backgroundColor: metric.color }"></div>
                <div class="legend-label">{{ metric.label }}</div>
              </div>
            </div>
          </div>
        </template>
        <div class="chart-container">
          <!-- 在实际应用中，这里将使用ECharts或其他图表库来渲染图表 -->
          <div class="chart-placeholder" v-if="loading">
            <n-spin size="medium" />
            <span>加载中...</span>
          </div>
          <div class="chart-placeholder" v-else-if="!hasData">
            <n-empty description="暂无数据" />
          </div>
          <div class="chart-area" v-else>
            <!-- 图表区域 - 使用模拟数据显示 -->
            <div class="chart-overlay">
              <div class="chart-grid">
                <div class="grid-line" v-for="i in 5" :key="i"></div>
              </div>
              <div class="chart-axis">
                <div class="y-axis">
                  <div class="axis-label" v-for="(value, index) in yAxisValues" :key="index">
                    {{ value }}
                  </div>
                </div>
              </div>
            </div>
            <div class="mock-chart">
              <div class="mock-bars">
                <div v-for="(item, index) in mockData" :key="index" class="mock-bar" :style="{
                  height: `${item.value}%`,
                  backgroundColor: item.color,
                  boxShadow: `0 5px 15px ${item.color}50`
                }">
                  <div class="bar-tooltip">{{ item.value }}%</div>
                </div>
              </div>
              <div class="mock-x-axis">
                <div v-for="(item, index) in mockData" :key="index" class="mock-label">
                  {{ item.label }}
                </div>
              </div>
            </div>
            <div class="trend-line"></div>
          </div>
        </div>
      </n-card>

      <div class="metrics-grid">
        <n-card v-for="metric in keyMetrics" :key="metric.key" class="metric-card">
          <div class="metric-value">{{ formatValue(metric.value, metric.format) }}</div>
          <div class="metric-label">{{ metric.label }}</div>
          <div class="metric-trend" :class="getTrendClass(metric.trend)">
            <n-icon size="14" class="trend-icon">
              <component :is="getTrendIcon(metric.trend)"></component>
            </n-icon>
            {{ formatTrend(metric.trend) }}
          </div>
          <div class="sparkline">
            <div v-for="(point, i) in metric.sparkline" :key="i" class="sparkline-point" :style="{
              height: `${point}%`,
              backgroundColor: getTrendColor(metric.trend)
            }"></div>
          </div>
        </n-card>
      </div>

      <n-card title="热门视频" class="popular-videos-card">
        <div class="top-videos-header">
          <div class="top-videos-title">表现最佳的内容</div>
          <n-select v-model:value="videosSortBy" :options="videoSortOptions" size="small" />
        </div>
        <n-data-table :columns="topVideosColumns" :data="topVideos" :pagination="pagination" :bordered="false"
          class="videos-table" />
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, computed, onMounted } from 'vue';
  import { NCard, NSelect, NSpin, NEmpty, NDataTable, NSpace, NProgress, NIcon, NTag, NAvatar } from 'naive-ui';
  import {
    TrendingUpOutline,
    TrendingDownOutline,
    RemoveOutline,
    TimeOutline,
    VideocamOutline,
    EyeOutline,
    ThumbsUpOutline
  } from '@vicons/ionicons5';

  const props = defineProps({
    title: {
      type: String,
      default: '数据分析'
    },
    chartTitle: {
      type: String,
      default: '观看趋势'
    },
    type: {
      type: String,
      default: 'channel', // 'channel' 或 'video'
    },
    videoId: {
      type: String,
      default: ''
    }
  });

  // 数据类型选择
  const selectedMetricType = ref('views');
  const metricTypeOptions = [
    { label: '观看次数', value: 'views' },
    { label: '观看时长', value: 'watchTime' },
    { label: '互动率', value: 'engagement' }
  ];

  // 视频排序选项
  const videosSortBy = ref('views');
  const videoSortOptions = [
    { label: '观看次数', value: 'views' },
    { label: '观看时长', value: 'watchTime' },
    { label: '互动率', value: 'engagement' }
  ];

  // 时间范围选择
  const timeRange = ref('7d');
  const timeRangeOptions = [
    { label: '过去7天', value: '7d' },
    { label: '过去30天', value: '30d' },
    { label: '过去90天', value: '90d' },
    { label: '今年', value: 'year' }
  ];

  // Y轴标签
  const yAxisValues = ['0', '25', '50', '75', '100'];

  // 选中的指标
  const selectedMetrics = ref([
    { key: 'views', label: '观看次数', color: '#58a6ff' },
    { key: 'watchTime', label: '观看时长', color: '#f85149' },
    { key: 'engagement', label: '互动率', color: '#3fb950' }
  ]);

  // 加载状态
  const loading = ref(true);
  const hasData = ref(true);

  // 模拟图表数据
  const mockData = ref([
    { label: '周一', value: 45, color: '#58a6ff' },
    { label: '周二', value: 65, color: '#58a6ff' },
    { label: '周三', value: 40, color: '#58a6ff' },
    { label: '周四', value: 75, color: '#58a6ff' },
    { label: '周五', value: 90, color: '#58a6ff' },
    { label: '周六', value: 60, color: '#58a6ff' },
    { label: '周日', value: 80, color: '#58a6ff' }
  ]);

  // 关键指标
  const keyMetrics = ref([
    {
      key: 'views',
      label: '总观看量',
      value: 12580,
      format: 'number',
      trend: 5.2,
      sparkline: [30, 45, 35, 60, 40, 45, 70]
    },
    {
      key: 'watchTime',
      label: '总观看时长',
      value: 345,
      format: 'hours',
      trend: 2.8,
      sparkline: [40, 35, 40, 45, 55, 50, 60]
    },
    {
      key: 'engagement',
      label: '平均互动率',
      value: 8.5,
      format: 'percent',
      trend: -1.3,
      sparkline: [65, 60, 55, 40, 45, 35, 30]
    },
    {
      key: 'subscribers',
      label: '新增订阅者',
      value: 230,
      format: 'number',
      trend: 12.5,
      sparkline: [25, 30, 35, 40, 55, 65, 80]
    }
  ]);

  // 热门视频
  const topVideos = ref([
    {
      id: '1',
      title: 'Vue 3 完全指南 - 组合式API详解',
      thumbnail: 'https://picsum.photos/id/237/400/225',
      views: 1250,
      watchTime: 125,
      engagement: 9.6,
      publishDate: '2024-06-10T15:30:00Z'
    },
    {
      id: '2',
      title: 'TypeScript 高级类型系统详解',
      thumbnail: 'https://picsum.photos/id/238/400/225',
      views: 980,
      watchTime: 86,
      engagement: 7.8,
      publishDate: '2024-06-08T10:15:00Z'
    },
    {
      id: '3',
      title: 'Pinia 状态管理入门',
      thumbnail: 'https://picsum.photos/id/239/400/225',
      views: 650,
      watchTime: 48,
      engagement: 6.3,
      publishDate: '2024-06-01T08:20:00Z'
    }
  ]);

  // 表格列配置
  const topVideosColumns = [
    {
      title: '视频',
      key: 'title',
      render: (row: any) => {
        return h('div', { class: 'video-cell' }, [
          h('img', {
            src: row.thumbnail,
            class: 'video-thumbnail'
          }),
          h('div', { class: 'video-info' }, [
            h('div', { class: 'video-title' }, row.title),
            h('div', { class: 'video-date' }, [
              h(NIcon, { size: 14 }, { default: () => h(TimeOutline) }),
              ' ' + formatDate(row.publishDate)
            ])
          ])
        ]);
      }
    },
    {
      title: '观看',
      key: 'views',
      width: 120,
      render: (row: any) => {
        return h('div', { class: 'stat-cell' }, [
          h(NIcon, { size: 16, color: '#58a6ff' }, { default: () => h(EyeOutline) }),
          ' ' + formatNumber(row.views)
        ]);
      }
    },
    {
      title: '时长(分钟)',
      key: 'watchTime',
      width: 120,
      render: (row: any) => {
        return h('div', { class: 'stat-cell' }, [
          h(NIcon, { size: 16, color: '#f85149' }, { default: () => h(TimeOutline) }),
          ' ' + row.watchTime
        ]);
      }
    },
    {
      title: '互动率(%)',
      key: 'engagement',
      width: 120,
      render: (row: any) => {
        const color = row.engagement > 8 ? '#3fb950' :
          row.engagement > 5 ? '#f0883e' : '#8b949e';

        return h('div', { class: 'stat-cell' }, [
          h(NIcon, { size: 16, color }, { default: () => h(ThumbsUpOutline) }),
          ' ' + row.engagement
        ]);
      }
    }
  ];

  // 分页设置
  const pagination = {
    pageSize: 5
  };

  // 格式化函数
  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'number':
        return value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value;
      case 'hours':
        return value + ' 小时';
      case 'percent':
        return value + '%';
      default:
        return value;
    }
  };

  const formatTrend = (trend: number) => {
    return trend > 0 ? `+${trend}%` : `${trend}%`;
  };

  const getTrendClass = (trend: number) => {
    return trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? TrendingUpOutline :
      trend < 0 ? TrendingDownOutline : RemoveOutline;
  };

  const getTrendColor = (trend: number) => {
    return trend > 0 ? '#3fb950' :
      trend < 0 ? '#f85149' : '#8b949e';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN');
  };

  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num;
  };

  // 生命周期钩子
  onMounted(() => {
    // 在实际应用中，这里将调用API获取分析数据
    setTimeout(() => {
      loading.value = false;

      // 给柱状图添加动画效果
      const bars = document.querySelectorAll('.mock-bar');
      bars.forEach((bar, index) => {
        setTimeout(() => {
          (bar as HTMLElement).style.height = `${mockData.value[index].value}%`;
        }, 100 * index);
      });

      // 显示指标卡片
      const metricCards = document.querySelectorAll('.metric-card');
      metricCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, 100 * index);
      });
    }, 1000);
  });
</script>

<style scoped>
  .analytics-container {
    width: 100%;
  }

  .analytics-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .analytics-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: #e6edf3;
    position: relative;
    display: inline-block;
  }

  .analytics-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    height: 3px;
    width: 40px;
    background: linear-gradient(90deg, #58a6ff 0%, #388bfd 100%);
    border-radius: 3px;
  }

  .chart-card {
    margin-bottom: 24px;
    background: rgba(22, 27, 34, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chart-title {
    font-weight: 600;
    color: #e6edf3;
  }

  .chart-legend {
    display: flex;
    gap: 16px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .legend-label {
    font-size: 13px;
    color: rgba(230, 237, 243, 0.6);
  }

  .chart-container {
    height: 350px;
    position: relative;
    padding: 20px 10px 0;
  }

  .chart-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: rgba(230, 237, 243, 0.6);
    gap: 16px;
  }

  .chart-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  .chart-grid {
    position: absolute;
    top: 20px;
    left: 40px;
    right: 10px;
    bottom: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .grid-line {
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.05);
  }

  .chart-axis {
    position: absolute;
    top: 20px;
    left: 0;
    bottom: 50px;
  }

  .y-axis {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 10px;
  }

  .axis-label {
    font-size: 11px;
    color: rgba(230, 237, 243, 0.4);
    text-align: right;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }

  .metric-card {
    text-align: center;
    background: rgba(22, 27, 34, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.5s ease;
    opacity: 0;
    transform: translateY(20px);
  }

  .metric-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .metric-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .metric-value {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 6px;
    color: #e6edf3;
    transition: transform 0.3s ease;
  }

  .metric-card:hover .metric-value {
    transform: scale(1.05);
  }

  .metric-label {
    font-size: 14px;
    font-weight: 500;
    color: rgba(230, 237, 243, 0.8);
    margin-bottom: 8px;
  }

  .metric-trend {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .metric-trend.up {
    background-color: rgba(59, 185, 80, 0.15);
    color: #3fb950;
  }

  .metric-trend.down {
    background-color: rgba(248, 81, 73, 0.15);
    color: #f85149;
  }

  .metric-trend.neutral {
    background-color: rgba(139, 148, 158, 0.15);
    color: #8b949e;
  }

  .trend-icon {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 0.7;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0.7;
    }
  }

  .sparkline {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 30px;
    margin-top: auto;
  }

  .sparkline-point {
    flex: 1;
    min-height: 4px;
    border-radius: 2px 2px 0 0;
    transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .popular-videos-card {
    margin-bottom: 24px;
    background: rgba(22, 27, 34, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }

  .top-videos-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .top-videos-title {
    font-size: 16px;
    font-weight: 600;
    color: #e6edf3;
  }

  .videos-table {
    background: transparent;
  }

  .video-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .video-thumbnail {
    width: 80px;
    height: 45px;
    object-fit: cover;
    border-radius: 4px;
  }

  .video-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .video-title {
    font-weight: 500;
    color: #e6edf3;
  }

  .video-date {
    font-size: 12px;
    color: rgba(230, 237, 243, 0.5);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .stat-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
  }

  /* 模拟图表样式 */
  .mock-chart {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px 0 0 40px;
  }

  .mock-bars {
    height: 85%;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    position: relative;
  }

  .mock-bar {
    width: 40px;
    max-width: 10%;
    min-height: 4px;
    border-radius: 6px 6px 0 0;
    transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
    position: relative;
    height: 0;
  }

  .mock-bar:hover {
    transform: scaleY(1.03);
    filter: brightness(1.2);
  }

  .bar-tooltip {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(22, 27, 34, 0.9);
    color: #e6edf3;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    pointer-events: none;
    white-space: nowrap;
  }

  .mock-bar:hover .bar-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px);
  }

  .mock-bar::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  .mock-x-axis {
    height: 15%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding: 10px 0;
  }

  .mock-label {
    font-size: 12px;
    color: rgba(230, 237, 243, 0.5);
  }

  .trend-line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(88, 166, 255, 0), rgba(88, 166, 255, 1), rgba(88, 166, 255, 0));
    opacity: 0.3;
    animation: gradient-shift 3s infinite linear;
  }

  @keyframes gradient-shift {
    0% {
      background-position: 0% 50%;
    }

    100% {
      background-position: 100% 50%;
    }
  }

  @media (max-width: 992px) {
    .metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .chart-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .mock-bar {
      width: 30px;
    }
  }

  @media (max-width: 768px) {
    .analytics-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .mock-bar {
      width: 20px;
    }
  }

  @media (max-width: 600px) {
    .metrics-grid {
      grid-template-columns: 1fr;
    }

    .mock-bar {
      width: 14px;
    }
  }
</style>