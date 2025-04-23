/**
 * 管理后台Mock数据处理器
 *
 * 提供管理后台所需的模拟API数据
 */

import { registerMockHandler } from '../api';
import { localStorageSupport, safeGetItem, safeSetItem } from '@/utils/storageUtils';
import { formatDate } from '@/utils/format';
import { faker } from '@faker-js/faker';

// 常量定义
const ADMIN_STATS_KEY = 'atom-video-admin-stats';
const ADMIN_VIDEOS_KEY = 'atom-video-admin-videos';
const ADMIN_USERS_KEY = 'atom-video-admin-users';
const ADMIN_COMMENTS_KEY = 'atom-video-admin-comments';
const ADMIN_REPORTS_KEY = 'atom-video-admin-reports';
const ADMIN_LOGS_KEY = 'atom-video-admin-logs';
const ADMIN_TAGS_KEY = 'atom-video-admin-tags';
const ADMIN_CATEGORIES_KEY = 'atom-video-admin-categories';

// 初始化本地存储
const initAdminStorage = () => {
  if (!localStorageSupport()) return;

  // 检查并初始化管理统计数据
  if (!localStorage.getItem(ADMIN_STATS_KEY)) {
    const initialStats = {
      userCount: 12846,
      videoCount: 4295,
      commentCount: 31275,
      interactionCount: 84521,
      newUserCount: 128,
      newVideoCount: 47,
      activeUserCount: 2541,
      reportCount: 15,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(ADMIN_STATS_KEY, JSON.stringify(initialStats));
  }

  // 检查并初始化视频管理数据
  if (!localStorage.getItem(ADMIN_VIDEOS_KEY)) {
    const videos = Array(50)
      .fill(null)
      .map((_, index) => ({
        id: `video-${index + 1}`,
        title: faker.helpers.arrayElement([
          'Vue 3 完整教程 2024 - 从入门到精通',
          'React 实战项目开发教程',
          'TypeScript 高级特性详解',
          'Node.js 服务端开发实践',
          'Python 数据分析入门指南',
          'Web3开发完全指南',
          '区块链技术深度剖析',
          '移动应用UI设计原则',
          'DevOps实践与工具链',
          '微服务架构设计模式',
        ]),
        description: faker.lorem.paragraph(),
        thumbnailUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/480/270`,
        videoUrl: `https://example.com/videos/${faker.string.alphanumeric(12)}`,
        author: faker.person.fullName(),
        authorId: `user-${(index % 20) + 1}`,
        category: faker.helpers.arrayElement(['技术', '教育', '娱乐', '游戏', '音乐', '科学']),
        duration: `${faker.number.int({ min: 1, max: 30 })}:${faker.number.int({ min: 10, max: 59 })}`,
        status: faker.helpers.arrayElement(['published', 'pending', 'rejected', 'draft']),
        tags: faker.helpers.arrayElements(
          [
            'javascript',
            'typescript',
            'vue',
            'react',
            'nodejs',
            'python',
            'web3',
            'blockchain',
            'design',
            'devops',
          ],
          faker.number.int({ min: 1, max: 4 })
        ),
        createdAt: faker.date.past({ years: 1 }).toISOString(),
        publishedAt: faker.helpers.maybe(() => faker.date.recent({ days: 30 }).toISOString()),
        viewCount: faker.number.int({ min: 100, max: 100000 }),
        likeCount: faker.number.int({ min: 10, max: 5000 }),
        commentCount: faker.number.int({ min: 0, max: 500 }),
      }));
    localStorage.setItem(ADMIN_VIDEOS_KEY, JSON.stringify(videos));
  }

  // 检查并初始化用户管理数据
  if (!localStorage.getItem(ADMIN_USERS_KEY)) {
    const users = Array(100)
      .fill(null)
      .map((_, index) => ({
        id: `user-${index + 1}`,
        username: faker.internet.username(),
        email: faker.internet.email(),
        nickname: faker.person.fullName(),
        avatar: faker.image.avatar(),
        role: faker.helpers.arrayElement(['user', 'creator', 'admin', 'moderator']),
        status: faker.helpers.arrayElement(['active', 'suspended', 'pending']),
        createdAt: faker.date.past({ years: 2 }).toISOString(),
        lastLogin: faker.helpers.maybe(() => faker.date.recent({ days: 30 }).toISOString()),
        videoCount: faker.number.int({ min: 0, max: 50 }),
        subscriberCount: faker.number.int({ min: 0, max: 10000 }),
        bio: faker.lorem.paragraph(),
        verified: faker.datatype.boolean(0.2),
      }));
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  }

  // 检查并初始化评论管理数据
  if (!localStorage.getItem(ADMIN_COMMENTS_KEY)) {
    const comments = Array(200)
      .fill(null)
      .map((_, index) => ({
        id: `comment-${index + 1}`,
        content: faker.lorem.paragraph(),
        videoId: `video-${faker.number.int({ min: 1, max: 50 })}`,
        videoTitle: faker.lorem.sentence(),
        userId: `user-${faker.number.int({ min: 1, max: 100 })}`,
        username: faker.internet.username(),
        avatar: faker.image.avatar(),
        createdAt: faker.date.recent({ days: 30 }).toISOString(),
        status: faker.helpers.arrayElement(['visible', 'hidden', 'flagged']),
        likes: faker.number.int({ min: 0, max: 100 }),
        replies: faker.number.int({ min: 0, max: 20 }),
      }));
    localStorage.setItem(ADMIN_COMMENTS_KEY, JSON.stringify(comments));
  }

  // 检查并初始化举报管理数据
  if (!localStorage.getItem(ADMIN_REPORTS_KEY)) {
    const reports = Array(30)
      .fill(null)
      .map((_, index) => ({
        id: `report-${index + 1}`,
        type: faker.helpers.arrayElement(['video', 'comment', 'user']),
        reasonCode: faker.helpers.arrayElement([
          'inappropriate',
          'copyright',
          'spam',
          'harassment',
          'violence',
        ]),
        targetId: faker.helpers.arrayElement([
          `video-${faker.number.int({ min: 1, max: 50 })}`,
          `comment-${faker.number.int({ min: 1, max: 200 })}`,
          `user-${faker.number.int({ min: 1, max: 100 })}`,
        ]),
        reporterId: `user-${faker.number.int({ min: 1, max: 100 })}`,
        reporterName: faker.internet.username(),
        description: faker.lorem.paragraph(),
        createdAt: faker.date.recent({ days: 14 }).toISOString(),
        status: faker.helpers.arrayElement(['pending', 'resolved', 'dismissed']),
        resolvedAt: faker.helpers.maybe(() => faker.date.recent({ days: 7 }).toISOString()),
        resolvedById: faker.helpers.maybe(() => `admin-${faker.number.int({ min: 1, max: 5 })}`),
        severity: faker.helpers.arrayElement(['low', 'medium', 'high']),
      }));
    localStorage.setItem(ADMIN_REPORTS_KEY, JSON.stringify(reports));
  }

  // 检查并初始化系统日志数据
  if (!localStorage.getItem(ADMIN_LOGS_KEY)) {
    const logs = Array(100)
      .fill(null)
      .map((_, index) => ({
        id: `log-${index + 1}`,
        type: faker.helpers.arrayElement(['system', 'user', 'content', 'security']),
        level: faker.helpers.arrayElement(['info', 'warning', 'error', 'critical']),
        message: faker.lorem.sentence(),
        details: faker.lorem.paragraph(),
        timestamp: faker.date.recent({ days: 30 }).toISOString(),
        userId: faker.helpers.maybe(() => `user-${faker.number.int({ min: 1, max: 100 })}`),
        ipAddress: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
        path: faker.helpers.arrayElement([
          '/admin/dashboard',
          '/admin/videos',
          '/admin/users',
          '/admin/comments',
          '/admin/reports',
          '/video/upload',
          '/auth/login',
        ]),
        method: faker.helpers.arrayElement(['GET', 'POST', 'PUT', 'DELETE']),
      }));
    localStorage.setItem(ADMIN_LOGS_KEY, JSON.stringify(logs));
  }

  // 检查并初始化标签管理数据
  if (!localStorage.getItem(ADMIN_TAGS_KEY)) {
    const tags = [
      {
        id: 'tag-1',
        name: 'javascript',
        count: 128,
        createdAt: faker.date.past({ years: 1 }).toISOString(),
      },
      {
        id: 'tag-2',
        name: 'typescript',
        count: 97,
        createdAt: faker.date.past({ years: 1 }).toISOString(),
      },
      {
        id: 'tag-3',
        name: 'vue',
        count: 236,
        createdAt: faker.date.past({ years: 1 }).toISOString(),
      },
      {
        id: 'tag-4',
        name: 'react',
        count: 184,
        createdAt: faker.date.past({ years: 1 }).toISOString(),
      },
      {
        id: 'tag-5',
        name: 'nodejs',
        count: 112,
        createdAt: faker.date.past({ years: 1 }).toISOString(),
      },
      {
        id: 'tag-6',
        name: 'python',
        count: 153,
        createdAt: faker.date.past({ years: 1 }).toISOString(),
      },
      {
        id: 'tag-7',
        name: 'web3',
        count: 67,
        createdAt: faker.date.past({ months: 6 }).toISOString(),
      },
      {
        id: 'tag-8',
        name: 'blockchain',
        count: 48,
        createdAt: faker.date.past({ months: 8 }).toISOString(),
      },
      {
        id: 'tag-9',
        name: 'design',
        count: 92,
        createdAt: faker.date.past({ years: 1 }).toISOString(),
      },
      {
        id: 'tag-10',
        name: 'devops',
        count: 73,
        createdAt: faker.date.past({ months: 9 }).toISOString(),
      },
    ];
    localStorage.setItem(ADMIN_TAGS_KEY, JSON.stringify(tags));
  }

  // 检查并初始化分类管理数据
  if (!localStorage.getItem(ADMIN_CATEGORIES_KEY)) {
    const categories = [
      {
        id: 'cat-1',
        name: '技术',
        slug: 'technology',
        count: 1856,
        order: 1,
        createdAt: faker.date.past({ years: 2 }).toISOString(),
      },
      {
        id: 'cat-2',
        name: '教育',
        slug: 'education',
        count: 1243,
        order: 2,
        createdAt: faker.date.past({ years: 2 }).toISOString(),
      },
      {
        id: 'cat-3',
        name: '娱乐',
        slug: 'entertainment',
        count: 975,
        order: 3,
        createdAt: faker.date.past({ years: 2 }).toISOString(),
      },
      {
        id: 'cat-4',
        name: '游戏',
        slug: 'gaming',
        count: 734,
        order: 4,
        createdAt: faker.date.past({ years: 2 }).toISOString(),
      },
      {
        id: 'cat-5',
        name: '音乐',
        slug: 'music',
        count: 589,
        order: 5,
        createdAt: faker.date.past({ years: 2 }).toISOString(),
      },
      {
        id: 'cat-6',
        name: '科学',
        slug: 'science',
        count: 423,
        order: 6,
        createdAt: faker.date.past({ years: 1 }).toISOString(),
      },
    ];
    localStorage.setItem(ADMIN_CATEGORIES_KEY, JSON.stringify(categories));
  }
};

// 注册所有管理后台Mock处理器
export const registerAdminMockHandlers = () => {
  // 初始化管理后台存储
  initAdminStorage();

  // 仪表盘统计数据
  registerMockHandler({
    method: 'GET',
    url: '/api/admin/dashboard/stats',
    handler: () => {
      const stats = safeGetItem(ADMIN_STATS_KEY, {});
      return { success: true, data: stats };
    },
  });

  // 仪表盘活动数据
  registerMockHandler({
    method: 'GET',
    url: '/api/admin/dashboard/activities',
    handler: () => {
      const activities = [
        {
          id: 1,
          type: 'user_register',
          title: '新用户注册',
          description: '用户 John Doe 完成了注册',
          time: '10分钟前',
          userId: 'user123',
          avatar: 'https://i.pravatar.cc/100?img=1',
        },
        {
          id: 2,
          type: 'video_upload',
          title: '视频上传',
          description: 'Alice 上传了新视频"Vue 3.0 深入解析"',
          time: '30分钟前',
          userId: 'user456',
          videoId: 'video789',
          avatar: 'https://i.pravatar.cc/100?img=2',
        },
        {
          id: 3,
          type: 'report_resolve',
          title: '举报处理',
          description: '管理员处理了一条内容投诉',
          time: '2小时前',
          reportId: 'report123',
          adminId: 'admin789',
          avatar: 'https://i.pravatar.cc/100?img=3',
        },
        {
          id: 4,
          type: 'comment_flag',
          title: '评论被标记',
          description: '系统自动标记了一条可能违规的评论',
          time: '3小时前',
          commentId: 'comment456',
          avatar: 'https://i.pravatar.cc/100?img=4',
        },
        {
          id: 5,
          type: 'user_login',
          title: '管理员登录',
          description: '管理员 Sarah 从新IP地址登录系统',
          time: '5小时前',
          userId: 'admin123',
          avatar: 'https://i.pravatar.cc/100?img=5',
        },
      ];
      return { success: true, data: activities };
    },
  });

  // 视频列表
  registerMockHandler({
    method: 'GET',
    url: '/api/admin/videos',
    handler: (url, params) => {
      const page = Number(params?.page) || 1;
      const pageSize = Number(params?.pageSize) || 10;
      const status = params?.status;
      const category = params?.category;
      const query = params?.query?.toLowerCase();
      const startDate = params?.startDate;
      const endDate = params?.endDate;
      const sortBy = params?.sortBy || 'createdAt';
      const sortOrder = params?.sortOrder || 'desc';

      let videos = safeGetItem(ADMIN_VIDEOS_KEY, []);

      // 应用筛选
      if (status) {
        videos = videos.filter(video => video.status === status);
      }

      if (category) {
        videos = videos.filter(video => video.category === category);
      }

      if (query) {
        videos = videos.filter(
          video =>
            video.title.toLowerCase().includes(query) ||
            video.description.toLowerCase().includes(query) ||
            video.id.toLowerCase().includes(query)
        );
      }

      if (startDate && endDate) {
        videos = videos.filter(video => {
          const videoDate = new Date(video.createdAt);
          return videoDate >= new Date(startDate) && videoDate <= new Date(endDate);
        });
      }

      // 应用排序
      videos.sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          if (sortOrder === 'asc') {
            return valueA.localeCompare(valueB);
          } else {
            return valueB.localeCompare(valueA);
          }
        } else {
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

      return {
        success: true,
        data: {
          videos: paginatedVideos,
          total: videos.length,
          page,
          pageSize,
          totalPages: Math.ceil(videos.length / pageSize),
        },
      };
    },
  });

  // 视频详情
  registerMockHandler({
    method: 'GET',
    url: /\/api\/admin\/videos\/([a-zA-Z0-9-_]+)$/,
    handler: url => {
      const videoId = url.split('/').pop();
      const videos = safeGetItem(ADMIN_VIDEOS_KEY, []);
      const video = videos.find(v => v.id === videoId);

      if (!video) {
        return { success: false, message: '视频不存在' };
      }

      return { success: true, data: video };
    },
  });

  // 更新视频
  registerMockHandler({
    method: 'PUT',
    url: /\/api\/admin\/videos\/([a-zA-Z0-9-_]+)$/,
    handler: (url, data) => {
      const videoId = url.split('/').pop();
      const videos = safeGetItem(ADMIN_VIDEOS_KEY, []);
      const videoIndex = videos.findIndex(v => v.id === videoId);

      if (videoIndex === -1) {
        return { success: false, message: '视频不存在' };
      }

      // 更新视频
      videos[videoIndex] = { ...videos[videoIndex], ...data };
      safeSetItem(ADMIN_VIDEOS_KEY, videos);

      return { success: true, data: videos[videoIndex] };
    },
  });

  // 删除视频
  registerMockHandler({
    method: 'DELETE',
    url: /\/api\/admin\/videos\/([a-zA-Z0-9-_]+)$/,
    handler: url => {
      const videoId = url.split('/').pop();
      const videos = safeGetItem(ADMIN_VIDEOS_KEY, []);
      const filteredVideos = videos.filter(v => v.id !== videoId);

      if (filteredVideos.length === videos.length) {
        return { success: false, message: '视频不存在' };
      }

      safeSetItem(ADMIN_VIDEOS_KEY, filteredVideos);

      // 更新统计数据
      const stats = safeGetItem(ADMIN_STATS_KEY, {});
      stats.videoCount -= 1;
      safeSetItem(ADMIN_STATS_KEY, stats);

      return { success: true, message: '视频已删除' };
    },
  });

  // 用户列表
  registerMockHandler({
    method: 'GET',
    url: '/api/admin/users',
    handler: (url, params) => {
      const page = Number(params?.page) || 1;
      const pageSize = Number(params?.pageSize) || 10;
      const role = params?.role;
      const status = params?.status;
      const query = params?.query?.toLowerCase();

      let users = safeGetItem(ADMIN_USERS_KEY, []);

      // 应用筛选
      if (role) {
        users = users.filter(user => user.role === role);
      }

      if (status) {
        users = users.filter(user => user.status === status);
      }

      if (query) {
        users = users.filter(
          user =>
            user.username.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.nickname.toLowerCase().includes(query) ||
            user.id.toLowerCase().includes(query)
        );
      }

      // 应用分页
      const start = (page - 1) * pageSize;
      const paginatedUsers = users.slice(start, start + pageSize);

      return {
        success: true,
        data: {
          users: paginatedUsers,
          total: users.length,
          page,
          pageSize,
          totalPages: Math.ceil(users.length / pageSize),
        },
      };
    },
  });

  // 其他API处理器...
  // 根据需要继续添加更多的API处理器
};
