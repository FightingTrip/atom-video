/**
* 管理后台仪表盘页面
*
* 显示平台核心指标、趋势图表和近期活动
*/
<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">管理仪表盘</h1>
      <div class="dashboard-actions">
        <n-button-group>
          <n-button @click="refreshData">
            <template #icon>
              <n-icon>
                <ReloadOutline />
              </n-icon>
            </template>
            刷新数据
          </n-button>
          <n-button @click="exportData">
            <template #icon>
              <n-icon>
                <DownloadOutline />
              </n-icon>
            </template>
            导出报表
          </n-button>
        </n-button-group>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <n-grid cols="1 m:2 l:4" :x-gap="16" :y-gap="16">
      <n-grid-item v-for="stat in statistics" :key="stat.key">
        <n-card class="stat-card" :class="stat.class">
          <div class="stat-wrapper">
            <div class="stat-icon">
              <n-icon size="30">
                <component :is="stat.icon" />
              </n-icon>
            </div>
            <div class="stat-content">
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-trend" :class="getTrendClass(stat.change)">
                <n-icon size="16">
                  <component :is="stat.change > 0 ? trendingUpIcon : trendingDownIcon" />
                </n-icon>
                <span>{{ formatTrend(stat.change) }}</span>
              </div>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 趋势图表和活动列表 -->
    <n-grid cols="1 l:3" :x-gap="16" :y-gap="16" class="dashboard-main">
      <!-- 用户活跃趋势 -->
      <n-grid-item span="1 l:2">
        <n-card title="用户活跃趋势" class="chart-card">
          <div class="chart-header">
            <n-radio-group v-model:value="timeRange" size="small">
              <n-radio-button value="day">今日</n-radio-button>
              <n-radio-button value="week">本周</n-radio-button>
              <n-radio-button value="month">本月</n-radio-button>
            </n-radio-group>
          </div>
          <div class="chart-container">
            <div id="userActivityChart" class="echarts-container"></div>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 近期活动 -->
      <n-grid-item>
        <n-card title="近期活动" class="activity-card">
          <div class="activity-list">
            <n-list>
              <n-list-item v-for="activity in activities" :key="activity.id">
                <n-thing :title="activity.title" :description="activity.time">
                  <template #avatar>
                    <n-avatar round :size="40" :src="activity.avatar" />
                  </template>
                  <template #header-extra>
                    <n-tag :type="getActivityTagType(activity.type)" size="small">
                      {{ activity.type }}
                    </n-tag>
                  </template>
                  <template #description>
                    <span>{{ activity.description }}</span>
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
          </div>
          <div class="activity-footer">
            <n-button text>查看更多活动</n-button>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 内容统计 -->
    <n-card title="内容分布统计" class="content-stats-card">
      <n-grid cols="1 m:2" :x-gap="16" :y-gap="16">
        <n-grid-item>
          <div class="chart-container">
            <div id="categoryDistChart" class="echarts-container"></div>
          </div>
        </n-grid-item>
        <n-grid-item>
          <div class="chart-container">
            <div id="tagDistChart" class="echarts-container"></div>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- 待处理任务 -->
    <n-card title="待处理任务" class="tasks-card">
      <n-tabs type="line">
        <n-tab-pane name="videos" tab="视频审核">
          <n-table :bordered="false" :single-line="false">
            <thead>
              <tr>
                <th>标题</th>
                <th>上传者</th>
                <th>上传时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in pendingVideos" :key="task.id">
                <td>{{ task.title }}</td>
                <td>{{ task.uploader }}</td>
                <td>{{ task.uploadTime }}</td>
                <td>
                  <n-button-group size="small">
                    <n-button type="primary">审核</n-button>
                    <n-button>查看</n-button>
                  </n-button-group>
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-tab-pane>
        <n-tab-pane name="reports" tab="举报处理">
          <n-table :bordered="false" :single-line="false">
            <thead>
              <tr>
                <th>举报内容</th>
                <th>举报类型</th>
                <th>举报时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in pendingReports" :key="report.id">
                <td>{{ report.content }}</td>
                <td>
                  <n-tag :type="getReportTagType(report.type)">
                    {{ report.type }}
                  </n-tag>
                </td>
                <td>{{ report.time }}</td>
                <td>
                  <n-button-group size="small">
                    <n-button type="primary">处理</n-button>
                    <n-button>查看</n-button>
                  </n-button-group>
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch, markRaw } from 'vue'
  import {
    NButton,
    NButtonGroup,
    NCard,
    NGrid,
    NGridItem,
    NIcon,
    NList,
    NListItem,
    NThing,
    NAvatar,
    NTag,
    NRadioGroup,
    NRadioButton,
    NTabs,
    NTabPane,
    NTable,
    NEmpty
  } from 'naive-ui'
  import {
    PeopleOutline,
    PlayOutline,
    HeartOutline,
    ChatbubbleOutline,
    ReloadOutline,
    DownloadOutline,
    TrendingUpOutline,
    TrendingDownOutline,
    PersonAddOutline,
    VideocamOutline,
    ChatboxOutline,
    ThumbsUpOutline,
    AlertCircleOutline,
    EyeOutline
  } from '@vicons/ionicons5'
  import * as echarts from 'echarts/core'
  import {
    LineChart,
    BarChart,
    PieChart
  } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    ToolboxComponent
  } from 'echarts/components'
  import { LabelLayout, UniversalTransition } from 'echarts/features'
  import { CanvasRenderer } from 'echarts/renderers'

  // 使用ref创建响应式变量
  const timeRange = ref('week')

  // 使用markRaw包装图标组件以避免性能警告
  const trendingUpIcon = markRaw(TrendingUpOutline)
  const trendingDownIcon = markRaw(TrendingDownOutline)

  // 导入和初始化ECharts
  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LineChart,
    BarChart,
    PieChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    LegendComponent,
    ToolboxComponent
  ])

  // 图表实例
  let userActivityChart: echarts.ECharts | null = null
  let categoryDistChart: echarts.ECharts | null = null
  let tagDistChart: echarts.ECharts | null = null

  // 统计数据
  const statistics = ref([
    {
      key: 'users',
      title: '用户总数',
      value: '12,846',
      change: 5.8,
      icon: markRaw(PeopleOutline),
      class: 'user-stat'
    },
    {
      key: 'videos',
      title: '视频总数',
      value: '4,295',
      change: 12.4,
      icon: markRaw(PlayOutline),
      class: 'video-stat'
    },
    {
      key: 'interactions',
      title: '互动总数',
      value: '84,521',
      change: 8.2,
      icon: markRaw(HeartOutline),
      class: 'interaction-stat'
    },
    {
      key: 'comments',
      title: '评论总数',
      value: '31,275',
      change: -3.6,
      icon: markRaw(ChatbubbleOutline),
      class: 'comment-stat'
    }
  ])

  // 获取趋势样式
  function getTrendClass(change: number) {
    return change > 0 ? 'trend-up' : 'trend-down'
  }

  // 格式化趋势数据
  function formatTrend(change: number) {
    const prefix = change > 0 ? '+' : ''
    return `${prefix}${change.toFixed(1)}%`
  }

  // 近期活动
  const activities = ref([
    {
      id: '1',
      type: '注册',
      title: '新用户注册',
      description: '用户 John Doe 完成了注册',
      time: '10分钟前',
      avatar: 'https://i.pravatar.cc/100?img=1'
    },
    {
      id: '2',
      type: '上传',
      title: '视频上传',
      description: 'Alice 上传了新视频"Vue 3.0 深入解析"',
      time: '30分钟前',
      avatar: 'https://i.pravatar.cc/100?img=2'
    },
    {
      id: '3',
      type: '举报',
      title: '内容举报',
      description: '用户举报了一条不当评论',
      time: '1小时前',
      avatar: 'https://i.pravatar.cc/100?img=3'
    },
    {
      id: '4',
      type: '订阅',
      title: '频道订阅',
      description: 'Bob 订阅了 Tech Channel 频道',
      time: '2小时前',
      avatar: 'https://i.pravatar.cc/100?img=4'
    },
    {
      id: '5',
      type: '评论',
      title: '新评论',
      description: 'Charlie 在视频"JavaScript教程"下发表了评论',
      time: '3小时前',
      avatar: 'https://i.pravatar.cc/100?img=5'
    }
  ])

  // 待审核视频
  const pendingVideos = ref([
    {
      id: '1',
      title: 'Vue 3.0 完全指南',
      uploader: 'TechGuru',
      uploadTime: '今天 08:30'
    },
    {
      id: '2',
      title: 'React vs Vue 深度对比',
      uploader: 'CodeMaster',
      uploadTime: '今天 10:15'
    },
    {
      id: '3',
      title: 'TypeScript 高级技巧',
      uploader: 'JSNinja',
      uploadTime: '昨天 16:45'
    }
  ])

  // 待处理举报
  const pendingReports = ref([
    {
      id: '1',
      content: '视频含有不当内容',
      type: '违规内容',
      time: '今天 09:45'
    },
    {
      id: '2',
      content: '评论存在侮辱言论',
      type: '骚扰行为',
      time: '今天 11:30'
    },
    {
      id: '3',
      content: '用户多次发布垃圾信息',
      type: '垃圾信息',
      time: '昨天 14:20'
    }
  ])

  // 用户活跃趋势数据
  const getUserActivityData = computed(() => {
    // 根据时间范围选择不同的数据
    const data: Record<string, {
      labels: string[],
      activeUsers: number[],
      newUsers: number[],
      returningUsers: number[]
    }> = {
      day: {
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        activeUsers: [120, 85, 65, 140, 280, 350, 410, 320],
        newUsers: [20, 12, 8, 25, 45, 55, 42, 30],
        returningUsers: [100, 73, 57, 115, 235, 295, 368, 290]
      },
      week: {
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        activeUsers: [980, 1120, 1050, 1080, 1250, 1420, 1380],
        newUsers: [150, 185, 160, 175, 210, 280, 250],
        returningUsers: [830, 935, 890, 905, 1040, 1140, 1130]
      },
      month: {
        labels: ['1日', '5日', '10日', '15日', '20日', '25日', '30日'],
        activeUsers: [3200, 3450, 3800, 4100, 4300, 4500, 4800],
        newUsers: [520, 580, 650, 720, 780, 820, 840],
        returningUsers: [2680, 2870, 3150, 3380, 3520, 3680, 3960]
      }
    }
    return data[timeRange.value]
  })

  // 获取活动标签类型
  const getActivityTagType = (type: string): 'success' | 'info' | 'warning' | 'default' | 'error' | 'primary' => {
    const types: Record<string, 'success' | 'info' | 'warning' | 'default' | 'error' | 'primary'> = {
      '注册': 'success',
      '登录': 'info',
      '上传': 'primary',
      '评论': 'info',
      '点赞': 'success',
      '举报': 'warning',
      '系统': 'default'
    }
    return types[type] || 'default'
  }

  // 获取举报标签类型
  const getReportTagType = (type: string): 'success' | 'info' | 'warning' | 'default' | 'error' | 'primary' => {
    const types: Record<string, 'success' | 'info' | 'warning' | 'default' | 'error' | 'primary'> = {
      '垃圾内容': 'warning',
      '侵权': 'error',
      '不当行为': 'warning',
      '违规': 'error',
      '其他': 'info'
    }
    return types[type] || 'default'
  }

  // 刷新数据
  function refreshData() {
    console.log('刷新数据')
    // 实际应用中，这里应该调用API获取最新数据
  }

  // 导出数据
  function exportData() {
    console.log('导出数据')
    // 实际应用中，这里应该处理数据导出逻辑
  }

  // 监听时间范围变化，更新图表
  watch(timeRange, () => {
    updateUserActivityChart()
  })

  // 初始化用户活跃趋势图表
  const initUserActivityChart = () => {
    const chartDom = document.getElementById('userActivityChart')
    if (!chartDom) return

    userActivityChart = echarts.init(chartDom)
    updateUserActivityChart()

    // 响应窗口大小变化
    window.addEventListener('resize', () => {
      userActivityChart?.resize()
    })
  }

  // 更新用户活跃趋势图表
  const updateUserActivityChart = () => {
    if (!userActivityChart) return

    const data = getUserActivityData.value
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['活跃用户', '新用户', '回访用户']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.labels
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '活跃用户',
          type: 'line',
          smooth: true,
          data: data.activeUsers,
          itemStyle: {
            color: '#409EFF'
          }
        },
        {
          name: '新用户',
          type: 'line',
          smooth: true,
          data: data.newUsers,
          itemStyle: {
            color: '#67C23A'
          }
        },
        {
          name: '回访用户',
          type: 'line',
          smooth: true,
          data: data.returningUsers,
          itemStyle: {
            color: '#E6A23C'
          }
        }
      ]
    }

    userActivityChart.setOption(option)
  }

  // 分类分布数据
  const categoryDistributionData = [
    { value: 1048, name: '前端开发' },
    { value: 735, name: '后端开发' },
    { value: 580, name: '移动开发' },
    { value: 484, name: '数据科学' },
    { value: 300, name: 'DevOps' },
    { value: 220, name: '人工智能' },
    { value: 150, name: '区块链' }
  ]

  // 标签分布数据
  const tagDistributionData = [
    { value: 850, name: 'JavaScript' },
    { value: 742, name: 'Python' },
    { value: 610, name: 'Vue' },
    { value: 544, name: 'React' },
    { value: 420, name: 'Node.js' },
    { value: 370, name: 'TypeScript' },
    { value: 310, name: 'Java' },
    { value: 280, name: 'Go' },
    { value: 190, name: 'Docker' }
  ]

  // 初始化分类分布图表
  const initCategoryDistChart = () => {
    const chartDom = document.getElementById('categoryDistChart')
    if (!chartDom) return

    categoryDistChart = echarts.init(chartDom)

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        data: categoryDistributionData.map(item => item.name)
      },
      series: [
        {
          name: '分类分布',
          type: 'pie',
          radius: ['40%', '70%'],
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
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: categoryDistributionData
        }
      ]
    }

    categoryDistChart.setOption(option)

    // 响应窗口大小变化
    window.addEventListener('resize', () => {
      categoryDistChart?.resize()
    })
  }

  // 初始化标签分布图表
  const initTagDistChart = () => {
    const chartDom = document.getElementById('tagDistChart')
    if (!chartDom) return

    tagDistChart = echarts.init(chartDom)

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        data: tagDistributionData.map(item => item.name)
      },
      series: [
        {
          name: '标签分布',
          type: 'pie',
          radius: '70%',
          center: ['50%', '40%'],
          data: tagDistributionData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    tagDistChart.setOption(option)

    // 响应窗口大小变化
    window.addEventListener('resize', () => {
      tagDistChart?.resize()
    })
  }

  // 组件挂载时的处理
  onMounted(() => {
    console.log('管理仪表盘页面已加载')
    nextTick(() => {
      initUserActivityChart()
      initCategoryDistChart()
      initTagDistChart()
    })
  })

  // 组件卸载时的处理
  onBeforeUnmount(() => {
    // 清理ECharts实例
    userActivityChart = null
    categoryDistChart = null
    tagDistChart = null
  })
</script>

<style scoped>
  .admin-dashboard {
    padding-bottom: 24px;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .dashboard-title {
    font-size: 24px;
    font-weight: 500;
    margin: 0;
  }

  .stat-card {
    height: 100%;
  }

  .stat-wrapper {
    display: flex;
    align-items: center;
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 16px;
  }

  .user-stat .stat-icon {
    background-color: rgba(64, 158, 255, 0.1);
    color: #409eff;
  }

  .video-stat .stat-icon {
    background-color: rgba(103, 194, 58, 0.1);
    color: #67c23a;
  }

  .interaction-stat .stat-icon {
    background-color: rgba(230, 162, 60, 0.1);
    color: #e6a23c;
  }

  .comment-stat .stat-icon {
    background-color: rgba(245, 108, 108, 0.1);
    color: #f56c6c;
  }

  .stat-content {
    flex: 1;
  }

  .stat-title {
    font-size: 14px;
    color: var(--text-color-secondary);
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .stat-trend {
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .trend-up {
    color: #67c23a;
  }

  .trend-down {
    color: #f56c6c;
  }

  .dashboard-main {
    margin-top: 24px;
    margin-bottom: 24px;
  }

  .chart-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }

  .chart-container {
    height: 300px;
  }

  .echarts-container {
    height: 100%;
  }

  .content-stats-card {
    margin-bottom: 24px;
  }

  .activity-card {
    height: 100%;
  }

  .activity-list {
    max-height: 400px;
    overflow-y: auto;
  }

  .activity-footer {
    margin-top: 12px;
    text-align: center;
  }

  .tasks-card {
    margin-bottom: 24px;
  }

  @media (max-width: 768px) {
    .dashboard-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .stat-wrapper {
      flex-direction: column;
      text-align: center;
    }

    .stat-icon {
      margin-right: 0;
      margin-bottom: 12px;
    }
  }
</style>