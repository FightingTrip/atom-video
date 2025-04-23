/**
 * @file adminHandlers.ts
 * @description 管理员相关的模拟API处理程序
 */

import { http, HttpResponse } from 'msw';
import mockDb from './mockDb';
import { mockDelay } from '../utils/mockInitializer';

// 管理员视频类型
interface AdminVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  author: string;
  authorId: string;
  category: string;
  duration: string;
  status: string;
  tags: string[];
  createdAt: string;
  publishedAt: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

// 管理员用户类型
interface AdminUser {
  id: string;
  username: string;
  email: string;
  nickname: string;
  avatar: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string | null;
  videoCount: number;
  subscriberCount: number;
  bio: string;
  verified: boolean;
}

// 管理员评论类型
interface AdminComment {
  id: string;
  content: string;
  videoId: string;
  videoTitle: string;
  userId: string;
  username: string;
  avatar: string;
  createdAt: string;
  status: string;
  likes: number;
  replies: number;
}

// 管理员举报类型
interface AdminReport {
  id: string;
  type: string;
  reasonCode: string;
  targetId: string;
  reporterId: string;
  reporterName: string;
  description: string;
  createdAt: string;
  status: string;
  resolvedAt: string | null;
  resolvedById: string | null;
  severity: string;
}

// 分页结果接口
interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 将数据库模型映射到API响应模型
const mapVideoToAdminVideo = (video: any): AdminVideo => ({
  id: video.id,
  title: video.title,
  description: video.description,
  thumbnailUrl: video.thumbnail || '',
  videoUrl: video.videoUrl || '',
  author: video.author?.nickname || 'Unknown',
  authorId: video.authorId,
  category: video.category,
  duration: formatDuration(video.duration),
  status: video.status,
  tags: video.tags || [],
  createdAt: video.createdAt,
  publishedAt: video.publishedAt || null,
  viewCount: video.views || 0,
  likeCount: video.likes || 0,
  commentCount: video.comments || 0,
});

const mapUserToAdminUser = (user: any): AdminUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
  nickname: user.nickname || user.username,
  avatar: user.avatar,
  role: user.role,
  status: user.status,
  createdAt: user.joinedAt,
  lastLogin: user.lastLogin,
  videoCount: user.videoCount || 0,
  subscriberCount: user.subscribers || 0,
  bio: user.bio || '',
  verified: user.verified || false,
});

const mapCommentToAdminComment = (comment: any, videos: any[], users: any[]): AdminComment => {
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
    replies: 0, // 在实际实现中需要计算回复数量
  };
};

const mapReportToAdminReport = (report: any, users: any[]): AdminReport => {
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
};

// 辅助函数：格式化视频时长
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

// 辅助函数：获取举报严重程度
const getSeverity = (reason: string): string => {
  const highSeverityReasons = ['版权问题', '不适当的言论'];
  const mediumSeverityReasons = ['内容错误', '抄袭内容', '误导性描述'];

  if (highSeverityReasons.includes(reason)) {
    return '高';
  } else if (mediumSeverityReasons.includes(reason)) {
    return '中';
  } else {
    return '低';
  }
};

// 管理员API处理程序
export const adminHandlers = [
  // 获取仪表盘统计数据
  http.get('/api/admin/dashboard/stats', async () => {
    await mockDelay();

    const stats = mockDb.getDashboardStats();

    return HttpResponse.json(stats);
  }),

  // 获取最近活动
  http.get('/api/admin/dashboard/activities', async () => {
    await mockDelay();

    const activities = mockDb.getRecentActivities(10);
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

    return HttpResponse.json(formattedActivities);
  }),

  // 获取视频列表
  http.get('/api/admin/videos', async ({ request }) => {
    await mockDelay();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const status = url.searchParams.get('status') || undefined;
    const category = url.searchParams.get('category') || undefined;
    const query = url.searchParams.get('query') || undefined;
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (url.searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

    const result = mockDb.getVideos({
      page,
      limit: pageSize,
      search: query,
      status,
      category,
      sortBy,
      sortOrder,
    });

    const adminVideos: AdminVideo[] = result.items.map(video => mapVideoToAdminVideo(video));

    return HttpResponse.json({
      data: adminVideos,
      total: result.total,
      page,
      pageSize,
      totalPages: result.totalPages,
    });
  }),

  // 获取视频详情
  http.get('/api/admin/videos/:id', async ({ params }) => {
    await mockDelay();

    const { id } = params;
    const video = mockDb.getVideoById(id as string);

    if (!video) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(mapVideoToAdminVideo(video));
  }),

  // 更新视频
  http.put('/api/admin/videos/:id', async ({ params, request }) => {
    await mockDelay();

    const { id } = params;
    const video = mockDb.getVideoById(id as string);

    if (!video) {
      return new HttpResponse(null, { status: 404 });
    }

    // 在实际实现中，我们需要更新数据库中的视频
    // 由于mockDb没有提供更新方法，所以这里我们只返回模拟成功

    return HttpResponse.json({
      success: true,
      message: '视频更新成功',
    });
  }),

  // 删除视频
  http.delete('/api/admin/videos/:id', async ({ params }) => {
    await mockDelay();

    const { id } = params;
    const video = mockDb.getVideoById(id as string);

    if (!video) {
      return new HttpResponse(null, { status: 404 });
    }

    // 在实际实现中，我们需要从数据库中删除视频
    // 由于mockDb没有提供删除方法，所以这里我们只返回模拟成功

    return HttpResponse.json({
      success: true,
      message: '视频已成功删除',
    });
  }),

  // 获取用户列表
  http.get('/api/admin/users', async ({ request }) => {
    await mockDelay();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const role = url.searchParams.get('role') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const query = url.searchParams.get('query') || undefined;

    // 使用mockDb获取所有用户
    const allUsers = mockDb.getUsers({
      role: role || undefined,
      status: status || undefined,
      search: query || undefined,
    });

    // 根据参数过滤用户
    let filteredUsers = [...allUsers.items];

    // 计算分页
    const startIndex = (page - 1) * pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

    // 将用户映射为管理员用户格式
    const adminUsers = paginatedUsers.map(user => mapUserToAdminUser(user));

    const result: PaginatedResult<AdminUser> = {
      data: adminUsers,
      total: filteredUsers.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredUsers.length / pageSize),
    };

    return HttpResponse.json(result);
  }),

  // 获取用户详情
  http.get('/api/admin/users/:id', async ({ params }) => {
    await mockDelay();

    const { id } = params;
    const users = mockDb.getAllUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(mapUserToAdminUser(user));
  }),

  // 更新用户
  http.put('/api/admin/users/:id', async ({ params, request }) => {
    await mockDelay();

    const { id } = params;
    const users = mockDb.getAllUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    // 在实际实现中，需要更新数据库中的用户信息
    // 由于mockDb没有提供更新方法，所以这里我们只返回模拟成功

    return HttpResponse.json({
      success: true,
      message: '用户信息更新成功',
    });
  }),

  // 删除用户
  http.delete('/api/admin/users/:id', async ({ params }) => {
    await mockDelay();

    const { id } = params;
    const users = mockDb.getAllUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }

    // 在实际实现中，需要从数据库中删除用户
    // 由于mockDb没有提供删除方法，所以这里我们只返回模拟成功

    return HttpResponse.json({
      success: true,
      message: '用户已成功删除',
    });
  }),

  // 获取评论列表
  http.get('/api/admin/comments', async ({ request }) => {
    await mockDelay();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const status = url.searchParams.get('status') || undefined;
    const videoId = url.searchParams.get('videoId') || undefined;
    const userId = url.searchParams.get('userId') || undefined;
    const query = url.searchParams.get('query') || undefined;

    // 获取评论列表
    const result = mockDb.getComments({
      page,
      limit: pageSize,
      videoId,
      userId,
      status,
      search: query,
    });

    // 获取视频和用户信息
    const videos = mockDb.getVideos({ limit: 100 }).items;
    const users = mockDb.getAllUsers();

    // 构建管理员评论列表
    const adminComments: AdminComment[] = result.items.map(comment =>
      mapCommentToAdminComment(comment, videos, users)
    );

    const resultData: PaginatedResult<AdminComment> = {
      data: adminComments,
      total: result.total,
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize),
    };

    return HttpResponse.json(resultData);
  }),

  // 获取举报列表
  http.get('/api/admin/reports', async ({ request }) => {
    await mockDelay();

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const type = url.searchParams.get('type') || undefined;
    const status = url.searchParams.get('status') || undefined;
    const severity = url.searchParams.get('severity') || undefined;

    const result = mockDb.getReports({
      page,
      limit: pageSize,
      type,
      status,
      severity,
    });

    const users = mockDb.getAllUsers();
    const adminReports: AdminReport[] = result.items.map(report =>
      mapReportToAdminReport(report, users)
    );

    const resultData: PaginatedResult<AdminReport> = {
      data: adminReports,
      total: result.total,
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize),
    };

    return HttpResponse.json(resultData);
  }),

  // 处理举报
  http.put('/api/admin/reports/:id', async ({ params, request }) => {
    await mockDelay();

    const { id } = params;
    // 在实际实现中，这里会从mockDb获取举报并进行更新
    // 由于mockDb没有提供相应的方法，我们只返回成功响应

    return HttpResponse.json({
      success: true,
      message: '举报处理成功',
    });
  }),
];

export default adminHandlers;
