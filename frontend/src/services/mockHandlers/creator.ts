/**
 * 创作者模块的Mock数据处理器
 *
 * 提供创作者工作室所需的模拟API数据
 */

import { registerMockHandler } from '../api';
import { localStorageSupport, safeGetItem, safeSetItem } from '@/utils/storageUtils';
import { faker } from '@faker-js/faker';
import { formatDate } from '@/utils/format';

// 存储键
const CREATOR_STATS_KEY = 'atom-video-creator-stats';
const CREATOR_ANALYTICS_KEY = 'atom-video-creator-analytics';
const CREATOR_CHANNEL_KEY = 'atom-video-creator-channel';
const CREATOR_REVENUE_KEY = 'atom-video-creator-revenue';

// 视频和评论复用管理后台的存储键
// 这些在mockHandlers/admin.ts中定义，但为了避免循环引用，这里重新定义
const ADMIN_VIDEOS_KEY = 'atom-video-admin-videos';
const ADMIN_COMMENTS_KEY = 'atom-video-admin-comments';
const ADMIN_USERS_KEY = 'atom-video-admin-users';

// 初始化创作者本地存储
const initCreatorStorage = () => {
  if (!localStorageSupport()) return;

  // 初始化创作者统计数据
  if (!localStorage.getItem(CREATOR_STATS_KEY)) {
    const initialStats = {
      totalVideos: 8,
      totalViews: 25640,
      totalSubscribers: 1240,
      totalLikes: 4290,
      totalComments: 768,
      newSubscribers: 28,
      revenueGenerated: 142.5,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(CREATOR_STATS_KEY, JSON.stringify(initialStats));
  }

  // 初始化视频分析数据
  if (!localStorage.getItem(CREATOR_ANALYTICS_KEY)) {
    // 可以在有需要时延迟生成
    localStorage.setItem(CREATOR_ANALYTICS_KEY, JSON.stringify({}));
  }

  // 初始化频道设置
  if (!localStorage.getItem(CREATOR_CHANNEL_KEY)) {
    const channelSettings = {
      name: '编程学习频道',
      description:
        '提供高质量的编程教程和技术分享，包括Vue、React、TypeScript等前端技术以及后端开发知识。',
      bannerUrl: 'https://picsum.photos/seed/channel/1200/300',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      links: [
        { type: 'website', url: 'https://example.com', title: '个人网站' },
        { type: 'github', url: 'https://github.com/example', title: 'GitHub' },
      ],
      themeColor: '#3fb950',
    };
    localStorage.setItem(CREATOR_CHANNEL_KEY, JSON.stringify(channelSettings));
  }

  // 初始化收入数据
  if (!localStorage.getItem(CREATOR_REVENUE_KEY)) {
    const dailyRevenue = Array(30)
      .fill(0)
      .map(() => faker.number.float({ min: 0.5, max: 15, precision: 0.01 }));
    const revenueData = {
      daily: dailyRevenue,
      weekly: [42.15, 38.75, 51.2, 35.8],
      monthly: [142.5, 168.75, 120.3, 98.6, 130.25, 160.8],
    };
    localStorage.setItem(CREATOR_REVENUE_KEY, JSON.stringify(revenueData));
  }
};

// 创建视频分析数据
const createVideoAnalytics = videoId => {
  const videos = safeGetItem(ADMIN_VIDEOS_KEY, []);
  const video = videos.find(v => v.id === videoId);

  if (!video) return null;

  // 基本分析数据
  const retention = faker.number.int({ min: 55, max: 95 });
  const watchTime = Math.round(video.viewCount * (retention / 100));

  // 近7天数据
  const viewsLast7Days = Array(7)
    .fill(0)
    .map(() => faker.number.int({ min: 10, max: 200 }));

  // 近30天数据
  const viewsLast30Days = Array(30)
    .fill(0)
    .map(() => faker.number.int({ min: 5, max: 150 }));

  // 区域数据
  const audienceRegions = [
    { region: '中国', percentage: 45 },
    { region: '美国', percentage: 20 },
    { region: '日本', percentage: 10 },
    { region: '德国', percentage: 8 },
    { region: '英国', percentage: 7 },
    { region: '其他', percentage: 10 },
  ];

  // 设备数据
  const audienceDevices = [
    { device: '桌面端', percentage: 55 },
    { device: '移动端', percentage: 40 },
    { device: '平板', percentage: 5 },
  ];

  return {
    id: videoId,
    title: video.title,
    views: video.viewCount,
    watchTime,
    likes: video.likeCount,
    comments: video.commentCount,
    retention,
    viewsLast7Days,
    viewsLast30Days,
    audienceRegions,
    audienceDevices,
    publishedAt: video.publishedAt || video.createdAt,
  };
};

// 注册创作者Mock处理器
export const registerCreatorMockHandlers = () => {
  // 初始化创作者存储
  initCreatorStorage();

  // 获取创作者统计数据
  registerMockHandler({
    method: 'GET',
    url: '/api/creator/stats',
    handler: () => {
      const stats = safeGetItem(CREATOR_STATS_KEY, {});
      return { success: true, data: stats };
    },
  });

  // 获取创作者视频列表
  registerMockHandler({
    method: 'GET',
    url: '/api/creator/videos',
    handler: (url, params) => {
      const page = Number(params?.page) || 1;
      const pageSize = Number(params?.pageSize) || 10;
      const status = params?.status;
      const query = params?.query?.toLowerCase();
      const sortBy = params?.sortBy || 'createdAt';
      const sortOrder = params?.sortOrder || 'desc';

      // 模拟当前创作者ID
      const currentCreatorId = 'user-1';

      // 从管理后台视频中筛选出当前创作者的视频
      let videos = safeGetItem(ADMIN_VIDEOS_KEY, []).filter(
        video => video.authorId === currentCreatorId
      );

      // 应用筛选
      if (status) {
        videos = videos.filter(video => video.status === status);
      }

      if (query) {
        videos = videos.filter(
          video =>
            video.title.toLowerCase().includes(query) ||
            video.description.toLowerCase().includes(query)
        );
      }

      // 应用排序
      videos.sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        // 字符串排序
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          if (sortOrder === 'asc') {
            return valueA.localeCompare(valueB);
          } else {
            return valueB.localeCompare(valueA);
          }
        }
        // 数值排序
        else {
          if (sortOrder === 'asc') {
            return valueA - valueB;
          } else {
            return valueB - valueA;
          }
        }
      });

      // 应用分页
      const start = (page - 1) * pageSize;
      const paginatedVideos = videos.slice(start, start + pageSize);

      // 转换为创作者视频格式
      const creatorVideos = paginatedVideos.map(video => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnailUrl,
        status: video.status,
        privacy: 'public', // 假设这个属性
        uploadDate: video.createdAt,
        publishedAt: video.publishedAt,
        views: video.viewCount,
        likes: video.likeCount,
        comments: video.commentCount,
        duration: video.duration,
        description: video.description,
      }));

      return {
        success: true,
        data: {
          data: creatorVideos,
          total: videos.length,
          page,
          pageSize,
          totalPages: Math.ceil(videos.length / pageSize),
        },
      };
    },
  });

  // 获取单个视频
  registerMockHandler({
    method: 'GET',
    url: /\/api\/creator\/videos\/([a-zA-Z0-9-_]+)$/,
    handler: url => {
      const videoId = url.split('/').pop();
      const videos = safeGetItem(ADMIN_VIDEOS_KEY, []);
      const video = videos.find(v => v.id === videoId);

      if (!video) {
        return { success: false, message: '视频不存在' };
      }

      const creatorVideo = {
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnailUrl,
        status: video.status,
        privacy: 'public', // 假设这个属性
        uploadDate: video.createdAt,
        publishedAt: video.publishedAt,
        views: video.viewCount,
        likes: video.likeCount,
        comments: video.commentCount,
        duration: video.duration,
        description: video.description,
      };

      return { success: true, data: creatorVideo };
    },
  });

  // 更新视频
  registerMockHandler({
    method: 'PUT',
    url: /\/api\/creator\/videos\/([a-zA-Z0-9-_]+)$/,
    handler: (url, data) => {
      const videoId = url.split('/').pop();
      const videos = safeGetItem(ADMIN_VIDEOS_KEY, []);
      const videoIndex = videos.findIndex(v => v.id === videoId);

      if (videoIndex === -1) {
        return { success: false, message: '视频不存在' };
      }

      // 从创作者视频格式转换回管理后台格式
      const updatedVideo = {
        ...videos[videoIndex],
        title: data.title || videos[videoIndex].title,
        description: data.description || videos[videoIndex].description,
        status: data.status || videos[videoIndex].status,
      };

      // 如果视频被发布，设置发布时间
      if (data.status === 'published' && videos[videoIndex].status !== 'published') {
        updatedVideo.publishedAt = new Date().toISOString();
      }

      // 更新视频
      videos[videoIndex] = updatedVideo;
      safeSetItem(ADMIN_VIDEOS_KEY, videos);

      // 转换为创作者视频格式返回
      const creatorVideo = {
        id: updatedVideo.id,
        title: updatedVideo.title,
        thumbnail: updatedVideo.thumbnailUrl,
        status: updatedVideo.status,
        privacy: 'public',
        uploadDate: updatedVideo.createdAt,
        publishedAt: updatedVideo.publishedAt,
        views: updatedVideo.viewCount,
        likes: updatedVideo.likeCount,
        comments: updatedVideo.commentCount,
        duration: updatedVideo.duration,
        description: updatedVideo.description,
      };

      return { success: true, data: creatorVideo };
    },
  });

  // 删除视频
  registerMockHandler({
    method: 'DELETE',
    url: /\/api\/creator\/videos\/([a-zA-Z0-9-_]+)$/,
    handler: url => {
      const videoId = url.split('/').pop();
      const videos = safeGetItem(ADMIN_VIDEOS_KEY, []);
      const videoIndex = videos.findIndex(v => v.id === videoId);

      if (videoIndex === -1) {
        return { success: false, message: '视频不存在' };
      }

      // 获取要删除的视频信息，用于更新统计数据
      const deletedVideo = videos[videoIndex];

      // 删除视频
      const updatedVideos = videos.filter(v => v.id !== videoId);
      safeSetItem(ADMIN_VIDEOS_KEY, updatedVideos);

      // 更新创作者统计数据
      const stats = safeGetItem(CREATOR_STATS_KEY, {});
      stats.totalVideos = Math.max(0, stats.totalVideos - 1);
      stats.totalViews = Math.max(0, stats.totalViews - deletedVideo.viewCount);
      stats.totalLikes = Math.max(0, stats.totalLikes - deletedVideo.likeCount);
      stats.totalComments = Math.max(0, stats.totalComments - deletedVideo.commentCount);
      stats.lastUpdated = new Date().toISOString();
      safeSetItem(CREATOR_STATS_KEY, stats);

      return { success: true, message: '视频已删除' };
    },
  });

  // 获取视频分析数据
  registerMockHandler({
    method: 'GET',
    url: /\/api\/creator\/videos\/([a-zA-Z0-9-_]+)\/analytics$/,
    handler: url => {
      const videoId = url.split('/').pop();

      // 获取缓存的分析数据，如果没有则创建新的
      const analyticsStore = safeGetItem(CREATOR_ANALYTICS_KEY, {});
      if (!analyticsStore[videoId]) {
        analyticsStore[videoId] = createVideoAnalytics(videoId);
        safeSetItem(CREATOR_ANALYTICS_KEY, analyticsStore);
      }

      const analytics = analyticsStore[videoId];
      if (!analytics) {
        return { success: false, message: '无法获取视频分析数据' };
      }

      return { success: true, data: analytics };
    },
  });

  // 获取创作者评论
  registerMockHandler({
    method: 'GET',
    url: '/api/creator/comments',
    handler: (url, params) => {
      const page = Number(params?.page) || 1;
      const pageSize = Number(params?.pageSize) || 10;
      const videoId = params?.videoId;
      const status = params?.status;

      // 模拟当前创作者ID和他的视频
      const currentCreatorId = 'user-1';
      const videos = safeGetItem(ADMIN_VIDEOS_KEY, [])
        .filter(v => v.authorId === currentCreatorId)
        .map(v => v.id);

      // 从所有评论中筛选出创作者视频上的评论
      let comments = safeGetItem(ADMIN_COMMENTS_KEY, []);
      comments = comments.filter(c => videos.includes(c.videoId));

      // 应用筛选
      if (videoId) {
        comments = comments.filter(c => c.videoId === videoId);
      }

      if (status) {
        comments = comments.filter(c => c.status === status);
      }

      // 应用分页
      const start = (page - 1) * pageSize;
      const paginatedComments = comments.slice(start, start + pageSize);

      // 转换为创作者评论格式
      const creatorComments = paginatedComments.map(comment => ({
        id: comment.id,
        content: comment.content,
        videoId: comment.videoId,
        videoTitle: comment.videoTitle,
        user: {
          id: comment.userId,
          nickname: comment.username,
          avatar: comment.avatar,
        },
        createdAt: comment.createdAt,
        status: comment.status,
        likes: comment.likes,
        replies: comment.replies,
        parentId: comment.parentId,
      }));

      return {
        success: true,
        data: {
          data: creatorComments,
          total: comments.length,
          page,
          pageSize,
          totalPages: Math.ceil(comments.length / pageSize),
        },
      };
    },
  });

  // 回复评论
  registerMockHandler({
    method: 'POST',
    url: /\/api\/creator\/comments\/([a-zA-Z0-9-_]+)\/reply$/,
    handler: (url, data) => {
      const commentId = url.split('/')[4];
      const content = data.content;

      // 获取原评论
      const comments = safeGetItem(ADMIN_COMMENTS_KEY, []);
      const commentIndex = comments.findIndex(c => c.id === commentId);

      if (commentIndex === -1) {
        return { success: false, message: '评论不存在' };
      }

      const originalComment = comments[commentIndex];

      // 创建回复评论
      const newComment = {
        id: `comment-${Date.now()}`,
        content: content,
        videoId: originalComment.videoId,
        videoTitle: originalComment.videoTitle,
        userId: 'user-1', // 当前创作者ID
        username: '创作者',
        avatar: 'https://i.pravatar.cc/150?img=1',
        createdAt: new Date().toISOString(),
        status: 'visible',
        likes: 0,
        replies: 0,
        parentId: commentId,
      };

      // 更新原评论的回复数
      comments[commentIndex].replies += 1;

      // 保存到评论列表
      comments.push(newComment);
      safeSetItem(ADMIN_COMMENTS_KEY, comments);

      // 更新统计数据
      const stats = safeGetItem(CREATOR_STATS_KEY, {});
      stats.totalComments += 1;
      stats.lastUpdated = new Date().toISOString();
      safeSetItem(CREATOR_STATS_KEY, stats);

      // 转换为创作者评论格式
      const creatorComment = {
        id: newComment.id,
        content: newComment.content,
        videoId: newComment.videoId,
        videoTitle: newComment.videoTitle,
        user: {
          id: newComment.userId,
          nickname: newComment.username,
          avatar: newComment.avatar,
        },
        createdAt: newComment.createdAt,
        status: newComment.status,
        likes: newComment.likes,
        replies: newComment.replies,
        parentId: newComment.parentId,
      };

      return { success: true, data: creatorComment };
    },
  });

  // 删除评论
  registerMockHandler({
    method: 'DELETE',
    url: /\/api\/creator\/comments\/([a-zA-Z0-9-_]+)$/,
    handler: url => {
      const commentId = url.split('/').pop();
      const comments = safeGetItem(ADMIN_COMMENTS_KEY, []);
      const commentIndex = comments.findIndex(c => c.id === commentId);

      if (commentIndex === -1) {
        return { success: false, message: '评论不存在' };
      }

      // 获取要删除的评论，用于检查是否有父评论
      const commentToDelete = comments[commentIndex];

      // 如果是回复，更新父评论的回复数
      if (commentToDelete.parentId) {
        const parentIndex = comments.findIndex(c => c.id === commentToDelete.parentId);
        if (parentIndex !== -1) {
          comments[parentIndex].replies = Math.max(0, comments[parentIndex].replies - 1);
        }
      }

      // 删除评论
      comments.splice(commentIndex, 1);
      safeSetItem(ADMIN_COMMENTS_KEY, comments);

      // 更新统计数据
      const stats = safeGetItem(CREATOR_STATS_KEY, {});
      stats.totalComments = Math.max(0, stats.totalComments - 1);
      stats.lastUpdated = new Date().toISOString();
      safeSetItem(CREATOR_STATS_KEY, stats);

      return { success: true, message: '评论已删除' };
    },
  });

  // 获取频道设置
  registerMockHandler({
    method: 'GET',
    url: '/api/creator/channel',
    handler: () => {
      const channelSettings = safeGetItem(CREATOR_CHANNEL_KEY, {});
      return { success: true, data: channelSettings };
    },
  });

  // 更新频道设置
  registerMockHandler({
    method: 'PUT',
    url: '/api/creator/channel',
    handler: (url, data) => {
      const channelSettings = safeGetItem(CREATOR_CHANNEL_KEY, {});
      const updatedSettings = { ...channelSettings, ...data };
      safeSetItem(CREATOR_CHANNEL_KEY, updatedSettings);
      return { success: true, data: updatedSettings };
    },
  });

  // 获取收入数据
  registerMockHandler({
    method: 'GET',
    url: '/api/creator/revenue',
    handler: (url, params) => {
      const period = params?.period || 'week';
      const revenueData = safeGetItem(CREATOR_REVENUE_KEY, {});

      let data = [];
      let labels = [];
      let total = 0;

      if (period === 'week') {
        data = revenueData.weekly || [];
        labels = ['上周', '两周前', '三周前', '四周前'];
        total = data.reduce((sum, val) => sum + val, 0);
      } else if (period === 'month') {
        data = revenueData.monthly || [];
        labels = ['本月', '上月', '两月前', '三月前', '四月前', '五月前'];
        total = data.reduce((sum, val) => sum + val, 0);
      } else if (period === 'day') {
        // 取最近7天
        data = (revenueData.daily || []).slice(0, 7);
        // 生成日期标签
        const today = new Date();
        labels = Array(7)
          .fill(0)
          .map((_, index) => {
            const date = new Date();
            date.setDate(today.getDate() - index);
            return formatDate(date.toISOString(), 'MM-DD');
          })
          .reverse();
        total = data.reduce((sum, val) => sum + val, 0);
      }

      return {
        success: true,
        data: {
          data,
          labels,
          total,
        },
      };
    },
  });
};
