/**
* @file TrendChartModal.vue
* @description 创作者趋势图表模态框，用于显示详细的趋势数据
*/

<template>
  <n-modal v-model:show="visible" preset="card" :title="title" :style="{ width: '800px', maxWidth: '90vw' }"
    @close="handleClose">
    <div class="trend-chart-container">
      <div class="chart-header">
        <h2 class="chart-title">{{ title }}</h2>
        <p class="chart-subtitle">{{ subtitle }}</p>
        <div class="chart-actions">
          <n-button-group>
            <n-button size="small" :type="period === '7d' ? 'primary' : 'default'" @click="changePeriod('7d')">
              7天
            </n-button>
            <n-button size="small" :type="period === '30d' ? 'primary' : 'default'" @click="changePeriod('30d')">
              30天
            </n-button>
            <n-button size="small" :type="period === '90d' ? 'primary' : 'default'" @click="changePeriod('90d')">
              90天
            </n-button>
          </n-button-group>
          <n-button size="small" style="margin-left: 8px;" @click="downloadChart">
            <template #icon><n-icon><download-outline /></n-icon></template>
            导出图表
          </n-button>
        </div>
      </div>

      <div class="chart-container">
        <n-spin :show="loading" description="加载中...">
          <div ref="chartRef" class="chart" style="height: 350px;"></div>
        </n-spin>
      </div>

      <div class="chart-stats">
        <div class="stat-item">
          <div class="stat-value">{{ formatNumber(calculateTotal()) }}</div>
          <div class="stat-label">总计</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ formatNumber(calculateAverage()) }}</div>
          <div class="stat-label">平均</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" :class="getTrendClass(trend)">{{ formatTrend(trend) }}</div>
          <div class="stat-label">趋势</div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch, nextTick } from 'vue';
  import { NModal, NButton, NButtonGroup, NSpin, NIcon } from 'naive-ui';
  import { DownloadOutline } from '@vicons/ionicons5';
  import * as echarts from 'echarts/core';
  import { LineChart } from 'echarts/charts';
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent
  } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';

  // 注册必要的组件
  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent,
    LineChart,
    CanvasRenderer
  ]);

  const props = defineProps({
    // 是否显示图表
    show: {
      type: Boolean,
      default: false
    },
    // 图表标题
    title: {
      type: String,
      default: '趋势图表'
    },
    // 图表副标题
    subtitle: {
      type: String,
      default: '展示数据变化趋势'
    },
    // 图表数据
    chartData: {
      type: Object,
      default: () => ({
        data: [],
        labels: [],
        trend: 0
      })
    },
    // 图表主题色
    color: {
      type: String,
      default: '#3fb950'
    },
    // 是否为多线图表
    multiLine: {
      type: Boolean,
      default: false
    },
    // 图表类型
    chartType: {
      type: String,
      default: 'content', // content, views, engagement, revenue
    }
  });

  const emit = defineEmits(['update:show', 'periodChange', 'close']);

  const visible = computed({
    get: () => props.show,
    set: (value) => emit('update:show', value)
  });

  const chartRef = ref<HTMLElement | null>(null);
  const chart = ref<echarts.ECharts | null>(null);
  const loading = ref(false);
  const period = ref('30d');
  const trend = computed(() => props.chartData.trend || 0);

  // 格式化数字
  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  };

  // 格式化趋势数据
  const formatTrend = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  // 获取趋势的CSS类
  const getTrendClass = (value: number) => {
    return value > 0 ? 'trend-up' : value < 0 ? 'trend-down' : '';
  };

  // 计算总数
  const calculateTotal = () => {
    if (props.multiLine && Array.isArray(props.chartData.data)) {
      // 多线图表数据格式不同，需要累加每条线的数据
      let total = 0;
      props.chartData.data.forEach(line => {
        if (Array.isArray(line.data)) {
          total += line.data.reduce((sum, val) => sum + val, 0);
        }
      });
      return total;
    } else if (Array.isArray(props.chartData.data)) {
      // 单线图表，直接累加数据
      return props.chartData.data.reduce((sum, val) => sum + val, 0);
    }
    return 0;
  };

  // 计算平均值
  const calculateAverage = () => {
    const total = calculateTotal();
    if (props.multiLine && Array.isArray(props.chartData.data)) {
      let count = 0;
      props.chartData.data.forEach(line => {
        if (Array.isArray(line.data)) {
          count += line.data.length;
        }
      });
      return count > 0 ? total / count : 0;
    } else if (Array.isArray(props.chartData.data)) {
      return props.chartData.data.length > 0 ? total / props.chartData.data.length : 0;
    }
    return 0;
  };

  // 初始化图表
  const initChart = () => {
    if (!chartRef.value) return;

    // 如果已经存在图表实例，先销毁
    if (chart.value) {
      chart.value.dispose();
    }

    // 创建新的图表实例
    chart.value = echarts.init(chartRef.value);

    // 更新图表
    updateChart();
  };

  // 更新图表数据
  const updateChart = () => {
    if (!chart.value) return;

    loading.value = true;

    // 设置图表选项
    const options: any = {
      title: {
        text: props.title,
        subtext: props.subtitle,
        left: 'center',
        textStyle: {
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          const date = params[0].axisValue;
          let result = `<div style="font-weight:bold;margin-bottom:5px;">${date}</div>`;

          params.forEach((item: any) => {
            result += `<div style="margin: 2px 0;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${item.color};margin-right:5px;"></span>
            <span>${item.seriesName}: </span>
            <span style="font-weight:bold;float:right;margin-left:20px;">${formatNumber(item.value)}</span>
          </div>`;
          });

          return result;
        }
      },
      xAxis: {
        type: 'category',
        data: props.chartData.labels || [],
        axisLabel: {
          formatter: (value: string) => {
            // 格式化日期，只显示月和日
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => formatNumber(value)
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '15%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: { title: '保存为图片' },
          dataZoom: { title: '数据缩放' },
          restore: { title: '重置' }
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100
        }
      ],
      series: []
    };

    // 根据数据类型设置不同的颜色
    let colors = [props.color];
    if (props.chartType === 'content') {
      colors = ['#ff7d00'];
    } else if (props.chartType === 'views') {
      colors = ['#00c2ff'];
    } else if (props.chartType === 'engagement') {
      colors = ['#ff2d55', '#5856d6', '#ff9500'];
    } else if (props.chartType === 'revenue') {
      colors = ['#34c759'];
    }

    // 设置颜色
    options.color = colors;

    // 设置系列数据
    if (props.multiLine && Array.isArray(props.chartData.data)) {
      // 多线图表
      options.legend = {
        data: props.chartData.data.map(item => item.name),
        bottom: 0
      };

      options.series = props.chartData.data.map((item, index) => ({
        name: item.name,
        type: 'line',
        data: item.data,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 3
        },
        areaStyle: {
          opacity: 0.1
        }
      }));
    } else {
      // 单线图表
      options.series = [
        {
          name: props.title,
          type: 'line',
          data: props.chartData.data,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 3
          },
          areaStyle: {
            opacity: 0.1
          }
        }
      ];
    }

    // 设置图表选项
    chart.value.setOption(options);

    // 加载完成
    loading.value = false;
  };

  // 切换时间周期
  const changePeriod = (newPeriod: string) => {
    period.value = newPeriod;
    emit('periodChange', newPeriod);
  };

  // 下载图表
  const downloadChart = () => {
    if (!chart.value) return;

    // 获取图表的base64图片
    const dataUrl = chart.value.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    });

    // 创建下载链接
    const link = document.createElement('a');
    link.download = `${props.title}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 处理关闭
  const handleClose = () => {
    emit('close');
  };

  // 监听数据变化，更新图表
  watch(() => props.chartData, () => {
    nextTick(() => {
      updateChart();
    });
  }, { deep: true });

  // 监听显示状态变化
  watch(() => props.show, (newVal) => {
    if (newVal) {
      nextTick(() => {
        initChart();
      });
    }
  });

  // 组件挂载时初始化图表
  onMounted(() => {
    if (props.show) {
      initChart();
    }
  });
</script>

<style scoped>
  .trend-chart-container {
    width: 100%;
  }

  .chart-header {
    margin-bottom: 20px;
  }

  .chart-title {
    font-size: 18px;
    margin: 0 0 4px 0;
  }

  .chart-subtitle {
    font-size: 14px;
    color: var(--text-color-secondary);
    margin: 0 0 16px 0;
  }

  .chart-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
  }

  .chart-container {
    width: 100%;
    margin-bottom: 20px;
  }

  .chart-stats {
    display: flex;
    justify-content: space-around;
    margin-top: 16px;
    padding: 16px;
    border-radius: 8px;
    background-color: var(--card-color);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 14px;
    color: var(--text-color-secondary);
  }

  .trend-up {
    color: var(--success-color, #18a058);
  }

  .trend-down {
    color: var(--error-color, #d03050);
  }
</style>