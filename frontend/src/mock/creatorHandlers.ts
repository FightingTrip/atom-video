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
];

export default creatorHandlers;
