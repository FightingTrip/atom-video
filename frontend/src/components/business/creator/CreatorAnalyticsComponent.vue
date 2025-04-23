/**
* @file CreatorAnalyticsComponent.vue
* @description 创作者数据分析组件，提供多种数据可视化图表
* @author Atom Video Team
* @date 2025-04-15
*/

<template>
  <div class="analytics-container">
    <div class="analytics-header" v-if="title">
      <h3 class="analytics-title">{{ title }}</h3>
      <div class="analytics-actions">
        <n-radio-group v-model:value="timeRange" size="small">
          <n-radio-button value="7">7天</n-radio-button>
          <n-radio-button value="30">30天</n-radio-button>
          <n-radio-button value="90">90天</n-radio-button>
        </n-radio-group>
        <n-button type="primary" size="small" @click="exportData">
          <template #icon>
            <n-icon>
              <DownloadOutline />
            </n-icon>
          </template>
          导出数据
        </n-button>
      </div>
    </div>

      <n-card class="chart-card">
        <template #header v-if="chartTitle">
          <div class="chart-header">
            <div class="chart-title">{{ chartTitle }}</div>
          <div class="chart-controls">
            <n-select v-model:value="chartType" :options="chartTypeOptions" size="small" style="width: 120px" />
            </div>
          </div>
        </template>

      <div class="chart-container" :class="{ 'loading': loading }">
        <div v-if="loading" class="chart-loading">
          <n-spin size="large" />
          </div>
        <div v-else ref="chartRef" class="chart-wrapper"></div>
          </div>

      <div class="metrics-summary" v-if="showMetrics">
        <div class="metric-item" v-for="(metric, idx) in metrics" :key="idx">
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-label">{{ metric.label }}</div>
          <div v-if="metric.change !== undefined" class="metric-change"
            :class="metric.change > 0 ? 'positive' : metric.change < 0 ? 'negative' : ''">
            {{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%
              </div>
          </div>
        </div>
      </n-card>

    <!-- 高级分析卡片 -->
    <div class="advanced-analytics" v-if="showAdvanced">
      <n-card class="analytics-card audience-card" title="观众来源">
        <div class="audience-chart" ref="audienceChartRef"></div>
        </n-card>

      <n-card class="analytics-card engagement-card" title="互动分析">
        <div class="engagement-chart" ref="engagementChartRef"></div>
      </n-card>

      <n-card class="analytics-card revenue-card" title="收入趋势">
        <div class="revenue-chart" ref="revenueChartRef"></div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
  import { useMessage } from 'naive-ui';
  import {
    NCard,
    NButton,
    NIcon,
    NRadioGroup,
    NRadioButton,
    NSelect,
    NSpin
  } from 'naive-ui';
  import { DownloadOutline } from '@vicons/ionicons5';
  import creatorService from '@/services/creator/creatorService';
  import * as echarts from 'echarts/core';
  import {
    LineChart,
    BarChart,
    PieChart,
    ScatterChart,
    RadarChart
  } from 'echarts/charts';
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    ToolboxComponent,
    VisualMapComponent
  } from 'echarts/components';
  import { LabelLayout, UniversalTransition } from 'echarts/features';
  import { CanvasRenderer } from 'echarts/renderers';

  // 注册必要的 ECharts 组件
  echarts.use([
    LineChart,
    BarChart,
    PieChart,
    ScatterChart,
    RadarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    ToolboxComponent,
    VisualMapComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
  ]);

  const props = defineProps({
    title: {
      type: String,
      default: '数据分析'
    },
    chartTitle: {
      type: String,
      default: '观看趋势'
    },
    videoId: {
      type: String,
      default: ''
    },
    showMetrics: {
      type: Boolean,
      default: true
    },
    showAdvanced: {
      type: Boolean,
      default: false
    }
  });

  const message = useMessage();
  const loading = ref(false);

  // 图表引用和选项
  const chartRef = ref<HTMLElement | null>(null);
  const audienceChartRef = ref<HTMLElement | null>(null);
  const engagementChartRef = ref<HTMLElement | null>(null);
  const revenueChartRef = ref<HTMLElement | null>(null);
  const mainChart = ref<echarts.ECharts | null>(null);
  const audienceChart = ref<echarts.ECharts | null>(null);
  const engagementChart = ref<echarts.ECharts | null>(null);
  const revenueChart = ref<echarts.ECharts | null>(null);

  // 数据和筛选器
  const timeRange = ref('30');
  const chartType = ref('line');
  const chartTypeOptions = [
    { label: '折线图', value: 'line' },
    { label: '柱状图', value: 'bar' },
    { label: '面积图', value: 'area' }
  ];

  // 指标数据
  const metrics = ref([
    { label: '观看量', value: '0', change: 0 },
    { label: '观看时长', value: '0分钟', change: 0 },
    { label: '平均观看时长', value: '0:00', change: 0 },
    { label: '点击率', value: '0%', change: 0 }
  ]);

  // 主图表数据
  const chartData = ref({
    dates: [] as string[],
    views: [] as number[],
    uniqueViewers: [] as number[],
    avgWatchTime: [] as number[],
    likes: [] as number[],
    comments: [] as number[]
  });

  // 获取数据
  const fetchAnalyticsData = async () => {
    loading.value = true;

    try {
      // 如果有指定视频ID，获取该视频的分析数据
      if (props.videoId) {
        const videoAnalytics = await creatorService.getVideoAnalytics(props.videoId);

        // 设置时间数据
        if (timeRange.value === '7') {
          chartData.value.dates = videoAnalytics.viewsLast7Days.map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 6 + i);
            return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
          });
          chartData.value.views = videoAnalytics.viewsLast7Days;
        } else {
          chartData.value.dates = videoAnalytics.viewsLast30Days.map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 29 + i);
            return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
          });
          chartData.value.views = videoAnalytics.viewsLast30Days;
        }

        // 模拟其他数据
        chartData.value.uniqueViewers = chartData.value.views.map(v => Math.round(v * 0.85));
        chartData.value.avgWatchTime = chartData.value.views.map(v => Math.round(v * 0.3));
        chartData.value.likes = chartData.value.views.map(v => Math.round(v * 0.12));
        chartData.value.comments = chartData.value.views.map(v => Math.round(v * 0.03));

        // 更新指标
        updateMetrics(videoAnalytics);

      } else {
        // 获取创作者整体数据（模拟）
        const days = timeRange.value === '7' ? 7 : timeRange.value === '30' ? 30 : 90;

        chartData.value.dates = Array(days).fill(0).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1) + i);
          return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
        });

        // 模拟数据趋势
        chartData.value.views = generateRandomData(days, 500, 5000);
        chartData.value.uniqueViewers = chartData.value.views.map(v => Math.round(v * 0.85));
        chartData.value.avgWatchTime = generateRandomData(days, 2, 8);
        chartData.value.likes = chartData.value.views.map(v => Math.round(v * 0.15));
        chartData.value.comments = chartData.value.views.map(v => Math.round(v * 0.03));

        // 更新指标
        updateChannelMetrics();
      }

      // 绘制图表
      renderCharts();

    } catch (error) {
      console.error('获取分析数据失败:', error);
      message.error('获取分析数据失败');
    } finally {
      loading.value = false;
    }
  };

  // 更新视频指标
  const updateMetrics = (data: any) => {
    const totalViews = data.views;
    const previousViews = totalViews * 0.8; // 模拟上一时期数据
    const viewsChange = Math.round(((totalViews - previousViews) / previousViews) * 100);

    const watchTime = Math.round(data.watchTime);
    const prevWatchTime = watchTime * 0.9;
    const watchTimeChange = Math.round(((watchTime - prevWatchTime) / prevWatchTime) * 100);

    const avgRetention = data.retention;
    const prevRetention = avgRetention * 0.95;
    const retentionChange = Math.round(((avgRetention - prevRetention) / prevRetention) * 100);

    const clickRate = Math.round(Math.random() * 15);
    const prevClickRate = clickRate * 0.9;
    const clickRateChange = Math.round(((clickRate - prevClickRate) / prevClickRate) * 100);

    metrics.value = [
      { label: '观看量', value: formatNumber(totalViews), change: viewsChange },
      { label: '观看时长', value: `${watchTime}分钟`, change: watchTimeChange },
      { label: '平均观看时长', value: formatTime(avgRetention * 60), change: retentionChange },
      { label: '点击率', value: `${clickRate}%`, change: clickRateChange }
    ];
  };

  // 更新频道整体指标
  const updateChannelMetrics = () => {
    const views = chartData.value.views.reduce((a, b) => a + b, 0);
    const prevViews = views * 0.9;
    const viewsChange = Math.round(((views - prevViews) / prevViews) * 100);

    const watchTime = Math.round(views * 3.5);
    const prevWatchTime = watchTime * 0.85;
    const watchTimeChange = Math.round(((watchTime - prevWatchTime) / prevWatchTime) * 100);

    const totalMinutes = watchTime;
    const totalViews = views;
    const avgWatchTime = totalViews ? totalMinutes / totalViews : 0;
    const prevAvgTime = avgWatchTime * 0.95;
    const avgTimeChange = Math.round(((avgWatchTime - prevAvgTime) / prevAvgTime) * 100);

    const clickRate = Math.round(Math.random() * 12 + 3);
    const prevClickRate = clickRate * 0.9;
    const clickRateChange = Math.round(((clickRate - prevClickRate) / prevClickRate) * 100);

    metrics.value = [
      { label: '观看量', value: formatNumber(views), change: viewsChange },
      { label: '观看时长', value: `${formatNumber(watchTime)}分钟`, change: watchTimeChange },
      { label: '平均观看时长', value: formatTime(avgWatchTime * 60), change: avgTimeChange },
      { label: '点击率', value: `${clickRate}%`, change: clickRateChange }
    ];
  };

  // 渲染所有图表
  const renderCharts = () => {
    nextTick(() => {
      renderMainChart();

      if (props.showAdvanced) {
        renderAudienceChart();
        renderEngagementChart();
        renderRevenueChart();
      }
    });
  };

  // 渲染主图表
  const renderMainChart = () => {
    if (!chartRef.value) return;

    // 销毁旧图表
    if (mainChart.value) {
      mainChart.value.dispose();
    }

    // 初始化图表
    mainChart.value = echarts.init(chartRef.value);

    // 确定要显示的数据系列
    const series = [];
    const colors = ['#58a6ff', '#3fb950', '#f78166', '#ed8936', '#9c27b0'];

    series.push({
      name: '观看数',
      type: chartType.value === 'area' ? 'line' : chartType.value,
      data: chartData.value.views,
      areaStyle: chartType.value === 'area' ? {} : null,
      smooth: true,
      lineStyle: { width: 3 },
      itemStyle: { color: colors[0] }
    });

    series.push({
      name: '独立观众',
      type: chartType.value === 'area' ? 'line' : chartType.value,
      data: chartData.value.uniqueViewers,
      areaStyle: chartType.value === 'area' ? { opacity: 0.5 } : null,
      smooth: true,
      lineStyle: { width: 3 },
      itemStyle: { color: colors[1] }
    });

    // 设置图表选项
    const option = {
      backgroundColor: 'transparent',
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {
        data: ['观看数', '独立观众'],
        textStyle: { color: 'rgba(255, 255, 255, 0.7)' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.value.dates,
        axisLine: {
          lineStyle: { color: 'rgba(255, 255, 255, 0.2)' }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      series: series
    };

    // 设置图表
    mainChart.value.setOption(option);

    // 响应容器大小变化
    window.addEventListener('resize', handleResize);
  };

  // 渲染观众来源图
  const renderAudienceChart = () => {
    if (!audienceChartRef.value) return;

    if (audienceChart.value) {
      audienceChart.value.dispose();
    }

    audienceChart.value = echarts.init(audienceChartRef.value);

    // 模拟数据
    const regions = [
      { name: '中国', value: 65 },
      { name: '美国', value: 12 },
      { name: '英国', value: 5 },
      { name: '日本', value: 4 },
      { name: '韩国', value: 3 },
      { name: '其他', value: 11 }
    ];

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: regions.map(r => r.name),
        textStyle: { color: 'rgba(255, 255, 255, 0.7)' }
      },
      series: [
        {
          name: '观众来源',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: regions.map(r => ({ name: r.name, value: r.value }))
        }
      ]
    };

    audienceChart.value.setOption(option);
  };

  // 渲染互动分析图
  const renderEngagementChart = () => {
    if (!engagementChartRef.value) return;

    if (engagementChart.value) {
      engagementChart.value.dispose();
    }

    engagementChart.value = echarts.init(engagementChartRef.value);

    // 模拟数据
    const indicators = [
      { text: '观看完成率', max: 100 },
      { text: '点赞率', max: 100 },
      { text: '评论率', max: 100 },
      { text: '分享率', max: 100 },
      { text: '订阅转化率', max: 100 }
    ];

    const data = [
      { value: [65, 80, 30, 40, 55], name: '当前时期' },
      { value: [50, 70, 25, 30, 45], name: '上一时期' }
    ];

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item'
      },
      legend: {
        data: data.map(d => d.name),
        textStyle: { color: 'rgba(255, 255, 255, 0.7)' }
      },
      radar: {
        indicator: indicators,
        shape: 'circle',
        splitNumber: 5,
        axisName: {
          color: 'rgb(238, 197, 102)'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        splitArea: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)'
          }
        }
      },
      series: [
        {
          type: 'radar',
          data: data.map(d => ({
            value: d.value,
            name: d.name,
            areaStyle: {
              color: d.name === '当前时期'
                ? 'rgba(58, 166, 255, 0.3)'
                : 'rgba(63, 185, 80, 0.3)'
            }
          }))
        }
      ]
    };

    engagementChart.value.setOption(option);
  };

  // 渲染收入趋势图
  const renderRevenueChart = () => {
    if (!revenueChartRef.value) return;

    if (revenueChart.value) {
      revenueChart.value.dispose();
    }

    revenueChart.value = echarts.init(revenueChartRef.value);

    // 获取收入数据
    const fetchRevenueData = async () => {
      try {
        const period = timeRange.value === '7' ? 'week' : timeRange.value === '30' ? 'month' : 'year';
        const revenueData = await creatorService.getRevenueData(period);

        const option = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params: any) {
              return `${params[0].axisValue}<br/>${params[0].marker}${params[0].seriesName}: ${params[0].value}元`;
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
            data: revenueData.labels,
            axisLine: {
              lineStyle: { color: 'rgba(255, 255, 255, 0.2)' }
            },
            axisLabel: {
              color: 'rgba(255, 255, 255, 0.7)',
              rotate: revenueData.labels.length > 10 ? 45 : 0,
              interval: revenueData.labels.length > 15 ? 'auto' : 0
            }
          },
          yAxis: {
            type: 'value',
            name: '收入 (元)',
            nameTextStyle: {
              color: 'rgba(255, 255, 255, 0.7)'
            },
            splitLine: {
              lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            axisLabel: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          },
          series: [
            {
              name: '收入',
              type: 'bar',
              barWidth: '60%',
              data: revenueData.data,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FFB74D' },
                  { offset: 1, color: '#FF7043' }
                ])
              }
            }
          ]
        };

        revenueChart.value?.setOption(option);

      } catch (error) {
        console.error('获取收入数据失败:', error);
        message.error('获取收入数据失败');
      }
    };

    fetchRevenueData();
  };

  // 导出数据
  const exportData = () => {
    try {
      // 创建CSV内容
      let csvContent = "data:text/csv;charset=utf-8,日期,观看数,独立观众,平均观看时长,点赞数,评论数\n";

      for (let i = 0; i < chartData.value.dates.length; i++) {
        csvContent += `${chartData.value.dates[i]},${chartData.value.views[i]},${chartData.value.uniqueViewers[i]},${chartData.value.avgWatchTime[i]},${chartData.value.likes[i]},${chartData.value.comments[i]}\n`;
      }

      // 创建下载链接
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `创作者数据_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);

      // 点击下载
      link.click();
      document.body.removeChild(link);

      message.success("数据导出成功");
    } catch (error) {
      console.error('导出数据失败:', error);
      message.error('导出数据失败');
    }
  };

  // 处理窗口大小变化
  const handleResize = () => {
    mainChart.value?.resize();
    audienceChart.value?.resize();
    engagementChart.value?.resize();
    revenueChart.value?.resize();
  };

  // 生成随机数据
  const generateRandomData = (length: number, min: number, max: number) => {
    const base = Math.floor(Math.random() * (max - min)) + min;
    return Array(length).fill(0).map((_, i) => {
      const trend = i / length * 2;  // 添加上升趋势
      const dailyVariation = Math.sin(i / 2) * (max - min) * 0.1;  // 添加波动
      const randomness = (Math.random() - 0.5) * (max - min) * 0.2;  // 添加随机性

      return Math.max(min, Math.floor(base + (base * trend) + dailyVariation + randomness));
    });
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

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 监听时间范围变更
  watch(timeRange, () => {
    fetchAnalyticsData();
  });

  // 监听图表类型变更
  watch(chartType, () => {
    if (mainChart.value) {
      renderMainChart();
    }
  });

  // 组件挂载
  onMounted(() => {
    fetchAnalyticsData();
  });

  // 组件卸载
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);

    // 销毁图表实例
    mainChart.value?.dispose();
    audienceChart.value?.dispose();
    engagementChart.value?.dispose();
    revenueChart.value?.dispose();
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
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  .analytics-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .chart-card {
    margin-bottom: 24px;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chart-title {
    font-size: 16px;
    font-weight: 600;
  }

  .chart-controls {
    display: flex;
    gap: 8px;
  }

  .chart-container {
    position: relative;
    height: 350px;
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

  .metrics-summary {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .metric-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .metric-value {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .metric-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 4px;
  }

  .metric-change {
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
    background-color: rgba(158, 158, 158, 0.1);
    color: #9e9e9e;
  }

  .metric-change.positive {
    background-color: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }

  .metric-change.negative {
    background-color: rgba(244, 67, 54, 0.1);
    color: #f44336;
  }

  .advanced-analytics {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 24px;
  }

  .analytics-card {
    height: 300px;
  }

  .audience-chart,
  .engagement-chart,
  .revenue-chart {
    height: 100%;
    width: 100%;
  }

  @media (max-width: 768px) {
    .analytics-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .analytics-actions {
      width: 100%;
      justify-content: space-between;
    }

    .metrics-summary {
      grid-template-columns: repeat(2, 1fr);
    }

    .advanced-analytics {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .metrics-summary {
      grid-template-columns: 1fr;
    }
  }
</style>