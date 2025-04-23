/**
 * @file mockMapper.ts
 * @description 将模拟数据库的模型映射到前端类型
 */

import type {
  Video as DbVideo,
  User as DbUser,
  Comment as DbComment,
  Report as DbReport,
  Activity as DbActivity,
} from '@/mock/models';
import type { Video, User, Comment } from '@/types';
import type {
  DashboardStats,
  Activity,
  AdminVideo,
  AdminUser,
  AdminComment,
  AdminReport,
} from '@/services/admin';
import { formatDuration } from './format';

/**
 * 将数据库视频模型映射到前端视频类型
 */
export function mapDbVideoToFrontend(dbVideo: DbVideo | null): Video | null {
  if (!dbVideo) return null;

  // 查找作者数据 - 实际应用中可以从数据库获取
  const authorId = dbVideo.authorId;

  return {
    id: dbVideo.id,
    title: dbVideo.title,
    description: dbVideo.description,
    coverUrl: dbVideo.coverUrl,
    videoUrl: dbVideo.videoUrl,
    duration: dbVideo.duration,
    views: dbVideo.views,
    likes: dbVideo.likes,
    favorites: dbVideo.favorites || 0,
    comments: dbVideo.comments,
    createdAt: dbVideo.createdAt,
    author: {
      id: authorId,
      username: 'creator_' + authorId.substring(0, 5),
      nickname: '创作者_' + authorId.substring(0, 5),
      avatar: `https://i.pravatar.cc/150?u=${authorId}`,
      verified: true,
    },
    tags: dbVideo.tags || [],
    sources: dbVideo.sources || [],
    subtitles: dbVideo.subtitles || [],
  };
}

/**
 * 将数据库视频列表映射到前端视频类型列表
 */
export function mapDbVideosToFrontend(dbVideos: DbVideo[]): Video[] {
  return dbVideos.map(video => mapDbVideoToFrontend(video)!);
}

/**
 * 将数据库用户模型映射到前端用户类型
 */
export function mapDbUserToFrontend(dbUser: DbUser | null): User | null {
  if (!dbUser) return null;

  // 将数据库角色映射到前端User接口支持的角色类型
  let userRole: 'user' | 'creator' | 'admin' | undefined = undefined;
  if (dbUser.role) {
    const role = dbUser.role.toLowerCase();
    if (role === 'admin') userRole = 'admin';
    else if (role === 'creator') userRole = 'creator';
    else userRole = 'user';
  }

  return {
    id: dbUser.id,
    username: dbUser.username,
    email: dbUser.email,
    nickname: dbUser.nickname,
    avatar: dbUser.avatar,
    verified: dbUser.verified,
    bio: dbUser.bio,
    subscribers: dbUser.subscribers,
    subscribing: dbUser.subscribing,
    totalViews: dbUser.totalViews,
    joinedAt: dbUser.joinedAt || new Date().toISOString(),
    social: dbUser.social,
    role: userRole,
  };
}

/**
 * 将数据库用户列表映射到前端用户类型列表
 */
export function mapDbUsersToFrontend(dbUsers: DbUser[]): User[] {
  return dbUsers.map(user => mapDbUserToFrontend(user)!);
}

/**
 * 获取视频分类列表
 */
export const videoCategories = [
  { key: 'all', label: '全部' },
  { key: '编程语言', label: '编程语言' },
  { key: '前端开发', label: '前端开发' },
  { key: '后端开发', label: '后端开发' },
  { key: '移动开发', label: '移动开发' },
  { key: '数据库', label: '数据库' },
  { key: '大数据', label: '大数据' },
  { key: '人工智能', label: '人工智能' },
  { key: '云计算', label: '云计算' },
  { key: '网络安全', label: '网络安全' },
  { key: '开发工具', label: '开发工具' },
  { key: '软件工程', label: '软件工程' },
  { key: '算法与数据结构', label: '算法与数据结构' },
  { key: '设计模式', label: '设计模式' },
  { key: '架构设计', label: '架构设计' },
  { key: '运维与部署', label: '运维与部署' },
];

/**
 * 将数据库视频模型映射为管理员视频模型
 * @param video 数据库视频模型
 */
export function mapToAdminVideo(video: DbVideo): AdminVideo {
  return {
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
  };
}

/**
 * 将数据库用户模型映射为管理员用户模型
 * @param user 数据库用户模型
 */
export function mapToAdminUser(user: DbUser): AdminUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    nickname: user.nickname || user.username,
    avatar: user.avatar,
    role: user.role,
    status: user.status || 'active',
    createdAt: user.createdAt || user.joinedAt || new Date().toISOString(),
    lastLogin: user.lastLogin || null,
    videoCount: user.videoCount || 0,
    subscriberCount: typeof user.subscribers === 'number' ? user.subscribers : 0,
    bio: user.bio || '',
    verified: user.verified || false,
  };
}

/**
 * 将数据库评论模型映射为管理员评论模型
 * @param comment 数据库评论模型
 * @param videos 数据库视频列表
 * @param users 数据库用户列表
 */
export function mapToAdminComment(
  comment: DbComment,
  videos: DbVideo[],
  users: DbUser[]
): AdminComment {
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
}

/**
 * 将数据库举报模型映射为管理员举报模型
 * @param report 数据库举报模型
 * @param users 数据库用户列表
 */
export function mapToAdminReport(report: DbReport, users: DbUser[]): AdminReport {
  const reporter = users.find(u => u.id === report.reporterId);

  // 根据举报原因确定严重程度
  const highSeverityReasons = ['版权问题', '不适当的言论'];
  const mediumSeverityReasons = ['内容错误', '抄袭内容', '误导性描述'];

  let severity = '低';
  if (highSeverityReasons.includes(report.reason)) {
    severity = '高';
  } else if (mediumSeverityReasons.includes(report.reason)) {
    severity = '中';
  }

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
    severity,
  };
}

/**
 * 将数据库活动模型映射为API活动模型
 * @param activity 数据库活动模型
 * @param users 数据库用户列表
 * @param videos 数据库视频列表
 */
export function mapToApiActivity(
  activity: DbActivity,
  users: DbUser[],
  videos: DbVideo[]
): Activity {
  const user = users.find(u => u.id === activity.userId);
  const video =
    activity.targetId && activity.action.includes('视频')
      ? videos.find(v => v.id === activity.targetId)
      : null;

  return {
    id: parseInt(activity.id.replace(/[^\d]/g, '')) || Date.now(),
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
}
