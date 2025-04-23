/**
 * @file mockDb.ts
 * @description 模拟数据库，提供统一的数据访问和管理
 */

import { faker } from '@faker-js/faker';
import {
  DbTables,
  User,
  Video,
  Comment,
  Report,
  Activity,
  Revenue,
  Playlist,
  PlaylistVideo,
  Channel,
  ChannelStats,
  ChannelVideo,
  ChannelPlaylist,
} from './models';

// 生成随机ID
export const generateId = (prefix: string = ''): string => {
  return `${prefix}${Math.random().toString(36).substring(2, 15)}`;
};

// 判断是否为今天的日期
const isToday = (dateString: string | undefined): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// 初始化种子用户
const initSeedUsers = (): User[] => {
  return [
    {
      id: 'u-admin',
      username: 'admin',
      email: 'admin@atomvideo.com',
      password: 'Admin@123',
      nickname: '管理员',
      avatar: 'https://i.pravatar.cc/150?u=admin',
      bio: '系统管理员',
      role: 'admin',
      status: 'active',
      verified: true,
      subscribers: 0,
      subscribing: 0,
      totalViews: 0,
      videoCount: 0,
      joinedAt: '2024-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'u-creator',
      username: 'creator',
      email: 'creator@atomvideo.com',
      password: 'Creator@123',
      nickname: '教育创作者',
      avatar: 'https://i.pravatar.cc/150?u=creator',
      bio: '资深软件工程师，专注于Web开发和系统架构设计教学。',
      role: 'creator',
      status: 'active',
      verified: true,
      subscribers: 5000,
      subscribing: 20,
      totalViews: 120000,
      videoCount: 15,
      joinedAt: '2024-02-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
      social: {
        website: 'https://example.com',
        github: 'creator-github',
        twitter: 'creator-twitter',
        location: faker.location.city() + ', ' + faker.location.country(),
      },
    },
    {
      id: 'u-user',
      username: 'user',
      email: 'user@atomvideo.com',
      password: 'User@123',
      nickname: '学习者',
      avatar: 'https://i.pravatar.cc/150?u=user',
      bio: '热爱学习新技术，正在学习前端开发。',
      role: 'user',
      status: 'active',
      verified: false,
      subscribers: 10,
      subscribing: 50,
      totalViews: 0,
      videoCount: 0,
      joinedAt: '2024-03-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z',
      social: {
        location: faker.location.city() + ', ' + faker.location.country(),
      },
    },
  ];
};

// 模拟数据库对象
class MockDatabase {
  private db: DbTables;
  private tokenUserMap: Map<string, string> = new Map(); // token -> userId映射

  constructor() {
    // 初始化空数据库
    this.db = {
      users: [],
      videos: [],
      comments: [],
      reports: [],
      activities: [],
      revenues: [],
      notifications: [], // 添加通知表初始化
      playlists: [], // 添加播放列表表初始化
      playlistVideos: [], // 添加播放列表视频关联表初始化
    };

    // 添加种子数据
    this.initializeData();
  }

  // 初始化数据
  private initializeData(): void {
    // 添加种子用户
    this.db.users = initSeedUsers();

    // 生成更多随机用户
    this.generateRandomUsers(20);

    // 为创作者生成视频
    this.generateRandomVideos(50);

    // 生成评论
    this.generateRandomComments(200);

    // 生成收入数据
    this.generateRandomRevenues(100);

    // 生成举报数据
    this.generateRandomReports(30);

    // 生成活动日志
    this.generateRandomActivities(50);

    // 生成通知数据
    this.generateRandomNotifications(60);

    // 在用户数据中添加following属性以便支持subscribers计算
    this.db.users.forEach(user => {
      if (!user.following) {
        user.following = [];
      }
    });

    // 初始化用户交互数据
    this.initializeUserInteractions();

    // 生成播放列表数据
    this.generateRandomPlaylists(30);
  }

  // 初始化用户交互数据
  private initializeUserInteractions(): void {
    // 获取所有活跃用户
    const activeUsers = this.db.users.filter(user => user.status === 'active');
    // 获取所有已发布视频
    const publishedVideos = this.db.videos.filter(video => video.status === 'published');

    activeUsers.forEach(user => {
      // 初始化点赞视频列表
      if (!user.likedVideos) {
        user.likedVideos = [];

        // 随机选择1-15个视频添加到点赞列表
        const likeCount = faker.number.int({ min: 1, max: 15 });
        for (let i = 0; i < likeCount; i++) {
          const randomVideo = faker.helpers.arrayElement(publishedVideos);

          // 避免重复
          if (!user.likedVideos.includes(randomVideo.id)) {
            user.likedVideos.push(randomVideo.id);
            // 同时更新视频的点赞数
            const video = this.db.videos.find(v => v.id === randomVideo.id);
            if (video) {
              video.likes += 1;
            }
          }
        }
      }

      // 初始化收藏视频列表
      if (!user.favorites) {
        user.favorites = [];

        // 随机选择1-10个视频添加到收藏列表
        const favoriteCount = faker.number.int({ min: 1, max: 10 });
        for (let i = 0; i < favoriteCount; i++) {
          const randomVideo = faker.helpers.arrayElement(publishedVideos);

          // 避免重复
          if (!user.favorites.includes(randomVideo.id)) {
            user.favorites.push(randomVideo.id);
            // 更新视频的收藏计数（如果有的话）
            const video = this.db.videos.find(v => v.id === randomVideo.id);
            if (video && video.favorites !== undefined) {
              video.favorites += 1;
            }
          }
        }
      }

      // 初始化观看历史
      if (!user.watchHistory) {
        user.watchHistory = [];

        // 随机选择5-20个视频添加到观看历史
        const historyCount = faker.number.int({ min: 5, max: 20 });
        for (let i = 0; i < historyCount; i++) {
          const randomVideo = faker.helpers.arrayElement(publishedVideos);
          const videoDuration = randomVideo.duration || 300;

          // 创建观看记录
          const watchProgress = faker.number.float({ min: 0.1, max: 1, fractionDigits: 2 });
          const currentTime = Math.floor(videoDuration * watchProgress);

          user.watchHistory.push({
            videoId: randomVideo.id,
            timestamp: faker.date.recent({ days: 30 }).toISOString(),
            progress: watchProgress,
            currentTime,
            duration: videoDuration,
          });

          // 更新视频的观看次数
          const video = this.db.videos.find(v => v.id === randomVideo.id);
          if (video) {
            video.views += 1;
          }
        }

        // 按时间倒序排序观看历史
        user.watchHistory.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      }
    });
  }

  // 生成随机用户
  private generateRandomUsers(count: number): void {
    const roles = ['creator', 'user'];

    for (let i = 0; i < count; i++) {
      const role = faker.helpers.arrayElement(roles) as 'creator' | 'user';

      const user: User = {
        id: generateId('u-'),
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: 'Password@123',
        nickname: faker.person.fullName(),
        avatar: faker.image.avatar(),
        bio:
          role === 'creator'
            ? faker.helpers.arrayElement([
                '资深软件工程师，专注于Web开发和系统架构设计。',
                '编程讲师，热衷于分享技术知识和编程技巧。',
                '全栈开发者，对新技术有浓厚兴趣，喜欢解决复杂问题。',
                '数据科学家，专注于机器学习和数据分析。',
                '开源贡献者，积极参与多个开源项目的开发和维护。',
              ])
            : faker.lorem.sentence(),
        role,
        status: faker.helpers.arrayElement(['active', 'disabled', 'unverified']),
        verified: role === 'creator' ? faker.datatype.boolean(0.7) : faker.datatype.boolean(0.1),
        subscribers:
          role === 'creator'
            ? faker.number.int({ min: 100, max: 50000 })
            : faker.number.int({ min: 0, max: 100 }),
        subscribing: faker.number.int({ min: 5, max: 200 }),
        totalViews: role === 'creator' ? faker.number.int({ min: 1000, max: 1000000 }) : 0,
        videoCount: role === 'creator' ? faker.number.int({ min: 5, max: 50 }) : 0,
        joinedAt: faker.date.past({ years: 2 }).toISOString(),
        lastLogin: faker.date.recent().toISOString(),
        createdAt: faker.date.past({ years: 2 }).toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        social:
          role === 'creator'
            ? {
                website: faker.helpers.maybe(() => faker.internet.url()),
                twitter: faker.helpers.maybe(() => faker.internet.username()),
                github: faker.helpers.maybe(() => faker.internet.username()),
                location: faker.location.city() + ', ' + faker.location.country(),
              }
            : undefined,
      };

      this.db.users.push(user);
    }
  }

  // 生成随机视频
  private generateRandomVideos(count: number): void {
    // 获取所有创作者
    const creators = this.db.users.filter(user => user.role === 'creator');

    if (creators.length === 0) return;

    // 教育视频分类
    const categories = [
      '编程语言',
      '前端开发',
      '后端开发',
      '移动开发',
      '数据库',
      '大数据',
      '人工智能',
      '云计算',
      '网络安全',
      '开发工具',
      '软件工程',
      '算法与数据结构',
      '设计模式',
      '架构设计',
      '运维与部署',
    ];

    // 教育视频标题模板
    const titleTemplates = [
      `如何提高${faker.helpers.arrayElement(['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust'])}编程效率`,
      `${faker.helpers.arrayElement(['前端', '后端', '全栈', '移动端', '数据库', '云计算'])}开发最佳实践`,
      `${faker.helpers.arrayElement(['算法', '数据结构', '设计模式', '架构设计', '性能优化'])}详解`,
      `${faker.helpers.arrayElement(['React', 'Vue', 'Angular', 'Flutter', 'Swift', 'Kotlin'])}实战教程`,
      `${faker.helpers.arrayElement(['大数据', '人工智能', '区块链', '物联网', '微服务'])}技术入门`,
      `${faker.helpers.arrayElement(['SQL', 'NoSQL', 'GraphQL', 'RESTful API', 'gRPC'])}应用指南`,
      `${faker.helpers.arrayElement(['DevOps', 'CI/CD', '容器化', '自动化测试', '敏捷开发'])}工作流`,
      `${faker.helpers.arrayElement(['Web安全', '网络协议', '加密算法', '身份认证', '授权机制'])}详解`,
    ];

    // 教育视频描述模板
    const descriptionTemplates = [
      '本教程详细讲解了开发中常见的问题及解决方案，适合初学者和有经验的开发者。',
      '通过实际项目案例，深入浅出地讲解了核心概念和实现细节，帮助学习者快速掌握技能。',
      '本课程从基础开始，逐步深入，涵盖了从入门到精通的全部内容，配合完整代码示例。',
      '结合最新技术发展趋势，讲解了行业最佳实践和未来发展方向，助力学习者把握技术前沿。',
      '通过手把手演示，讲解了项目从需求分析到最终实现的完整流程，实用性极强。',
    ];

    // 视频源
    const videoSources = [
      'https://vjs.zencdn.net/v/oceans.mp4',
      'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      'https://media.w3.org/2010/05/bunny/movie.mp4',
      'https://vjs.zencdn.net/v/elephantsdream.mp4',
    ];

    for (let i = 0; i < count; i++) {
      const author = faker.helpers.arrayElement(creators);
      const status = faker.helpers.arrayElement(['published', 'draft', 'pending', 'rejected']);
      const createdAt = faker.date.past({ years: 1 }).toISOString();
      const publishedAt =
        status === 'published'
          ? faker.date.between({ from: createdAt, to: new Date() }).toISOString()
          : undefined;

      // 生成标签 (1-5个)
      const tags = faker.helpers.arrayElements(
        [
          'javascript',
          'python',
          'web开发',
          '算法',
          '数据库',
          'react',
          'vue',
          'docker',
          'kubernetes',
          '微服务',
          'nodejs',
          'typescript',
          'java',
          'spring',
          'mysql',
          'mongodb',
          'redis',
          'aws',
          'azure',
          'git',
          'devops',
        ],
        faker.number.int({ min: 1, max: 5 })
      );

      const video: Video = {
        id: generateId('v-'),
        title: faker.helpers.arrayElement(titleTemplates),
        description:
          faker.helpers.arrayElement(descriptionTemplates) + ' ' + faker.lorem.paragraph(),
        thumbnail: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/320/180`,
        coverUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/640/360`,
        videoUrl: faker.helpers.arrayElement(videoSources),
        duration: faker.number.int({ min: 300, max: 3600 }), // 5分钟到1小时
        views: faker.number.int({ min: 50, max: 500000 }),
        likes: faker.number.int({ min: 5, max: 20000 }),
        dislikes: faker.number.int({ min: 0, max: 500 }),
        favorites: faker.number.int({ min: 0, max: 5000 }),
        isRecommended: faker.datatype.boolean(0.2),
        isTrending: faker.datatype.boolean(0.1),
        comments: 0, // 将在生成评论时更新
        authorId: author.id,
        category: faker.helpers.arrayElement(categories),
        tags,
        status: status as 'published' | 'draft' | 'pending' | 'rejected',
        reason: status === 'rejected' ? faker.lorem.sentence() : undefined,
        createdAt,
        publishedAt,
        updatedAt: faker.date.between({ from: createdAt, to: new Date() }).toISOString(),
        sources: [
          {
            url: faker.helpers.arrayElement(videoSources),
            type: 'video/mp4',
            size: 1080,
            label: '1080p',
          },
          {
            url: faker.helpers.arrayElement(videoSources),
            type: 'video/mp4',
            size: 720,
            label: '720p',
          },
        ],
        subtitles: faker.helpers.maybe(() => [
          {
            url: '#',
            label: '中文',
            srclang: 'zh',
            default: true,
          },
          {
            url: '#',
            label: 'English',
            srclang: 'en',
          },
        ]),
      };

      this.db.videos.push(video);
    }

    // 更新创作者的视频计数
    this.updateCreatorVideoCount();
  }

  // 更新创作者的视频数量
  private updateCreatorVideoCount(): void {
    // 为每个创作者计算视频数量
    const creatorVideoCounts = new Map<string, number>();

    this.db.videos.forEach(video => {
      const count = creatorVideoCounts.get(video.authorId) || 0;
      creatorVideoCounts.set(video.authorId, count + 1);
    });

    // 更新用户的视频计数
    this.db.users.forEach(user => {
      if (creatorVideoCounts.has(user.id)) {
        user.videoCount = creatorVideoCounts.get(user.id) || 0;
      }
    });
  }

  // 生成随机评论
  private generateRandomComments(count: number): void {
    // 获取所有已发布的视频
    const publishedVideos = this.db.videos.filter(video => video.status === 'published');

    if (publishedVideos.length === 0) return;

    // 获取所有用户
    const users = this.db.users;

    if (users.length === 0) return;

    // 评论内容模板
    const commentTemplates = [
      '非常实用的教程，讲解清晰，收获很多！',
      '感谢分享，这个知识点我一直没弄明白，现在理解了。',
      '代码示例很有帮助，能否再详细解释一下第三部分的实现方式？',
      '这个教程对我的项目很有启发，已经应用到实际开发中了。',
      '内容组织得很好，循序渐进，非常适合初学者。',
      '讲解的概念很深入，但是表达方式简单明了，赞！',
      '希望能有更多关于这个主题的进阶内容。',
      '这个问题我之前处理过，补充一点：可以考虑使用xx方法来优化性能。',
    ];

    const commentStatuses = ['normal', 'hidden', 'pending'];

    // 生成评论
    for (let i = 0; i < count; i++) {
      const video = faker.helpers.arrayElement(publishedVideos);
      const user = faker.helpers.arrayElement(users);
      const createdAt = faker.date
        .between({ from: video.publishedAt || video.createdAt, to: new Date() })
        .toISOString();

      const comment: Comment = {
        id: generateId('c-'),
        videoId: video.id,
        userId: user.id,
        content: faker.helpers.arrayElement(commentTemplates) + ' ' + faker.lorem.sentence(),
        likes: faker.number.int({ min: 0, max: 200 }),
        status: faker.helpers.arrayElement(commentStatuses) as 'normal' | 'hidden' | 'pending',
        createdAt,
        updatedAt: createdAt,
        parentId: faker.helpers.maybe(() => {
          const existingComments = this.db.comments.filter(c => c.videoId === video.id);
          return existingComments.length > 0
            ? faker.helpers.arrayElement(existingComments).id
            : undefined;
        }),
      };

      this.db.comments.push(comment);

      // 更新视频评论计数
      video.comments++;
    }
  }

  // 生成收入数据
  private generateRandomRevenues(count: number): void {
    // 获取所有创作者
    const creators = this.db.users.filter(user => user.role === 'creator');

    if (creators.length === 0) return;

    // 收入来源
    const sources: Array<'ads' | 'sponsors' | 'tips' | 'membership'> = [
      'ads',
      'sponsors',
      'tips',
      'membership',
    ];
    const statuses: Array<'pending' | 'paid' | 'cancelled'> = ['pending', 'paid', 'cancelled'];

    for (let i = 0; i < count; i++) {
      const creator = faker.helpers.arrayElement(creators);
      const source = faker.helpers.arrayElement(sources);
      const status = faker.helpers.arrayElement(statuses);
      const createdAt = faker.date.past({ years: 1 }).toISOString();

      const revenue: Revenue = {
        id: generateId('r-'),
        userId: creator.id,
        amount: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
        source,
        status,
        createdAt,
        paidAt:
          status === 'paid'
            ? faker.date.between({ from: createdAt, to: new Date() }).toISOString()
            : undefined,
      };

      this.db.revenues.push(revenue);
    }
  }

  // 生成举报数据
  private generateRandomReports(count: number): void {
    // 获取所有用户、视频和评论
    const users = this.db.users;
    const videos = this.db.videos;
    const comments = this.db.comments;

    if (users.length === 0 || videos.length === 0) return;

    // 举报原因
    const reasons = [
      '内容错误',
      '过时的技术信息',
      '抄袭内容',
      '误导性描述',
      '质量过低',
      '不适当的言论',
      '广告内容',
      '版权问题',
      '其他',
    ];

    // 举报描述
    const descriptions = [
      '该内容包含明显技术错误，可能会误导学习者。',
      '内容中的信息已经过时，不再适用于当前技术环境。',
      '该内容涉嫌抄袭其他平台的教程，未经授权。',
      '视频中的代码示例存在安全漏洞，不应推荐给学习者。',
      '内容质量不符合平台标准，讲解不清晰，示例不完整。',
      '评论中包含不适当的言论，影响社区氛围。',
      '该内容主要是为了推广特定产品，不具有教育价值。',
    ];

    const statuses: Array<'pending' | 'resolved' | 'ignored'> = ['pending', 'resolved', 'ignored'];

    for (let i = 0; i < count; i++) {
      const reporter = faker.helpers.arrayElement(users);
      const type = faker.helpers.arrayElement(['video', 'comment', 'user']) as
        | 'video'
        | 'comment'
        | 'user';

      let targetId = '';

      if (type === 'video' && videos.length > 0) {
        targetId = faker.helpers.arrayElement(videos).id;
      } else if (type === 'comment' && comments.length > 0) {
        targetId = faker.helpers.arrayElement(comments).id;
      } else if (type === 'user' && users.length > 0) {
        // 不要让用户举报自己
        const otherUsers = users.filter(u => u.id !== reporter.id);
        if (otherUsers.length > 0) {
          targetId = faker.helpers.arrayElement(otherUsers).id;
        } else {
          continue;
        }
      }

      if (!targetId) continue;

      const status = faker.helpers.arrayElement(statuses);
      const createdAt = faker.date.recent({ days: 30 }).toISOString();

      const report: Report = {
        id: generateId('rp-'),
        type,
        targetId,
        reporterId: reporter.id,
        reason: faker.helpers.arrayElement(reasons),
        description: faker.helpers.arrayElement(descriptions),
        status,
        createdAt,
        updatedAt:
          status !== 'pending'
            ? faker.date.between({ from: createdAt, to: new Date() }).toISOString()
            : createdAt,
        resolution: status === 'resolved' ? faker.lorem.sentence() : undefined,
      };

      this.db.reports.push(report);
    }
  }

  // 生成活动日志
  private generateRandomActivities(count: number): void {
    // 获取管理员
    const admins = this.db.users.filter(user => user.role === 'admin');

    if (admins.length === 0) return;

    // 活动类型
    const actionTypes = [
      '用户注册',
      '视频上传',
      '视频审核',
      '视频删除',
      '用户禁用',
      '评论审核',
      '举报处理',
    ];

    for (let i = 0; i < count; i++) {
      const admin = faker.helpers.arrayElement(admins);
      const actionType = faker.helpers.arrayElement(actionTypes);

      let action, target, targetId;

      switch (actionType) {
        case '用户注册':
          action = '审核通过了新教育者账号';
          if (this.db.users.length > 0) {
            const user = faker.helpers.arrayElement(
              this.db.users.filter(u => u.role === 'creator')
            );
            target = user.username;
            targetId = user.id;
          } else {
            target = faker.internet.username();
          }
          break;

        case '视频上传':
          action = '收到了新的教育视频';
          if (this.db.videos.length > 0) {
            const video = faker.helpers.arrayElement(this.db.videos);
            target = video.title;
            targetId = video.id;
          } else {
            target = faker.helpers.arrayElement([
              'JavaScript高级编程技巧',
              'React性能优化指南',
              'Python数据分析实战',
              '微服务架构设计模式',
            ]);
          }
          break;

        case '视频审核':
          action = faker.helpers.arrayElement(['通过了视频审核', '拒绝了视频审核']);
          if (this.db.videos.length > 0) {
            const video = faker.helpers.arrayElement(this.db.videos);
            target = video.title;
            targetId = video.id;
          } else {
            target = faker.helpers.arrayElement([
              'Git版本控制完全指南',
              'Docker容器化部署实战',
              'Web应用安全防护',
              '数据结构与算法分析',
            ]);
          }
          break;

        case '视频删除':
          action = '删除了违规视频';
          target = faker.helpers.arrayElement([
            '含有错误信息的Python教程',
            '过时的前端开发技术',
            '侵权的编程课程',
            '低质量的开发工具介绍',
          ]);
          break;

        case '用户禁用':
          action = faker.helpers.arrayElement([
            '暂时禁用了用户',
            '永久禁用了用户',
            '解除了用户禁用',
          ]);
          if (this.db.users.length > 0) {
            const user = faker.helpers.arrayElement(this.db.users);
            target = user.username;
            targetId = user.id;
          } else {
            target = faker.internet.username();
          }
          break;

        case '评论审核':
          action = faker.helpers.arrayElement(['隐藏了不当评论', '恢复了被举报的评论']);
          if (this.db.comments.length > 0) {
            const comment = faker.helpers.arrayElement(this.db.comments);
            target = comment.content.substring(0, 20) + '...';
            targetId = comment.id;
          } else {
            target = faker.lorem.sentence();
          }
          break;

        case '举报处理':
          action = '处理了举报';
          if (this.db.reports.length > 0) {
            const report = faker.helpers.arrayElement(this.db.reports);
            target = `${report.type} 举报`;
            targetId = report.id;
          } else {
            target =
              faker.helpers.arrayElement(['内容错误视频', '误导性评论', '违规用户']) + ' 举报';
          }
          break;

        default:
          action = '执行了平台管理操作';
          target = '教育内容审核';
      }

      const activity: Activity = {
        id: generateId('a-'),
        userId: admin.id,
        action,
        target,
        targetId,
        timestamp: faker.date.recent({ days: 7 }).toISOString(),
        details: faker.helpers.arrayElement([
          '确保平台内容质量和准确性',
          '维护良好的学习社区环境',
          '保障用户获取正确的技术知识',
          '提升平台整体教学体验',
          '防止错误技术信息传播',
        ]),
      };

      this.db.activities.push(activity);
    }
  }

  // 生成随机通知
  private generateRandomNotifications(count: number): void {
    // 通知类型数组
    const notificationTypes = ['video', 'comment', 'subscription', 'system', 'like'];

    // 通知标题模板
    const titleTemplates = {
      video: ['新视频发布', '视频推荐', '热门视频'],
      comment: ['新评论', '评论回复', '评论获赞'],
      subscription: ['新关注者', '关注动态', '创作者更新'],
      system: ['系统通知', '账号安全', '功能更新'],
      like: ['获得点赞', '内容受欢迎', '互动提醒'],
    };

    // 通知内容模板
    const messageTemplates = {
      video: [
        '你关注的创作者发布了新视频',
        '根据你的喜好，为你推荐这个视频',
        '你可能对这个热门视频感兴趣',
      ],
      comment: ['有人评论了你的视频', '有人回复了你的评论', '你的评论获得了点赞'],
      subscription: ['有新用户关注了你', '你关注的创作者有新动态', '创作者更新了个人资料'],
      system: ['你的账号安全设置已更新', '平台新功能上线，点击了解详情', '你的账号完成了安全检查'],
      like: ['你的视频获得了新的点赞', '你的内容很受欢迎', '有新的互动等待你查看'],
    };

    // 为每个活跃用户生成通知
    const activeUsers = this.db.users.filter(user => user.status === 'active');

    for (let i = 0; i < count; i++) {
      // 随机选择用户
      const randomUser = faker.helpers.arrayElement(activeUsers);

      // 随机选择通知类型
      const notificationType = faker.helpers.arrayElement(notificationTypes) as
        | 'video'
        | 'comment'
        | 'subscription'
        | 'system'
        | 'like';

      // 随机选择标题和消息
      const title = faker.helpers.arrayElement(titleTemplates[notificationType]);
      const message = faker.helpers.arrayElement(messageTemplates[notificationType]);

      // 生成随机日期（过去30天内）
      const createdAt = faker.date.recent({ days: 30 }).toISOString();

      // 创建通知
      const notification = {
        id: generateId('notif-'),
        userId: randomUser.id,
        type: notificationType,
        title,
        message,
        read: faker.datatype.boolean(0.3), // 70%未读，30%已读
        createdAt,
        relatedId: faker.helpers.maybe(() => generateId(), { probability: 0.7 }),
        actionUrl: faker.helpers.maybe(() => faker.internet.url(), { probability: 0.8 }),
      };

      this.db.notifications.push(notification);
    }
  }

  /**
   * 从令牌中获取用户ID
   * @param token 用户令牌
   * @returns 用户ID或null
   */
  public getUserIdFromToken(token: string): string | null {
    // 检查令牌是否存在于映射中
    const userId = this.tokenUserMap.get(token);

    if (userId) {
      // 验证用户是否仍然存在（例如，可能已被删除）
      const userExists = this.db.users.some(u => u.id === userId);
      if (userExists) {
        return userId;
      } else {
        // 如果用户不存在，清除令牌映射
        this.tokenUserMap.delete(token);
        return null;
      }
    }

    return null;
  }

  /**
   * 为用户生成认证令牌并存储映射关系
   * @param userId 用户ID
   * @returns 生成的令牌
   */
  private generateTokenForUser(userId: string): string {
    // 生成一个简单的令牌 (在实际应用中应使用更安全的方法)
    const token = `${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // 存储令牌与用户ID的映射
    this.tokenUserMap.set(token, userId);

    return token;
  }

  // 修改login方法，使用generateTokenForUser生成令牌
  public login(
    username: string,
    password: string
  ): { success: boolean; token?: string; user?: User; error?: string } {
    // 查找匹配的用户
    const user = this.db.users.find(
      u => (u.username === username || u.email === username) && u.password === password
    );

    if (!user) {
      return { success: false, error: '用户名或密码错误' };
    }

    // 检查用户状态
    if (user.status === 'disabled') {
      return { success: false, error: '账户已禁用' };
    }

    // 生成令牌
    const token = this.generateTokenForUser(user.id);

    // 更新最后登录时间
    const userIndex = this.db.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      this.db.users[userIndex].lastLogin = new Date().toISOString();
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      token,
      user: userWithoutPassword as User,
    };
  }

  // 用户注册
  public register(userData: {
    username: string;
    email: string;
    password: string;
    nickname?: string;
  }): { success: boolean; message?: string; error?: string } {
    // 检查用户名或邮箱是否已存在
    const userExists = this.db.users.some(
      u => u.username === userData.username || u.email === userData.email
    );

    if (userExists) {
      return { success: false, error: '用户名或邮箱已被注册' };
    }

    // 创建新用户
    const newUser: User = {
      id: generateId('u-'),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      nickname: userData.nickname || userData.username,
      avatar: `https://i.pravatar.cc/150?u=${userData.username}`,
      bio: '',
      role: 'user',
      status: 'active',
      verified: false,
      subscribers: 0,
      subscribing: 0,
      totalViews: 0,
      videoCount: 0,
      joinedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      social: {
        location: faker.location.city() + ', ' + faker.location.country(),
      },
    };

    this.db.users.push(newUser);

    return { success: true, message: '注册成功' };
  }

  // 获取仪表盘统计数据
  public getDashboardStats(): {
    totalUsers: number;
    newUsersToday: number;
    totalVideos: number;
    newVideosToday: number;
    totalViews: number;
    viewsToday: number;
    pendingVideos: number;
    pendingReports: number;
    totalRevenue: number;
    revenueToday: number;
    userGrowthRate: number;
    contentGrowthRate: number;
    viewsGrowthRate: number;
    revenueGrowthRate: number;
  } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // 总用户数和今日新增用户数
    const totalUsers = this.db.users.length;
    const newUsersToday = this.db.users.filter(user => isToday(user.joinedAt)).length;

    // 总视频数和今日新增视频数
    const totalVideos = this.db.videos.length;
    const newVideosToday = this.db.videos.filter(video => isToday(video.createdAt)).length;

    // 总观看数和今日观看数（模拟数据）
    const totalViews = this.db.videos.reduce((sum, video) => sum + video.views, 0);
    const viewsToday = Math.floor(totalViews * 0.01); // 假设今日浏览量是总量的1%

    // 等待审核的视频和举报数
    const pendingVideos = this.db.videos.filter(video => video.status === 'pending').length;
    const pendingReports = this.db.reports.filter(report => report.status === 'pending').length;

    // 总收入和今日收入
    const totalRevenue = this.db.revenues.reduce((sum, revenue) => sum + revenue.amount, 0);
    const revenueToday = this.db.revenues
      .filter(revenue => isToday(revenue.createdAt))
      .reduce((sum, revenue) => sum + revenue.amount, 0);

    return {
      totalUsers,
      newUsersToday,
      totalVideos,
      newVideosToday,
      totalViews,
      viewsToday,
      pendingVideos,
      pendingReports,
      totalRevenue,
      revenueToday,
      userGrowthRate: faker.number.float({ min: 1, max: 10, fractionDigits: 2 }),
      contentGrowthRate: faker.number.float({ min: 2, max: 15, fractionDigits: 2 }),
      viewsGrowthRate: faker.number.float({ min: 0.5, max: 20, fractionDigits: 2 }),
      revenueGrowthRate: faker.number.float({ min: 1, max: 15, fractionDigits: 2 }),
    };
  }

  // 获取最近活动
  public getRecentActivities(limit: number = 10): Activity[] {
    return this.db.activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
      .map(activity => {
        // 如果有targetId，获取目标对象的其他信息
        if (activity.targetId) {
          // 可以在此处添加额外的目标信息
        }
        return activity;
      });
  }

  // 获取视频列表（分页、过滤、排序）
  public getVideos(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    authorId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): { items: Video[]; total: number; page: number; limit: number; totalPages: number } {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      category,
      authorId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    // 筛选视频
    let filteredVideos = [...this.db.videos];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredVideos = filteredVideos.filter(
        video =>
          video.title.toLowerCase().includes(searchLower) ||
          video.description.toLowerCase().includes(searchLower)
      );
    }

    if (status) {
      filteredVideos = filteredVideos.filter(video => video.status === status);
    }

    if (category) {
      filteredVideos = filteredVideos.filter(video => video.category === category);
    }

    if (authorId) {
      filteredVideos = filteredVideos.filter(video => video.authorId === authorId);
    }

    // 排序
    filteredVideos.sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

    // 为每个视频添加作者信息
    const videosWithAuthor = paginatedVideos.map(video => {
      const author = this.db.users.find(user => user.id === video.authorId);
      return {
        ...video,
        author: author
          ? {
              id: author.id,
              username: author.username,
              nickname: author.nickname,
              avatar: author.avatar,
              verified: author.verified,
            }
          : undefined,
      } as any; // 使用类型断言处理额外属性
    });

    return {
      items: videosWithAuthor,
      total: filteredVideos.length,
      page,
      limit,
      totalPages: Math.ceil(filteredVideos.length / limit),
    };
  }

  // 获取单个视频
  public getVideoById(id: string): (Video & { author?: any }) | null {
    const video = this.db.videos.find(v => v.id === id);

    if (!video) return null;

    // 添加作者信息
    const author = this.db.users.find(user => user.id === video.authorId);

    return {
      ...video,
      author: author
        ? {
            id: author.id,
            username: author.username,
            nickname: author.nickname,
            avatar: author.avatar,
            verified: author.verified,
          }
        : undefined,
    };
  }

  /**
   * 获取所有用户列表
   * @returns 所有用户的数组
   */
  public getAllUsers(): User[] {
    return [...this.db.users];
  }

  /**
   * 获取用户列表，支持分页和过滤
   * @param params 过滤和分页选项
   * @returns 分页后的用户列表和元数据
   */
  public getUsers(
    params: {
      page?: number;
      limit?: number;
      role?: string;
      status?: string;
      search?: string;
    } = {}
  ): {
    items: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const { page = 1, limit = 10, role, status, search = '' } = params;

    // 筛选用户
    let filteredUsers = [...this.db.users];

    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        user =>
          user.username.toLowerCase().includes(searchLower) ||
          user.nickname?.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    // 排序：按注册时间倒序
    filteredUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      items: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredUsers.length / limit),
    };
  }

  /**
   * 根据ID获取用户
   * @param id 用户ID
   * @returns 用户对象或null
   */
  getUserById(id: string) {
    const user = this.db.users.find(user => user.id === id);
    if (!user) return undefined;

    // 计算用户的视频数量和订阅者数量
    const videoCount = this.db.videos.filter(v => v.authorId === user.id).length;
    const subscribers = this.db.users.filter(
      u => u.following && u.following.includes(user.id)
    ).length;

    return {
      ...user,
      videoCount,
      subscribers: subscribers || 0,
    };
  }

  // 获取评论列表，支持过滤和分页
  public getComments(params?: {
    page?: number;
    limit?: number;
    videoId?: string;
    userId?: string;
    status?: string;
    search?: string;
  }): {
    items: Comment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const { page = 1, limit = 10, videoId, userId, status, search = '' } = params || {};

    // 筛选评论
    let filteredComments = [...this.db.comments];

    if (videoId) {
      filteredComments = filteredComments.filter(comment => comment.videoId === videoId);
    }

    if (userId) {
      filteredComments = filteredComments.filter(comment => comment.userId === userId);
    }

    if (status) {
      filteredComments = filteredComments.filter(comment => comment.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredComments = filteredComments.filter(comment =>
        comment.content.toLowerCase().includes(searchLower)
      );
    }

    // 排序：按创建时间倒序
    filteredComments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = filteredComments.slice(startIndex, endIndex);

    return {
      items: paginatedComments,
      total: filteredComments.length,
      page,
      limit,
      totalPages: Math.ceil(filteredComments.length / limit),
    };
  }

  // 获取评论详情
  public getCommentById(id: string): Comment | null {
    const comment = this.db.comments.find(c => c.id === id);
    return comment || null;
  }

  // 获取举报列表，支持过滤和分页
  public getReports(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    severity?: string;
  }): {
    items: Report[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const { page = 1, limit = 10, type, status, severity } = params || {};

    // 筛选举报
    let filteredReports = [...this.db.reports];

    if (type) {
      filteredReports = filteredReports.filter(report => report.type === type);
    }

    if (status) {
      filteredReports = filteredReports.filter(report => report.status === status);
    }

    if (severity) {
      // 假设severity已经转换为合适的值
      const reportWithSeverity = filteredReports.map(report => {
        const highSeverityReasons = ['版权问题', '不适当的言论'];
        const mediumSeverityReasons = ['内容错误', '抄袭内容', '误导性描述'];

        let reportSeverity = '低';
        if (highSeverityReasons.includes(report.reason)) {
          reportSeverity = '高';
        } else if (mediumSeverityReasons.includes(report.reason)) {
          reportSeverity = '中';
        }

        return { ...report, severity: reportSeverity };
      });

      filteredReports = reportWithSeverity.filter(report => report.severity === severity);
    }

    // 排序：按创建时间倒序
    filteredReports.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    return {
      items: paginatedReports,
      total: filteredReports.length,
      page,
      limit,
      totalPages: Math.ceil(filteredReports.length / limit),
    };
  }

  // 获取举报详情
  public getReportById(id: string): Report | null {
    const report = this.db.reports.find(r => r.id === id);
    return report || null;
  }

  // 获取热门视频 - 按照观看量排序，可指定类别
  public getTrendingVideos(limit: number = 10, category?: string): Video[] {
    let videos = [...this.db.videos].filter(v => v.status === 'published');

    // 如果指定了类别，筛选该类别的视频
    if (category && category !== 'all') {
      videos = videos.filter(v => v.category === category);
    }

    // 按观看量排序
    videos.sort((a, b) => b.views - a.views);

    // 返回指定数量的视频
    return videos.slice(0, limit).map(video => {
      // 添加作者信息
      const author = this.db.users.find(u => u.id === video.authorId);
      if (!author) return video;

      return {
        ...video,
        author: {
          id: author.id,
          username: author.username,
          avatar: author.avatar,
        },
      };
    });
  }

  // 获取推荐视频 - 基于用户喜好或随机推荐
  public getRecommendedVideos(userId?: string, limit: number = 10): Video[] {
    // 获取所有已发布的视频
    let videos = [...this.db.videos].filter(v => v.status === 'published');

    if (userId) {
      // 如果提供了用户ID，获取用户喜好的类别
      const user = this.db.users.find(u => u.id === userId);
      if (user && user.preferences && user.preferences.categories) {
        // 获取用户喜欢的视频类别
        const preferredCategories = user.preferences.categories;

        // 先按用户偏好筛选视频
        const preferredVideos = videos.filter(v => preferredCategories.includes(v.category));

        // 如果有足够的偏好视频，优先返回这些
        if (preferredVideos.length >= limit) {
          // 随机打乱顺序
          return this.shuffle(preferredVideos)
            .slice(0, limit)
            .map(this.attachAuthorInfo.bind(this));
        }

        // 如果偏好视频不够，先保留这些，然后添加其他视频
        const otherVideos = videos.filter(v => !preferredCategories.includes(v.category));

        // 合并两部分视频并打乱顺序
        return this.shuffle([...preferredVideos, ...otherVideos])
          .slice(0, limit)
          .map(this.attachAuthorInfo.bind(this));
      }
    }

    // 如果没有用户ID或用户没有偏好，随机推荐
    return this.shuffle(videos).slice(0, limit).map(this.attachAuthorInfo.bind(this));
  }

  // 获取相关视频 - 基于视频类别和标签
  public getRelatedVideos(videoId: string, limit: number = 5): Video[] {
    const video = this.db.videos.find(v => v.id === videoId);
    if (!video) return [];

    // 筛选同一类别且已发布的视频
    let relatedVideos = this.db.videos.filter(
      v => v.id !== videoId && v.status === 'published' && v.category === video.category
    );

    // 如果同类别视频不够，添加其他已发布视频
    if (relatedVideos.length < limit) {
      const otherVideos = this.db.videos.filter(
        v => v.id !== videoId && v.status === 'published' && v.category !== video.category
      );

      relatedVideos = [...relatedVideos, ...otherVideos];
    }

    // 随机打乱并返回指定数量
    return this.shuffle(relatedVideos).slice(0, limit).map(this.attachAuthorInfo.bind(this));
  }

  // 记录视频观看
  public addVideoView(videoId: string): void {
    const video = this.db.videos.find(v => v.id === videoId);
    if (video) {
      video.views += 1;

      // 更新作者的总观看量统计
      const author = this.db.users.find(u => u.id === video.authorId);
      if (author && author.stats) {
        author.stats.totalViews = (author.stats.totalViews || 0) + 1;
      }

      // 记录观看活动
      /*
      this.addActivity({
        id: generateId(),
        type: 'view',
        userId: null, // 匿名观看
        videoId: videoId,
        timestamp: new Date().toISOString(),
      });
      */

      // 添加观看记录到活动日志
      const activity: Activity = {
        id: generateId('a-'),
        userId: 'system',
        action: '观看了视频',
        target: video.title,
        targetId: videoId,
        timestamp: new Date().toISOString(),
      };

      this.db.activities.push(activity);
    }
  }

  // 添加作者信息到视频
  private attachAuthorInfo(video: Video): Video {
    const author = this.db.users.find(u => u.id === video.authorId);
    if (!author) return video;

    return {
      ...video,
      author: {
        id: author.id,
        username: author.username,
        avatar: author.avatar,
      },
    };
  }

  // 辅助方法：随机打乱数组
  private shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * 获取创作者统计数据
   * @param userId 创作者用户ID
   * @returns 创作者统计数据
   */
  public getCreatorStats(userId: string): {
    totalVideos: number;
    totalViews: number;
    totalSubscribers: number;
    totalLikes: number;
    totalComments: number;
    newSubscribers: number;
    revenueGenerated?: number;
    lastUpdated: string;
  } {
    // 检查用户是否存在
    const user = this.db.users.find(u => u.id === userId);
    if (!user) {
      return {
        totalVideos: 0,
        totalViews: 0,
        totalSubscribers: 0,
        totalLikes: 0,
        totalComments: 0,
        newSubscribers: 0,
        revenueGenerated: 0,
        lastUpdated: new Date().toISOString(),
      };
    }

    // 获取该用户的所有视频
    const videos = this.db.videos.filter(video => video.authorId === userId);

    // 计算总观看量和点赞数
    const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
    const totalLikes = videos.reduce((sum, video) => sum + (video.likes || 0), 0);

    // 计算总评论数
    const totalComments = this.db.comments.filter(comment =>
      videos.some(video => video.id === comment.videoId)
    ).length;

    // 计算总订阅者
    const totalSubscribers = this.db.users.filter(
      u => u.following && u.following.includes(userId)
    ).length;

    // 计算新增订阅者（最近7天）
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newSubscribers = Math.floor(Math.random() * 100); // 简化实现，实际应该计算最近增加的订阅者

    // 获取收入数据
    const revenueData = this.db.revenues.filter(rev => rev.userId === userId);
    const revenueGenerated = revenueData.reduce((sum, rev) => sum + rev.amount, 0);

    return {
      totalVideos: videos.length,
      totalViews,
      totalSubscribers,
      totalLikes,
      totalComments,
      newSubscribers,
      revenueGenerated,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * 获取创作者视频列表
   * @param userId 创作者用户ID
   * @param options 过滤和分页选项
   * @returns 分页后的视频列表和元数据
   */
  public getCreatorVideos(
    userId: string,
    options: {
      page: number;
      limit: number;
      status?: string;
      search?: string;
      sortBy: string;
      sortOrder: 'asc' | 'desc';
    }
  ): { data: any[]; total: number } {
    const { page, limit, status, search, sortBy, sortOrder } = options;

    // 获取该用户的所有视频
    let videos = this.db.videos.filter(video => video.authorId === userId);

    // 应用过滤条件
    if (status) {
      videos = videos.filter(video => video.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      videos = videos.filter(
        video =>
          video.title.toLowerCase().includes(searchLower) ||
          (video.description && video.description.toLowerCase().includes(searchLower))
      );
    }

    // 排序
    videos.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // 特殊处理日期类型
      if (sortBy.includes('Date') || sortBy.includes('At')) {
        valueA = new Date(valueA || 0).getTime();
        valueB = new Date(valueB || 0).getTime();
      }

      // 比较
      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = videos.slice(startIndex, endIndex);

    // 转换为创作者视频格式
    const creatorVideos = paginatedVideos.map(video => ({
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnail || video.coverUrl,
      status: video.status,
      privacy: video.privacy || 'public',
      uploadDate: video.createdAt,
      publishedAt: video.publishedAt,
      views: video.views || 0,
      likes: video.likes || 0,
      comments: video.comments || 0,
      duration: video.duration || '0:00',
      description: video.description,
    }));

    return {
      data: creatorVideos,
      total: videos.length,
    };
  }

  /**
   * 获取创作者单个视频详情
   * @param userId 创作者用户ID
   * @param videoId 视频ID
   * @returns 视频详情或null
   */
  public getCreatorVideoById(userId: string, videoId: string): any | null {
    // 查找视频
    const video = this.db.videos.find(v => v.id === videoId && v.authorId === userId);

    if (!video) {
      return null;
    }

    // 转换为创作者视频格式
    return {
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnail || video.coverUrl,
      status: video.status,
      privacy: video.privacy || 'public',
      uploadDate: video.createdAt,
      publishedAt: video.publishedAt,
      views: video.views || 0,
      likes: video.likes || 0,
      comments: video.comments || 0,
      duration: video.duration || '0:00',
      description: video.description,
      category: video.category,
      tags: video.tags || [],
    };
  }

  /**
   * 更新创作者视频
   * @param userId 创作者用户ID
   * @param videoId 视频ID
   * @param updateData 更新数据
   * @returns 结果对象
   */
  public updateCreatorVideo(
    userId: string,
    videoId: string,
    updateData: any
  ): { success: boolean; video?: any; error?: string } {
    // 查找视频
    const videoIndex = this.db.videos.findIndex(v => v.id === videoId && v.authorId === userId);

    if (videoIndex === -1) {
      return { success: false, error: '视频不存在或您没有权限修改' };
    }

    // 更新视频
    const video = this.db.videos[videoIndex];

    // 允许更新的字段
    const allowedFields = [
      'title',
      'description',
      'thumbnail',
      'coverUrl',
      'status',
      'privacy',
      'category',
      'tags',
    ];

    // 应用更新
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        video[field] = updateData[field];
      }
    });

    // 更新时间戳
    video.updatedAt = new Date().toISOString();

    // 如果状态从草稿变为已发布，设置发布时间
    if (updateData.status === 'published' && video.status !== 'published') {
      video.publishedAt = new Date().toISOString();
    }

    // 保存更新
    this.db.videos[videoIndex] = video;

    // 记录活动
    this.db.activities.push({
      id: generateId('a-'),
      userId,
      action: '更新视频',
      target: video.title,
      targetId: videoId,
      details: `更新了视频 "${video.title}"`,
      timestamp: new Date().toISOString(),
      type: 'video',
    });

    // 返回更新后的视频
    return {
      success: true,
      video: this.getCreatorVideoById(userId, videoId),
    };
  }

  /**
   * 删除创作者视频
   * @param userId 创作者用户ID
   * @param videoId 视频ID
   * @returns 结果对象
   */
  public deleteCreatorVideo(userId: string, videoId: string): { success: boolean; error?: string } {
    // 查找视频
    const videoIndex = this.db.videos.findIndex(v => v.id === videoId && v.authorId === userId);

    if (videoIndex === -1) {
      return { success: false, error: '视频不存在或您没有权限删除' };
    }

    // 获取视频信息用于活动记录
    const video = this.db.videos[videoIndex];

    // 删除视频
    this.db.videos.splice(videoIndex, 1);

    // 删除相关评论
    this.db.comments = this.db.comments.filter(comment => comment.videoId !== videoId);

    // 记录活动
    this.db.activities.push({
      id: generateId('a-'),
      userId,
      action: '删除视频',
      target: video.title,
      targetId: videoId,
      details: `删除了视频 "${video.title}"`,
      timestamp: new Date().toISOString(),
      type: 'video',
    });

    // 更新创作者视频计数
    this.updateCreatorVideoCount();

    return { success: true };
  }

  /**
   * 获取视频分析数据
   * @param userId 创作者用户ID
   * @param videoId 视频ID
   * @returns 视频分析数据或null
   */
  public getVideoAnalytics(userId: string, videoId: string): any | null {
    // 查找视频
    const video = this.db.videos.find(v => v.id === videoId && v.authorId === userId);

    if (!video) {
      return null;
    }

    // 生成模拟的分析数据
    const viewsLast7Days = Array.from({ length: 7 }, () =>
      Math.floor((Math.random() * (video.views || 100)) / 10)
    );

    const viewsLast30Days = Array.from({ length: 30 }, () =>
      Math.floor((Math.random() * (video.views || 100)) / 30)
    );

    // 观众区域分布
    const audienceRegions = [
      { region: '中国', percentage: 45 },
      { region: '美国', percentage: 20 },
      { region: '印度', percentage: 10 },
      { region: '英国', percentage: 8 },
      { region: '德国', percentage: 7 },
      { region: '其他', percentage: 10 },
    ];

    // 设备分布
    const audienceDevices = [
      { device: '手机', percentage: 65 },
      { device: '电脑', percentage: 25 },
      { device: '平板', percentage: 8 },
      { device: '其他', percentage: 2 },
    ];

    return {
      id: video.id,
      title: video.title,
      views: video.views || 0,
      watchTime: Math.floor(
        (video.views || 0) * (video.duration ? parseInt(String(video.duration)) : 120) * 0.6
      ),
      likes: video.likes || 0,
      comments: video.comments || 0,
      retention: Math.floor(Math.random() * 30 + 60), // 60-90%的保留率
      viewsLast7Days,
      viewsLast30Days,
      audienceRegions,
      audienceDevices,
      publishedAt: video.publishedAt || video.createdAt,
    };
  }

  /**
   * 获取创作者视频评论
   * @param userId 创作者用户ID
   * @param videoId 视频ID
   * @param options 分页选项
   * @returns 分页后的评论列表和元数据
   */
  public getCreatorVideoComments(
    userId: string,
    videoId: string,
    options: { page: number; limit: number }
  ): { data: any[]; total: number } {
    const { page, limit } = options;

    // 查找视频
    const video = this.db.videos.find(v => v.id === videoId && v.authorId === userId);

    if (!video) {
      return { data: [], total: 0 };
    }

    // 获取该视频的所有评论
    const comments = this.db.comments.filter(comment => comment.videoId === videoId);

    // 按时间倒序排序
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = comments.slice(startIndex, endIndex);

    // 转换为创作者评论格式
    const creatorComments = paginatedComments.map(comment => {
      // 获取评论用户
      const user = this.db.users.find(u => u.id === comment.userId);

      // 计算回复数
      const replies = this.db.comments.filter(c => c.parentId === comment.id).length;

      return {
        id: comment.id,
        content: comment.content,
        videoId: comment.videoId,
        videoTitle: video.title,
        user: {
          id: user?.id || 'unknown',
          nickname: user?.nickname || '未知用户',
          avatar: user?.avatar || '',
        },
        createdAt: comment.createdAt,
        status: comment.status || 'active',
        likes: comment.likes || 0,
        replies,
        parentId: comment.parentId,
      };
    });

    return {
      data: creatorComments,
      total: comments.length,
    };
  }

  /**
   * 获取创作者频道设置
   * @param userId 创作者用户ID
   * @returns 频道设置
   */
  public getCreatorChannel(userId: string): any {
    // 查找用户
    const user = this.db.users.find(u => u.id === userId);

    if (!user) {
      return null;
    }

    // 提取频道相关信息
    return {
      name: user.nickname || user.username,
      description: user.bio || '',
      bannerUrl: user.bannerUrl || '',
      avatarUrl: user.avatar,
      links: user.social
        ? Object.entries(user.social).map(([type, url]) => ({
            type,
            url: url || '',
            title: type.charAt(0).toUpperCase() + type.slice(1),
          }))
        : [],
      themeColor: user.themeColor || '#1890ff',
    };
  }

  /**
   * 更新创作者频道设置
   * @param userId 创作者用户ID
   * @param updateData 更新数据
   * @returns 更新后的频道设置
   */
  public updateCreatorChannel(userId: string, updateData: any): any {
    // 查找用户
    const userIndex = this.db.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return null;
    }

    const user = this.db.users[userIndex];

    // 更新频道信息
    if (updateData.name) {
      user.nickname = updateData.name;
    }

    if (updateData.description) {
      user.bio = updateData.description;
    }

    if (updateData.bannerUrl) {
      user.bannerUrl = updateData.bannerUrl;
    }

    if (updateData.avatarUrl) {
      user.avatar = updateData.avatarUrl;
    }

    if (updateData.themeColor) {
      user.themeColor = updateData.themeColor;
    }

    // 更新社交链接
    if (updateData.links && Array.isArray(updateData.links)) {
      const social: Record<string, string> = {};

      updateData.links.forEach((link: { type: string; url: string }) => {
        if (link.type && link.url) {
          social[link.type] = link.url;
        }
      });

      user.social = social;
    }

    // 保存更新
    this.db.users[userIndex] = user;

    // 记录活动
    this.db.activities.push({
      id: generateId('a-'),
      userId,
      action: '更新频道设置',
      target: '频道设置',
      targetId: userId,
      details: '更新了频道设置',
      timestamp: new Date().toISOString(),
      type: 'user',
    });

    // 返回更新后的频道设置
    return this.getCreatorChannel(userId);
  }

  /**
   * 获取创作者收入数据
   * @param userId 创作者用户ID
   * @param period 时间周期
   * @returns 收入数据
   */
  public getCreatorRevenue(
    userId: string,
    period: 'day' | 'week' | 'month' | 'year'
  ): { data: number[]; labels: string[]; total: number } {
    // 查找用户
    const user = this.db.users.find(u => u.id === userId);

    if (!user) {
      return { data: [], labels: [], total: 0 };
    }

    // 获取该用户的所有收入记录
    const revenues = this.db.revenues.filter(rev => rev.userId === userId);

    // 根据选择的时间周期生成数据
    let data: number[] = [];
    let labels: string[] = [];
    let total = 0;

    const now = new Date();

    if (period === 'day') {
      // 最近24小时的数据，每小时一个点
      data = Array.from({ length: 24 }, (_, i) => {
        const hour = (now.getHours() - i + 24) % 24;
        const amount = Math.floor(Math.random() * 50); // 简化实现
        total += amount;
        return amount;
      }).reverse();

      labels = Array.from({ length: 24 }, (_, i) => {
        const hour = (now.getHours() - i + 24) % 24;
        return `${hour}:00`;
      }).reverse();
    } else if (period === 'week') {
      // 最近7天的数据，每天一个点
      data = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        const amount = Math.floor(Math.random() * 300); // 简化实现
        total += amount;
        return amount;
      }).reverse();

      labels = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        return `${day.getMonth() + 1}/${day.getDate()}`;
      }).reverse();
    } else if (period === 'month') {
      // 最近30天的数据，每天一个点
      data = Array.from({ length: 30 }, (_, i) => {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        const amount = Math.floor(Math.random() * 300); // 简化实现
        total += amount;
        return amount;
      }).reverse();

      labels = Array.from({ length: 30 }, (_, i) => {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        return `${day.getMonth() + 1}/${day.getDate()}`;
      }).reverse();
    } else if (period === 'year') {
      // 最近12个月的数据，每月一个点
      data = Array.from({ length: 12 }, (_, i) => {
        const month = (now.getMonth() - i + 12) % 12;
        const amount = Math.floor(Math.random() * 9000); // 简化实现
        total += amount;
        return amount;
      }).reverse();

      const monthNames = [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
      ];

      labels = Array.from({ length: 12 }, (_, i) => {
        const month = (now.getMonth() - i + 12) % 12;
        return monthNames[month];
      }).reverse();
    }

    return { data, labels, total };
  }

  /**
   * 添加评论到视频
   * @param userId 用户ID
   * @param videoId 视频ID
   * @param content 评论内容
   * @param parentId 父评论ID（回复）
   * @returns 添加的评论
   */
  public addComment(userId: string, videoId: string, content: string, parentId?: string): Comment {
    // 检查视频是否存在
    const video = this.db.videos.find(v => v.id === videoId);
    if (!video) {
      throw new Error('视频不存在');
    }

    // 创建新评论
    const newComment: Comment = {
      id: generateId('c-'),
      videoId,
      userId,
      content,
      likes: 0,
      status: 'normal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId,
    };

    // 添加到数据库
    this.db.comments.push(newComment);

    // 更新视频评论计数
    video.comments++;

    // 记录活动
    this.db.activities.push({
      id: generateId('a-'),
      userId,
      action: '发表了评论',
      target: `视频 "${video.title}"`,
      targetId: videoId,
      timestamp: new Date().toISOString(),
      type: 'comment',
    });

    // 返回添加的评论
    return newComment;
  }

  /**
   * 获取视频评论列表
   * @param videoId 视频ID
   * @param options 分页和排序选项
   * @returns 评论列表和元数据
   */
  public getVideoComments(
    videoId: string,
    options: {
      page: number;
      limit: number;
      sort: 'newest' | 'oldest' | 'popular';
    }
  ): { data: any[]; total: number } {
    const { page, limit, sort } = options;

    // 获取当前视频的所有顶级评论
    let comments = this.db.comments.filter(
      comment => comment.videoId === videoId && !comment.parentId
    );

    // 排序
    switch (sort) {
      case 'newest':
        comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
        comments.sort((a, b) => b.likes - a.likes);
        break;
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = comments.slice(startIndex, endIndex);

    // 格式化评论，添加用户信息和回复
    const formattedComments = paginatedComments.map(comment => {
      // 获取用户信息
      const user = this.db.users.find(u => u.id === comment.userId);

      // 获取回复
      const replies = this.db.comments
        .filter(c => c.parentId === comment.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map(reply => {
          const replyUser = this.db.users.find(u => u.id === reply.userId);
          return {
            id: reply.id,
            content: reply.content,
            user: {
              id: replyUser?.id,
              nickname: replyUser?.nickname || '未知用户',
              avatar: replyUser?.avatar || '',
            },
            createdAt: reply.createdAt,
            likes: reply.likes,
          };
        });

      return {
        id: comment.id,
        content: comment.content,
        user: {
          id: user?.id,
          nickname: user?.nickname || '未知用户',
          avatar: user?.avatar || '',
        },
        createdAt: comment.createdAt,
        likes: comment.likes,
        replies,
        replyCount: replies.length,
      };
    });

    return {
      data: formattedComments,
      total: comments.length,
    };
  }

  /**
   * 获取视频互动状态
   * @param userId 用户ID
   * @param videoId 视频ID
   * @returns 互动状态
   */
  public getVideoInteraction(
    userId: string,
    videoId: string
  ): { isLiked: boolean; isFavorited: boolean; isSubscribed: boolean } {
    // 查找视频
    const video = this.db.videos.find(v => v.id === videoId);
    if (!video) {
      return {
        isLiked: false,
        isFavorited: false,
        isSubscribed: false,
      };
    }

    // 查找用户
    const user = this.db.users.find(u => u.id === userId);
    if (!user) {
      return {
        isLiked: false,
        isFavorited: false,
        isSubscribed: false,
      };
    }

    // 获取点赞状态
    const isLiked = user.likedVideos ? user.likedVideos.includes(videoId) : false;

    // 获取收藏状态
    const isFavorited = user.favorites ? user.favorites.includes(videoId) : false;

    // 获取订阅状态
    const isSubscribed = user.following ? user.following.includes(video.authorId) : false;

    return {
      isLiked,
      isFavorited,
      isSubscribed,
    };
  }

  /**
   * 切换视频点赞状态
   * @param userId 用户ID
   * @param videoId 视频ID
   * @returns 最终的点赞状态
   */
  public toggleVideoLike(userId: string, videoId: string): boolean {
    // 查找视频
    const videoIndex = this.db.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) {
      throw new Error('视频不存在');
    }

    // 查找用户
    const userIndex = this.db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('用户不存在');
    }

    const video = this.db.videos[videoIndex];
    const user = this.db.users[userIndex];

    // 初始化用户的likedVideos数组
    if (!user.likedVideos) {
      user.likedVideos = [];
    }

    // 检查用户是否已点赞
    const likedIndex = user.likedVideos.indexOf(videoId);
    let newStatus: boolean;

    if (likedIndex === -1) {
      // 用户未点赞，添加点赞
      user.likedVideos.push(videoId);
      video.likes++;
      newStatus = true;

      // 记录活动
      this.db.activities.push({
        id: generateId('a-'),
        userId,
        action: '点赞了视频',
        target: video.title,
        targetId: videoId,
        timestamp: new Date().toISOString(),
        type: 'video',
      });
    } else {
      // 用户已点赞，取消点赞
      user.likedVideos.splice(likedIndex, 1);
      video.likes = Math.max(0, video.likes - 1);
      newStatus = false;
    }

    // 更新用户和视频
    this.db.users[userIndex] = user;
    this.db.videos[videoIndex] = video;

    return newStatus;
  }

  /**
   * 切换视频收藏状态
   * @param userId 用户ID
   * @param videoId 视频ID
   * @returns 最终的收藏状态
   */
  public toggleVideoFavorite(userId: string, videoId: string): boolean {
    // 查找视频
    const videoIndex = this.db.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) {
      throw new Error('视频不存在');
    }

    // 查找用户
    const userIndex = this.db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('用户不存在');
    }

    const video = this.db.videos[videoIndex];
    const user = this.db.users[userIndex];

    // 初始化用户的收藏数组
    if (!user.favorites) {
      user.favorites = [];
    }

    // 初始化视频的收藏计数
    if (video.favorites === undefined) {
      video.favorites = 0;
    }

    // 检查用户是否已收藏
    const favoriteIndex = user.favorites.indexOf(videoId);
    let newStatus: boolean;

    if (favoriteIndex === -1) {
      // 用户未收藏，添加收藏
      user.favorites.push(videoId);
      video.favorites++;
      newStatus = true;

      // 记录活动
      this.db.activities.push({
        id: generateId('a-'),
        userId,
        action: '收藏了视频',
        target: video.title,
        targetId: videoId,
        timestamp: new Date().toISOString(),
        type: 'video',
      });
    } else {
      // 用户已收藏，取消收藏
      user.favorites.splice(favoriteIndex, 1);
      video.favorites = Math.max(0, video.favorites - 1);
      newStatus = false;
    }

    // 更新用户和视频
    this.db.users[userIndex] = user;
    this.db.videos[videoIndex] = video;

    return newStatus;
  }

  /**
   * 保存视频观看进度
   * @param userId 用户ID
   * @param videoId 视频ID
   * @param currentTime 当前时间（秒）
   * @param duration 总时长（秒）
   */
  public saveVideoProgress(
    userId: string,
    videoId: string,
    currentTime: number,
    duration: number
  ): void {
    // 查找用户
    const userIndex = this.db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return;
    }

    const user = this.db.users[userIndex];

    // 初始化用户的观看历史
    if (!user.watchHistory) {
      user.watchHistory = [];
    }

    // 查找是否已有该视频的观看记录
    const existingIndex = user.watchHistory.findIndex(item => item.videoId === videoId);

    // 计算观看进度百分比
    const progress = Math.min(100, Math.round((currentTime / duration) * 100));

    if (existingIndex === -1) {
      // 新增观看记录
      user.watchHistory.push({
        videoId,
        timestamp: new Date().toISOString(),
        progress,
        currentTime,
        duration,
      });
    } else {
      // 更新现有记录
      user.watchHistory[existingIndex] = {
        ...user.watchHistory[existingIndex],
        timestamp: new Date().toISOString(),
        progress,
        currentTime,
        duration,
      };
    }

    // 限制历史记录数量
    if (user.watchHistory.length > 100) {
      user.watchHistory = user.watchHistory
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 100);
    }

    // 更新用户
    this.db.users[userIndex] = user;
  }

  /**
   * 获取视频观看进度
   * @param userId 用户ID
   * @param videoId 视频ID
   * @returns 观看进度信息
   */
  public getVideoProgress(
    userId: string,
    videoId: string
  ): { currentTime: number; progress: number } | null {
    // 查找用户
    const user = this.db.users.find(u => u.id === userId);
    if (!user || !user.watchHistory) {
      return null;
    }

    // 查找视频的观看记录
    const record = user.watchHistory.find(item => item.videoId === videoId);
    if (!record) {
      return null;
    }

    return {
      currentTime: record.currentTime,
      progress: record.progress,
    };
  }

  /**
   * 获取用户观看历史
   * @param userId 用户ID
   * @param params 分页参数
   * @returns 分页后的观看历史列表
   */
  public getUserHistory(
    userId: string,
    params: { page?: number; limit?: number }
  ): { data: any[]; total: number } {
    const { page = 1, limit = 10 } = params;
    const user = this.db.users.find(u => u.id === userId);

    if (!user || !user.watchHistory || user.watchHistory.length === 0) {
      return { data: [], total: 0 };
    }

    // 获取观看历史
    const history = [...user.watchHistory]; // 复制一份，避免改变原始数据

    // 按时间倒序排序（最近观看的在前面）
    history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // 为每个记录添加视频详情
    const historyWithDetails = history
      .map(item => {
        const video = this.db.videos.find(v => v.id === item.videoId);

        // 如果视频不存在或已被删除，跳过
        if (!video) {
          return null;
        }

        // 获取视频作者信息
        const author = this.db.users.find(u => u.id === video.authorId);

        return {
          ...item,
          video: {
            id: video.id,
            title: video.title,
            thumbnail: video.thumbnail,
            duration: video.duration,
            views: video.views,
            author: author
              ? {
                  id: author.id,
                  username: author.username,
                  nickname: author.nickname,
                  avatar: author.avatar,
                  verified: author.verified,
                }
              : null,
          },
        };
      })
      .filter(item => item !== null); // 过滤掉不存在的视频

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHistory = historyWithDetails.slice(startIndex, endIndex);

    return { data: paginatedHistory, total: historyWithDetails.length };
  }

  /**
   * 添加举报
   * @param userId 用户ID
   * @param type 举报类型
   * @param targetId 目标ID
   * @param reason 原因
   * @param description 描述
   * @returns 添加的举报
   */
  public addReport(
    userId: string,
    type: 'video' | 'comment' | 'user',
    targetId: string,
    reason: string,
    description?: string
  ): Report {
    // 创建举报
    const report: Report = {
      id: generateId('rp-'),
      type,
      targetId,
      reporterId: userId,
      reason,
      description: description || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 添加到数据库
    this.db.reports.push(report);

    // 记录活动
    let targetName = '内容';

    if (type === 'video') {
      const video = this.db.videos.find(v => v.id === targetId);
      targetName = video ? `视频 "${video.title}"` : '视频';
    } else if (type === 'comment') {
      targetName = '评论';
    } else if (type === 'user') {
      const user = this.db.users.find(u => u.id === targetId);
      targetName = user ? `用户 "${user.nickname}"` : '用户';
    }

    this.db.activities.push({
      id: generateId('a-'),
      userId,
      action: '举报',
      target: targetName,
      targetId,
      timestamp: new Date().toISOString(),
      type: 'report',
    });

    return report;
  }

  /**
   * 更新用户信息
   * @param userId 用户ID
   * @param data 部分用户数据
   * @returns 更新结果
   */
  public updateUser(
    userId: string,
    data: Partial<User>
  ): { success: boolean; user?: User; error?: string } {
    // 查找用户
    const userIndex = this.db.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return { success: false, error: '用户不存在' };
    }

    // 不允许更新敏感字段
    const safeData = { ...data };
    delete safeData.password;
    delete safeData.id;
    delete safeData.role;
    delete safeData.status;
    delete safeData.createdAt;
    delete safeData.likedVideos;
    delete safeData.favorites;
    delete safeData.watchHistory;

    // 更新用户信息
    this.db.users[userIndex] = {
      ...this.db.users[userIndex],
      ...safeData,
      updatedAt: new Date().toISOString(),
    };

    // 添加活动日志
    this.db.activities.unshift({
      id: generateId('act-'),
      userId,
      action: '更新用户信息',
      target: 'user',
      targetId: userId,
      timestamp: new Date().toISOString(),
      details: `用户 ${this.db.users[userIndex].nickname || this.db.users[userIndex].username} 更新了个人信息`,
      type: 'user',
    });

    return { success: true, user: this.db.users[userIndex] };
  }

  /**
   * 获取用户收藏列表
   * @param userId 用户ID
   * @param params 分页参数
   * @returns 分页后的收藏视频列表
   */
  public getUserFavorites(
    userId: string,
    params: { page?: number; limit?: number }
  ): { data: any[]; total: number } {
    const { page = 1, limit = 10 } = params;
    const user = this.db.users.find(u => u.id === userId);

    if (!user || !user.favorites || user.favorites.length === 0) {
      return { data: [], total: 0 };
    }

    // 获取视频列表
    const favoriteVideos = this.db.videos
      .filter(video => user.favorites!.includes(video.id))
      .filter(video => video.status === 'published') // 只返回已发布视频
      .map(video => {
        const author = this.db.users.find(u => u.id === video.authorId);
        return {
          ...video,
          author: author
            ? {
                id: author.id,
                username: author.username,
                nickname: author.nickname,
                avatar: author.avatar,
                verified: author.verified,
              }
            : undefined,
        };
      });

    // 按最新添加排序（实际上我们没有记录添加时间，所以这里按视频日期降序）
    favoriteVideos.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = favoriteVideos.slice(startIndex, endIndex);

    return { data: paginatedVideos, total: favoriteVideos.length };
  }

  /**
   * 获取用户点赞列表
   * @param userId 用户ID
   * @param params 分页参数
   * @returns 分页后的点赞视频列表
   */
  public getUserLikes(
    userId: string,
    params: { page?: number; limit?: number }
  ): { data: any[]; total: number } {
    const { page = 1, limit = 10 } = params;
    const user = this.db.users.find(u => u.id === userId);

    if (!user || !user.likedVideos || user.likedVideos.length === 0) {
      return { data: [], total: 0 };
    }

    // 获取视频列表
    const likedVideos = this.db.videos
      .filter(video => user.likedVideos!.includes(video.id))
      .filter(video => video.status === 'published') // 只返回已发布视频
      .map(video => {
        const author = this.db.users.find(u => u.id === video.authorId);
        return {
          ...video,
          author: author
            ? {
                id: author.id,
                username: author.username,
                nickname: author.nickname,
                avatar: author.avatar,
                verified: author.verified,
              }
            : undefined,
        };
      });

    // 按最新添加排序（实际上我们没有记录添加时间，所以这里按视频日期降序）
    likedVideos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = likedVideos.slice(startIndex, endIndex);

    return { data: paginatedVideos, total: likedVideos.length };
  }

  /**
   * 获取用户评论列表
   * @param userId 用户ID
   * @param params 分页参数
   * @returns 分页后的评论列表
   */
  public getUserComments(
    userId: string,
    params: { page?: number; limit?: number }
  ): { data: any[]; total: number } {
    const { page = 1, limit = 10 } = params;

    // 获取用户所有评论
    const userComments = this.db.comments
      .filter(comment => comment.userId === userId)
      .filter(comment => comment.status === 'normal') // 只返回正常状态的评论
      .map(comment => {
        const video = this.db.videos.find(v => v.id === comment.videoId);
        return {
          ...comment,
          videoTitle: video ? video.title : '未知视频',
          videoThumbnail: video ? video.thumbnail : '',
        };
      });

    // 按最新发布排序
    userComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = userComments.slice(startIndex, endIndex);

    return { data: paginatedComments, total: userComments.length };
  }

  /**
   * 获取用户订阅（关注）列表
   * @param userId 用户ID
   * @param params 分页参数
   * @returns 分页后的订阅用户列表
   */
  public getUserSubscriptions(
    userId: string,
    params: { page?: number; limit?: number }
  ): { data: any[]; total: number } {
    const { page = 1, limit = 10 } = params;
    const user = this.db.users.find(u => u.id === userId);

    if (!user || !user.following || user.following.length === 0) {
      return { data: [], total: 0 };
    }

    // 获取关注用户列表
    const followedUsers = this.db.users
      .filter(u => user.following!.includes(u.id))
      .filter(u => u.status === 'active') // 只返回活跃用户
      .map(u => ({
        id: u.id,
        username: u.username,
        nickname: u.nickname,
        avatar: u.avatar,
        bio: u.bio,
        verified: u.verified,
        videoCount: u.videoCount || 0,
        subscribers: u.subscribers,
      }));

    // 按用户名排序
    followedUsers.sort((a, b) => a.nickname.localeCompare(b.nickname));

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = followedUsers.slice(startIndex, endIndex);

    return { data: paginatedUsers, total: followedUsers.length };
  }

  /**
   * 切换用户订阅状态（关注/取消关注）
   * @param userId 当前用户ID
   * @param targetUserId 目标用户ID
   * @returns 切换后的状态（true=已关注，false=未关注）
   */
  public toggleSubscription(userId: string, targetUserId: string): boolean {
    // 不能关注自己
    if (userId === targetUserId) {
      return false;
    }

    // 查找用户
    const user = this.db.users.find(u => u.id === userId);
    const targetUser = this.db.users.find(u => u.id === targetUserId);

    if (!user || !targetUser) {
      return false;
    }

    // 初始化关注列表
    if (!user.following) {
      user.following = [];
    }

    // 检查是否已关注
    const isFollowing = user.following.includes(targetUserId);

    if (isFollowing) {
      // 取消关注
      user.following = user.following.filter(id => id !== targetUserId);
      user.subscribing -= 1;
      targetUser.subscribers -= 1;

      // 添加活动记录
      this.db.activities.unshift({
        id: generateId('act-'),
        userId,
        action: '取消关注用户',
        target: 'user',
        targetId: targetUserId,
        timestamp: new Date().toISOString(),
        details: `用户 ${user.nickname || user.username} 取消关注了 ${targetUser.nickname || targetUser.username}`,
        type: 'user',
      });

      return false;
    } else {
      // 添加关注
      user.following.push(targetUserId);
      user.subscribing += 1;
      targetUser.subscribers += 1;

      // 添加活动记录
      this.db.activities.unshift({
        id: generateId('act-'),
        userId,
        action: '关注用户',
        target: 'user',
        targetId: targetUserId,
        timestamp: new Date().toISOString(),
        details: `用户 ${user.nickname || user.username} 关注了 ${targetUser.nickname || targetUser.username}`,
        type: 'user',
      });

      // 为目标用户生成通知
      if (!this.db.notifications) {
        this.db.notifications = [];
      }

      this.db.notifications.push({
        id: generateId('notif-'),
        userId: targetUserId,
        type: 'subscription',
        title: '新关注',
        message: `${user.nickname || user.username} 关注了你`,
        read: false,
        createdAt: new Date().toISOString(),
        relatedId: userId,
        actionUrl: `/user/${userId}`,
      });

      return true;
    }
  }

  /**
   * 初始化通知数据
   * 确保数据库中存在notifications表
   */
  private initializeNotifications(): void {
    if (!this.db.notifications) {
      this.db.notifications = [];
    }
  }

  /**
   * 获取用户通知列表
   * @param userId 用户ID
   * @param params 分页参数
   * @returns 分页后的通知列表
   */
  public getUserNotifications(
    userId: string,
    params: { page?: number; limit?: number }
  ): { data: any[]; total: number } {
    const { page = 1, limit = 10 } = params;
    this.initializeNotifications();

    // 获取用户通知
    const userNotifications = this.db.notifications.filter(notif => notif.userId === userId);

    // 按最新优先排序
    userNotifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotifications = userNotifications.slice(startIndex, endIndex);

    return { data: paginatedNotifications, total: userNotifications.length };
  }

  /**
   * 标记通知为已读
   * @param userId 用户ID
   * @param notificationId 通知ID
   * @returns 操作结果
   */
  public markNotificationRead(
    userId: string,
    notificationId: string
  ): { success: boolean; error?: string } {
    this.initializeNotifications();

    // 查找通知
    const notification = this.db.notifications.find(
      n => n.id === notificationId && n.userId === userId
    );

    if (!notification) {
      return { success: false, error: '通知不存在' };
    }

    // 标记为已读
    notification.read = true;

    return { success: true };
  }

  /**
   * 标记所有通知为已读
   * @param userId 用户ID
   */
  public markAllNotificationsRead(userId: string): void {
    this.initializeNotifications();

    // 获取用户的所有通知并标记为已读
    this.db.notifications
      .filter(notif => notif.userId === userId)
      .forEach(notif => {
        notif.read = true;
      });
  }

  /**
   * 修改用户密码
   * @param userId 用户ID
   * @param currentPassword 当前密码
   * @param newPassword 新密码
   * @returns 操作结果
   */
  public changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): { success: boolean; error?: string } {
    // 查找用户
    const userIndex = this.db.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return { success: false, error: '用户不存在' };
    }

    const user = this.db.users[userIndex];

    // 验证当前密码
    if (user.password !== currentPassword) {
      return { success: false, error: '当前密码不正确' };
    }

    // 验证新密码
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: '新密码不能少于6个字符' };
    }

    // 更新密码
    this.db.users[userIndex].password = newPassword;
    this.db.users[userIndex].updatedAt = new Date().toISOString();

    // 添加活动记录
    this.db.activities.unshift({
      id: generateId('act-'),
      userId,
      action: '修改密码',
      target: 'user',
      targetId: userId,
      timestamp: new Date().toISOString(),
      details: `用户 ${user.nickname || user.username} 修改了密码`,
      type: 'user',
    });

    return { success: true };
  }

  // 生成随机播放列表
  private generateRandomPlaylists(count: number): void {
    // 获取所有活跃用户
    const activeUsers = this.db.users.filter(user => user.status === 'active');
    // 获取所有已发布视频
    const publishedVideos = this.db.videos.filter(video => video.status === 'published');

    if (activeUsers.length === 0 || publishedVideos.length === 0) return;

    // 播放列表标题模板
    const titleTemplates = [
      `${faker.helpers.arrayElement(['前端', '后端', '全栈', '移动端', '数据库', '云计算'])}开发学习清单`,
      `${faker.helpers.arrayElement(['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust'])}编程教程合集`,
      `${faker.helpers.arrayElement(['初学者', '中级', '高级'])}${faker.helpers.arrayElement(['Web开发', '移动开发', '游戏开发', '数据科学'])}教程`,
      `${faker.helpers.arrayElement(['React', 'Vue', 'Angular', 'Flutter', 'SwiftUI', '微信小程序'])}实战项目`,
      `${faker.helpers.arrayElement(['必看', '推荐', '精选', '热门'])}${faker.helpers.arrayElement(['教程', '讲解', '案例', '项目'])}`,
    ];

    for (let i = 0; i < count; i++) {
      const user = faker.helpers.arrayElement(activeUsers);
      const videoCount = faker.number.int({ min: 3, max: 20 });
      const visibility = faker.helpers.arrayElement(['public', 'private', 'unlisted']) as
        | 'public'
        | 'private'
        | 'unlisted';

      // 创建播放列表
      const playlist: Playlist = {
        id: generateId('pl-'),
        title: faker.helpers.arrayElement(titleTemplates),
        description: faker.lorem.paragraph(),
        userId: user.id,
        thumbnailUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/320/180`,
        videoCount,
        visibility,
        createdAt: faker.date.past({ years: 1 }).toISOString(),
        updatedAt: faker.date.recent().toISOString(),
        viewCount: faker.number.int({ min: 0, max: 5000 }),
        isSystem: false,
      };

      this.db.playlists.push(playlist);

      // 为播放列表添加视频
      const playlistVideos = faker.helpers.arrayElements(publishedVideos, videoCount);

      playlistVideos.forEach((video, index) => {
        const playlistVideo: PlaylistVideo = {
          id: generateId('plv-'),
          playlistId: playlist.id,
          videoId: video.id,
          position: index + 1,
          addedAt: faker.date
            .between({ from: new Date(playlist.createdAt), to: new Date() })
            .toISOString(),
          addedBy: playlist.userId,
        };

        this.db.playlistVideos.push(playlistVideo);
      });

      // 为每个用户创建"稍后观看"默认播放列表
      if (i === 0 && user.id === 'u-user') {
        const watchLaterPlaylist: Playlist = {
          id: 'pl-watch-later-u-user',
          title: '稍后观看',
          description: '保存的视频，以便稍后观看',
          userId: 'u-user',
          thumbnailUrl: `https://picsum.photos/seed/watchlater/320/180`,
          videoCount: 5,
          visibility: 'private',
          createdAt: faker.date.past({ years: 1 }).toISOString(),
          updatedAt: faker.date.recent().toISOString(),
          isSystem: true,
        };

        this.db.playlists.push(watchLaterPlaylist);

        // 为"稍后观看"添加一些视频
        const watchLaterVideos = faker.helpers.arrayElements(publishedVideos, 5);

        watchLaterVideos.forEach((video, index) => {
          const playlistVideo: PlaylistVideo = {
            id: generateId('plv-'),
            playlistId: watchLaterPlaylist.id,
            videoId: video.id,
            position: index + 1,
            addedAt: faker.date
              .between({ from: new Date(watchLaterPlaylist.createdAt), to: new Date() })
              .toISOString(),
            addedBy: 'u-user',
          };

          this.db.playlistVideos.push(playlistVideo);
        });
      }
    }
  }

  /**
   * 获取用户的播放列表
   * @param userId 用户ID
   * @param params 查询参数
   * @returns 分页后的播放列表
   */
  public getUserPlaylists(
    userId: string,
    params: {
      page?: number;
      limit?: number;
      search?: string;
      visibility?: 'public' | 'private' | 'unlisted' | 'all';
    } = {}
  ): {
    items: Playlist[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const { page = 1, limit = 10, search = '', visibility = 'all' } = params;

    // 筛选播放列表
    let filteredPlaylists = this.db.playlists.filter(playlist => playlist.userId === userId);

    // 按可见性筛选
    if (visibility !== 'all') {
      filteredPlaylists = filteredPlaylists.filter(playlist => playlist.visibility === visibility);
    }

    // 按搜索词筛选
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPlaylists = filteredPlaylists.filter(
        playlist =>
          playlist.title.toLowerCase().includes(searchLower) ||
          playlist.description.toLowerCase().includes(searchLower)
      );
    }

    // 排序：默认按更新时间倒序
    filteredPlaylists.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPlaylists = filteredPlaylists.slice(startIndex, endIndex);

    return {
      items: paginatedPlaylists,
      total: filteredPlaylists.length,
      page,
      limit,
      totalPages: Math.ceil(filteredPlaylists.length / limit),
    };
  }

  /**
   * 获取播放列表详情
   * @param playlistId 播放列表ID
   * @returns 播放列表详情或null
   */
  public getPlaylistById(playlistId: string): Playlist | null {
    return this.db.playlists.find(playlist => playlist.id === playlistId) || null;
  }

  /**
   * 获取播放列表的视频
   * @param playlistId 播放列表ID
   * @param params 查询参数
   * @returns 分页后的视频列表
   */
  public getPlaylistVideos(
    playlistId: string,
    params: {
      page?: number;
      limit?: number;
    } = {}
  ): {
    items: (Video & { position: number; addedAt: string })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const { page = 1, limit = 10 } = params;

    // 获取播放列表
    const playlist = this.getPlaylistById(playlistId);
    if (!playlist) {
      return {
        items: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    // 获取播放列表中的视频ID和位置
    const playlistVideosItems = this.db.playlistVideos
      .filter(pv => pv.playlistId === playlistId)
      .sort((a, b) => a.position - b.position);

    // 获取视频详情
    const videos = playlistVideosItems
      .map(pv => {
        const video = this.db.videos.find(v => v.id === pv.videoId);
        if (!video) return null;

        // 附加作者信息
        const videoWithAuthor = this.attachAuthorInfo(video);

        // 附加位置和添加时间信息
        return {
          ...videoWithAuthor,
          position: pv.position,
          addedAt: pv.addedAt,
        };
      })
      .filter(v => v !== null) as (Video & { position: number; addedAt: string })[];

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = videos.slice(startIndex, endIndex);

    return {
      items: paginatedVideos,
      total: videos.length,
      page,
      limit,
      totalPages: Math.ceil(videos.length / limit),
    };
  }

  /**
   * 创建播放列表
   * @param userId 用户ID
   * @param data 播放列表数据
   * @returns 创建的播放列表
   */
  public createPlaylist(
    userId: string,
    data: {
      title: string;
      description?: string;
      visibility: 'public' | 'private' | 'unlisted';
      videoIds?: string[];
    }
  ): Playlist {
    // 创建播放列表
    const playlist: Playlist = {
      id: generateId('pl-'),
      title: data.title,
      description: data.description || '',
      userId,
      thumbnailUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/320/180`,
      videoCount: data.videoIds?.length || 0,
      visibility: data.visibility,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      isSystem: false,
    };

    this.db.playlists.push(playlist);

    // 如果提供了视频ID，添加到播放列表
    if (data.videoIds && data.videoIds.length > 0) {
      data.videoIds.forEach((videoId, index) => {
        // 检查视频是否存在
        const video = this.db.videos.find(v => v.id === videoId);
        if (video) {
          const playlistVideo: PlaylistVideo = {
            id: generateId('plv-'),
            playlistId: playlist.id,
            videoId,
            position: index + 1,
            addedAt: new Date().toISOString(),
            addedBy: userId,
          };

          this.db.playlistVideos.push(playlistVideo);
        }
      });

      // 更新视频数量
      playlist.videoCount = this.db.playlistVideos.filter(
        pv => pv.playlistId === playlist.id
      ).length;
    }

    // 记录活动
    this.db.activities.push({
      id: generateId('a-'),
      userId,
      action: '创建了播放列表',
      target: playlist.title,
      targetId: playlist.id,
      timestamp: new Date().toISOString(),
      type: 'video',
    });

    return playlist;
  }

  /**
   * 更新播放列表
   * @param playlistId 播放列表ID
   * @param userId 用户ID
   * @param data 更新数据
   * @returns 更新结果
   */
  public updatePlaylist(
    playlistId: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      visibility?: 'public' | 'private' | 'unlisted';
    }
  ): { success: boolean; playlist?: Playlist; error?: string } {
    // 获取播放列表
    const playlist = this.db.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      return { success: false, error: '播放列表不存在' };
    }

    // 检查权限
    if (playlist.userId !== userId) {
      return { success: false, error: '没有权限修改此播放列表' };
    }

    // 系统播放列表不能修改
    if (playlist.isSystem) {
      return { success: false, error: '系统播放列表不能修改' };
    }

    // 更新数据
    if (data.title) playlist.title = data.title;
    if (data.description !== undefined) playlist.description = data.description;
    if (data.visibility) playlist.visibility = data.visibility;
    playlist.updatedAt = new Date().toISOString();

    return { success: true, playlist };
  }

  /**
   * 删除播放列表
   * @param playlistId 播放列表ID
   * @param userId 用户ID
   * @returns 删除结果
   */
  public deletePlaylist(playlistId: string, userId: string): { success: boolean; error?: string } {
    // 获取播放列表
    const playlist = this.db.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      return { success: false, error: '播放列表不存在' };
    }

    // 检查权限
    if (playlist.userId !== userId) {
      return { success: false, error: '没有权限删除此播放列表' };
    }

    // 系统播放列表不能删除
    if (playlist.isSystem) {
      return { success: false, error: '系统播放列表不能删除' };
    }

    // 删除播放列表
    this.db.playlists = this.db.playlists.filter(p => p.id !== playlistId);

    // 删除相关的播放列表视频记录
    this.db.playlistVideos = this.db.playlistVideos.filter(pv => pv.playlistId !== playlistId);

    // 记录活动
    this.db.activities.push({
      id: generateId('a-'),
      userId,
      action: '删除了播放列表',
      target: playlist.title,
      timestamp: new Date().toISOString(),
      type: 'video',
    });

    return { success: true };
  }

  /**
   * 添加视频到播放列表
   * @param playlistId 播放列表ID
   * @param videoId 视频ID
   * @param userId 用户ID
   * @returns 添加结果
   */
  public addVideoToPlaylist(
    playlistId: string,
    videoId: string,
    userId: string
  ): { success: boolean; error?: string } {
    // 获取播放列表
    const playlist = this.db.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      return { success: false, error: '播放列表不存在' };
    }

    // 检查权限
    if (playlist.userId !== userId) {
      return { success: false, error: '没有权限修改此播放列表' };
    }

    // 检查视频是否存在
    const video = this.db.videos.find(v => v.id === videoId);
    if (!video) {
      return { success: false, error: '视频不存在' };
    }

    // 检查视频是否已在播放列表中
    const existingPlaylistVideo = this.db.playlistVideos.find(
      pv => pv.playlistId === playlistId && pv.videoId === videoId
    );
    if (existingPlaylistVideo) {
      return { success: false, error: '视频已在播放列表中' };
    }

    // 获取当前最大位置
    const maxPosition = this.db.playlistVideos
      .filter(pv => pv.playlistId === playlistId)
      .reduce((max, pv) => Math.max(max, pv.position), 0);

    // 添加视频到播放列表
    const playlistVideo: PlaylistVideo = {
      id: generateId('plv-'),
      playlistId,
      videoId,
      position: maxPosition + 1,
      addedAt: new Date().toISOString(),
      addedBy: userId,
    };

    this.db.playlistVideos.push(playlistVideo);

    // 更新播放列表视频数量和修改时间
    playlist.videoCount = this.db.playlistVideos.filter(pv => pv.playlistId === playlistId).length;
    playlist.updatedAt = new Date().toISOString();

    return { success: true };
  }

  /**
   * 从播放列表中移除视频
   * @param playlistId 播放列表ID
   * @param videoId 视频ID
   * @param userId 用户ID
   * @returns 移除结果
   */
  public removeVideoFromPlaylist(
    playlistId: string,
    videoId: string,
    userId: string
  ): { success: boolean; error?: string } {
    // 获取播放列表
    const playlist = this.db.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      return { success: false, error: '播放列表不存在' };
    }

    // 检查权限
    if (playlist.userId !== userId) {
      return { success: false, error: '没有权限修改此播放列表' };
    }

    // 检查视频是否在播放列表中
    const existingPlaylistVideo = this.db.playlistVideos.find(
      pv => pv.playlistId === playlistId && pv.videoId === videoId
    );
    if (!existingPlaylistVideo) {
      return { success: false, error: '视频不在播放列表中' };
    }

    // 移除视频
    this.db.playlistVideos = this.db.playlistVideos.filter(
      pv => !(pv.playlistId === playlistId && pv.videoId === videoId)
    );

    // 重新排序其他视频
    const remainingVideos = this.db.playlistVideos
      .filter(pv => pv.playlistId === playlistId)
      .sort((a, b) => a.position - b.position);

    remainingVideos.forEach((pv, index) => {
      pv.position = index + 1;
    });

    // 更新播放列表视频数量和修改时间
    playlist.videoCount = remainingVideos.length;
    playlist.updatedAt = new Date().toISOString();

    return { success: true };
  }

  /**
   * 更新播放列表中视频的位置
   * @param playlistId 播放列表ID
   * @param videoId 视频ID
   * @param newPosition 新位置
   * @param userId 用户ID
   * @returns 更新结果
   */
  public updateVideoPosition(
    playlistId: string,
    videoId: string,
    newPosition: number,
    userId: string
  ): { success: boolean; error?: string } {
    // 获取播放列表
    const playlist = this.db.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      return { success: false, error: '播放列表不存在' };
    }

    // 检查权限
    if (playlist.userId !== userId) {
      return { success: false, error: '没有权限修改此播放列表' };
    }

    // 检查视频是否在播放列表中
    const playlistVideo = this.db.playlistVideos.find(
      pv => pv.playlistId === playlistId && pv.videoId === videoId
    );
    if (!playlistVideo) {
      return { success: false, error: '视频不在播放列表中' };
    }

    // 获取所有播放列表视频并排序
    const playlistVideos = this.db.playlistVideos
      .filter(pv => pv.playlistId === playlistId)
      .sort((a, b) => a.position - b.position);

    // 确保新位置有效
    const validPosition = Math.max(1, Math.min(newPosition, playlistVideos.length));
    const oldPosition = playlistVideo.position;

    // 如果位置没有变化，不需要更新
    if (validPosition === oldPosition) {
      return { success: true };
    }

    // 更新位置
    if (validPosition < oldPosition) {
      // 向上移动：中间的视频向下移动一位
      for (const pv of playlistVideos) {
        if (pv.position >= validPosition && pv.position < oldPosition) {
          pv.position += 1;
        }
      }
    } else {
      // 向下移动：中间的视频向上移动一位
      for (const pv of playlistVideos) {
        if (pv.position > oldPosition && pv.position <= validPosition) {
          pv.position -= 1;
        }
      }
    }

    // 设置新位置
    playlistVideo.position = validPosition;

    // 更新播放列表修改时间
    playlist.updatedAt = new Date().toISOString();

    return { success: true };
  }

  /**
   * 设置播放列表封面
   * @param playlistId 播放列表ID
   * @param thumbnailUrl 封面URL
   * @param userId 用户ID
   * @returns 更新结果
   */
  public setPlaylistThumbnail(
    playlistId: string,
    thumbnailUrl: string,
    userId: string
  ): { success: boolean; error?: string } {
    // 获取播放列表
    const playlist = this.db.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      return { success: false, error: '播放列表不存在' };
    }

    // 检查权限
    if (playlist.userId !== userId) {
      return { success: false, error: '没有权限修改此播放列表' };
    }

    // 更新封面
    playlist.thumbnailUrl = thumbnailUrl;
    playlist.updatedAt = new Date().toISOString();

    return { success: true };
  }

  /**
   * 获取所有频道列表
   * @param params 查询参数
   * @returns 分页后的频道列表
   */
  public getChannels(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      sort?: string;
      order?: 'asc' | 'desc';
      categories?: string[];
    } = {}
  ): {
    items: Channel[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const {
      page = 1,
      limit = 10,
      search = '',
      sort = 'createdAt',
      order = 'desc',
      categories = [],
    } = params;

    // 获取所有用户，转化为频道列表
    let channels: Channel[] = this.db.users.map(user => {
      // 确保用户有统计信息
      const userStats = user.stats || {
        totalVideosWatched: 0,
        totalCommentsPosted: 0,
        totalLikesGiven: 0,
        totalViews: 0,
      };

      // 计算用户的视频总数
      const videoCount = this.db.videos.filter(v => v.authorId === user.id).length;

      // 计算总观看量
      const totalViews =
        userStats.totalViews ||
        this.db.videos
          .filter(v => v.authorId === user.id)
          .reduce((sum, video) => sum + video.views, 0);

      // 判断是否为认证用户（假设这里使用.verified属性）
      const verified = user.verified || false;

      return {
        id: `ch-${user.id}`, // 频道ID使用ch-前缀加用户ID
        userId: user.id,
        name: user.nickname || user.username,
        handle: user.username.toLowerCase().replace(/\s+/g, '_'),
        description: user.bio || '',
        avatarUrl: user.avatar,
        coverUrl: user.bannerUrl || `https://picsum.photos/1200/300?random=${user.id}`,
        subscriberCount: user.subscribers || 0,
        videoCount,
        totalViews,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        location: user.social?.location || user.location || '',
        verified,
        socialLinks: [
          ...(user.social?.website ? [{ platform: 'Website', url: user.social.website }] : []),
          ...(user.social?.twitter ? [{ platform: 'Twitter', url: user.social.twitter }] : []),
          ...(user.social?.github ? [{ platform: 'GitHub', url: user.social.github }] : []),
        ],
        isSubscribed: false, // 默认未订阅，稍后会根据当前登录用户来更新
        categories: user.preferences?.categories || [],
      } as Channel;
    });

    // 过滤：搜索条件
    if (search) {
      const searchLower = search.toLowerCase();
      channels = channels.filter(
        channel =>
          channel.name.toLowerCase().includes(searchLower) ||
          channel.handle.toLowerCase().includes(searchLower) ||
          channel.description.toLowerCase().includes(searchLower)
      );
    }

    // 过滤：类别
    if (categories.length > 0) {
      channels = channels.filter(channel => {
        if (!channel.categories || channel.categories.length === 0) return false;
        return categories.some(cat => channel.categories?.includes(cat));
      });
    }

    // 排序
    channels.sort((a, b) => {
      let valueA, valueB;

      switch (sort) {
        case 'name':
          valueA = a.name;
          valueB = b.name;
          break;
        case 'subscribers':
          valueA = a.subscriberCount;
          valueB = b.subscriberCount;
          break;
        case 'views':
          valueA = a.totalViews;
          valueB = b.totalViews;
          break;
        case 'videoCount':
          valueA = a.videoCount;
          valueB = b.videoCount;
          break;
        case 'createdAt':
        default:
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        // 数字类型
        return order === 'asc' ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
      }
    });

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedChannels = channels.slice(startIndex, endIndex);

    return {
      items: paginatedChannels,
      total: channels.length,
      page,
      limit,
      totalPages: Math.ceil(channels.length / limit),
    };
  }

  /**
   * 获取频道详情
   * @param channelId 频道ID，格式为ch-{userId}
   * @returns 频道详情或null
   */
  public getChannelById(channelId: string): Channel | null {
    // 频道ID格式 ch-{userId}
    const userId = channelId.startsWith('ch-') ? channelId.substring(3) : channelId;

    // 查找对应的用户
    const user = this.db.users.find(u => u.id === userId);
    if (!user) return null;

    // 创建频道对象
    return this.getUserChannel(user);
  }

  /**
   * 根据用户获取其频道信息
   * @param user 用户对象
   * @returns 频道信息
   */
  private getUserChannel(user: User): Channel {
    // 确保用户有统计信息
    const userStats = user.stats || {
      totalVideosWatched: 0,
      totalCommentsPosted: 0,
      totalLikesGiven: 0,
      totalViews: 0,
    };

    // 计算用户的视频总数
    const videoCount = this.db.videos.filter(v => v.authorId === user.id).length;

    // 计算总观看量
    const totalViews =
      userStats.totalViews ||
      this.db.videos
        .filter(v => v.authorId === user.id)
        .reduce((sum, video) => sum + video.views, 0);

    // 判断当前登录用户是否已订阅该频道
    const currentUserId = this.getCurrentUserId();
    const isSubscribed = currentUserId ? (user.following || []).includes(currentUserId) : false;

    return {
      id: `ch-${user.id}`,
      userId: user.id,
      name: user.nickname || user.username,
      handle: user.username.toLowerCase().replace(/\s+/g, '_'),
      description: user.bio || '',
      avatarUrl: user.avatar,
      coverUrl: user.bannerUrl || `https://picsum.photos/1200/300?random=${user.id}`,
      subscriberCount: user.subscribers || 0,
      videoCount,
      totalViews,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      location: user.social?.location || user.location || '',
      verified: user.verified || false,
      socialLinks: [
        ...(user.social?.website ? [{ platform: 'Website', url: user.social.website }] : []),
        ...(user.social?.twitter ? [{ platform: 'Twitter', url: user.social.twitter }] : []),
        ...(user.social?.github ? [{ platform: 'GitHub', url: user.social.github }] : []),
      ],
      isSubscribed,
      categories: user.preferences?.categories || [],
    };
  }

  /**
   * 获取频道统计信息
   * @param channelId 频道ID
   * @returns 频道统计信息
   */
  public getChannelStats(channelId: string): ChannelStats | null {
    const userId = channelId.startsWith('ch-') ? channelId.substring(3) : channelId;
    const user = this.db.users.find(u => u.id === userId);
    if (!user) return null;

    // 获取频道视频
    const videos = this.db.videos.filter(v => v.authorId === userId);

    // 计算视频总观看量
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0);

    // 获取频道订阅者数量
    const subscriberCount = user.subscribers || 0;

    // 视频数量
    const videoCount = videos.length;

    // 计算今日、本周、本月的订阅者增长和观看量增长
    // 这里假设有1-5%的随机增长率
    const getRandom = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const dailySubscriberGrowth = Math.floor((subscriberCount * getRandom(1, 2)) / 100);
    const weeklySubscriberGrowth = Math.floor((subscriberCount * getRandom(2, 5)) / 100);
    const monthlySubscriberGrowth = Math.floor((subscriberCount * getRandom(5, 10)) / 100);

    const dailyViewsGrowth = Math.floor((totalViews * getRandom(1, 3)) / 100);
    const weeklyViewsGrowth = Math.floor((totalViews * getRandom(3, 8)) / 100);
    const monthlyViewsGrowth = Math.floor((totalViews * getRandom(8, 15)) / 100);

    return {
      subscriberCount,
      videoCount,
      totalViews,
      subscriberGrowth: {
        day: dailySubscriberGrowth,
        week: weeklySubscriberGrowth,
        month: monthlySubscriberGrowth,
      },
      viewsGrowth: {
        day: dailyViewsGrowth,
        week: weeklyViewsGrowth,
        month: monthlyViewsGrowth,
      },
    };
  }

  /**
   * 获取频道视频列表
   * @param params 查询参数
   * @returns 分页后的视频列表
   */
  public getChannelVideos(params: {
    channelId: string;
    page?: number;
    limit?: number;
    sort?: 'newest' | 'oldest' | 'popular' | 'views';
    search?: string;
    tags?: string[];
  }): {
    items: ChannelVideo[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const { channelId, page = 1, limit = 10, sort = 'newest', search = '', tags = [] } = params;
    const userId = channelId.startsWith('ch-') ? channelId.substring(3) : channelId;

    // 获取所有视频
    let videos = this.db.videos.filter(v => v.authorId === userId);

    // 过滤：搜索条件
    if (search) {
      const searchLower = search.toLowerCase();
      videos = videos.filter(
        video =>
          video.title.toLowerCase().includes(searchLower) ||
          video.description.toLowerCase().includes(searchLower)
      );
    }

    // 过滤：标签
    if (tags.length > 0) {
      videos = videos.filter(video => tags.some(tag => video.tags.includes(tag)));
    }

    // 排序
    videos.sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return b.likes - a.likes;
        case 'views':
          return b.views - a.views;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    // 转换为ChannelVideo格式
    const channelVideos = videos.map(video => {
      return {
        ...video,
        publishedAt: video.publishedAt || video.createdAt,
        visibility: video.privacy || 'public',
        status: 'published',
      } as ChannelVideo;
    });

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = channelVideos.slice(startIndex, endIndex);

    return {
      items: paginatedVideos,
      total: channelVideos.length,
      page,
      limit,
      totalPages: Math.ceil(channelVideos.length / limit),
    };
  }

  /**
   * 获取频道播放列表
   * @param channelId 频道ID
   * @param page 页码
   * @param limit 每页数量
   * @returns 分页后的播放列表
   */
  public getChannelPlaylists(
    channelId: string,
    page: number = 1,
    limit: number = 10
  ): {
    items: ChannelPlaylist[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const userId = channelId.startsWith('ch-') ? channelId.substring(3) : channelId;

    // 获取用户的所有播放列表
    let playlists = this.db.playlists.filter(pl => pl.userId === userId);

    // 仅包含公开的播放列表
    const currentUserId = this.getCurrentUserId();
    if (currentUserId !== userId) {
      playlists = playlists.filter(
        pl => pl.visibility === 'public' || pl.visibility === 'unlisted'
      );
    }

    // 按更新时间倒序排序
    playlists.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // 转换为ChannelPlaylist格式
    const channelPlaylists = playlists.map(playlist => {
      return {
        id: playlist.id,
        title: playlist.title,
        description: playlist.description,
        thumbnailUrl: playlist.thumbnailUrl,
        videoCount: playlist.videoCount,
        visibility: playlist.visibility,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
      } as ChannelPlaylist;
    });

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPlaylists = channelPlaylists.slice(startIndex, endIndex);

    return {
      items: paginatedPlaylists,
      total: channelPlaylists.length,
      page,
      limit,
      totalPages: Math.ceil(channelPlaylists.length / limit),
    };
  }

  /**
   * 订阅频道
   * @param channelId 频道ID
   * @returns 是否成功
   */
  public subscribeChannel(channelId: string): { success: boolean; error?: string } {
    const userId = channelId.startsWith('ch-') ? channelId.substring(3) : channelId;

    // 获取当前用户ID
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      return { success: false, error: '未授权，请先登录' };
    }

    // 查找目标用户
    const targetUser = this.db.users.find(u => u.id === userId);
    if (!targetUser) {
      return { success: false, error: '频道不存在' };
    }

    // 不能订阅自己
    if (currentUserId === userId) {
      return { success: false, error: '不能订阅自己的频道' };
    }

    // 查找当前用户
    const currentUser = this.db.users.find(u => u.id === currentUserId);
    if (!currentUser) {
      return { success: false, error: '用户不存在' };
    }

    // 检查是否已订阅
    if (!currentUser.following) {
      currentUser.following = [];
    }

    if (currentUser.following.includes(userId)) {
      return { success: false, error: '已经订阅了此频道' };
    }

    // 添加订阅关系
    currentUser.following.push(userId);

    // 更新订阅者计数
    targetUser.subscribers = (targetUser.subscribers || 0) + 1;

    // 记录活动
    this.db.activities.push({
      id: generateId('a-'),
      userId: currentUserId,
      action: '订阅了频道',
      target: targetUser.nickname || targetUser.username,
      targetId: userId,
      timestamp: new Date().toISOString(),
      type: 'user',
    });

    // 添加通知
    this.db.notifications.push({
      id: generateId('n-'),
      userId: userId,
      type: 'subscription',
      title: '新订阅者',
      message: `${currentUser.nickname || currentUser.username} 订阅了你的频道`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: currentUserId,
      actionUrl: `/channel/ch-${currentUserId}`,
    });

    return { success: true };
  }

  /**
   * 取消订阅频道
   * @param channelId 频道ID
   * @returns 是否成功
   */
  public unsubscribeChannel(channelId: string): { success: boolean; error?: string } {
    const userId = channelId.startsWith('ch-') ? channelId.substring(3) : channelId;

    // 获取当前用户ID
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      return { success: false, error: '未授权，请先登录' };
    }

    // 查找目标用户
    const targetUser = this.db.users.find(u => u.id === userId);
    if (!targetUser) {
      return { success: false, error: '频道不存在' };
    }

    // 查找当前用户
    const currentUser = this.db.users.find(u => u.id === currentUserId);
    if (!currentUser) {
      return { success: false, error: '用户不存在' };
    }

    // 检查是否已订阅
    if (!currentUser.following || !currentUser.following.includes(userId)) {
      return { success: false, error: '尚未订阅此频道' };
    }

    // 移除订阅关系
    currentUser.following = currentUser.following.filter(id => id !== userId);

    // 更新订阅者计数
    targetUser.subscribers = Math.max(0, (targetUser.subscribers || 0) - 1);

    // 记录活动
    this.db.activities.push({
      id: generateId('a-'),
      userId: currentUserId,
      action: '取消订阅了频道',
      target: targetUser.nickname || targetUser.username,
      targetId: userId,
      timestamp: new Date().toISOString(),
      type: 'user',
    });

    return { success: true };
  }

  /**
   * 获取当前登录用户ID
   * @returns 用户ID或null
   */
  private getCurrentUserId(): string | null {
    // 通过localStorage获取token
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return null;

    // 通过token获取用户ID
    return this.getUserIdFromToken(token);
  }
}

// 创建并导出单例实例
const mockDb = new MockDatabase();
export default mockDb;
