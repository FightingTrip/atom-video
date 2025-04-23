/**
 * @file analyticsService.ts
 * @description 数据分析服务，提供各种分析数据获取和处理功能
 * @author Atom Video Team
 * @date 2025-04-25
 */

import api from '../api';
import { mockDb } from '@/mock/utils';
import { getToken } from '@/utils/auth';

export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyGrowth: number;
  estimatedYearlyRevenue: number;
  lifetimeRevenue: number;
  monthlyData: {
    month: string;
    revenue: number;
    views: number;
  }[];
  sources: {
    name: string;
    value: number;
  }[];
  predictions: {
    nextMonth: number;
    threeMonths: number;
    remainingYear: number;
    nextYear: number;
  };
  topVideos: {
    title: string;
    views: number;
    revenue: number;
    revenuePerView: number;
  }[];
  suggestions: {
    title: string;
    description: string;
  }[];
}

export interface AudienceAnalytics {
  totalViewers: number;
  returningViewers: number;
  newViewers: number;
  averageWatchTime: number; // 秒
  geography: {
    name: string;
    value: number;
  }[];
  international: {
    name: string;
    value: number;
  }[];
  timeDistribution: {
    hour: number;
    value: number;
  }[];
  ageDistribution: {
    group: string;
    value: number;
  }[];
  genderDistribution: {
    gender: string;
    value: number;
  }[];
  deviceDistribution: {
    device: string;
    value: number;
  }[];
  trafficSources: {
    source: string;
    value: number;
  }[];
  referrers: {
    name: string;
    value: number;
  }[];
  searchKeywords: {
    keyword: string;
    value: number;
  }[];
  interactionData: {
    comments: { time: number; value: number }[];
    likes: { time: number; value: number }[];
    shares: { time: number; value: number }[];
    danmaku: { time: number; value: number }[];
  };
  retentionData: {
    segments: {
      segment: string;
      retention: number;
    }[];
  };
}

export interface ContentAnalytics {
  categoryPerformance: {
    category: string;
    videoCount: number;
    totalViews: number;
    avgViews: number;
    totalRevenue: number;
    avgRevenue: number;
    engagement: number;
  }[];
  durationPerformance: {
    duration: string;
    videoCount: number;
    avgRetention: number;
    avgEngagement: number;
    avgRevenue: number;
  }[];
  topPerformingVideos: {
    id: string;
    title: string;
    views: number;
    engagement: number;
    retention: number;
    revenue: number;
  }[];
  optimizationTips: {
    title: string;
    description: string;
    actionItems: string[];
  }[];
  publishTimeAnalysis: {
    dayOfWeek: string;
    timeOfDay: string;
    performance: number;
  }[];
}

class AnalyticsService {
  /**
   * 获取收益分析数据
   * @param params 参数对象
   * @returns 收益分析数据
   */
  async getRevenueAnalytics(params: {
    videoId?: string;
    timeFrame?: 'week' | 'month' | 'quarter' | 'year';
  }): Promise<RevenueAnalytics> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('未授权，请先登录');
      }

      // 在实际项目中，这里应该调用API
      // const response = await api.get('/api/analytics/revenue', { params });
      // return response.data;

      // 模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 使用mockDb获取收益相关数据
      const userId = mockDb.getUserIdFromToken(token) as string;

      // 获取用户的视频数据
      const userVideos = mockDb.db.videos.filter(v => v.authorId === userId);

      // 获取所有收益数据
      const revenues = mockDb.db.revenues.filter(r => r.userId === userId);

      // 计算总收益
      const totalRevenue = revenues.reduce((sum, rev) => sum + rev.amount, 0);

      // 返回模拟的收益分析数据
      return {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        monthlyGrowth: 12.5,
        estimatedYearlyRevenue: Math.round(totalRevenue * 12 * 100) / 100,
        lifetimeRevenue: Math.round(totalRevenue * 1.5 * 100) / 100,
        monthlyData: [
          { month: '一月', revenue: 2100.32, views: 152000 },
          { month: '二月', revenue: 2350.18, views: 168000 },
          { month: '三月', revenue: 2480.75, views: 175000 },
          { month: '四月', revenue: 2600.45, views: 183000 },
          { month: '五月', revenue: 2950.8, views: 205000 },
          { month: '六月', revenue: 3180.25, views: 215000 },
          { month: '七月', revenue: 3578.42, views: 230000 },
        ],
        sources: [
          { name: '广告收入', value: Math.round(totalRevenue * 0.6 * 100) / 100 },
          { name: '会员订阅', value: Math.round(totalRevenue * 0.25 * 100) / 100 },
          { name: '打赏', value: Math.round(totalRevenue * 0.1 * 100) / 100 },
          { name: '付费内容', value: Math.round(totalRevenue * 0.05 * 100) / 100 },
        ],
        predictions: {
          nextMonth: Math.round(totalRevenue * 1.05 * 100) / 100,
          threeMonths: Math.round(totalRevenue * 3.2 * 100) / 100,
          remainingYear: Math.round(totalRevenue * 6 * 100) / 100,
          nextYear: Math.round(totalRevenue * 14 * 100) / 100,
        },
        topVideos: userVideos.slice(0, 5).map(video => ({
          title: video.title,
          views: video.views,
          revenue: Math.round(video.views * 0.01 * 100) / 100,
          revenuePerView: 0.01,
        })),
        suggestions: [
          {
            title: '增加上传频率',
            description:
              '数据显示，每周上传2-3个视频的创作者收益增长率高出30%。考虑增加您的上传频率。',
          },
          {
            title: '优化视频长度',
            description:
              '您的8-12分钟长度的视频获得最高的收益率。考虑将更多视频控制在这个时长范围内。',
          },
          {
            title: '探索新的内容类别',
            description: '科技评测和教程类内容在您的频道中表现最佳。考虑增加这类内容的比重。',
          },
          {
            title: '增加互动元素',
            description: '增加视频中的互动环节可以提高观众参与度和停留时间，从而增加广告收益。',
          },
        ],
      };
    } catch (error) {
      console.error('获取收益分析数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取观众分析数据
   * @param params 参数对象
   * @returns 观众分析数据
   */
  async getAudienceAnalytics(params: {
    videoId?: string;
    timeFrame?: 'week' | 'month' | 'quarter' | 'year';
  }): Promise<AudienceAnalytics> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('未授权，请先登录');
      }

      // 在实际项目中，这里应该调用API
      // const response = await api.get('/api/analytics/audience', { params });
      // return response.data;

      // 模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 使用mockDb获取用户信息
      const userId = mockDb.getUserIdFromToken(token) as string;

      // 获取用户的视频数据
      const userVideos = mockDb.db.videos.filter(v => v.authorId === userId);

      // 计算总观看次数
      const totalViews = userVideos.reduce((sum, video) => sum + video.views, 0);

      // 模拟返回观众分析数据
      return {
        totalViewers: totalViews,
        returningViewers: Math.floor(totalViews * 0.57),
        newViewers: Math.floor(totalViews * 0.43),
        averageWatchTime: 475, // 秒
        geography: [
          { name: '北京', value: Math.floor(totalViews * 0.12) },
          { name: '上海', value: Math.floor(totalViews * 0.15) },
          { name: '广州', value: Math.floor(totalViews * 0.08) },
          { name: '深圳', value: Math.floor(totalViews * 0.07) },
          { name: '杭州', value: Math.floor(totalViews * 0.06) },
          { name: '成都', value: Math.floor(totalViews * 0.05) },
          { name: '武汉', value: Math.floor(totalViews * 0.04) },
          { name: '南京', value: Math.floor(totalViews * 0.04) },
          { name: '重庆', value: Math.floor(totalViews * 0.03) },
          { name: '西安', value: Math.floor(totalViews * 0.03) },
        ],
        international: [
          { name: '中国', value: Math.floor(totalViews * 0.65) },
          { name: '美国', value: Math.floor(totalViews * 0.12) },
          { name: '日本', value: Math.floor(totalViews * 0.08) },
          { name: '韩国', value: Math.floor(totalViews * 0.05) },
          { name: '英国', value: Math.floor(totalViews * 0.03) },
          { name: '德国', value: Math.floor(totalViews * 0.02) },
          { name: '法国', value: Math.floor(totalViews * 0.02) },
          { name: '加拿大', value: Math.floor(totalViews * 0.015) },
          { name: '澳大利亚', value: Math.floor(totalViews * 0.01) },
          { name: '俄罗斯', value: Math.floor(totalViews * 0.005) },
        ],
        timeDistribution: [
          { hour: 0, value: Math.floor(totalViews * 0.02) },
          { hour: 1, value: Math.floor(totalViews * 0.015) },
          { hour: 2, value: Math.floor(totalViews * 0.01) },
          { hour: 3, value: Math.floor(totalViews * 0.005) },
          { hour: 4, value: Math.floor(totalViews * 0.003) },
          { hour: 5, value: Math.floor(totalViews * 0.005) },
          { hour: 6, value: Math.floor(totalViews * 0.01) },
          { hour: 7, value: Math.floor(totalViews * 0.02) },
          { hour: 8, value: Math.floor(totalViews * 0.03) },
          { hour: 9, value: Math.floor(totalViews * 0.04) },
          { hour: 10, value: Math.floor(totalViews * 0.05) },
          { hour: 11, value: Math.floor(totalViews * 0.06) },
          { hour: 12, value: Math.floor(totalViews * 0.07) },
          { hour: 13, value: Math.floor(totalViews * 0.06) },
          { hour: 14, value: Math.floor(totalViews * 0.05) },
          { hour: 15, value: Math.floor(totalViews * 0.06) },
          { hour: 16, value: Math.floor(totalViews * 0.07) },
          { hour: 17, value: Math.floor(totalViews * 0.08) },
          { hour: 18, value: Math.floor(totalViews * 0.09) },
          { hour: 19, value: Math.floor(totalViews * 0.11) },
          { hour: 20, value: Math.floor(totalViews * 0.13) },
          { hour: 21, value: Math.floor(totalViews * 0.15) },
          { hour: 22, value: Math.floor(totalViews * 0.11) },
          { hour: 23, value: Math.floor(totalViews * 0.07) },
        ],
        ageDistribution: [
          { group: '18以下', value: Math.floor(totalViews * 0.1) },
          { group: '18-24', value: Math.floor(totalViews * 0.28) },
          { group: '25-34', value: Math.floor(totalViews * 0.35) },
          { group: '35-44', value: Math.floor(totalViews * 0.16) },
          { group: '45-54', value: Math.floor(totalViews * 0.07) },
          { group: '55以上', value: Math.floor(totalViews * 0.04) },
        ],
        genderDistribution: [
          { gender: '男', value: Math.floor(totalViews * 0.58) },
          { gender: '女', value: Math.floor(totalViews * 0.41) },
          { gender: '其他', value: Math.floor(totalViews * 0.01) },
        ],
        deviceDistribution: [
          { device: '手机', value: Math.floor(totalViews * 0.62) },
          { device: '电脑', value: Math.floor(totalViews * 0.31) },
          { device: '平板', value: Math.floor(totalViews * 0.06) },
          { device: '电视', value: Math.floor(totalViews * 0.01) },
        ],
        trafficSources: [
          { source: '搜索', value: Math.floor(totalViews * 0.25) },
          { source: '首页推荐', value: Math.floor(totalViews * 0.35) },
          { source: '外部链接', value: Math.floor(totalViews * 0.15) },
          { source: '订阅', value: Math.floor(totalViews * 0.18) },
          { source: '相关视频', value: Math.floor(totalViews * 0.07) },
        ],
        referrers: [
          { name: '微信', value: Math.floor(totalViews * 0.05) },
          { name: '微博', value: Math.floor(totalViews * 0.04) },
          { name: '知乎', value: Math.floor(totalViews * 0.03) },
          { name: '百度', value: Math.floor(totalViews * 0.02) },
          { name: 'BiliBili', value: Math.floor(totalViews * 0.01) },
          { name: '其他网站', value: Math.floor(totalViews * 0.01) },
        ],
        searchKeywords: [
          { keyword: 'Atom视频', value: 8547 },
          { keyword: '视频创作教程', value: 5874 },
          { keyword: '视频剪辑', value: 4587 },
          { keyword: '视频平台', value: 3254 },
          { keyword: '内容创作', value: 2541 },
          { keyword: '视频上传', value: 2145 },
          { keyword: '其他关键词', value: 5599 },
        ],
        interactionData: {
          // 视频互动时间戳数据（模拟视频总长15分钟，按10秒分段）
          comments: Array.from({ length: 90 }, (_, i) => ({
            time: i * 10,
            value: Math.floor(Math.random() * 100),
          })),
          likes: Array.from({ length: 90 }, (_, i) => ({
            time: i * 10,
            value: Math.floor(Math.random() * 150),
          })),
          shares: Array.from({ length: 90 }, (_, i) => ({
            time: i * 10,
            value: Math.floor(Math.random() * 50),
          })),
          danmaku: Array.from({ length: 90 }, (_, i) => ({
            time: i * 10,
            value: Math.floor(Math.random() * 200),
          })),
        },
        retentionData: {
          // 每个视频片段（按10%分割）的观众留存率
          segments: [
            { segment: '0-10%', retention: 100 },
            { segment: '10-20%', retention: 92 },
            { segment: '20-30%', retention: 85 },
            { segment: '30-40%', retention: 78 },
            { segment: '40-50%', retention: 72 },
            { segment: '50-60%', retention: 65 },
            { segment: '60-70%', retention: 58 },
            { segment: '70-80%', retention: 52 },
            { segment: '80-90%', retention: 45 },
            { segment: '90-100%', retention: 40 },
          ],
        },
      };
    } catch (error) {
      console.error('获取观众分析数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取内容分析数据
   * @param params 参数对象
   * @returns 内容分析数据
   */
  async getContentAnalytics(params: {
    videoId?: string;
    timeFrame?: 'week' | 'month' | 'quarter' | 'year';
  }): Promise<ContentAnalytics> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('未授权，请先登录');
      }

      // 在实际项目中，这里应该调用API
      // const response = await api.get('/api/analytics/content', { params });
      // return response.data;

      // 模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 使用mockDb获取用户信息
      const userId = mockDb.getUserIdFromToken(token) as string;

      // 获取用户的视频数据
      const userVideos = mockDb.db.videos.filter(v => v.authorId === userId);

      // 按分类分组
      const categories = {} as Record<
        string,
        {
          videoCount: number;
          totalViews: number;
          totalRevenue: number;
          engagement: number;
        }
      >;

      userVideos.forEach(video => {
        if (!categories[video.category]) {
          categories[video.category] = {
            videoCount: 0,
            totalViews: 0,
            totalRevenue: 0,
            engagement: 0,
          };
        }

        categories[video.category].videoCount += 1;
        categories[video.category].totalViews += video.views;
        // 假设收益和浏览量相关（每次观看约0.01元）
        categories[video.category].totalRevenue += video.views * 0.01;
        // 假设互动度是(评论+点赞+收藏)/浏览量
        const engagementRate =
          (video.comments + video.likes + (video.favorites || 0)) / video.views;
        categories[video.category].engagement += engagementRate;
      });

      // 计算平均值并格式化
      const categoryPerformance = Object.entries(categories).map(([category, data]) => ({
        category,
        videoCount: data.videoCount,
        totalViews: data.totalViews,
        avgViews: Math.round(data.totalViews / data.videoCount),
        totalRevenue: Math.round(data.totalRevenue * 100) / 100,
        avgRevenue: Math.round((data.totalRevenue / data.videoCount) * 100) / 100,
        engagement: Math.round((data.engagement / data.videoCount) * 100) / 100,
      }));

      // 按时长分组
      const durations = [
        { name: '0-5分钟', min: 0, max: 300 },
        { name: '5-10分钟', min: 300, max: 600 },
        { name: '10-15分钟', min: 600, max: 900 },
        { name: '15-20分钟', min: 900, max: 1200 },
        { name: '20分钟以上', min: 1200, max: Infinity },
      ];

      const durationPerformance = durations.map(duration => {
        const videosInRange = userVideos.filter(
          video => video.duration >= duration.min && video.duration < duration.max
        );

        if (videosInRange.length === 0) {
          return {
            duration: duration.name,
            videoCount: 0,
            avgRetention: 0,
            avgEngagement: 0,
            avgRevenue: 0,
          };
        }

        // 假设留存率在60-75%之间随机
        const avgRetention = Math.round(Math.random() * 15 + 60);

        // 计算平均互动率
        const avgEngagement = Math.round(
          videosInRange.reduce((sum, video) => {
            return (
              sum + ((video.comments + video.likes + (video.favorites || 0)) / video.views) * 100
            );
          }, 0) / videosInRange.length
        );

        // 计算平均收益
        const avgRevenue =
          Math.round(
            (videosInRange.reduce((sum, video) => sum + video.views * 0.01, 0) /
              videosInRange.length) *
              100
          ) / 100;

        return {
          duration: duration.name,
          videoCount: videosInRange.length,
          avgRetention,
          avgEngagement,
          avgRevenue,
        };
      });

      // 按照性能排序的前10个视频
      const topPerformingVideos = userVideos
        .map(video => {
          // 假设留存率在40-80%之间
          const retention = Math.round(Math.random() * 40 + 40);
          // 互动率
          const engagement = Math.round(
            ((video.comments + video.likes + (video.favorites || 0)) / video.views) * 100
          );
          // 假设收益基于观看次数
          const revenue = Math.round(video.views * 0.01 * 100) / 100;

          return {
            id: video.id,
            title: video.title,
            views: video.views,
            engagement,
            retention,
            revenue,
          };
        })
        .sort((a, b) => b.views * b.engagement * b.retention - a.views * a.engagement * a.retention)
        .slice(0, 10);

      // 内容优化建议
      const optimizationTips = [
        {
          title: '优化视频长度',
          description: '数据显示，8-12分钟的视频表现最佳，观众留存率高达70%以上。',
          actionItems: [
            '将长视频分割成多个8-12分钟的部分',
            '保持节奏紧凑，减少冗余内容',
            '在视频开头的前30秒引入核心话题',
          ],
        },
        {
          title: '增加教程类内容',
          description: '教程类内容的观众留存率和收益显著高于其他类型，同时互动率也更高。',
          actionItems: [
            '考虑每月至少发布2个教程视频',
            '将教程系列化，提高观众持续观看率',
            '结合热门话题和专业知识创建独特教程',
          ],
        },
        {
          title: '提高视频缩略图点击率',
          description:
            '缩略图和标题是影响点击率的关键因素。数据显示，使用鲜明对比色和清晰文字的缩略图点击率提高了35%。',
          actionItems: [
            '使用高对比度和鲜明色彩',
            '添加清晰可读的文字',
            '对同一视频测试不同缩略图效果',
          ],
        },
        {
          title: '优化发布时间',
          description:
            '根据您的观众活跃时间分析，工作日晚上7-9点和周末下午2-5点是观众活跃度最高的时段。',
          actionItems: [
            '在高峰时段发布新内容',
            '提前24-48小时预告新视频',
            '使用平台的预约发布功能',
          ],
        },
      ];

      // 发布时间分析
      const publishTimeAnalysis = [
        { dayOfWeek: '周一', timeOfDay: '晚上7-9点', performance: 85 },
        { dayOfWeek: '周二', timeOfDay: '晚上7-9点', performance: 82 },
        { dayOfWeek: '周三', timeOfDay: '晚上7-9点', performance: 80 },
        { dayOfWeek: '周四', timeOfDay: '晚上7-9点', performance: 78 },
        { dayOfWeek: '周五', timeOfDay: '晚上8-10点', performance: 88 },
        { dayOfWeek: '周六', timeOfDay: '下午2-5点', performance: 92 },
        { dayOfWeek: '周日', timeOfDay: '下午2-5点', performance: 95 },
      ];

      return {
        categoryPerformance,
        durationPerformance,
        topPerformingVideos,
        optimizationTips,
        publishTimeAnalysis,
      };
    } catch (error) {
      console.error('获取内容分析数据失败:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
