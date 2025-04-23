/**
 * @file creatorHandlers.ts
 * @description 创作者相关API的处理程序
 */

import { http, HttpResponse } from 'msw';
import mockDb from './mockDb';
import { mockDelay } from '../utils/mockInitializer';

// 创作者相关处理程序
export const creatorHandlers = [
  // 获取创作者统计数据
  http.get('/api/creator/stats', async ({ request }) => {
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    const stats = mockDb.getCreatorStats(userId);

    return HttpResponse.json({
      success: true,
      data: stats,
    });
  }),

  // 获取创作者视频列表
  http.get('/api/creator/videos', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const status = url.searchParams.get('status') || undefined;
    const query = url.searchParams.get('query') || undefined;
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    const result = mockDb.getCreatorVideos(userId, {
      page,
      limit: pageSize,
      status: status || undefined,
      search: query || undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    });

    return HttpResponse.json({
      success: true,
      data: {
        data: result.data,
        total: result.total,
        page,
        pageSize,
        totalPages: Math.ceil(result.total / pageSize),
      },
    });
  }),

  // 获取单个视频详情
  http.get('/api/creator/videos/:id', async ({ params, request }) => {
    const { id } = params;
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    const video = mockDb.getCreatorVideoById(userId, id as string);

    if (!video) {
      return HttpResponse.json(
        {
          success: false,
          error: '视频不存在或您没有权限访问',
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: video,
    });
  }),

  // 更新视频信息
  http.put('/api/creator/videos/:id', async ({ params, request }) => {
    const { id } = params;
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    // 获取更新数据
    const body = await request.json();

    await mockDelay();

    const result = mockDb.updateCreatorVideo(userId, id as string, body);

    if (!result.success) {
      return HttpResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        message: '视频已更新',
        video: result.video,
      },
    });
  }),

  // 删除视频
  http.delete('/api/creator/videos/:id', async ({ params, request }) => {
    const { id } = params;
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    const result = mockDb.deleteCreatorVideo(userId, id as string);

    if (!result.success) {
      return HttpResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        message: '视频已删除',
      },
    });
  }),

  // 获取视频分析数据
  http.get('/api/creator/videos/:id/analytics', async ({ params, request }) => {
    const { id } = params;
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    const analytics = mockDb.getVideoAnalytics(userId, id as string);

    if (!analytics) {
      return HttpResponse.json(
        {
          success: false,
          error: '视频不存在或您没有权限访问',
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: analytics,
    });
  }),

  // 获取视频评论列表
  http.get('/api/creator/videos/:id/comments', async ({ params, request }) => {
    const { id } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    const result = mockDb.getCreatorVideoComments(userId, id as string, {
      page,
      limit,
    });

    return HttpResponse.json({
      success: true,
      data: {
        comments: result.data,
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  }),

  // 获取频道设置
  http.get('/api/creator/channel', async ({ request }) => {
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    const channel = mockDb.getCreatorChannel(userId);

    return HttpResponse.json({
      success: true,
      data: channel,
    });
  }),

  // 更新频道设置
  http.put('/api/creator/channel', async ({ request }) => {
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    // 获取更新数据
    const body = await request.json();

    await mockDelay();

    const result = mockDb.updateCreatorChannel(userId, body);

    return HttpResponse.json({
      success: true,
      data: {
        message: '频道设置已更新',
        channel: result,
      },
    });
  }),

  // 获取收入数据
  http.get('/api/creator/revenue', async ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'month';
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    const revenue = mockDb.getCreatorRevenue(userId, period as 'day' | 'week' | 'month' | 'year');

    return HttpResponse.json({
      success: true,
      data: revenue,
    });
  }),

  // 获取内容趋势数据
  http.get('/api/creator/trends/content', async ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '30d';
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    // 生成模拟的内容趋势数据
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const trendData = generateTrendData(days, { min: 0, max: 5 });

    return HttpResponse.json({
      success: true,
      data: trendData,
    });
  }),

  // 获取观看量趋势数据
  http.get('/api/creator/trends/views', async ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '30d';
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    // 生成模拟的观看趋势数据
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const trendData = generateTrendData(days, { min: 50, max: 500 });

    return HttpResponse.json({
      success: true,
      data: trendData,
    });
  }),

  // 获取互动趋势数据
  http.get('/api/creator/trends/engagement', async ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '30d';
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    // 生成模拟的互动趋势数据
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const trendData = generateEngagementTrendData(days, { min: 20, max: 200 });

    return HttpResponse.json({
      success: true,
      data: trendData,
    });
  }),

  // 获取收入趋势数据
  http.get('/api/creator/trends/revenue', async ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || '30d';
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    // 生成模拟的收入趋势数据
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const trendData = generateTrendData(days, { min: 10, max: 100 });

    return HttpResponse.json({
      success: true,
      data: trendData,
    });
  }),

  // 获取创作者频道信息
  http.get('/api/creator/channel', async ({ request }) => {
    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    const channel = mockDb.getCreatorChannel(userId);

    return HttpResponse.json({
      success: true,
      data: channel,
    });
  }),

  // 获取创作者评论
  http.get('/api/creator/comments', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const status = url.searchParams.get('status');
    const videoId = url.searchParams.get('videoId');

    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    // 获取创作者的视频列表
    const creatorVideos = mockDb
      .getCreatorVideos(userId, {
        page: 1,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })
      .data.map(video => video.id);

    // 模拟数据：20条评论
    const totalComments = 20;
    const commentsPerPage = [];

    for (let i = (page - 1) * pageSize; i < Math.min(page * pageSize, totalComments); i++) {
      const commentVideoId =
        videoId || creatorVideos[Math.floor(Math.random() * creatorVideos.length)];
      const commentStatus =
        status || ['normal', 'hidden', 'pending'][Math.floor(Math.random() * 3)];

      commentsPerPage.push({
        id: `comment-${i}`,
        videoId: commentVideoId,
        videoTitle: `视频标题 ${(i % 5) + 1}`,
        userId: `user-${i}`,
        userName: `用户${i}`,
        userAvatar: `https://i.pravatar.cc/150?u=user${i}`,
        content: `这是第${i + 1}条评论，内容非常精彩！`,
        likes: Math.floor(Math.random() * 100),
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
        ).toISOString(),
        status: commentStatus,
        replies: Math.floor(Math.random() * 5),
        hasReplied: Math.random() > 0.5,
      });
    }

    return HttpResponse.json({
      success: true,
      data: {
        data: commentsPerPage,
        total: totalComments,
        page,
        pageSize,
        totalPages: Math.ceil(totalComments / pageSize),
      },
    });
  }),

  // 获取表现最佳的视频
  http.get('/api/creator/top-videos', async ({ request }) => {
    const url = new URL(request.url);
    const metric = url.searchParams.get('metric') || 'views';
    const period = url.searchParams.get('period') || '30d';
    const limit = parseInt(url.searchParams.get('limit') || '5');

    const tokenHeader = request.headers.get('Authorization');

    if (!tokenHeader) {
      return HttpResponse.json(
        {
          success: false,
          error: '未授权操作',
        },
        { status: 401 }
      );
    }

    const userId = mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''));
    if (!userId) {
      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    await mockDelay();

    // 生成表现最佳的视频数据
    const topVideos = [];
    for (let i = 0; i < limit; i++) {
      const viewCount = 1000 + Math.floor(Math.random() * 9000);
      topVideos.push({
        id: `video-top-${i}`,
        title: `表现最佳视频 ${i + 1}`,
        thumbnailUrl: `https://picsum.photos/300/180?random=${i}`,
        duration: 180 + Math.floor(Math.random() * 600),
        views: viewCount,
        likes: Math.floor(viewCount * 0.1),
        comments: Math.floor(viewCount * 0.02),
        shares: Math.floor(viewCount * 0.01),
        revenue: Math.floor(viewCount * 0.05),
        publishDate: new Date(
          Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }

    // 根据指定的指标排序
    topVideos.sort((a, b) => {
      // 使用类型安全的方式访问属性
      const metricA =
        metric === 'views'
          ? a.views
          : metric === 'likes'
            ? a.likes
            : metric === 'comments'
              ? a.comments
              : metric === 'shares'
                ? a.shares
                : metric === 'revenue'
                  ? a.revenue
                  : a.views;

      const metricB =
        metric === 'views'
          ? b.views
          : metric === 'likes'
            ? b.likes
            : metric === 'comments'
              ? b.comments
              : metric === 'shares'
                ? b.shares
                : metric === 'revenue'
                  ? b.revenue
                  : b.views;

      return metricB - metricA;
    });

    return HttpResponse.json({
      success: true,
      data: topVideos,
    });
  }),
];

// 辅助函数：生成模拟的趋势数据
function generateTrendData(days: number, range: { min: number; max: number }) {
  const trendData: { date: string; value: number }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    trendData.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * (range.max - range.min + 1)) + range.min,
    });
  }

  return trendData;
}

// 生成互动趋势数据，包含likes, comments, shares
function generateEngagementTrendData(days: number, range: { min: number; max: number }) {
  const trendData: {
    date: string;
    value: number;
    likes: number;
    comments: number;
    shares: number;
  }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const value = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

    trendData.push({
      date: date.toISOString().split('T')[0],
      value,
      likes: Math.round(value * 0.6),
      comments: Math.round(value * 0.3),
      shares: Math.round(value * 0.1),
    });
  }

  return trendData;
}

export default creatorHandlers;
