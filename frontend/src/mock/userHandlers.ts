/**
 * @file userHandlers.ts
 * @description 用户相关API的处理程序
 */

import { http, HttpResponse } from 'msw';
import mockDb from './mockDb';
import { mockDelay } from '../utils/mockInitializer';

// 通用延迟处理 - 模拟网络请求延迟
const withDelay = async (callback: () => any) => {
  await mockDelay(300, 800);
  return callback();
};

// 用户相关处理程序
export const userHandlers = [
  // 获取用户信息
  http.get('/api/user/profile', async ({ request }) => {
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

    return withDelay(() => {
      const user = mockDb.getUserById(userId);

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

  // 更新用户信息
  http.put('/api/user/profile', async ({ request }) => {
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

    return withDelay(() => {
      const result = mockDb.updateUser(userId, body);

      if (!result.success) {
        return HttpResponse.json(
          {
            success: false,
            error: result.error || '更新失败',
          },
          { status: 400 }
        );
      }

      return HttpResponse.json({
        success: true,
        data: {
          message: '个人信息已更新',
          user: result.user,
        },
      });
    });
  }),

  // 获取用户收藏列表
  http.get('/api/user/favorites', async ({ request }) => {
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

    return withDelay(() => {
      const result = mockDb.getUserFavorites(userId, {
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
    });
  }),

  // 获取用户点赞列表
  http.get('/api/user/likes', async ({ request }) => {
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

    return withDelay(() => {
      const result = mockDb.getUserLikes(userId, {
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
    });
  }),

  // 获取用户评论列表
  http.get('/api/user/comments', async ({ request }) => {
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

    return withDelay(() => {
      const result = mockDb.getUserComments(userId, {
        page,
        limit,
      });

      return HttpResponse.json({
        success: true,
        data: {
          comments: result.data,
          total: result.total,
          hasMore: page * limit < result.total,
        },
      });
    });
  }),

  // 获取用户关注列表
  http.get('/api/user/subscriptions', async ({ request }) => {
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

    return withDelay(() => {
      const result = mockDb.getUserSubscriptions(userId, {
        page,
        limit,
      });

      return HttpResponse.json({
        success: true,
        data: {
          channels: result.data,
          total: result.total,
          hasMore: page * limit < result.total,
        },
      });
    });
  }),

  // 关注/取消关注用户
  http.post('/api/users/:id/subscribe', async ({ params, request }) => {
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

    return withDelay(() => {
      const result = mockDb.toggleSubscription(userId, id as string);

      return HttpResponse.json({
        success: true,
        data: { subscribed: result },
      });
    });
  }),

  // 获取用户通知
  http.get('/api/user/notifications', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const tokenHeader = request.headers.get('Authorization');

    // 如果是开发环境，允许未授权访问，返回空数据
    if (!tokenHeader) {
      if (import.meta.env.DEV) {
        return HttpResponse.json({
          success: true,
          data: {
            notifications: [],
            total: 0,
            unreadCount: 0,
            hasMore: false,
          },
        });
      }

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
      if (import.meta.env.DEV) {
        return HttpResponse.json({
          success: true,
          data: {
            notifications: [],
            total: 0,
            unreadCount: 0,
            hasMore: false,
          },
        });
      }

      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    return withDelay(() => {
      const result = mockDb.getUserNotifications(userId, {
        page,
        limit,
      });

      return HttpResponse.json({
        success: true,
        data: {
          notifications: result.data,
          total: result.total,
          unreadCount: result.data.filter(n => !n.read).length,
          hasMore: page * limit < result.total,
        },
      });
    });
  }),

  // 标记通知为已读
  http.put('/api/user/notifications/:id/read', async ({ params, request }) => {
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

    return withDelay(() => {
      const result = mockDb.markNotificationRead(userId, id as string);

      if (!result.success) {
        return HttpResponse.json(
          {
            success: false,
            error: result.error || '操作失败',
          },
          { status: 400 }
        );
      }

      return HttpResponse.json({
        success: true,
        data: { message: '已标记为已读' },
      });
    });
  }),

  // 标记所有通知为已读
  http.put('/api/user/notifications/read-all', async ({ request }) => {
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

    return withDelay(() => {
      mockDb.markAllNotificationsRead(userId);

      return HttpResponse.json({
        success: true,
        data: { message: '所有通知已标记为已读' },
      });
    });
  }),

  // 获取未读通知数量
  http.get('/api/user/notifications/unread-count', async ({ request }) => {
    const tokenHeader = request.headers.get('Authorization');

    // 如果是开发环境，允许未授权访问，返回空结果
    if (!tokenHeader) {
      if (import.meta.env.DEV) {
        return HttpResponse.json({
          success: true,
          data: {
            count: 0,
          },
        });
      }

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
      if (import.meta.env.DEV) {
        return HttpResponse.json({
          success: true,
          data: {
            count: 0,
          },
        });
      }

      return HttpResponse.json(
        {
          success: false,
          error: '无效的授权',
        },
        { status: 401 }
      );
    }

    return withDelay(() => {
      const notifications = mockDb.db.notifications.filter(n => n.userId === userId && !n.read);

      return HttpResponse.json({
        success: true,
        data: {
          count: notifications.length,
        },
      });
    });
  }),

  // 修改密码
  http.post('/api/user/password', async ({ request }) => {
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

    // 获取密码数据
    const body = (await request.json()) as { currentPassword: string; newPassword: string };
    const { currentPassword, newPassword } = body;

    return withDelay(() => {
      const result = mockDb.changePassword(userId, currentPassword, newPassword);

      if (!result.success) {
        return HttpResponse.json(
          {
            success: false,
            error: result.error || '密码修改失败',
          },
          { status: 400 }
        );
      }

      return HttpResponse.json({
        success: true,
        data: { message: '密码已成功修改' },
      });
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

    return withDelay(() => {
      const result = mockDb.getUserHistory(userId, {
        page,
        limit,
      });

      return HttpResponse.json({
        success: true,
        data: {
          history: result.data,
          total: result.total,
          hasMore: page * limit < result.total,
        },
      });
    });
  }),
];

export default userHandlers;
