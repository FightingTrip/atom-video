/**
* @file TrendChart.vue
* @description 数据趋势图表组件，用于展示创作者数据趋势
* @author Atom Video Team
* @date 2025-04-15
*/

<template>
  <div class="trend-chart-container">
    <div class="chart-header">
      <div class="chart-title-area">
        <h3 class="chart-title">{{ title }}</h3>
        <p class="chart-subtitle">{{ subTitle }}</p>
      </div>
      <div class="chart-actions">
        <n-select v-model:value="chartType" size="small" :options="chartTypeOptions"
          style="width: 100px; margin-right: 10px" />
        <n-button-group size="small">
          <n-button size="small" :type="isDaily ? 'primary' : 'default'" @click="changeInterval('daily')">
            日
          </n-button>
          <n-button size="small" :type="isWeekly ? 'primary' : 'default'" @click="changeInterval('weekly')">
            周
          </n-button>
          <n-button size="small" :type="isMonthly ? 'primary' : 'default'" @click="changeInterval('monthly')">
            月
          </n-button>
        </n-button-group>
      </div>
    </div>

    <div class="chart-overview">
      <div class="overview-item">
        <div class="overview-value">{{ formatNumber(totalValue) }}</div>
        <div class="overview-label">总计</div>
      </div>
      <div class="overview-item">
        <div class="overview-value">{{ formatNumber(averageValue) }}</div>
        <div class="overview-label">平均值</div>
      </div>
      <div class="overview-item">
        <div class="overview-value" :class="getTrendClass(percentageChange)">
          {{ formatTrend(percentageChange) }}
        </div>
        <div class="overview-label">变化率</div>
      </div>
      <div class="overview-item">
        <div class="overview-value">{{ formatNumber(maxValue) }}</div>
        <div class="overview-label">最高值</div>
      </div>
    </div>

    <div ref="chartContainer" class="chart-container"></div>

    <div v-if="multiLine && chartType === 'line'" class="chart-legend">
      <div v-for="(item, index) in multiLineLegend" :key="index" class="legend-item" @click="toggleSeries(item.key)">
        <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
        <div class="legend-label">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch, nextTick } from 'vue';
  import { NSelect, NButton, NButtonGroup } from 'naive-ui';
  import * as echarts from 'echarts/core';
  import {
    LineChart,
    BarChart,
    PieChart,
    LineSeriesOption,
    BarSeriesOption,
    PieSeriesOption
  } from 'echarts/charts';
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    ToolboxComponent
  } from 'echarts/components';
  import { LabelLayout, UniversalTransition } from 'echarts/features';
  import { CanvasRenderer } from 'echarts/renderers';

  // 注册 ECharts 组件
  echarts.use([
    LineChart,
    BarChart,
    PieChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    ToolboxComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
  ]);

  // 类型定义
  type ChartType = 'line' | 'bar' | 'area';
  type DataInterval = 'daily' | 'weekly' | 'monthly';
  type EChartsOption = echarts.ComposeOption<LineSeriesOption | BarSeriesOption | PieSeriesOption>;

  interface DataItem {
    date: string;
    value: number;
    likes?: number;
    comments?: number;
    shares?: number;
    [key: string]: any;
  }

  const props = defineProps({
    data: {
      type: Array as () => DataItem[],
      default: () => []
    },
    color: {
      type: String,
      default: '#2196F3'
    },
    title: {
      type: String,
      default: '数据趋势'
    },
    subTitle: {
      type: String,
      default: ''
    },
    multiLine: {
      type: Boolean,
      default: false
    }
  });

  const chartContainer = ref<HTMLElement | null>(null);
  const chartInstance = ref<echarts.ECharts | null>(null);
  const chartType = ref<ChartType>('line');
  const interval = ref<DataInterval>('daily');
  const hiddenSeries = ref<string[]>([]);

  const chartTypeOptions = [
    { label: '折线图', value: 'line' },
    { label: '柱状图', value: 'bar' },
    { label: '面积图', value: 'area' }
  ];

  // 计算属性
  const isDaily = computed(() => interval.value === 'daily');
  const isWeekly = computed(() => interval.value === 'weekly');
  const isMonthly = computed(() => interval.value === 'monthly');

  // 处理数据以适应不同的时间间隔
  const processedData = computed(() => {
    if (!props.data || props.data.length === 0) return [];

    const data = [...props.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (interval.value === 'daily') {
      return data;
    } else if (interval.value === 'weekly') {
      // 按周分组
      const weeks: { [key: string]: DataItem[] } = {};
      data.forEach(item => {
        const date = new Date(item.date);
        const year = date.getFullYear();
        const weekNumber = getWeekNumber(date);
        const weekKey = `${year}-W${weekNumber}`;

        if (!weeks[weekKey]) {
          weeks[weekKey] = [];
        }
        weeks[weekKey].push(item);
      });

      // 计算每周的总和
      return Object.keys(weeks).map(weekKey => {
        const weekItems = weeks[weekKey];
        const weekData: DataItem = {
          date: weekKey,
          value: weekItems.reduce((sum, item) => sum + item.value, 0)
        };

        // 处理多线数据
        if (props.multiLine) {
          weekData.likes = weekItems.reduce((sum, item) => sum + (item.likes || 0), 0);
          weekData.comments = weekItems.reduce((sum, item) => sum + (item.comments || 0), 0);
          weekData.shares = weekItems.reduce((sum, item) => sum + (item.shares || 0), 0);
        }

        return weekData;
      });
    } else if (interval.value === 'monthly') {
      // 按月分组
      const months: { [key: string]: DataItem[] } = {};
      data.forEach(item => {
        const date = new Date(item.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const monthKey = `${year}-${month.toString().padStart(2, '0')}`;

        if (!months[monthKey]) {
          months[monthKey] = [];
        }
        months[monthKey].push(item);
      });

      // 计算每月的总和
      return Object.keys(months).map(monthKey => {
        const monthItems = months[monthKey];
        const monthData: DataItem = {
          date: monthKey,
          value: monthItems.reduce((sum, item) => sum + item.value, 0)
        };

        // 处理多线数据
        if (props.multiLine) {
          monthData.likes = monthItems.reduce((sum, item) => sum + (item.likes || 0), 0);
          monthData.comments = monthItems.reduce((sum, item) => sum + (item.comments || 0), 0);
          monthData.shares = monthItems.reduce((sum, item) => sum + (item.shares || 0), 0);
        }

        return monthData;
      });
    }

    return data;
  });

  // 统计指标计算
  const totalValue = computed(() => {
    return processedData.value.reduce((sum, item) => sum + item.value, 0);
  });

  const averageValue = computed(() => {
    if (processedData.value.length === 0) return 0;
    return totalValue.value / processedData.value.length;
  });

  const maxValue = computed(() => {
    if (processedData.value.length === 0) return 0;
    return Math.max(...processedData.value.map(item => item.value));
  });

  const percentageChange = computed(() => {
    if (processedData.value.length < 2) return 0;

    const firstHalf = processedData.value.slice(0, Math.floor(processedData.value.length / 2));
    const secondHalf = processedData.value.slice(Math.floor(processedData.value.length / 2));

    const firstHalfSum = firstHalf.reduce((sum, item) => sum + item.value, 0);
    const secondHalfSum = secondHalf.reduce((sum, item) => sum + item.value, 0);

    if (firstHalfSum === 0) return secondHalfSum > 0 ? 100 : 0;

    return ((secondHalfSum - firstHalfSum) / firstHalfSum) * 100;
  });

  // 多线图的图例
  const multiLineLegend = computed(() => {
    if (!props.multiLine) return [];

    return [
      { key: 'likes', label: '点赞', color: '#E91E63' },
      { key: 'comments', label: '评论', color: '#9C27B0' },
      { key: 'shares', label: '分享', color: '#795548' }
    ];
  });

  // 初始化图表
  const initChart = () => {
    if (!chartContainer.value) return;

    // 如果已有图表实例，先销毁
    if (chartInstance.value) {
      chartInstance.value.dispose();
    }

    // 创建图表实例
    chartInstance.value = echarts.init(chartContainer.value);
    updateChart();

    // 窗口大小变化时，重新调整图表大小
    window.addEventListener('resize', handleResize);
  };

  // 更新图表数据和配置
  const updateChart = () => {
    if (!chartInstance.value) return;

    const option: EChartsOption = {
      color: [props.color, '#E91E63', '#9C27B0', '#795548'],
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          if (!Array.isArray(params)) return '';

          let result = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].name}</div>`;

          params.forEach((param: any) => {
            if (hiddenSeries.value.includes(param.seriesName)) return;

            result += `<div style="display: flex; align-items: center; margin: 3px 0;">
            <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 5px;"></span>
            <span style="margin-right: 5px;">${param.seriesName}:</span>
            <span style="font-weight: bold;">${formatNumber(param.value)}</span>
          </div>`;
          });

          return result;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: chartType.value !== 'line',
        data: processedData.value.map(item => formatDate(item.date)),
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)'
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      },
      series: getSeries()
    };

    chartInstance.value.setOption(option);
  };

  // 获取图表系列配置
  const getSeries = () => {
    if (props.multiLine && chartType.value !== 'bar') {
      // 多线图表
      const series = [];

      // 主线
      series.push({
        name: '总数',
        type: chartType.value === 'area' ? 'line' : chartType.value,
        data: processedData.value.map(item => item.value),
        areaStyle: chartType.value === 'area' ? {
          opacity: 0.3
        } : undefined,
        smooth: true,
        showSymbol: false,
        emphasis: {
          focus: 'series'
        }
      });

      // 点赞线
      if (!hiddenSeries.value.includes('likes')) {
        series.push({
          name: '点赞',
          type: chartType.value === 'area' ? 'line' : chartType.value,
          data: processedData.value.map(item => item.likes || 0),
          areaStyle: chartType.value === 'area' ? {
            opacity: 0.3
          } : undefined,
          smooth: true,
          showSymbol: false,
          emphasis: {
            focus: 'series'
          }
        });
      }

      // 评论线
      if (!hiddenSeries.value.includes('comments')) {
        series.push({
          name: '评论',
          type: chartType.value === 'area' ? 'line' : chartType.value,
          data: processedData.value.map(item => item.comments || 0),
          areaStyle: chartType.value === 'area' ? {
            opacity: 0.3
          } : undefined,
          smooth: true,
          showSymbol: false,
          emphasis: {
            focus: 'series'
          }
        });
      }

      // 分享线
      if (!hiddenSeries.value.includes('shares')) {
        series.push({
          name: '分享',
          type: chartType.value === 'area' ? 'line' : chartType.value,
          data: processedData.value.map(item => item.shares || 0),
          areaStyle: chartType.value === 'area' ? {
            opacity: 0.3
          } : undefined,
          smooth: true,
          showSymbol: false,
          emphasis: {
            focus: 'series'
          }
        });
      }

      return series;
    } else {
      // 单线图表
      return [{
        type: chartType.value === 'area' ? 'line' : chartType.value,
        data: processedData.value.map(item => item.value),
        areaStyle: chartType.value === 'area' ? {
          opacity: 0.3
        } : undefined,
        smooth: true,
        showSymbol: false,
        emphasis: {
          focus: 'series'
        }
      }];
    }
  };

  // 处理窗口大小变化
  const handleResize = () => {
    chartInstance.value?.resize();
  };

  // 切换时间间隔
  const changeInterval = (newInterval: DataInterval) => {
    interval.value = newInterval;
  };

  // 切换隐藏/显示某个系列
  const toggleSeries = (seriesKey: string) => {
    const index = hiddenSeries.value.indexOf(seriesKey);
    if (index !== -1) {
      hiddenSeries.value.splice(index, 1);
    } else {
      hiddenSeries.value.push(seriesKey);
    }
  };

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // 格式化趋势
  const formatTrend = (trend: number) => {
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  // 获取趋势样式类
  const getTrendClass = (trend: number) => {
    if (trend > 0) return 'trend-up';
    if (trend < 0) return 'trend-down';
    return 'trend-neutral';
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    // 根据时间间隔格式化日期
    if (interval.value === 'daily') {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    } else if (interval.value === 'weekly') {
      // 周格式: 2023-W1 -> 第1周
      if (dateStr.includes('W')) {
        const [year, week] = dateStr.split('-W');
        return `${year}年第${week}周`;
      }
      return dateStr;
    } else if (interval.value === 'monthly') {
      // 月格式: 2023-01 -> 1月
      const [year, month] = dateStr.split('-');
      return `${year}年${parseInt(month)}月`;
    }

    return dateStr;
  };

  // 获取周数
  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  // 监听数据和图表类型变化，更新图表
  watch([() => props.data, chartType, processedData, hiddenSeries], () => {
    nextTick(() => {
      updateChart();
    });
  });

  // 组件挂载时初始化图表
  onMounted(() => {
    nextTick(() => {
      initChart();
    });
  });

  // 组件卸载时清理
  onBeforeUnmount(() => {
    if (chartInstance.value) {
      chartInstance.value.dispose();
    }
    window.removeEventListener('resize', handleResize);
  });
</script>

<style scoped>
  .trend-chart-container {
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    background-color: var(--card-color, #1a1a1a);
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .chart-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }

  .chart-subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }

  .chart-container {
    width: 100%;
    height: 300px;
    margin: 16px 0;
  }

  .chart-overview {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .overview-item {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 12px 16px;
    min-width: 120px;
    flex: 1;
    margin-right: 12px;
    margin-bottom: 12px;
  }

  .overview-item:last-child {
    margin-right: 0;
  }

  .overview-value {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .overview-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }

  .trend-up {
    color: #4caf50;
  }

  .trend-down {
    color: #f44336;
  }

  .trend-neutral {
    color: #9e9e9e;
  }

  .chart-legend {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin: 0 12px 8px 0;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .legend-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-right: 6px;
  }

  .legend-label {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .chart-overview {
      flex-direction: column;
    }

    .overview-item {
      margin-right: 0;
      margin-bottom: 8px;
    }
  }

  @media (max-width: 480px) {
    .chart-header {
      flex-direction: column;
    }

    .chart-actions {
      margin-top: 12px;
      width: 100%;
      justify-content: flex-start;
    }
  }
</style>