/**
 * @file videoHandlers.ts
 * @description 视频相关API的处理程序
 */

import { http, HttpResponse } from 'msw';
import mockDb from './mockDb';
import { mockDelay } from '../utils/mockInitializer';

// 视频相关处理程序
export const videoHandlers = [
  // 获取视频列表
  http.get('/api/videos', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const category = url.searchParams.get('category') || undefined;
    const search = url.searchParams.get('q') || undefined;

    await mockDelay();

    const result = mockDb.getVideos({
      page,
      limit,
      category: category || undefined,
      search: search || undefined,
    });

    return HttpResponse.json({
      success: true,
      data: {
        videos: result.items,
        total: result.total,
        hasMore: page * limit < result.total,
      },
    });
  }),

  // 获取热门视频
  http.get('/api/videos/trending', async () => {
    await mockDelay();

    const trendingVideos = mockDb.getTrendingVideos(10);

    return HttpResponse.json({
      success: true,
      data: trendingVideos,
    });
  }),

  // 获取推荐视频
  http.get('/api/videos/recommended', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const userId = url.searchParams.get('userId') || undefined;

    await mockDelay();

    const videos = mockDb.getRecommendedVideos(userId || undefined, limit);

    return HttpResponse.json({
      success: true,
      data: videos,
    });
  }),

  // 获取视频详情
  http.get('/api/videos/:id', async ({ params }) => {
    const { id } = params;

    await mockDelay();

    // 获取视频详情
    const video = mockDb.getVideoById(id as string);

    if (!video) {
      return HttpResponse.json(
        {
          success: false,
          error: '视频不存在',
        },
        { status: 404 }
      );
    }

    // 添加访问记录
    mockDb.addVideoView(id as string);

    return HttpResponse.json({
      success: true,
      data: video,
    });
  }),

  // 获取相关视频
  http.get('/api/videos/:id/related', async ({ params }) => {
    const { id } = params;

    await mockDelay();

    const relatedVideos = mockDb.getRelatedVideos(id as string, 8);

    return HttpResponse.json({
      success: true,
      data: relatedVideos,
    });
  }),

  // 获取视频互动状态
  http.get('/api/videos/:id/interaction', async ({ params, request }) => {
    const { id } = params;
    const tokenHeader = request.headers.get('Authorization');
    const userId = tokenHeader
      ? mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''))
      : null;

    await mockDelay();

    if (!userId) {
      return HttpResponse.json({
        success: true,
        data: {
          isLiked: false,
          isFavorited: false,
          isSubscribed: false,
        },
      });
    }

    const interaction = mockDb.getVideoInteraction(userId, id as string);

    return HttpResponse.json({
      success: true,
      data: interaction,
    });
  }),

  // 点赞/取消点赞视频
  http.post('/api/videos/:id/like', async ({ params, request }) => {
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

    const result = mockDb.toggleVideoLike(userId, id as string);

    return HttpResponse.json({
      success: true,
      data: { liked: result },
    });
  }),

  // 收藏/取消收藏视频
  http.post('/api/videos/:id/favorite', async ({ params, request }) => {
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

    const result = mockDb.toggleVideoFavorite(userId, id as string);

    return HttpResponse.json({
      success: true,
      data: { favorited: result },
    });
  }),

  // 获取视频评论
  http.get('/api/videos/:id/comments', async ({ params, request }) => {
    const { id } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const sort = url.searchParams.get('sort') || 'newest';

    await mockDelay();

    const result = mockDb.getVideoComments(id as string, {
      page,
      limit,
      sort: sort as 'newest' | 'oldest' | 'popular',
    });

    return HttpResponse.json({
      success: true,
      data: {
        comments: result.data,
        total: result.total,
        hasMore: page * limit < result.total,
      },
    });
  }),

  // 添加评论
  http.post('/api/videos/:id/comments', async ({ params, request }) => {
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

    // 获取评论内容
    const body = (await request.json()) as { content: string; parentId?: string };
    const { content, parentId } = body;

    if (!content || content.trim() === '') {
      return HttpResponse.json(
        {
          success: false,
          error: '评论内容不能为空',
        },
        { status: 400 }
      );
    }

    await mockDelay();

    const comment = mockDb.addComment(userId, id as string, content, parentId);

    return HttpResponse.json({
      success: true,
      data: comment,
    });
  }),

  // 更新视频观看进度
  http.post('/api/videos/:id/progress', async ({ params, request }) => {
    const { id } = params;
    const tokenHeader = request.headers.get('Authorization');
    const userId = tokenHeader
      ? mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''))
      : null;

    // 获取进度数据
    const body = (await request.json()) as { currentTime: number; duration: number };
    const { currentTime, duration } = body;

    await mockDelay();

    if (userId) {
      mockDb.saveVideoProgress(userId, id as string, currentTime, duration);
    }

    return HttpResponse.json({
      success: true,
    });
  }),

  // 获取视频观看进度
  http.get('/api/videos/:id/progress', async ({ params, request }) => {
    const { id } = params;
    const tokenHeader = request.headers.get('Authorization');
    const userId = tokenHeader
      ? mockDb.getUserIdFromToken(tokenHeader.replace('Bearer ', ''))
      : null;

    await mockDelay();

    if (!userId) {
      return HttpResponse.json({
        success: true,
        data: null,
      });
    }

    const progress = mockDb.getVideoProgress(userId, id as string);

    return HttpResponse.json({
      success: true,
      data: progress,
    });
  }),

  // 获取用户观看历史
  http.get('/api/user/history', async ({ request }) => {
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

    const result = mockDb.getUserHistory(userId, {
      page,
      limit,
    });

    return HttpResponse.json({
      success: true,
      data: {
        videos: result.data,
        total: result.total,
        hasMore: page * limit < result.total,
      },
    });
  }),

  // 举报视频
  http.post('/api/videos/:id/report', async ({ params, request }) => {
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

    // 获取举报信息
    const body = (await request.json()) as { reason: string; description?: string };
    const { reason, description } = body;

    if (!reason) {
      return HttpResponse.json(
        {
          success: false,
          error: '举报原因不能为空',
        },
        { status: 400 }
      );
    }

    await mockDelay();

    const report = mockDb.addReport(userId, 'video', id as string, reason, description);

    return HttpResponse.json({
      success: true,
      data: {
        message: '举报已提交，我们会尽快处理',
        reportId: report.id,
      },
    });
  }),
];

export default videoHandlers;
