/**
 * @file sharedHandlers.ts
 * @description 共享处理程序，使用统一的数据库处理所有模拟API请求
 */

import { http, HttpResponse } from 'msw';
import mockDb from './mockDb';
import { mockDelay } from '../utils/mockInitializer';

// 通用延迟处理 - 模拟网络请求延迟
const withDelay = async (callback: () => any) => {
  await mockDelay();
  return callback();
};

// 登录和注册相关处理程序
export const authHandlers = [
  // 登录
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { username: string; password: string };
    const { username, password } = body;

    return withDelay(() => {
      const result = mockDb.login(username, password);

      if (result.success) {
        return HttpResponse.json({
          success: true,
          data: {
            token: result.token,
            user: result.user,
          },
        });
      } else {
        return HttpResponse.json(
          {
            success: false,
            error: result.error,
          },
          { status: 401 }
        );
      }
    });
  }),

  // 注册
  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as {
      username: string;
      email: string;
      password: string;
      nickname?: string;
    };

    return withDelay(() => {
      const result = mockDb.register(body);

      if (result.success) {
        return HttpResponse.json({
          success: true,
          data: {
            message: result.message,
          },
        });
      } else {
        return HttpResponse.json(
          {
            success: false,
            error: result.error,
          },
          { status: 400 }
        );
      }
    });
  }),
];

// 管理后台相关处理程序
export const adminHandlers = [
  // 获取仪表盘统计数据
  http.get('/api/admin/dashboard/stats', async () => {
    return withDelay(() => {
      const stats = mockDb.getDashboardStats();

      return HttpResponse.json({
        success: true,
        data: stats,
      });
    });
  }),

  // 获取最近活动
  http.get('/api/admin/dashboard/activities', async ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    return withDelay(() => {
      const activities = mockDb.getRecentActivities(limit);
      const users = mockDb.getAllUsers();

      // 格式化活动数据为前端需要的格式
      const formattedActivities = activities.map(activity => {
        const user = users.find(u => u.id === activity.userId);
        const video = activity.action.includes('视频')
          ? mockDb.getVideoById(activity.targetId || '')
          : null;

        return {
          id: activity.id,
          type: activity.action.includes('视频')
            ? 'video'
            : activity.action.includes('用户')
              ? 'user'
              : activity.action.includes('评论')
                ? 'comment'
                : activity.action.includes('举报')
                  ? 'report'
                  : 'system',
          title: activity.action,
          description: activity.details || '',
          time: activity.timestamp,
          userId: activity.userId,
          avatar: user?.avatar || '',
          videoId: activity.action.includes('视频') ? activity.targetId : undefined,
          reportId: activity.action.includes('举报') ? activity.targetId : undefined,
          commentId: activity.action.includes('评论') ? activity.targetId : undefined,
          adminId: activity.userId,
        };
      });

      return HttpResponse.json({
        success: true,
        data: formattedActivities,
      });
    });
  }),

  // 获取视频列表
  http.get('/api/admin/videos', async ({ request }) => {
    const url = new URL(request.url);

    const params = {
      page: parseInt(url.searchParams.get('page') || '1'),
      limit: parseInt(url.searchParams.get('limit') || '10'),
      search: url.searchParams.get('search') || '',
      status: url.searchParams.get('status') || '',
      category: url.searchParams.get('category') || '',
      sortBy: url.searchParams.get('sortBy') || 'createdAt',
      sortOrder: (url.searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc',
    };

    return withDelay(() => {
      const result = mockDb.getVideos(params);

      return HttpResponse.json({
        success: true,
        data: result,
      });
    });
  }),

  // 获取视频详情
  http.get('/api/admin/videos/:id', async ({ params }) => {
    const { id } = params;

    return withDelay(() => {
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

      return HttpResponse.json({
        success: true,
        data: video,
      });
    });
  }),

  // 获取用户列表
  http.get('/api/admin/users', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const role = url.searchParams.get('role') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const query = url.searchParams.get('query') || undefined;

    return withDelay(() => {
      // 使用mockDb获取所有用户
      const usersResult = mockDb.getUsers({
        role: role || undefined,
        status: status || undefined,
        search: query || undefined,
      });

      // 简单映射用户数据（不包含敏感信息）
      const adminUsers = usersResult.items.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email || `${user.username}@example.com`,
        nickname: user.nickname || user.username,
        avatar: user.avatar,
        role: user.role || 'creator',
        status: user.status || 'active',
        createdAt: user.joinedAt || new Date().toISOString(),
        lastLogin: user.lastLogin || new Date().toISOString(),
        videoCount: 0, // 实际应用中可以从mockDb获取
        subscriberCount: user.subscribers || 100,
        bio: user.bio || '',
        verified: user.verified || false,
      }));

      const result = {
        data: adminUsers,
        total: usersResult.total,
        page,
        pageSize,
        totalPages: usersResult.totalPages,
      };

      return HttpResponse.json({
        success: true,
        data: result,
      });
    });
  }),

  // 获取用户详情
  http.get('/api/admin/users/:id', async ({ params }) => {
    const { id } = params;

    return withDelay(() => {
      const users = mockDb.getAllUsers();
      const user = users.find(u => u.id === id);

      if (!user) {
        return HttpResponse.json(
          {
            success: false,
            error: '用户不存在',
          },
          { status: 404 }
        );
      }

      return HttpResponse.json({
        success: true,
        data: user,
      });
    });
  }),

  // 更新用户
  http.put('/api/admin/users/:id', async ({ params, request }) => {
    const { id } = params;

    return withDelay(() => {
      const users = mockDb.getAllUsers();
      const user = users.find(u => u.id === id);

      if (!user) {
        return HttpResponse.json(
          {
            success: false,
            error: '用户不存在',
          },
          { status: 404 }
        );
      }

      // 在实际实现中，应该更新用户数据
      // 由于mockDb未提供更新方法，这里只返回成功响应

      return HttpResponse.json({
        success: true,
        message: '用户信息更新成功',
      });
    });
  }),

  // 删除用户
  http.delete('/api/admin/users/:id', async ({ params }) => {
    const { id } = params;

    return withDelay(() => {
      const users = mockDb.getAllUsers();
      const user = users.find(u => u.id === id);

      if (!user) {
        return HttpResponse.json(
          {
            success: false,
            error: '用户不存在',
          },
          { status: 404 }
        );
      }

      // 在实际实现中，应该删除用户数据
      // 由于mockDb未提供删除方法，这里只返回成功响应

      return HttpResponse.json({
        success: true,
        message: '用户已成功删除',
      });
    });
  }),

  // 获取评论列表
  http.get('/api/admin/comments', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const status = url.searchParams.get('status') || undefined;
    const videoId = url.searchParams.get('videoId') || undefined;
    const userId = url.searchParams.get('userId') || undefined;
    const query = url.searchParams.get('query') || undefined;

    return withDelay(() => {
      // 使用mockDb获取评论
      const result = mockDb.getComments({
        page,
        limit: pageSize,
        videoId,
        userId,
        status,
        search: query,
      });

      const videos = mockDb.getVideos({ limit: 100 }).items;
      const users = mockDb.getAllUsers(); // 使用getAllUsers直接获取用户数组

      // 映射评论数据，添加视频和用户信息
      const comments = result.items.map(comment => {
        const video = videos.find(v => v.id === comment.videoId);
        const user = users.find(u => u.id === comment.userId);

        return {
          id: comment.id,
          content: comment.content,
          videoId: comment.videoId,
          videoTitle: video?.title || 'Unknown Video',
          userId: comment.userId,
          username: user?.username || 'Unknown User',
          avatar: user?.avatar || '',
          createdAt: comment.createdAt,
          status: comment.status,
          likes: comment.likes || 0,
          replies: 0, // 可以扩展为通过parentId计算回复数量
        };
      });

      return HttpResponse.json({
        success: true,
        data: {
          data: comments,
          total: result.total,
          page,
          pageSize,
          totalPages: result.totalPages,
        },
      });
    });
  }),

  // 获取举报列表
  http.get('/api/admin/reports', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const status = url.searchParams.get('status') || undefined;
    const type = url.searchParams.get('type') || undefined;
    const severity = url.searchParams.get('severity') || undefined;

    return withDelay(() => {
      // 使用mockDb获取举报
      const result = mockDb.getReports({
        page,
        limit: pageSize,
        type,
        status,
        severity,
      });

      const users = mockDb.getAllUsers();

      // 映射举报数据，添加用户信息
      const reports = result.items.map(report => {
        const reporter = users.find(u => u.id === report.reporterId);

        return {
          id: report.id,
          type: report.type,
          reasonCode: report.reason,
          targetId: report.targetId,
          reporterId: report.reporterId,
          reporterName: reporter?.username || 'Unknown User',
          description: report.description,
          createdAt: report.createdAt,
          status: report.status,
          resolvedAt: report.updatedAt !== report.createdAt ? report.updatedAt : null,
          resolvedById: null, // 模拟数据中没有这个字段
          severity: getSeverity(report.reason),
        };
      });

      // 辅助函数：获取举报严重程度
      function getSeverity(reason: string): string {
        const highSeverityReasons = ['版权问题', '不适当的言论'];
        const mediumSeverityReasons = ['内容错误', '抄袭内容', '误导性描述'];

        if (highSeverityReasons.includes(reason)) {
          return '高';
        } else if (mediumSeverityReasons.includes(reason)) {
          return '中';
        } else {
          return '低';
        }
      }

      return HttpResponse.json({
        success: true,
        data: {
          data: reports,
          total: result.total,
          page,
          pageSize,
          totalPages: result.totalPages,
        },
      });
    });
  }),

  // 处理举报
  http.put('/api/admin/reports/:id', async ({ params, request }) => {
    const { id } = params;

    return withDelay(() => {
      // 在实际实现中，这里会处理举报
      return HttpResponse.json({
        success: true,
        message: '举报处理成功',
      });
    });
  }),
];

// 创作者空间相关处理程序
export const creatorHandlers = [
  // 获取创作者统计数据
  http.get('/api/creator/stats', async () => {
    return withDelay(() => {
      // 此处可以从mockDb中获取创作者相关的统计数据
      // 目前仍使用模拟数据，后续可以扩展mockDb的方法来支持
      return HttpResponse.json({
        success: true,
        data: {
          totalVideos: 42,
          publishedVideos: 35,
          draftVideos: 7,
          videosTrend: 12.5,
          publishedVideosTrend: 8.3,
          draftVideosTrend: 25.0,

          totalViews: 245000,
          totalMinutesWatched: 1250000,
          averageViewDuration: 5.1,
          viewsTrend: 18.2,
          minutesWatchedTrend: 22.4,
          viewDurationTrend: 3.7,

          totalLikes: 12500,
          totalComments: 3200,
          totalShares: 1800,
          likesTrend: 15.3,
          commentsTrend: 8.9,
          sharesTrend: 21.6,

          totalRevenue: 45000,
          monthlyRevenue: 3800,
          pendingRevenue: 1200,
          revenueTrend: 12.8,
          monthlyRevenueTrend: 9.4,

          lastUpdated: new Date().toISOString(),
        },
      });
    });
  }),
];

// 合并所有处理程序
export const sharedHandlers = [
  ...authHandlers,
  ...adminHandlers,
  ...creatorHandlers,
  // 可以继续添加其他处理程序
];

export default sharedHandlers;
