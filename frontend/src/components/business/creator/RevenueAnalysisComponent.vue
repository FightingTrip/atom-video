/**
* @file RevenueAnalysisComponent.vue
* @description 创作者收入分析组件，提供收入数据可视化和分析
* @author Atom Video Team
* @date 2025-04-20
*/

<template>
  <div class="revenue-analysis-container">
    <div class="revenue-header">
      <h3 class="revenue-title">收入分析</h3>
      <div class="revenue-actions">
        <n-radio-group v-model:value="timePeriod" size="small">
          <n-radio-button value="week">周</n-radio-button>
          <n-radio-button value="month">月</n-radio-button>
          <n-radio-button value="year">年</n-radio-button>
        </n-radio-group>
        <n-button type="primary" size="small" @click="exportRevenueData">
          <template #icon>
            <n-icon>
              <download-outline />
            </n-icon>
          </template>
          导出数据
        </n-button>
      </div>
    </div>

    <n-card class="chart-card">
      <div class="chart-container" :class="{ 'loading': loading }">
        <div v-if="loading" class="chart-loading">
          <n-spin size="large" />
        </div>
        <div v-else ref="chartRef" class="chart-wrapper"></div>
      </div>

      <div class="revenue-summary">
        <div class="summary-item total-revenue">
          <div class="summary-value">¥{{ formatNumber(totalRevenue) }}</div>
          <div class="summary-label">{{ timeRangeLabel }}总收入</div>
        </div>

        <div class="summary-item average-revenue">
          <div class="summary-value">¥{{ formatNumber(averageRevenue) }}</div>
          <div class="summary-label">平均{{ averageLabel }}</div>
        </div>

        <div class="summary-item highest-revenue">
          <div class="summary-value">¥{{ formatNumber(highestRevenue.value) }}</div>
          <div class="summary-label">最高收入 ({{ highestRevenue.label }})</div>
        </div>

        <div class="summary-item revenue-trend">
          <div class="summary-value" :class="trendClass">{{ trendIndicator }} {{ Math.abs(revenueTrend) }}%</div>
          <div class="summary-label">相比上{{ timePeriod === 'week' ? '周' : timePeriod === 'month' ? '月' : '年' }}</div>
        </div>
      </div>
    </n-card>

    <div class="revenue-details">
      <n-card title="收入来源分析" class="revenue-sources-card">
        <div class="sources-chart" ref="sourcesChartRef"></div>
      </n-card>

      <n-card title="收入预测" class="revenue-forecast-card">
        <div class="forecast-chart" ref="forecastChartRef"></div>
      </n-card>
    </div>

    <n-card title="详细收入记录" class="revenue-records-card">
      <n-data-table :columns="recordColumns" :data="revenueRecords" :loading="loading" :pagination="pagination"
        @update:page="handlePageChange" />
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted, watch } from 'vue';
  import {
    NCard,
    NButton,
    NRadioGroup,
    NRadioButton,
    NIcon,
    NSpin,
    NDataTable,
  } from 'naive-ui';
  import type { DataTableColumns } from 'naive-ui';
  import * as echarts from 'echarts/core';
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
  } from 'echarts/components';
  import { BarChart, LineChart, PieChart } from 'echarts/charts';
  import { CanvasRenderer } from 'echarts/renderers';
  import creatorService from '@/services/creator/creatorService';
  import { DownloadOutline } from '@vicons/ionicons5';

  // 注册echarts组件
  echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    BarChart,
    LineChart,
    PieChart,
    CanvasRenderer,
  ]);

  // 状态变量
  const loading = ref(false);
  const timePeriod = ref<'week' | 'month' | 'year'>('month');
  const chartRef = ref<HTMLDivElement | null>(null);
  const sourcesChartRef = ref<HTMLDivElement | null>(null);
  const forecastChartRef = ref<HTMLDivElement | null>(null);
  const chart = ref<echarts.ECharts | null>(null);
  const sourcesChart = ref<echarts.ECharts | null>(null);
  const forecastChart = ref<echarts.ECharts | null>(null);

  // 收入数据
  const revenueData = ref<{
    labels: string[];
    data: number[];
    total: number;
  }>({
    labels: [],
    data: [],
    total: 0,
  });

  // 收入记录分页
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
  });

  // 收入记录数据
  const revenueRecords = ref<{
    id: string;
    date: string;
    source: string;
    description: string;
    amount: number;
  }[]>([]);

  // 收入记录表格列定义
  const recordColumns = [{
    title: '日期',
    key: 'date',
  }, {
    title: '来源',
    key: 'source',
  }, {
    title: '描述',
    key: 'description',
  }, {
    title: '金额',
    key: 'amount',
    render: (row: any) => `¥${formatNumber(row.amount)}`,
  }] as DataTableColumns;

  // 计算属性
  const totalRevenue = computed(() => revenueData.value.total);

  const averageRevenue = computed(() => {
    if (revenueData.value.data.length === 0) return 0;
    return revenueData.value.total / revenueData.value.data.length;
  });

  const averageLabel = computed(() => {
    if (timePeriod.value === 'week') return '日收入';
    if (timePeriod.value === 'month') return '周收入';
    return '月收入';
  });

  const highestRevenue = computed(() => {
    if (revenueData.value.data.length === 0) return { value: 0, label: '' };
    const maxValue = Math.max(...revenueData.value.data);
    const maxIndex = revenueData.value.data.indexOf(maxValue);
    return {
      value: maxValue,
      label: revenueData.value.labels[maxIndex],
    };
  });

  const revenueTrend = computed(() => {
    // 模拟趋势，实际应用中应该从API获取
    return faker.number.float({ min: -20, max: 40, fractionDigits: 1 });
  });

  const trendClass = computed(() => {
    return revenueTrend.value > 0 ? 'positive' : revenueTrend.value < 0 ? 'negative' : '';
  });

  const trendIndicator = computed(() => {
    return revenueTrend.value > 0 ? '+' : '';
  });

  const timeRangeLabel = computed(() => {
    if (timePeriod.value === 'week') return '本周';
    if (timePeriod.value === 'month') return '本月';
    return '今年';
  });

  // 加载收入数据
  const loadRevenueData = async () => {
    loading.value = true;
    try {
      const data = await creatorService.getRevenueData(timePeriod.value);
      revenueData.value = data;
      generateMockRecords();
      renderRevenueChart();
      renderSourcesChart();
      renderForecastChart();
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
    } finally {
      loading.value = false;
    }
  };

  // 生成模拟收入记录
  const generateMockRecords = () => {
    const sources = ['广告分成', '会员订阅', '打赏收入', '商品销售', '合作推广'];
    const descriptions = {
      '广告分成': ['视频广告收入', '前贴片广告收入', '中插广告收入', 'Banner广告收入'],
      '会员订阅': ['月度会员分成', '年度会员分成', '会员专属内容收入'],
      '打赏收入': ['视频打赏', '直播打赏', '评论区打赏'],
      '商品销售': ['周边商品销售', '数字商品销售', '教程销售'],
      '合作推广': ['品牌合作推广', '商品联盟佣金', '推广链接佣金'],
    };

    // 根据当前时间周期生成相应的日期
    const dates: string[] = [];
    const now = new Date();
    if (timePeriod.value === 'week') {
      // 生成过去7天的日期
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
    } else if (timePeriod.value === 'month') {
      // 生成过去30天的日期
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
    } else {
      // 生成今年每月的日期
      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), i, 15);
        dates.push(date.toISOString().split('T')[0].substring(0, 7));
      }
    }

    // 生成收入记录
    const records = [];
    for (let i = 0; i < 100; i++) {
      const source = faker.helpers.arrayElement(sources);
      const description = faker.helpers.arrayElement(descriptions[source as keyof typeof descriptions]);
      const date = faker.helpers.arrayElement(dates);

      records.push({
        id: `rev-${i}`,
        date,
        source,
        description,
        amount: faker.number.int({ min: 10, max: 5000 }),
      });
    }

    // 按日期排序
    records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    revenueRecords.value = records;
    pagination.itemCount = records.length;
  };

  // 渲染收入图表
  const renderRevenueChart = () => {
    if (!chartRef.value) return;

    if (chart.value) {
      chart.value.dispose();
    }

    chart.value = echarts.init(chartRef.value);

    const option = {
      backgroundColor: 'transparent',
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '8%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: function (params: any) {
          return `${params[0].axisValue}<br/>${params[0].marker}收入: ¥${formatNumber(params[0].value)}`;
        },
      },
      xAxis: {
        type: 'category',
        data: revenueData.value.labels,
        axisLabel: {
          interval: 0,
          rotate: revenueData.value.labels.length > 7 ? 30 : 0,
        },
      },
      yAxis: {
        type: 'value',
        name: '收入 (元)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: (value: number) => `¥${formatNumber(value)}`,
        },
      },
      series: [
        {
          name: '收入',
          type: 'bar',
          data: revenueData.value.data,
          barWidth: '60%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#36CFFF' },
              { offset: 1, color: '#3B7CFF' },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#5EDBFF' },
                { offset: 1, color: '#598FFF' },
              ]),
            },
          },
        },
      ],
    };

    chart.value.setOption(option);
  };

  // 渲染收入来源图表
  const renderSourcesChart = () => {
    if (!sourcesChartRef.value) return;

    if (sourcesChart.value) {
      sourcesChart.value.dispose();
    }

    sourcesChart.value = echarts.init(sourcesChartRef.value);

    // 模拟数据
    const sourcesData = [
      { value: 5348, name: '广告分成' },
      { value: 2436, name: '会员订阅' },
      { value: 1852, name: '打赏收入' },
      { value: 943, name: '商品销售' },
      { value: 1286, name: '合作推广' },
    ];

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ¥{c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        textStyle: {
          fontSize: 12,
        },
      },
      series: [
        {
          name: '收入来源',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: sourcesData,
        },
      ],
    };

    sourcesChart.value.setOption(option);
  };

  // 渲染收入预测图表
  const renderForecastChart = () => {
    if (!forecastChartRef.value) return;

    if (forecastChart.value) {
      forecastChart.value.dispose();
    }

    forecastChart.value = echarts.init(forecastChartRef.value);

    // 根据当前收入数据生成预测数据
    const historicalData = [...revenueData.value.data];
    const forecastData = [];

    // 计算平均增长率
    let avgGrowth = 0;
    for (let i = 1; i < historicalData.length; i++) {
      if (historicalData[i - 1] > 0) {
        avgGrowth += (historicalData[i] - historicalData[i - 1]) / historicalData[i - 1];
      }
    }
    avgGrowth = avgGrowth / (historicalData.length - 1);

    // 生成预测数据
    const lastValue = historicalData[historicalData.length - 1];
    for (let i = 0; i < 6; i++) {
      let nextValue = lastValue * (1 + avgGrowth) * (1 + (Math.random() * 0.2 - 0.1));
      forecastData.push(Math.round(nextValue));
    }

    // 根据当前时间周期生成未来标签
    const futureLabels = [];
    const currentLabels = [...revenueData.value.labels];
    const lastLabel = currentLabels[currentLabels.length - 1];

    if (timePeriod.value === 'week') {
      // 未来6天
      const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      const lastIndex = weekdays.indexOf(lastLabel);
      for (let i = 1; i <= 6; i++) {
        const index = (lastIndex + i) % 7;
        futureLabels.push(weekdays[index]);
      }
    } else if (timePeriod.value === 'month') {
      // 未来6周
      const lastIndex = parseInt(lastLabel.replace('第', '').replace('周', ''));
      for (let i = 1; i <= 6; i++) {
        futureLabels.push(`第${lastIndex + i}周`);
      }
    } else {
      // 未来6个月
      const months = [
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
      ];
      const lastIndex = months.indexOf(lastLabel);
      for (let i = 1; i <= 6; i++) {
        const index = (lastIndex + i) % 12;
        futureLabels.push(`${months[index]}'${new Date().getFullYear() + Math.floor((lastIndex + i) / 12)}`);
      }
    }

    // 准备图表数据
    const allLabels = [...currentLabels, ...futureLabels];
    const allData = [...historicalData, ...forecastData];

    // 创建图表配置
    const option = {
      backgroundColor: 'transparent',
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '8%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
        formatter: function (params: any) {
          const isHistory = params[0].dataIndex < historicalData.length;
          return `${params[0].axisValue}<br/>${params[0].marker}${isHistory ? '实际' : '预测'}收入: ¥${formatNumber(params[0].value)}`;
        },
      },
      xAxis: {
        type: 'category',
        data: allLabels,
        axisLabel: {
          interval: 'auto',
          rotate: allLabels.length > 10 ? 30 : 0,
        },
        axisPointer: {
          label: {
            formatter: function (params: any) {
              return allLabels[params.value];
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '收入 (元)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: (value: number) => `¥${formatNumber(value)}`,
        },
      },
      series: [
        {
          name: '收入趋势',
          type: 'line',
          smooth: true,
          data: allData.map((value, index) => ({
            value,
            // 标记历史数据与预测数据
            itemStyle: {
              color: index < historicalData.length ? '#3B7CFF' : '#FF9800',
            },
          })),
          lineStyle: {
            width: 3,
          },
          areaStyle: {
            opacity: 0.2,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(59, 124, 255, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(59, 124, 255, 0.1)',
              },
            ]),
          },
          markLine: {
            silent: true,
            lineStyle: {
              color: '#FF9800',
              type: 'dashed',
            },
            data: [
              {
                xAxis: historicalData.length - 1,
                label: {
                  formatter: '预测',
                  position: 'start',
                },
              },
            ],
          },
        },
      ],
    };

    forecastChart.value.setOption(option);
  };

  // 页面变化处理
  const handlePageChange = (page: number) => {
    pagination.page = page;
  };

  // 导出收入数据
  const exportRevenueData = () => {
    const timeLabel = timePeriod.value === 'week' ? '周度' : timePeriod.value === 'month' ? '月度' : '年度';
    const filename = `${timeLabel}收入数据_${new Date().toISOString().split('T')[0]}.csv`;

    let csvContent = '时间,收入(元)\n';
    revenueData.value.labels.forEach((label, index) => {
      csvContent += `${label},${revenueData.value.data[index]}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 格式化数字
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('zh-CN').format(num);
  };

  // 导入faker库用于生成随机数据
  import { faker } from '@faker-js/faker';

  // 监听时间周期变化
  watch(timePeriod, () => {
    loadRevenueData();
  });

  // 监听窗口大小变化，重绘图表
  window.addEventListener('resize', () => {
    chart.value?.resize();
    sourcesChart.value?.resize();
    forecastChart.value?.resize();
  });

  // 组件挂载时加载数据
  onMounted(() => {
    loadRevenueData();
  });
</script>

<style scoped>
  .revenue-analysis-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .revenue-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .revenue-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }

  .revenue-actions {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .chart-card {
    width: 100%;
    margin-bottom: 24px;
  }

  .chart-container {
    position: relative;
    height: 300px;
    width: 100%;
  }

  .chart-container.loading {
    opacity: 0.5;
  }

  .chart-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .chart-wrapper {
    height: 100%;
    width: 100%;
  }

  .revenue-summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 16px;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);
  }

  .summary-value {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .summary-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  .summary-value.positive {
    color: #4CAF50;
  }

  .summary-value.negative {
    color: #F44336;
  }

  .revenue-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
  }

  .revenue-sources-card,
  .revenue-forecast-card {
    height: 300px;
  }

  .revenue-records-card {
    margin-bottom: 24px;
  }

  .sources-chart,
  .forecast-chart {
    height: 250px;
    width: 100%;
  }

  @media (max-width: 1024px) {
    .revenue-summary {
      grid-template-columns: repeat(2, 1fr);
    }

    .revenue-details {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .revenue-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .revenue-actions {
      width: 100%;
      justify-content: space-between;
    }

    .revenue-summary {
      grid-template-columns: 1fr;
    }
  }
</style>