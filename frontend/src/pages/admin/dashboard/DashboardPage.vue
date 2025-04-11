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
          <div class="chart-placeholder">
            <n-empty description="用户活跃趋势图表" />
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
          <div class="chart-placeholder">
            <n-empty description="分类分布图表" />
          </div>
        </n-grid-item>
        <n-grid-item>
          <div class="chart-placeholder">
            <n-empty description="标签分布图表" />
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
import { ref, onMounted } from 'vue'
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

// 使用ref创建响应式变量
const timeRange = ref('week')

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
    change: 8.2,
    icon: HeartOutline,
    class: 'interaction-stat'
  },
  {
    key: 'comments',
    title: '评论总数',
    value: '31,275',
    change: -3.6,
    icon: ChatbubbleOutline,
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

// 获取活动标签类型
function getActivityTagType(type: string) {
  const typeMap: Record<string, string> = {
    '注册': 'success',
    '上传': 'info',
    '举报': 'warning',
    '订阅': 'success',
    '评论': 'info'
  }
  return typeMap[type] || 'default'
}

// 获取举报类型标签
function getReportTagType(type: string) {
  const typeMap: Record<string, string> = {
    '违规内容': 'error',
    '骚扰行为': 'warning',
    '垃圾信息': 'info'
  }
  return typeMap[type] || 'default'
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

// 组件挂载时的处理
onMounted(() => {
  console.log('管理仪表盘页面已加载')
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

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
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