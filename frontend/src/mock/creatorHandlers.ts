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

  // 获取创作者评论列表
  http.get('/api/creator/comments', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const status = url.searchParams.get('status') || undefined;
    const videoId = url.searchParams.get('videoId') || undefined;
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

    // 模拟获取创作者所有评论的逻辑
    // 由于mockDb中没有直接提供此方法，我们可以使用已有方法组合实现
    // 或增加一个模拟实现

    // 先获取创作者所有视频
    const videos = mockDb.getCreatorVideos(userId, {
      page: 1,
      limit: 100,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    // 模拟评论数据
    const comments = [];
    let total = 0;

    for (const video of videos.data.slice(0, 5)) {
      // 只取前5个视频的评论，避免数据过多
      if (videoId && video.id !== videoId) continue;

      const videoComments = mockDb.getCreatorVideoComments(userId, video.id, {
        page: 1,
        limit: 10,
      });
      comments.push(
        ...videoComments.data.map(comment => ({
          ...comment,
          videoTitle: video.title,
          videoThumbnail: video.thumbnail,
        }))
      );

      total += videoComments.total;
    }

    // 分页处理
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedComments = comments.slice(startIndex, endIndex);

    return HttpResponse.json({
      success: true,
      data: {
        data: paginatedComments,
        total: total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  }),

  // 删除评论
  http.delete('/api/creator/comments/:id', async ({ params, request }) => {
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

    // 模拟删除评论的逻辑
    // 这里简单返回成功，实际需要检查评论是否存在、是否属于该创作者等

    return HttpResponse.json({
      success: true,
      data: {
        message: '评论已删除',
      },
    });
  }),

  // 回复评论
  http.post('/api/creator/comments/:id/reply', async ({ params, request }) => {
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

    const body = await request.json();
    const { content } = body;

    await mockDelay();

    // 模拟回复评论的逻辑
    // 这里简单返回一个模拟的回复对象

    return HttpResponse.json({
      success: true,
      data: {
        id: `reply-${Date.now()}`,
        parentId: id,
        content,
        userId,
        userAvatar: 'https://i.pravatar.cc/150?u=creator',
        username: '创作者',
        createdAt: new Date().toISOString(),
        likes: 0,
      },
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

    // 生成模拟的观看量趋势数据
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const trendData = generateTrendData(days, { min: 10, max: 500 });

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
    const trendData = generateEngagementTrendData(days, { min: 1, max: 50 });

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
    const trendData = generateTrendData(days, { min: 0, max: 100 });

    return HttpResponse.json({
      success: true,
      data: trendData,
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

    // 获取创作者的视频列表
    const videos = mockDb.getCreatorVideos(userId, {
      page: 1,
      limit: 50, // 获取更多视频，以便筛选
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    // 根据指标对视频进行排序
    let sortedVideos = [...videos.data];

    if (metric === 'views') {
      sortedVideos.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (metric === 'likes') {
      sortedVideos.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (metric === 'comments') {
      sortedVideos.sort((a, b) => (b.comments || 0) - (a.comments || 0));
    } else if (metric === 'revenue') {
      sortedVideos.sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
    }

    // 获取前N个视频
    const topVideos = sortedVideos.slice(0, limit).map(video => ({
      id: video.id,
      title: video.title,
      thumbnailUrl: video.thumbnail || '/images/default-thumbnail.jpg',
      views: video.views || 0,
      likes: video.likes || 0,
      comments: video.comments || 0,
      revenue: video.revenue || 0,
      publishDate: video.uploadDate || new Date().toISOString(),
      duration: video.duration || 300,
    }));

    return HttpResponse.json({
      success: true,
      data: topVideos,
    });
  }),
];

// 生成趋势数据的辅助函数
function generateTrendData(days: number, range: { min: number; max: number }) {
  const data = [];
  const labels = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    labels.push(date.toISOString().slice(0, 10));
    data.push(Math.floor(Math.random() * (range.max - range.min + 1)) + range.min);
  }

  return {
    data,
    labels,
    trend: Math.random() > 0.5 ? Math.random() * 20 : -Math.random() * 20, // 随机趋势
  };
}

// 生成多条线的互动趋势数据
function generateEngagementTrendData(days: number, range: { min: number; max: number }) {
  const likesData = [];
  const commentsData = [];
  const sharesData = [];
  const labels = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    labels.push(date.toISOString().slice(0, 10));
    likesData.push(Math.floor(Math.random() * (range.max - range.min + 1)) + range.min);
    commentsData.push(Math.floor(Math.random() * (range.max / 2 - range.min + 1)) + range.min);
    sharesData.push(Math.floor(Math.random() * (range.max / 3 - range.min + 1)) + range.min);
  }

  return {
    data: [
      { name: '点赞', data: likesData },
      { name: '评论', data: commentsData },
      { name: '分享', data: sharesData },
    ],
    labels,
    trend: Math.random() > 0.5 ? Math.random() * 15 : -Math.random() * 15, // 随机趋势
  };
}

export default creatorHandlers;
