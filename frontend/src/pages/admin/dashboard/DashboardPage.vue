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
              <n-icon><ReloadOutline /></n-icon>
            </template>
            刷新数据
          </n-button>
          <n-button @click="exportData">
            <template #icon>
              <n-icon><DownloadOutline /></n-icon>
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
                  <component :is="stat.change > 0 ? TrendingUpOutline : TrendingDownOutline" />
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
          <div class="chart-container" ref="userTrendsChart"></div>
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
          <div class="chart-container" ref="categoryChart"></div>
        </n-grid-item>
        <n-grid-item>
          <div class="chart-container" ref="tagChart"></div>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
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
  NTable
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
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  BarChart,
  PieChart,
  CanvasRenderer
])

// 统计数据
const statistics = ref([
  {
    key: 'users',
    title: '用户总数',
    value: '12,846',
    change: 5.8,
    icon: PeopleOutline,
    class: 'user-stat'
  },
  {
    key: 'videos',
    title: '视频总数',
    value: '4,295',
    change: 12.4,
    icon: PlayOutline,
    class: 'video-stat'
  },
  {
    key: 'interactions',
    title: '互动总数',
    value: '84,521',
    change: -2.3,
    icon: HeartOutline,
    class: 'interaction-stat'
  },
  {
    key: 'comments',
    title: '评论总数',
    value: '31,275',
    change: 8.7,
    icon: ChatbubbleOutline,
    class: 'comment-stat'
  }
])

// 近期活动
const activities = ref([
  {
    id: 1,
    title: '新用户注册',
    description: '用户 John Doe 完成了注册',
    type: '用户',
    time: '10分钟前',
    avatar: 'https://i.pravatar.cc/100?img=1'
  },
  {
    id: 2,
    title: '视频上传',
    description: 'Alice 上传了新视频"Vue 3.0 深入解析"',
    type: '内容',
    time: '30分钟前',
    avatar: 'https://i.pravatar.cc/100?img=2'
  },
  {
    id: 3,
    title: '举报处理',
    description: '管理员处理了一条内容投诉',
    type: '管理',
    time: '2小时前',
    avatar: 'https://i.pravatar.cc/100?img=3'
  },
  {
    id: 4,
    title: '评论标记',
    description: '系统自动标记了一条可能违规的评论',
    type: '系统',
    time: '4小时前',
    avatar: 'https://i.pravatar.cc/100?img=4'
  },
  {
    id: 5,
    title: '创作者认证',
    description: 'Bob 申请了创作者认证',
    type: '认证',
    time: '1天前',
    avatar: 'https://i.pravatar.cc/100?img=5'
  }
])

// 待审核视频
const pendingVideos = ref([
  {
    id: 1,
    title: 'TypeScript高级类型讲解',
    uploader: 'Alice',
    uploadTime: '2025-04-10 14:30'
  },
  {
    id: 2,
    title: 'React Hooks深入解析',
    uploader: 'Bob',
    uploadTime: '2025-04-10 11:15'
  },
  {
    id: 3,
    title: 'Vue 3.0性能优化技巧',
    uploader: 'Charlie',
    uploadTime: '2025-04-09 18:45'
  }
])

// 待处理举报
const pendingReports = ref([
  {
    id: 1,
    content: '视频"JavaScript基础"中包含不当内容',
    type: '内容不当',
    time: '2025-04-10 16:20'
  },
  {
    id: 2,
    content: '用户"BadUser"的评论有侮辱性言论',
    type: '骚扰',
    time: '2025-04-10 10:05'
  },
  {
    id: 3,
    content: '视频"数据结构"疑似抄袭',
    type: '版权',
    time: '2025-04-09 22:15'
  }
])

// 时间范围选择
const timeRange = ref('week')

// 图表引用
const userTrendsChart = ref<HTMLElement | null>(null)
const categoryChart = ref<HTMLElement | null>(null)
const tagChart = ref<HTMLElement | null>(null)

// 渲染区
let userTrendsChartInstance: echarts.ECharts | null = null
let categoryChartInstance: echarts.ECharts | null = null
let tagChartInstance: echarts.ECharts | null = null

// 格式化趋势
const formatTrend = (change: number) => {
  return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`
}

// 获取趋势样式类
const getTrendClass = (change: number) => {
  return change > 0 ? 'trend-up' : 'trend-down'
}

// 获取活动标签类型
const getActivityTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    '用户': 'success',
    '内容': 'info',
    '管理': 'warning',
    '系统': 'default',
    '认证': 'primary'
  }
  return typeMap[type] || 'default'
}

// 获取举报标签类型
const getReportTagType = (type: string) => {
  const typeMap: Record<string, string> = {
    '内容不当': 'warning',
    '骚扰': 'error',
    '版权': 'info'
  }
  return typeMap[type] || 'default'
}

// 刷新数据
const refreshData = () => {
  console.log('刷新数据')
  // TODO: 调用API获取最新数据
}

// 导出报表
const exportData = () => {
  console.log('导出报表')
  // TODO: 导出报表功能
}

// 初始化用户趋势图表
const initUserTrendsChart = () => {
  if (!userTrendsChart.value) return
  
  userTrendsChartInstance = echarts.init(userTrendsChart.value)
  
  const option = {
    title: {
      text: '平台用户活跃度趋势',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['活跃用户', '新增用户', '视频观看']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '活跃用户',
        type: 'line',
        data: [450, 482, 531, 654, 830, 940, 1200],
        smooth: true,
        lineStyle: {
          width: 3
        }
      },
      {
        name: '新增用户',
        type: 'line',
        data: [30, 42, 51, 54, 83, 94, 120],
        smooth: true,
        lineStyle: {
          width: 3
        }
      },
      {
        name: '视频观看',
        type: 'line',
        data: [1200, 1582, 1631, 1854, 2030, 2640, 3200],
        smooth: true,
        lineStyle: {
          width: 3
        }
      }
    ]
  }
  
  userTrendsChartInstance.setOption(option)
}

// 初始化分类图表
const initCategoryChart = () => {
  if (!categoryChart.value) return
  
  categoryChartInstance = echarts.init(categoryChart.value)
  
  const option = {
    title: {
      text: '视频分类占比',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: ['前端', '后端', '移动开发', '数据库', '人工智能', '其他']
    },
    series: [
      {
        name: '视频分类',
        type: 'pie',
        radius: ['50%', '70%'],
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
            fontSize: '15',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '前端' },
          { value: 735, name: '后端' },
          { value: 580, name: '移动开发' },
          { value: 484, name: '数据库' },
          { value: 300, name: '人工智能' },
          { value: 200, name: '其他' }
        ]
      }
    ]
  }
  
  categoryChartInstance.setOption(option)
}

// 初始化标签图表
const initTagChart = () => {
  if (!tagChart.value) return
  
  tagChartInstance = echarts.init(tagChart.value)
  
  const option = {
    title: {
      text: '热门标签统计',
      textStyle: {
        fontSize: 14
      }
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
      data: ['Vue', 'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Docker']
    },
    series: [
      {
        name: '视频数量',
        type: 'bar',
        data: [420, 380, 370, 320, 280, 240, 190]
      }
    ]
  }
  
  tagChartInstance.setOption(option)
}

// 初始化所有图表
const initCharts = () => {
  initUserTrendsChart()
  initCategoryChart()
  initTagChart()
}

// 窗口大小变化时重绘图表
const handleResize = () => {
  userTrendsChartInstance?.resize()
  categoryChartInstance?.resize()
  tagChartInstance?.resize()
}

// 组件挂载时初始化图表
onMounted(() => {
  // 需要延迟一下，确保DOM已经渲染完成
  setTimeout(() => {
    initCharts()
    window.addEventListener('resize', handleResize)
  }, 100)
})

// 组件卸载时销毁图表实例
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  userTrendsChartInstance?.dispose()
  categoryChartInstance?.dispose()
  tagChartInstance?.dispose()
})
</script>

<style scoped>
.admin-dashboard {
  width: 100%;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 500;
}

.stat-card {
  height: 100%;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-wrapper {
  display: flex;
  align-items: center;
}

.stat-icon {
  padding: 12px;
  border-radius: 50%;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-stat .stat-icon {
  background-color: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.video-stat .stat-icon {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.interaction-stat .stat-icon {
  background-color: rgba(250, 84, 28, 0.1);
  color: #fa541c;
}

.comment-stat .stat-icon {
  background-color: rgba(47, 84, 235, 0.1);
  color: #2f54eb;
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
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-up {
  color: #52c41a;
}

.trend-down {
  color: #ff4d4f;
}

.dashboard-main {
  margin-top: 24px;
}

.chart-card,
.activity-card,
.content-stats-card,
.tasks-card {
  height: 100%;
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

.activity-list {
  max-height: 320px;
  overflow-y: auto;
}

.activity-footer {
  text-align: center;
  margin-top: 16px;
}

@media (max-width: 1200px) {
  .chart-container {
    height: 250px;
  }
  
  .activity-list {
    max-height: 250px;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .chart-container {
    height: 200px;
  }
}
</style> 