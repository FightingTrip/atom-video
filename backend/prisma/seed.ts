import {
  PrismaClient,
  UserRole,
  VideoVisibility,
  VideoType,
  DifficultyLevel,
  TechnologyCategory,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始数据库种子填充...');

  // 清理现有数据
  await cleanDatabase();

  // 创建编程语言
  const javascript = await prisma.programmingLanguage.create({
    data: {
      name: 'JavaScript',
      slug: 'javascript',
      description: '一种轻量级的解释型或即时编译型的编程语言',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    },
  });

  const typescript = await prisma.programmingLanguage.create({
    data: {
      name: 'TypeScript',
      slug: 'typescript',
      description: 'JavaScript的超集，添加了静态类型系统',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    },
  });

  const python = await prisma.programmingLanguage.create({
    data: {
      name: 'Python',
      slug: 'python',
      description: '一种易于学习、功能强大的编程语言',
      iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    },
  });

  // 创建技术
  const react = await prisma.technology.create({
    data: {
      name: 'React',
      slug: 'react',
      description: '用于构建用户界面的JavaScript库',
      iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      category: TechnologyCategory.LIBRARY,
    },
  });

  const nestjs = await prisma.technology.create({
    data: {
      name: 'NestJS',
      slug: 'nestjs',
      description: '用于构建高效、可靠和可扩展的服务器端应用程序的框架',
      iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg',
      category: TechnologyCategory.FRAMEWORK,
    },
  });

  const prismaOrm = await prisma.technology.create({
    data: {
      name: 'Prisma',
      slug: 'prisma',
      description: '下一代Node.js和TypeScript ORM',
      iconUrl: 'https://prismalens.vercel.app/header/logo-dark.svg',
      category: TechnologyCategory.LIBRARY,
    },
  });

  // 创建标签
  const webDevTag = await prisma.tag.create({
    data: {
      name: '网页开发',
      slug: 'web-development',
    },
  });

  const backendTag = await prisma.tag.create({
    data: {
      name: '后端开发',
      slug: 'backend-development',
    },
  });

  const beginnerTag = await prisma.tag.create({
    data: {
      name: '入门级',
      slug: 'beginner-friendly',
    },
  });

  // 创建分类
  const webCategory = await prisma.category.create({
    data: {
      name: '网页开发',
      slug: 'web-development',
      description: '学习构建现代网页应用',
      iconUrl: 'https://example.com/icons/web.png',
    },
  });

  const backendCategory = await prisma.category.create({
    data: {
      name: '后端开发',
      slug: 'backend-development',
      description: '学习服务器端开发技术',
      iconUrl: 'https://example.com/icons/backend.png',
    },
  });

  // 创建用户
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@atomvideo.com',
      password: adminPassword,
      name: '系统管理员',
      bio: 'Atom Video 平台管理员',
      role: UserRole.ADMIN,
      isVerified: true,
      avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=random',
    },
  });

  const creatorPassword = await bcrypt.hash('creator123', 10);
  const creator = await prisma.user.create({
    data: {
      username: 'techguru',
      email: 'creator@atomvideo.com',
      password: creatorPassword,
      name: '技术大牛',
      bio: '全栈开发者，热爱分享技术知识',
      role: UserRole.CREATOR,
      isVerified: true,
      isCreator: true,
      avatarUrl: 'https://ui-avatars.com/api/?name=Tech+Guru&background=random',
      githubProfile: 'https://github.com/techguru',
      personalWebsite: 'https://techguru.dev',
      company: 'TechCorp',
      position: '高级开发工程师',
      experienceLevel: 'EXPERT',
      channelDescription: '分享编程技巧和最佳实践',
    },
  });

  const viewerPassword = await bcrypt.hash('viewer123', 10);
  const viewer = await prisma.user.create({
    data: {
      username: 'codestudent',
      email: 'viewer@atomvideo.com',
      password: viewerPassword,
      name: '编程学习者',
      bio: '正在学习编程的大学生',
      role: UserRole.VIEWER,
      isVerified: true,
      avatarUrl: 'https://ui-avatars.com/api/?name=Code+Student&background=random',
      experienceLevel: 'BEGINNER',
    },
  });

  // 添加GitHub OAuth账号
  const githubOAuth = await prisma.oauthAccount.create({
    data: {
      userId: creator.id,
      provider: 'GITHUB',
      providerId: '12345678',
    },
  });

  // 添加Google OAuth账号
  const googleOAuth = await prisma.oauthAccount.create({
    data: {
      userId: viewer.id,
      provider: 'GOOGLE',
      providerId: '87654321',
    },
  });

  // 添加刷新令牌
  const refreshToken = await prisma.refreshToken.create({
    data: {
      userId: creator.id,
      token: 'sample-refresh-token-for-testing',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后过期
    },
  });

  // 创建视频系列
  const reactSeries = await prisma.series.create({
    data: {
      title: 'React 入门到精通',
      description: '从零开始学习React，成为前端开发专家',
      thumbnailUrl: 'https://example.com/thumbnails/react-series.jpg',
      difficultyLevel: DifficultyLevel.BEGINNER,
      isComplete: true,
      creatorId: creator.id,
    },
  });

  // 创建视频
  const reactIntroVideo = await prisma.video.create({
    data: {
      title: 'React 入门：核心概念解析',
      description: '本视频介绍React的基本概念，包括组件、JSX和状态管理',
      thumbnailUrl: 'https://example.com/thumbnails/react-intro.jpg',
      videoUrl: 'https://example.com/videos/react-intro.mp4',
      duration: 1800, // 30分钟
      visibility: VideoVisibility.PUBLIC,
      difficultyLevel: DifficultyLevel.BEGINNER,
      sourceCodeUrl: 'https://github.com/techguru/react-intro',
      liveDemo: 'https://codesandbox.io/s/react-intro-demo',
      videoType: VideoType.TUTORIAL,
      prerequisites: '基本的HTML、CSS和JavaScript知识',
      learningOutcomes: '理解React组件和状态管理的基本概念',
      creatorId: creator.id,
      languageId: javascript.id,
      seriesId: reactSeries.id,
      seriesOrder: 1,
      publishedAt: new Date(),
    },
  });

  // 添加视频技术关联
  await prisma.videoTechnology.create({
    data: {
      videoId: reactIntroVideo.id,
      technologyId: react.id,
    },
  });

  // 添加视频标签
  await prisma.videoTag.create({
    data: {
      videoId: reactIntroVideo.id,
      tagId: webDevTag.id,
    },
  });

  await prisma.videoTag.create({
    data: {
      videoId: reactIntroVideo.id,
      tagId: beginnerTag.id,
    },
  });

  // 添加视频分类
  await prisma.videoCategory.create({
    data: {
      videoId: reactIntroVideo.id,
      categoryId: webCategory.id,
    },
  });

  // 创建第二个视频
  const nestjsIntroVideo = await prisma.video.create({
    data: {
      title: 'NestJS 实战：构建现代后端API',
      description: '学习如何使用NestJS构建可扩展的后端服务',
      thumbnailUrl: 'https://example.com/thumbnails/nestjs-intro.jpg',
      videoUrl: 'https://example.com/videos/nestjs-intro.mp4',
      duration: 2400, // 40分钟
      visibility: VideoVisibility.PUBLIC,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      sourceCodeUrl: 'https://github.com/techguru/nestjs-api',
      videoType: VideoType.TUTORIAL,
      prerequisites: 'TypeScript基础，了解Node.js',
      learningOutcomes: '能够创建基本的NestJS应用和REST API',
      creatorId: creator.id,
      languageId: typescript.id,
      publishedAt: new Date(),
    },
  });

  // 添加视频技术关联
  await prisma.videoTechnology.create({
    data: {
      videoId: nestjsIntroVideo.id,
      technologyId: nestjs.id,
    },
  });

  await prisma.videoTechnology.create({
    data: {
      videoId: nestjsIntroVideo.id,
      technologyId: prismaOrm.id,
    },
  });

  // 添加视频标签
  await prisma.videoTag.create({
    data: {
      videoId: nestjsIntroVideo.id,
      tagId: backendTag.id,
    },
  });

  // 添加视频分类
  await prisma.videoCategory.create({
    data: {
      videoId: nestjsIntroVideo.id,
      categoryId: backendCategory.id,
    },
  });

  // 创建评论
  await prisma.comment.create({
    data: {
      content: '非常棒的教程！讲解非常清晰。',
      userId: viewer.id,
      videoId: reactIntroVideo.id,
    },
  });

  // 创建点赞
  await prisma.like.create({
    data: {
      userId: viewer.id,
      videoId: reactIntroVideo.id,
    },
  });

  // 创建订阅关系
  await prisma.subscription.create({
    data: {
      subscriberId: viewer.id,
      creatorId: creator.id,
    },
  });

  // 创建观看历史
  await prisma.watchHistory.create({
    data: {
      userId: viewer.id,
      videoId: reactIntroVideo.id,
      lastWatchedAt: new Date(),
    },
  });

  // 创建视频进度
  await prisma.videoProgress.create({
    data: {
      userId: viewer.id,
      videoId: reactIntroVideo.id,
      currentTime: 600, // 10分钟
      isCompleted: false,
    },
  });

  console.log('数据库种子填充完成!');
}

async function cleanDatabase() {
  // 删除依赖数据
  await prisma.videoProgress.deleteMany({});
  await prisma.watchHistory.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.commentLike.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.videoCategory.deleteMany({});
  await prisma.videoTag.deleteMany({});
  await prisma.videoTechnology.deleteMany({});
  await prisma.playlistVideo.deleteMany({});
  await prisma.seriesTag.deleteMany({});
  await prisma.userProgrammingLanguage.deleteMany({});
  await prisma.userTechnology.deleteMany({});
  await prisma.savedVideo.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.codeSnippet.deleteMany({});
  await prisma.recommendation.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.userActivity.deleteMany({});
  await prisma.searchHistory.deleteMany({});
  await prisma.contentAccuracy.deleteMany({});
  await prisma.answerVote.deleteMany({});
  await prisma.answer.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.creatorBranding.deleteMany({});
  await prisma.oauthAccount.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.verificationCode.deleteMany({});
  await prisma.passwordReset.deleteMany({});

  // 删除主要实体
  await prisma.video.deleteMany({});
  await prisma.series.deleteMany({});
  await prisma.playlist.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.technology.deleteMany({});
  await prisma.programmingLanguage.deleteMany({});
}

main()
  .catch(e => {
    console.error('填充数据库时出错:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
