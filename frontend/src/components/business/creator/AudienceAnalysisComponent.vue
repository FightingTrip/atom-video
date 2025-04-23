/**
* @file AudienceAnalysisComponent.vue
* @description 视频或频道观众分析组件，包含地区分布、观看时长、观众特征等数据展示
* @author Atom Video Team
* @date 2023-05-01
*/

<template>
  <div class="audience-analysis">
    <div v-if="loading" class="loading-state">
      <n-spin size="large" />
      <p class="loading-text">正在加载观众数据...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <n-empty description="加载数据失败">
        <template #extra>
          <n-button @click="fetchAudienceData">重试</n-button>
        </template>
      </n-empty>
    </div>
    <div v-else class="audience-content">
      <!-- 观众概览卡片 -->
      <n-grid :cols="4" :x-gap="16" responsive="screen">
        <n-grid-item span="4 m:2 l:1">
          <n-statistic label="总观众数" :value="formatNumberWithCommas(audienceData.totalViewers)" />
        </n-grid-item>
        <n-grid-item span="4 m:2 l:1">
          <n-statistic label="回头观众" :value="formatNumberWithCommas(audienceData.returningViewers)"
            :suffix="`(${Math.round(audienceData.returningViewers / audienceData.totalViewers * 100)}%)`" />
        </n-grid-item>
        <n-grid-item span="4 m:2 l:1">
          <n-statistic label="新观众" :value="formatNumberWithCommas(audienceData.newViewers)"
            :suffix="`(${Math.round(audienceData.newViewers / audienceData.totalViewers * 100)}%)`" />
        </n-grid-item>
        <n-grid-item span="4 m:2 l:1">
          <n-statistic label="平均观看时长" :value="formatDuration(audienceData.averageWatchTime)" />
        </n-grid-item>
      </n-grid>

      <!-- 地区分布和时间段分析 -->
      <n-grid :cols="24" :x-gap="16" :y-gap="16">
        <n-grid-item span="24 l:12">
          <n-card title="观众地区分布" class="chart-card">
            <div ref="geoChartRef" class="chart-container geo-chart"></div>
          </n-card>
        </n-grid-item>
        <n-grid-item span="24 l:12">
          <n-card title="观看高峰时段" class="chart-card">
            <div ref="timeChartRef" class="chart-container"></div>
          </n-card>
        </n-grid-item>
      </n-grid>

      <!-- 观众属性分析 -->
      <n-grid :cols="3" :x-gap="16" :y-gap="16" responsive="screen">
        <n-grid-item span="3 l:1">
          <n-card title="年龄分布" class="chart-card">
            <div ref="ageChartRef" class="chart-container"></div>
          </n-card>
        </n-grid-item>
        <n-grid-item span="3 l:1">
          <n-card title="性别分布" class="chart-card">
            <div ref="genderChartRef" class="chart-container"></div>
          </n-card>
        </n-grid-item>
        <n-grid-item span="3 l:1">
          <n-card title="设备分布" class="chart-card">
            <div ref="deviceChartRef" class="chart-container"></div>
          </n-card>
        </n-grid-item>
      </n-grid>

      <!-- 观众来源分析 -->
      <n-card title="观众来源" class="chart-card">
        <n-tabs type="line" animated>
          <n-tab-pane name="source" tab="流量来源">
            <div ref="sourceChartRef" class="chart-container"></div>
          </n-tab-pane>
          <n-tab-pane name="referrer" tab="外部引荐">
            <div ref="referrerChartRef" class="chart-container"></div>
          </n-tab-pane>
          <n-tab-pane name="search" tab="搜索关键词">
            <div ref="searchChartRef" class="chart-container"></div>
          </n-tab-pane>
        </n-tabs>
      </n-card>

      <!-- 观众互动热图 -->
      <n-card title="观众互动热图" class="chart-card">
        <div class="interaction-header">
          <n-text>显示用户在视频中的互动高峰点</n-text>
          <n-select v-model:value="selectedInteractionType" :options="interactionTypeOptions" size="small"
            style="width: 150px;" />
        </div>
        <div ref="interactionChartRef" class="chart-container interaction-chart"></div>
      </n-card>

      <!-- 观众留存分析 -->
      <n-card title="观众留存分析" class="chart-card">
        <div ref="retentionChartRef" class="chart-container"></div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
  import {
    NCard,
    NSpin,
    NEmpty,
    NButton,
    NGrid,
    NGridItem,
    NTabs,
    NTabPane,
    NStatistic,
    NSelect,
    NText
  } from 'naive-ui';
  import * as echarts from 'echarts';
  import { analyticsService, AudienceAnalytics } from '@/services/analytics/analyticsService';
  // 导入中国地图数据
  // import 'echarts/map/js/china';
  // 导入世界地图数据
  // import 'echarts/map/js/world';

  const props = defineProps({
    title: {
      type: String,
      default: '观众分析'
    },
    videoId: {
      type: String,
      default: undefined
    }
  });

  // 图表引用
  const geoChartRef = ref<HTMLElement | null>(null);
  const timeChartRef = ref<HTMLElement | null>(null);
  const ageChartRef = ref<HTMLElement | null>(null);
  const genderChartRef = ref<HTMLElement | null>(null);
  const deviceChartRef = ref<HTMLElement | null>(null);
  const sourceChartRef = ref<HTMLElement | null>(null);
  const referrerChartRef = ref<HTMLElement | null>(null);
  const searchChartRef = ref<HTMLElement | null>(null);
  const interactionChartRef = ref<HTMLElement | null>(null);
  const retentionChartRef = ref<HTMLElement | null>(null);

  // 图表实例
  let geoChart: echarts.ECharts | null = null;
  let timeChart: echarts.ECharts | null = null;
  let ageChart: echarts.ECharts | null = null;
  let genderChart: echarts.ECharts | null = null;
  let deviceChart: echarts.ECharts | null = null;
  let sourceChart: echarts.ECharts | null = null;
  let referrerChart: echarts.ECharts | null = null;
  let searchChart: echarts.ECharts | null = null;
  let interactionChart: echarts.ECharts | null = null;
  let retentionChart: echarts.ECharts | null = null;

  // 状态
  const loading = ref(true);
  const error = ref(false);
  const selectedInteractionType = ref('comments');
  const interactionTypeOptions = [
    { label: '评论', value: 'comments' },
    { label: '点赞', value: 'likes' },
    { label: '分享', value: 'shares' },
    { label: '弹幕', value: 'danmaku' }
  ];

  // 观众数据
  const audienceData = ref<AudienceAnalytics>({
    totalViewers: 0,
    returningViewers: 0,
    newViewers: 0,
    averageWatchTime: 0,
    geography: [],
    international: [],
    timeDistribution: [],
    ageDistribution: [],
    genderDistribution: [],
    deviceDistribution: [],
    trafficSources: [],
    referrers: [],
    searchKeywords: [],
    interactionData: {
      comments: [],
      likes: [],
      shares: [],
      danmaku: []
    },
    retentionData: {
      segments: []
    }
  });

  // 获取观众数据
  const fetchAudienceData = async () => {
    loading.value = true;
    error.value = false;

    try {
      // 使用 analyticsService 获取数据
      const response = await analyticsService.getAudienceAnalytics({
        videoId: props.videoId,
        timeFrame: 'month'
      });

      audienceData.value = response;
      loading.value = false;

      nextTick(() => {
        initAllCharts();
      });
    } catch (err) {
      console.error('获取观众数据失败:', err);
      loading.value = false;
      error.value = true;
    }
  };

  // 初始化所有图表
  const initAllCharts = () => {
    initGeoChart();
    initTimeChart();
    initAgeChart();
    initGenderChart();
    initDeviceChart();
    initSourceChart();
    initReferrerChart();
    initSearchChart();
    initInteractionChart();
    initRetentionChart();
  };

  // 初始化地理分布图表
  const initGeoChart = () => {
    if (!geoChartRef.value) return;

    if (!geoChart) {
      geoChart = echarts.init(geoChartRef.value);
    }

    const option = {
      title: {
        text: '观众地区分布',
        subtext: '基于IP地址',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
      },
      series: [
        {
          name: '观众分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: audienceData.value.geography
        }
      ]
    };

    geoChart.setOption(option);
  };

  // 初始化时间分布图表
  const initTimeChart = () => {
    if (!timeChartRef.value) return;

    if (!timeChart) {
      timeChart = echarts.init(timeChartRef.value);
    }

    const option = {
      title: {
        text: '24小时观看分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: audienceData.value.timeDistribution.map(item => `${item.hour}:00`),
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '观看次数',
          type: 'bar',
          barWidth: '60%',
          data: audienceData.value.timeDistribution.map(item => item.value),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          }
        }
      ]
    };

    timeChart.setOption(option);
  };

  // 初始化年龄分布图表
  const initAgeChart = () => {
    if (!ageChartRef.value) return;

    if (!ageChart) {
      ageChart = echarts.init(ageChartRef.value);
    }

    const option = {
      title: {
        text: '年龄分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [
        {
          name: '年龄分布',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: audienceData.value.ageDistribution.map(item => ({
            name: item.group,
            value: item.value
          }))
        }
      ]
    };

    ageChart.setOption(option);
  };

  // 初始化性别分布图表
  const initGenderChart = () => {
    if (!genderChartRef.value) return;

    if (!genderChart) {
      genderChart = echarts.init(genderChartRef.value);
    }

    const option = {
      title: {
        text: '性别分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      color: ['#5470c6', '#ee6666', '#91cc75'],
      series: [
        {
          name: '性别分布',
          type: 'pie',
          radius: '50%',
          data: audienceData.value.genderDistribution.map(item => ({
            name: item.gender,
            value: item.value
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    genderChart.setOption(option);
  };

  // 初始化设备分布图表
  const initDeviceChart = () => {
    if (!deviceChartRef.value) return;

    if (!deviceChart) {
      deviceChart = echarts.init(deviceChartRef.value);
    }

    const option = {
      title: {
        text: '设备分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [
        {
          name: '设备分布',
          type: 'pie',
          radius: '50%',
          data: audienceData.value.deviceDistribution.map(item => ({
            name: item.device,
            value: item.value
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    deviceChart.setOption(option);
  };

  // 初始化流量来源图表
  const initSourceChart = () => {
    if (!sourceChartRef.value) return;

    if (!sourceChart) {
      sourceChart = echarts.init(sourceChartRef.value);
    }

    const option = {
      title: {
        text: '流量来源分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '流量来源',
          type: 'pie',
          radius: '50%',
          data: audienceData.value.trafficSources.map(item => ({
            name: item.source,
            value: item.value
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    sourceChart.setOption(option);
  };

  // 初始化外部引荐图表
  const initReferrerChart = () => {
    if (!referrerChartRef.value) return;

    if (!referrerChart) {
      referrerChart = echarts.init(referrerChartRef.value);
    }

    const option = {
      title: {
        text: '外部引荐来源',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: audienceData.value.referrers.map(item => item.name)
      },
      series: [
        {
          name: '访问量',
          type: 'bar',
          data: audienceData.value.referrers.map(item => item.value)
        }
      ]
    };

    referrerChart.setOption(option);
  };

  // 初始化搜索关键词图表
  const initSearchChart = () => {
    if (!searchChartRef.value) return;

    if (!searchChart) {
      searchChart = echarts.init(searchChartRef.value);
    }

    const option = {
      title: {
        text: '热门搜索关键词',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: audienceData.value.searchKeywords.map(item => item.keyword)
      },
      series: [
        {
          name: '搜索次数',
          type: 'bar',
          data: audienceData.value.searchKeywords.map(item => item.value)
        }
      ]
    };

    searchChart.setOption(option);
  };

  // 初始化互动热图
  const initInteractionChart = () => {
    if (!interactionChartRef.value) return;

    if (!interactionChart) {
      interactionChart = echarts.init(interactionChartRef.value);
    }

    const interactionData = audienceData.value.interactionData[selectedInteractionType.value as keyof typeof audienceData.value.interactionData];

    const option = {
      title: {
        text: '视频互动热图',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          const time = params[0].value[0];
          const minutes = Math.floor(time / 60);
          const seconds = time % 60;
          const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          return `时间点: ${timeStr}<br/>互动数: ${params[0].value[1]}`;
        }
      },
      xAxis: {
        type: 'value',
        name: '视频时间点(秒)',
        axisLabel: {
          formatter: function (value: number) {
            const minutes = Math.floor(value / 60);
            const seconds = value % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '互动数量'
      },
      series: [
        {
          name: '互动数',
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          itemStyle: {
            color: '#91cc75'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(145, 204, 117, 0.8)'
              },
              {
                offset: 1,
                color: 'rgba(145, 204, 117, 0.1)'
              }
            ])
          },
          data: interactionData.map((item: { time: number; value: number }) => [item.time, item.value])
        }
      ]
    };

    interactionChart.setOption(option);
  };

  // 初始化留存分析图表
  const initRetentionChart = () => {
    if (!retentionChartRef.value) return;

    if (!retentionChart) {
      retentionChart = echarts.init(retentionChartRef.value);
    }

    const option = {
      title: {
        text: '观众留存率',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
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
        data: audienceData.value.retentionData.segments.map(item => item.segment)
      },
      yAxis: {
        type: 'value',
        name: '留存率(%)',
        min: 0,
        max: 100
      },
      series: [
        {
          name: '留存率',
          type: 'line',
          data: audienceData.value.retentionData.segments.map(item => item.retention),
          markLine: {
            data: [
              {
                type: 'average',
                name: '平均值'
              }
            ]
          }
        }
      ]
    };

    retentionChart.setOption(option);
  };

  // 格式化数字，添加千位分隔符
  const formatNumberWithCommas = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 处理窗口大小变化
  const handleResize = () => {
    geoChart?.resize();
    timeChart?.resize();
    ageChart?.resize();
    genderChart?.resize();
    deviceChart?.resize();
    sourceChart?.resize();
    referrerChart?.resize();
    searchChart?.resize();
    interactionChart?.resize();
    retentionChart?.resize();
  };

  // 监听互动类型变化
  watch(selectedInteractionType, () => {
    initInteractionChart();
  });

  // 监听视频ID变化
  watch(() => props.videoId, () => {
    fetchAudienceData();
  });

  // 生命周期钩子
  onMounted(() => {
    window.addEventListener('resize', handleResize);
    fetchAudienceData();
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    geoChart?.dispose();
    timeChart?.dispose();
    ageChart?.dispose();
    genderChart?.dispose();
    deviceChart?.dispose();
    sourceChart?.dispose();
    referrerChart?.dispose();
    searchChart?.dispose();
    interactionChart?.dispose();
    retentionChart?.dispose();
  });
</script>

<style scoped>
  .audience-analysis {
    padding: 16px 0;
  }

  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .loading-text {
    margin-top: 16px;
    color: var(--text-color-secondary, #999);
  }

  .audience-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .chart-card {
    height: 100%;
  }

  .chart-container {
    height: 300px;
    width: 100%;
  }

  .geo-chart {
    height: 400px;
  }

  .interaction-chart {
    height: 250px;
  }

  .interaction-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  @media (max-width: 768px) {
    .chart-container {
      height: 250px;
    }

    .geo-chart {
      height: 300px;
    }
  }
</style>