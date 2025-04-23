/**
* @file AnalyticsPage.vue
* @description 创作者数据分析页面，提供内容、观众和收益分析
* @author Atom Video Team
* @date 2025-04-15
*/

<template>
  <div class="analytics-page">
    <div class="page-header">
      <h1 class="page-title">数据分析</h1>
      <div class="page-actions">
        <n-select v-model:value="currentVideoId" :options="videoOptions" placeholder="选择视频" clearable
          :disabled="!showingVideoData" style="width: 240px;" />
        <n-button-group>
          <n-button @click="refreshData">
            <template #icon>
              <n-icon>
                <ReloadOutline />
              </n-icon>
            </template>
            刷新数据
          </n-button>
          <n-button @click="showingVideoData = !showingVideoData">
            <template #icon>
              <n-icon>
                <component :is="showingVideoData ? PlayOutline : StatsChartOutline" />
              </n-icon>
            </template>
            {{ showingVideoData ? '查看频道数据' : '查看视频数据' }}
          </n-button>
        </n-button-group>
      </div>
    </div>

    <div class="analytics-content">
      <n-tabs type="line" animated v-model:value="activeTab">
        <n-tab-pane name="overview" tab="概览">
          <h2 class="section-title">
            {{ showingVideoData ? '视频概览' : '频道概览' }}
            <n-text type="info" class="last-updated">
              数据更新于 {{ formatDate(lastUpdated) }}
            </n-text>
          </h2>

          <creator-stats-component :title="showingVideoData ? '视频数据' : '频道数据'" />

          <n-divider />

          <creator-analytics-component :title="showingVideoData ? '视频表现' : '频道表现'"
            :videoId="showingVideoData ? currentVideoId : undefined" />
        </n-tab-pane>

        <n-tab-pane name="audience" tab="观众分析">
          <h2 class="section-title">
            {{ showingVideoData ? '视频观众分析' : '频道观众分析' }}
            <n-text type="info" class="last-updated">
              数据更新于 {{ formatDate(lastUpdated) }}
            </n-text>
          </h2>

          <audience-analysis-component :title="showingVideoData ? '视频观众' : '频道观众'"
            :videoId="showingVideoData ? currentVideoId : undefined" />
        </n-tab-pane>

        <n-tab-pane name="content" tab="内容分析">
          <h2 class="section-title">
            内容表现分析
            <n-text type="info" class="last-updated">
              数据更新于 {{ formatDate(lastUpdated) }}
            </n-text>
          </h2>

          <div class="content-analysis">
            <n-grid :cols="2" :x-gap="16">
              <n-grid-item>
                <n-card title="最佳表现内容类型" class="performance-card">
                  <div ref="contentTypeChartRef" class="chart-container"></div>
                </n-card>
              </n-grid-item>
              <n-grid-item>
                <n-card title="最佳表现时长" class="performance-card">
                  <div ref="durationChartRef" class="chart-container"></div>
                </n-card>
              </n-grid-item>
            </n-grid>

            <n-card title="内容表现对比" class="comparison-card">
              <n-data-table :columns="contentColumns" :data="contentData" :pagination="pagination" />
            </n-card>

            <n-card title="内容优化建议" class="tips-card">
              <n-collapse>
                <n-collapse-item v-for="(tip, index) in contentTips" :key="index" :title="tip.title" :name="index">
                  <div class="tip-content">
                    <p>{{ tip.description }}</p>
                    <ul v-if="tip.actionItems">
                      <li v-for="(item, i) in tip.actionItems" :key="i">{{ item }}</li>
                    </ul>
                  </div>
                </n-collapse-item>
              </n-collapse>
            </n-card>
          </div>
        </n-tab-pane>

        <n-tab-pane name="revenue" tab="收益分析">
          <h2 class="section-title">
            {{ showingVideoData ? '视频收益分析' : '频道收益分析' }}
            <n-text type="info" class="last-updated">
              数据更新于 {{ formatDate(lastUpdated) }}
            </n-text>
          </h2>

          <revenue-analysis-component :title="showingVideoData ? '视频收益' : '频道收益'" />
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, nextTick } from 'vue';
  import {
    NTabs,
    NTabPane,
    NCard,
    NGrid,
    NGridItem,
    NButton,
    NButtonGroup,
    NSelect,
    NIcon,
    NDataTable,
    NDivider,
    NCollapse,
    NCollapseItem,
    NText
  } from 'naive-ui';
  import {
    ReloadOutline,
    PlayOutline,
    StatsChartOutline
  } from '@vicons/ionicons5';
  import * as echarts from 'echarts';
  import CreatorStatsComponent from '@/components/business/creator/CreatorStatsComponent.vue';
  import CreatorAnalyticsComponent from '@/components/business/creator/CreatorAnalyticsComponent.vue';
  import AudienceAnalysisComponent from '@/components/business/creator/AudienceAnalysisComponent.vue';
  import RevenueAnalysisComponent from '@/components/business/creator/RevenueAnalysisComponent.vue';
  import { creatorService } from '@/services/creator/creatorService';

  // 页面状态
  const activeTab = ref('overview');
  const showingVideoData = ref(false);
  const currentVideoId = ref('');
  const lastUpdated = ref(new Date());
  const contentTypeChartRef = ref<HTMLElement | null>(null);
  const durationChartRef = ref<HTMLElement | null>(null);

  // 图表实例
  let contentTypeChart: echarts.ECharts | null = null;
  let durationChart: echarts.ECharts | null = null;

  // 视频选项
  const videoOptions = ref([
    { label: '如何使用Atom Video - 入门教程', value: 'v1' },
    { label: '10分钟学会视频剪辑 - 基础篇', value: 'v2' },
    { label: '2023年最值得期待的游戏', value: 'v3' },
    { label: '我的工作环境分享', value: 'v4' }
  ]);

  // 内容分析数据
  const contentData = ref([
    {
      id: 'v1',
      title: '如何使用Atom Video - 入门教程',
      category: '教程',
      duration: 485,
      views: 25600,
      retention: 72,
      engagement: 18.5,
      revenue: 1250.85
    },
    {
      id: 'v2',
      title: '10分钟学会视频剪辑 - 基础篇',
      category: '教程',
      duration: 612,
      views: 18400,
      retention: 68,
      engagement: 15.2,
      revenue: 856.40
    },
    {
      id: 'v3',
      title: '2023年最值得期待的游戏',
      category: '游戏',
      duration: 845,
      views: 32100,
      retention: 58,
      engagement: 22.7,
      revenue: 1584.60
    },
    {
      id: 'v4',
      title: '我的工作环境分享',
      category: '生活',
      duration: 725,
      views: 14800,
      retention: 65,
      engagement: 12.3,
      revenue: 652.25
    },
    {
      id: 'v5',
      title: '程序员的一天',
      category: '生活',
      duration: 1025,
      views: 21500,
      retention: 52,
      engagement: 16.8,
      revenue: 945.75
    }
  ]);

  // 分页设置
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
    onChange: (page: number) => {
      pagination.page = page;
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize;
      pagination.page = 1;
    }
  });

  // 表格列定义
  const contentColumns = [
    {
      title: '标题',
      key: 'title',
      width: 300
    },
    {
      title: '分类',
      key: 'category',
      width: 100
    },
    {
      title: '时长',
      key: 'duration',
      width: 100,
      render: (row: any) => formatDuration(row.duration)
    },
    {
      title: '观看量',
      key: 'views',
      width: 120,
      sorter: 'default'
    },
    {
      title: '留存率(%)',
      key: 'retention',
      width: 100,
      sorter: 'default'
    },
    {
      title: '互动率(%)',
      key: 'engagement',
      width: 100,
      sorter: 'default'
    },
    {
      title: '收益(¥)',
      key: 'revenue',
      width: 120,
      sorter: 'default'
    }
  ];

  // 内容优化建议
  const contentTips = ref([
    {
      title: '优化视频时长',
      description: '数据显示，8-12分钟的视频表现最佳，观众留存率高达70%以上。考虑将视频长度控制在这个范围内以获得最佳效果。',
      actionItems: [
        '将长视频分割成多个8-12分钟的部分',
        '保持节奏紧凑，减少冗余内容',
        '在视频开头的前30秒引入核心话题'
      ]
    },
    {
      title: '增加教程类内容',
      description: '教程类内容的观众留存率和收益显著高于其他类型，同时互动率也更高。',
      actionItems: [
        '考虑每月至少发布2个教程视频',
        '将教程系列化，提高观众持续观看率',
        '结合热门话题和专业知识创建独特教程'
      ]
    },
    {
      title: '提高视频缩略图点击率',
      description: '缩略图和标题是影响点击率的关键因素。数据显示，使用鲜明对比色和清晰文字的缩略图点击率提高了35%。',
      actionItems: [
        '使用高对比度和鲜明色彩',
        '添加清晰可读的文字',
        '对同一视频测试不同缩略图效果'
      ]
    },
    {
      title: '优化发布时间',
      description: '根据您的观众活跃时间分析，工作日晚上7-9点和周末下午2-5点是观众活跃度最高的时段。',
      actionItems: [
        '在高峰时段发布新内容',
        '提前24-48小时预告新视频',
        '使用平台的预约发布功能'
      ]
    }
  ]);

  // 格式化时长
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  // 刷新数据
  const refreshData = async () => {
    try {
      // 这里应该调用API获取最新数据
      // await creatorService.refreshAnalyticsData();

      lastUpdated.value = new Date();

      // 重新渲染图表
      nextTick(() => {
        initCharts();
      });

    } catch (error) {
      console.error('刷新数据失败:', error);
    }
  };

  // 初始化图表
  const initCharts = () => {
    initContentTypeChart();
    initDurationChart();
  };

  // 初始化内容类型图表
  const initContentTypeChart = () => {
    if (!contentTypeChartRef.value) return;

    if (!contentTypeChart) {
      contentTypeChart = echarts.init(contentTypeChartRef.value);
    }

    // 按类别统计数据
    const categories = {} as Record<string, { views: number, revenue: number, videos: number }>;

    contentData.value.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = { views: 0, revenue: 0, videos: 0 };
      }

      categories[item.category].views += item.views;
      categories[item.category].revenue += item.revenue;
      categories[item.category].videos += 1;
    });

    const categoryNames = Object.keys(categories);
    const viewsData = categoryNames.map(name => categories[name].views);
    const revenueData = categoryNames.map(name => categories[name].revenue);
    const avgRevenueData = categoryNames.map(name =>
      categories[name].revenue / categories[name].videos
    );

    const option = {
      title: {
        text: '内容类型表现',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['总观看量', '总收益', '平均收益/视频'],
        bottom: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categoryNames
      },
      yAxis: [
        {
          type: 'value',
          name: '观看量',
          position: 'left'
        },
        {
          type: 'value',
          name: '收益 (¥)',
          position: 'right'
        }
      ],
      series: [
        {
          name: '总观看量',
          type: 'bar',
          yAxisIndex: 0,
          data: viewsData
        },
        {
          name: '总收益',
          type: 'bar',
          yAxisIndex: 1,
          data: revenueData
        },
        {
          name: '平均收益/视频',
          type: 'line',
          yAxisIndex: 1,
          data: avgRevenueData,
          smooth: true,
          lineStyle: {
            width: 3
          },
          symbol: 'circle',
          symbolSize: 8
        }
      ]
    };

    contentTypeChart.setOption(option);
  };

  // 初始化时长图表
  const initDurationChart = () => {
    if (!durationChartRef.value) return;

    if (!durationChart) {
      durationChart = echarts.init(durationChartRef.value);
    }

    // 按时长分组
    const durationGroups = [
      { name: '0-5分钟', min: 0, max: 300 },
      { name: '5-10分钟', min: 300, max: 600 },
      { name: '10-15分钟', min: 600, max: 900 },
      { name: '15-20分钟', min: 900, max: 1200 },
      { name: '20分钟以上', min: 1200, max: Infinity }
    ];

    const groupData = durationGroups.map(group => {
      const videos = contentData.value.filter(
        video => video.duration >= group.min && video.duration < group.max
      );

      if (videos.length === 0) {
        return {
          name: group.name,
          videos: 0,
          avgRetention: 0,
          avgEngagement: 0,
          avgRevenue: 0
        };
      }

      const avgRetention = videos.reduce((sum, video) => sum + video.retention, 0) / videos.length;
      const avgEngagement = videos.reduce((sum, video) => sum + video.engagement, 0) / videos.length;
      const avgRevenue = videos.reduce((sum, video) => sum + video.revenue, 0) / videos.length;

      return {
        name: group.name,
        videos: videos.length,
        avgRetention,
        avgEngagement,
        avgRevenue
      };
    });

    const option = {
      title: {
        text: '视频时长表现',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['视频数量', '平均留存率(%)', '平均互动率(%)', '平均收益(¥)'],
        bottom: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: groupData.map(group => group.name)
      },
      yAxis: [
        {
          type: 'value',
          name: '数量',
          position: 'left'
        },
        {
          type: 'value',
          name: '百分比/收益',
          position: 'right'
        }
      ],
      series: [
        {
          name: '视频数量',
          type: 'bar',
          yAxisIndex: 0,
          data: groupData.map(group => group.videos)
        },
        {
          name: '平均留存率(%)',
          type: 'line',
          yAxisIndex: 1,
          data: groupData.map(group => group.avgRetention.toFixed(1)),
          smooth: true
        },
        {
          name: '平均互动率(%)',
          type: 'line',
          yAxisIndex: 1,
          data: groupData.map(group => group.avgEngagement.toFixed(1)),
          smooth: true
        },
        {
          name: '平均收益(¥)',
          type: 'line',
          yAxisIndex: 1,
          data: groupData.map(group => group.avgRevenue.toFixed(2)),
          smooth: true
        }
      ]
    };

    durationChart.setOption(option);
  };

  // 处理窗口大小变化
  const handleResize = () => {
    contentTypeChart?.resize();
    durationChart?.resize();
  };

  // 生命周期钩子
  onMounted(() => {
    window.addEventListener('resize', handleResize);
    nextTick(() => {
      initCharts();
    });
  });

  const onBeforeUnmount = () => {
    window.removeEventListener('resize', handleResize);
    contentTypeChart?.dispose();
    durationChart?.dispose();
  };
</script>

<style scoped>
  .analytics-page {
    padding: 24px;
    max-width: 1600px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .page-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }

  .page-actions {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .last-updated {
    font-size: 14px;
    font-weight: normal;
  }

  .analytics-content {
    background-color: var(--content-bg, #fff);
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    padding: 24px;
  }

  .chart-container {
    height: 300px;
    width: 100%;
  }

  .performance-card {
    margin-bottom: 24px;
  }

  .comparison-card {
    margin-bottom: 24px;
  }

  .tip-content {
    padding: 16px;
    background-color: var(--container-bg, rgba(250, 250, 252, 0.1));
    border-radius: 8px;
  }

  .tip-content p {
    margin-top: 0;
  }

  .tip-content ul {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .page-actions {
      width: 100%;
      flex-direction: column;
    }
  }
</style>