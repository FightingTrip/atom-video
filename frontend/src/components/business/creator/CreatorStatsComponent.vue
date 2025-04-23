/**
* @file CreatorStatsComponent.vue
* @description 创作者数据统计组件，显示创作者视频数据、观看数据和收入数据
* @author Atom Video Team
* @date 2025-04-22
*/

<template>
  <div class="creator-stats-container">
    <n-spin :show="loading" description="加载中...">
      <!-- 标题栏 -->
      <div class="stats-header">
        <div>
          <h1 class="stats-title">数据概览</h1>
          <p class="stats-subtitle">数据更新时间: {{ formattedLastUpdate }}</p>
        </div>
        <div class="stats-actions">
          <n-button-group>
            <n-button size="small" @click="refreshData">
              <template #icon><n-icon><refresh-outline /></n-icon></template>
              刷新数据
            </n-button>
            <n-button size="small" @click="exportStatsToCSV">
              <template #icon><n-icon><download-outline /></n-icon></template>
              导出数据
            </n-button>
          </n-button-group>
          <n-button-group style="margin-left: 8px;">
            <n-button size="small" :type="period === '7d' ? 'primary' : 'default'"
              @click="changePeriod('7d')">7天</n-button>
            <n-button size="small" :type="period === '30d' ? 'primary' : 'default'"
              @click="changePeriod('30d')">30天</n-button>
            <n-button size="small" :type="period === '90d' ? 'primary' : 'default'"
              @click="changePeriod('90d')">90天</n-button>
          </n-button-group>
        </div>
      </div>

      <!-- 主要统计数据卡片 -->
      <div class="stats-grid">
        <!-- 内容统计 -->
        <div class="stats-card">
          <div class="stats-card-header">
            <div class="stats-card-title">
              <n-icon size="24" color="#ff7d00">
                <videocam-outline />
              </n-icon>
              <h2>内容数据</h2>
            </div>
            <n-button text @click="showContentTrends = true">
              <template #icon><n-icon><trending-up-outline /></n-icon></template>
              查看趋势
            </n-button>
          </div>
          <div class="stats-items">
            <div class="stats-item">
              <div class="stats-value">{{ formatNumber(stats.totalVideos) }}</div>
              <div class="stats-label">总视频数</div>
              <div class="stats-trend" :class="getTrendClass(stats.videosTrend)">
                {{ formatTrend(stats.videosTrend) }}
              </div>
            </div>
            <div class="stats-item">
              <div class="stats-value">{{ formatNumber(stats.publishedVideos) }}</div>
              <div class="stats-label">已发布</div>
              <div class="stats-trend" :class="getTrendClass(stats.publishedVideosTrend)">
                {{ formatTrend(stats.publishedVideosTrend) }}
              </div>
            </div>
            <div class="stats-item">
              <div class="stats-value">{{ formatNumber(stats.draftVideos) }}</div>
              <div class="stats-label">草稿数</div>
              <div class="stats-trend" :class="getTrendClass(stats.draftVideosTrend)">
                {{ formatTrend(stats.draftVideosTrend) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 观看统计 -->
        <div class="stats-card">
          <div class="stats-card-header">
            <div class="stats-card-title">
              <n-icon size="24" color="#00c2ff">
                <eye-outline />
              </n-icon>
              <h2>观看数据</h2>
            </div>
            <n-button text @click="showViewsTrends = true">
              <template #icon><n-icon><trending-up-outline /></n-icon></template>
              查看趋势
            </n-button>
          </div>
          <div class="stats-items">
            <div class="stats-item">
              <div class="stats-value">{{ formatNumber(stats.totalViews) }}</div>
              <div class="stats-label">总观看量</div>
              <div class="stats-trend" :class="getTrendClass(stats.viewsTrend)">
                {{ formatTrend(stats.viewsTrend) }}
              </div>
            </div>
            <div class="stats-item">
              <div class="stats-value">{{ formatNumber(stats.totalMinutesWatched) }}</div>
              <div class="stats-label">总观看时长(分钟)</div>
              <div class="stats-trend" :class="getTrendClass(stats.minutesWatchedTrend)">
                {{ formatTrend(stats.minutesWatchedTrend) }}
              </div>
            </div>
            <div class="stats-item">
              <div class="stats-value">{{ formatNumber(stats.averageViewDuration) }}</div>
              <div class="stats-label">平均观看时长(秒)</div>
              <div class="stats-trend" :class="getTrendClass(stats.viewDurationTrend)">
                {{ formatTrend(stats.viewDurationTrend) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 互动统计 -->
        <div class="stats-card">
          <div class="stats-card-header">
            <div class="stats-card-title">
              <n-icon size="24" color="#ff2d55">
                <heart-outline />
              </n-icon>
              <h2>互动数据</h2>
            </div>
            <n-button text @click="showEngagementTrends = true">
              <template #icon><n-icon><trending-up-outline /></n-icon></template>
              查看趋势
            </n-button>
          </div>
          <div class="stats-items">
            <div class="stats-item">
              <div class="stats-value">{{ formatNumber(stats.totalLikes) }}</div>
              <div class="stats-label">点赞数</div>
              <div class="stats-trend" :class="getTrendClass(stats.likesTrend)">
                {{ formatTrend(stats.likesTrend) }}
              </div>
            </div>
            <div class="stats-item">
              <div class="stats-value">{{ formatNumber(stats.totalComments) }}</div>
              <div class="stats-label">评论数</div>
              <div class="stats-trend" :class="getTrendClass(stats.commentsTrend)">
                {{ formatTrend(stats.commentsTrend) }}
              </div>
            </div>
            <div class="stats-item">
              <div class="stats-value">{{ formatNumber(stats.totalShares) }}</div>
              <div class="stats-label">分享数</div>
              <div class="stats-trend" :class="getTrendClass(stats.sharesTrend)">
                {{ formatTrend(stats.sharesTrend) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 收入统计 -->
        <div class="stats-card">
          <div class="stats-card-header">
            <div class="stats-card-title">
              <n-icon size="24" color="#34c759">
                <cash-outline />
              </n-icon>
              <h2>收入数据</h2>
            </div>
            <n-button text @click="showRevenueTrends = true">
              <template #icon><n-icon><trending-up-outline /></n-icon></template>
              查看趋势
            </n-button>
          </div>
          <div class="stats-items">
            <div class="stats-item">
              <div class="stats-value">¥{{ formatNumber(stats.totalRevenue) }}</div>
              <div class="stats-label">总收入</div>
              <div class="stats-trend" :class="getTrendClass(stats.revenueTrend)">
                {{ formatTrend(stats.revenueTrend) }}
              </div>
            </div>
            <div class="stats-item">
              <div class="stats-value">¥{{ formatNumber(stats.monthlyRevenue) }}</div>
              <div class="stats-label">本月收入</div>
              <div class="stats-trend" :class="getTrendClass(stats.monthlyRevenueTrend)">
                {{ formatTrend(stats.monthlyRevenueTrend) }}
              </div>
            </div>
            <div class="stats-item">
              <div class="stats-value">¥{{ formatNumber(stats.pendingRevenue) }}</div>
              <div class="stats-label">待结算</div>
              <n-button size="tiny" type="primary" style="margin-top: 4px;">提现</n-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 表现最好的视频 -->
      <div class="top-videos-section">
        <div class="section-header">
          <h2>表现最佳的视频</h2>
          <n-select v-model:value="topVideosMetric" size="small" :options="topVideosMetrics" style="width: 120px;" />
        </div>

        <div class="top-videos-container">
          <div v-for="(video, index) in topVideos" :key="video.id" class="top-video-card">
            <div class="top-video-rank">{{ index + 1 }}</div>
            <div class="top-video-thumbnail">
              <img :src="video.thumbnailUrl" :alt="video.title" />
              <div class="video-duration">{{ formatDuration(video.duration) }}</div>
            </div>
            <div class="top-video-info">
              <div class="top-video-title">{{ video.title }}</div>
              <div class="top-video-stats">
                <div class="top-video-stat">
                  <n-icon><eye-outline /></n-icon>
                  <span>{{ formatNumber(video.views) }}</span>
                </div>
                <div class="top-video-stat">
                  <n-icon><heart-outline /></n-icon>
                  <span>{{ formatNumber(video.likes) }}</span>
                </div>
                <div class="top-video-stat">
                  <n-icon><cash-outline /></n-icon>
                  <span>¥{{ formatNumber(video.revenue) }}</span>
                </div>
              </div>
              <div class="top-video-date">发布于 {{ formatDate(video.publishDate) }}</div>
            </div>
            <div class="top-video-metric">
              <div class="metric-value">{{ formatTopMetric(video, topVideosMetric) }}</div>
              <div class="metric-label">{{ getTopMetricLabel(topVideosMetric) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 趋势图表模态框 -->
      <n-modal v-model:show="showContentTrends" preset="card" title="内容发布趋势" style="width: 800px; max-width: 90vw;">
        <trend-chart :data="contentTrendsData" title="内容发布趋势" sub-title="按时间查看您的内容发布数据" color="#ff7d00" />
      </n-modal>

      <n-modal v-model:show="showViewsTrends" preset="card" title="观看趋势" style="width: 800px; max-width: 90vw;">
        <trend-chart :data="viewsTrendsData" title="观看趋势" sub-title="按时间查看您的视频观看数据" color="#00c2ff" />
      </n-modal>

      <n-modal v-model:show="showEngagementTrends" preset="card" title="互动趋势" style="width: 800px; max-width: 90vw;">
        <trend-chart :data="engagementTrendsData" title="互动趋势" sub-title="按时间查看您的视频互动数据" color="#ff2d55"
          :multi-line="true" />
      </n-modal>

      <n-modal v-model:show="showRevenueTrends" preset="card" title="收入趋势" style="width: 800px; max-width: 90vw;">
        <trend-chart :data="revenueTrendsData" title="收入趋势" sub-title="按时间查看您的收入数据" color="#34c759" />
      </n-modal>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue';
  import { NButton, NButtonGroup, NSpin, NIcon, NModal, NSelect } from 'naive-ui';
  import {
    EyeOutline,
    HeartOutline,
    VideocamOutline,
    RefreshOutline,
    DownloadOutline,
    TrendingUpOutline,
    CashOutline
  } from '@vicons/ionicons5';
  import { creatorService } from '@/services/creator';
  import TrendChart from './TrendChart.vue';

  // 定义接口
  interface VideoStats {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: number;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    revenue: number;
    publishDate: string;
  }

  interface StatsData {
    // 内容数据
    totalVideos: number;
    publishedVideos: number;
    draftVideos: number;
    videosTrend: number;
    publishedVideosTrend: number;
    draftVideosTrend: number;

    // 观看数据
    totalViews: number;
    totalMinutesWatched: number;
    averageViewDuration: number;
    viewsTrend: number;
    minutesWatchedTrend: number;
    viewDurationTrend: number;

    // 互动数据
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    likesTrend: number;
    commentsTrend: number;
    sharesTrend: number;

    // 收入数据
    totalRevenue: number;
    monthlyRevenue: number;
    pendingRevenue: number;
    revenueTrend: number;
    monthlyRevenueTrend: number;

    lastUpdated: string;
  }

  interface TrendDataItem {
    date: string;
    value: number;
    likes?: number;
    comments?: number;
    shares?: number;
  }

  // 状态
  const loading = ref(false);
  const stats = reactive<StatsData>({
    totalVideos: 0,
    publishedVideos: 0,
    draftVideos: 0,
    videosTrend: 0,
    publishedVideosTrend: 0,
    draftVideosTrend: 0,

    totalViews: 0,
    totalMinutesWatched: 0,
    averageViewDuration: 0,
    viewsTrend: 0,
    minutesWatchedTrend: 0,
    viewDurationTrend: 0,

    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    likesTrend: 0,
    commentsTrend: 0,
    sharesTrend: 0,

    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingRevenue: 0,
    revenueTrend: 0,
    monthlyRevenueTrend: 0,

    lastUpdated: new Date().toISOString()
  });

  const topVideos = ref<VideoStats[]>([]);
  const period = ref<'7d' | '30d' | '90d'>('30d');
  const topVideosMetric = ref<string>('views');
  const topVideosMetrics = [
    { label: '观看量', value: 'views' },
    { label: '点赞数', value: 'likes' },
    { label: '评论数', value: 'comments' },
    { label: '分享数', value: 'shares' },
    { label: '收入', value: 'revenue' }
  ];

  // 趋势数据和模态框状态
  const contentTrendsData = ref<TrendDataItem[]>([]);
  const viewsTrendsData = ref<TrendDataItem[]>([]);
  const engagementTrendsData = ref<TrendDataItem[]>([]);
  const revenueTrendsData = ref<TrendDataItem[]>([]);

  const showContentTrends = ref(false);
  const showViewsTrends = ref(false);
  const showEngagementTrends = ref(false);
  const showRevenueTrends = ref(false);

  // 计算属性
  const formattedLastUpdate = computed(() => {
    const date = new Date(stats.lastUpdated);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  // 方法
  // 格式化数字（添加千位分隔符和缩写）
  const formatNumber = (value: any): string => {
    // 处理undefined或null值，返回默认值'0'
    if (value === undefined || value === null) {
      return '0';
    }

    // 确保value是数字
    const num = typeof value === 'number' ? value : Number(value);

    // 如果NaN，返回'0'
    if (isNaN(num)) {
      return '0';
    }

    // 格式化数字
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // 格式化趋势百分比
  const formatTrend = (trend: number): string => {
    // 处理undefined或null值
    if (trend === undefined || trend === null) {
      return '0.0%';
    }

    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  // 获取趋势样式类
  const getTrendClass = (trend: number): string => {
    // 处理undefined或null值
    if (trend === undefined || trend === null) {
      return 'trend-neutral';
    }

    if (trend > 0) return 'trend-up';
    if (trend < 0) return 'trend-down';
    return 'trend-neutral';
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  // 格式化视频时长
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 格式化顶部视频的指标
  const formatTopMetric = (video: VideoStats, metric: string): string => {
    switch (metric) {
      case 'views':
        return formatNumber(video.views);
      case 'likes':
        return formatNumber(video.likes);
      case 'comments':
        return formatNumber(video.comments);
      case 'shares':
        return formatNumber(video.shares);
      case 'revenue':
        return '¥' + formatNumber(video.revenue);
      default:
        return formatNumber(video.views);
    }
  };

  // 获取顶部视频指标的标签
  const getTopMetricLabel = (metric: string): string => {
    switch (metric) {
      case 'views':
        return '观看量';
      case 'likes':
        return '点赞数';
      case 'comments':
        return '评论数';
      case 'shares':
        return '分享数';
      case 'revenue':
        return '收入';
      default:
        return '观看量';
    }
  };

  // 刷新数据
  const refreshData = async () => {
    loading.value = true;
    try {
      // 获取统计数据
      const statsData = await creatorService.getCreatorStats(period.value);
      Object.assign(stats, statsData);

      // 获取趋势数据
      contentTrendsData.value = await creatorService.getContentTrends(period.value);
      viewsTrendsData.value = await creatorService.getViewsTrends(period.value);
      engagementTrendsData.value = await creatorService.getEngagementTrends(period.value);
      revenueTrendsData.value = await creatorService.getRevenueTrends(period.value);

      // 获取表现最好的视频
      topVideos.value = await creatorService.getTopVideos({
        metric: topVideosMetric.value,
        period: period.value,
        limit: 5
      });
    } catch (error) {
      console.error('Failed to fetch creator stats:', error);
    } finally {
      loading.value = false;
    }
  };

  // 导出统计数据为CSV
  const exportStatsToCSV = () => {
    // 确保所有值都是字符串，防止undefined.toString()错误
    const safeToString = (value: any): string => {
      return value !== undefined && value !== null ? value.toString() : '0';
    };

    // 构建CSV数据
    const csvRows = [
      ['指标', '值', '趋势'],
      ['总视频数', safeToString(stats.totalVideos), safeToString(stats.videosTrend) + '%'],
      ['已发布视频', safeToString(stats.publishedVideos), safeToString(stats.publishedVideosTrend) + '%'],
      ['草稿视频', safeToString(stats.draftVideos), safeToString(stats.draftVideosTrend) + '%'],
      ['总观看量', safeToString(stats.totalViews), safeToString(stats.viewsTrend) + '%'],
      ['总观看时长(分钟)', safeToString(stats.totalMinutesWatched), safeToString(stats.minutesWatchedTrend) + '%'],
      ['平均观看时长(秒)', safeToString(stats.averageViewDuration), safeToString(stats.viewDurationTrend) + '%'],
      ['总点赞数', safeToString(stats.totalLikes), safeToString(stats.likesTrend) + '%'],
      ['总评论数', safeToString(stats.totalComments), safeToString(stats.commentsTrend) + '%'],
      ['总分享数', safeToString(stats.totalShares), safeToString(stats.sharesTrend) + '%'],
      ['总收入(¥)', safeToString(stats.totalRevenue), safeToString(stats.revenueTrend) + '%'],
      ['本月收入(¥)', safeToString(stats.monthlyRevenue), safeToString(stats.monthlyRevenueTrend) + '%'],
      ['待结算收入(¥)', safeToString(stats.pendingRevenue), '']
    ];

    // 转换为CSV字符串
    const csvContent = csvRows.map(row => row.join(',')).join('\n');

    // 创建Blob并下载
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `creator_stats_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 切换时间段
  const changePeriod = (newPeriod: '7d' | '30d' | '90d') => {
    period.value = newPeriod;
    refreshData();
  };

  // 在组件挂载时获取数据
  onMounted(() => {
    refreshData();
  });
</script>

<style scoped>
  .creator-stats-container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }

  .stats-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .stats-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }

  .stats-subtitle {
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
    font-size: 14px;
  }

  .stats-actions {
    display: flex;
    align-items: center;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .stats-card {
    background-color: var(--card-color, #1a1a1a);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .stats-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .stats-card-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .stats-card-title h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  .stats-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 16px;
  }

  .stats-item {
    text-align: center;
  }

  .stats-value {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .stats-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 4px;
  }

  .stats-trend {
    font-size: 13px;
    font-weight: 500;
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

  .top-videos-section {
    background-color: var(--card-color, #1a1a1a);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .section-header h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  .top-videos-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .top-video-card {
    display: flex;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    transition: transform 0.2s;
  }

  .top-video-card:hover {
    transform: translateY(-2px);
  }

  .top-video-rank {
    position: absolute;
    top: 8px;
    left: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-weight: bold;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .top-video-thumbnail {
    width: 100px;
    height: 80px;
    position: relative;
    flex-shrink: 0;
  }

  .top-video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-duration {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 12px;
    padding: 1px 4px;
    border-radius: 2px;
  }

  .top-video-info {
    padding: 8px;
    flex-grow: 1;
    min-width: 0;
  }

  .top-video-title {
    font-weight: 500;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .top-video-stats {
    display: flex;
    gap: 10px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 6px;
  }

  .top-video-stat {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .top-video-stat .n-icon {
    font-size: 14px;
  }

  .top-video-date {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }

  .top-video-metric {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 80px;
    flex-shrink: 0;
  }

  .metric-value {
    font-weight: 600;
    font-size: 16px;
  }

  .metric-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
  }

  @media (max-width: 768px) {
    .stats-header {
      flex-direction: column;
      gap: 12px;
    }

    .stats-actions {
      width: 100%;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .top-videos-container {
      grid-template-columns: 1fr;
    }
  }
</style>