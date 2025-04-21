/**
 * @file video.ts
 * @description 模拟视频数据 - 面向开发者的教育视频
 */

import type { Video } from '@/types';

// 视频封面图片，用于统一开发环境
const COVER_IMAGES = [
  'https://picsum.photos/seed/react-hooks/640/360',
  'https://picsum.photos/seed/typescript-tips/640/360',
  'https://picsum.photos/seed/docker-deploy/640/360',
  'https://picsum.photos/seed/nodejs-api/640/360',
  'https://picsum.photos/seed/vue3-composition/640/360',
  'https://picsum.photos/seed/graphql-basics/640/360',
];

// 统一的视频源列表
const VIDEO_SOURCES = [
  'https://vjs.zencdn.net/v/oceans.mp4',
  'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
  'https://media.w3.org/2010/05/bunny/movie.mp4',
  'https://vjs.zencdn.net/v/elephantsdream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
];

// 创作者数据 - 开发专家
const AUTHORS = [
  {
    id: 'author-1',
    username: 'frontend_master',
    nickname: '前端专家',
    avatar: 'https://i.pravatar.cc/150?u=auth0',
    verified: true,
    followersCount: 125000,
    followingCount: 86,
    description: '资深前端开发工程师，专注于React、Vue等前端框架教学。',
  },
  {
    id: 'author-2',
    username: 'backend_guru',
    nickname: '后端大师',
    avatar: 'https://i.pravatar.cc/150?u=auth1',
    verified: true,
    followersCount: 85000,
    followingCount: 124,
    description: 'Node.js和Python专家，10年后端开发经验，微服务架构设计师。',
  },
  {
    id: 'author-3',
    username: 'devops_ninja',
    nickname: 'DevOps忍者',
    avatar: 'https://i.pravatar.cc/150?u=auth2',
    verified: true,
    followersCount: 56000,
    followingCount: 67,
    description: '云原生和容器化专家，分享DevOps最佳实践和自动化部署技巧。',
  },
];

// 模拟视频数据 - 开发者教育内容
export const mockVideos: Video[] = [
  {
    id: 'video-1',
    title: 'React Hooks完全指南 - 从入门到精通',
    description:
      '本教程详细讲解React Hooks的使用方法，从useState和useEffect基础知识到自定义Hooks的高级应用，帮助你掌握函数式组件开发。',
    coverUrl: COVER_IMAGES[0],
    videoUrl: VIDEO_SOURCES[0],
    duration: 325, // 5:25
    views: 328000,
    likes: 14200,
    favorites: 3650,
    comments: 820,
    createdAt: '2025-04-01T08:30:00Z',
    author: AUTHORS[0],
    tags: ['前端', 'React', 'Hooks', 'JavaScript'],
    sources: [
      {
        url: VIDEO_SOURCES[0],
        type: 'video/mp4',
        size: 1080,
        label: '1080p',
      },
      {
        url: VIDEO_SOURCES[0],
        type: 'video/mp4',
        size: 720,
        label: '720p',
      },
      {
        url: VIDEO_SOURCES[0],
        type: 'video/mp4',
        size: 480,
        label: '480p',
      },
    ],
    subtitles: [
      {
        url: '#',
        label: '中文',
        srclang: 'zh',
        default: true,
      },
    ],
  },
  {
    id: 'video-2',
    title: 'TypeScript高级类型系统详解',
    description:
      '深入探讨TypeScript类型系统的高级特性，包括泛型、条件类型、映射类型和类型推断，提升你的类型编程能力。',
    coverUrl: COVER_IMAGES[1],
    videoUrl: VIDEO_SOURCES[1],
    duration: 253, // 4:13
    views: 145000,
    likes: 9800,
    favorites: 4250,
    comments: 630,
    createdAt: '2025-03-28T14:45:00Z',
    author: AUTHORS[0],
    tags: ['TypeScript', '前端', '编程语言', '类型系统'],
    sources: [
      {
        url: VIDEO_SOURCES[1],
        type: 'video/mp4',
        size: 1080,
        label: '1080p',
      },
      {
        url: VIDEO_SOURCES[1],
        type: 'video/mp4',
        size: 720,
        label: '720p',
      },
    ],
    subtitles: [],
  },
  {
    id: 'video-3',
    title: 'Docker容器化应用部署实战',
    description:
      '从零开始学习Docker容器化技术，包括Dockerfile编写、镜像构建、多容器通信和Docker Compose编排，最终实现一个完整的应用部署。',
    coverUrl: COVER_IMAGES[2],
    videoUrl: VIDEO_SOURCES[2],
    duration: 485, // 8:05
    views: 264000,
    likes: 12400,
    favorites: 3200,
    comments: 780,
    createdAt: '2025-03-25T10:20:00Z',
    author: AUTHORS[2],
    tags: ['DevOps', 'Docker', '容器化', '部署'],
    sources: [
      {
        url: VIDEO_SOURCES[2],
        type: 'video/mp4',
        size: 1080,
        label: '1080p',
      },
      {
        url: VIDEO_SOURCES[2],
        type: 'video/mp4',
        size: 720,
        label: '720p',
      },
    ],
    subtitles: [],
  },
  {
    id: 'video-4',
    title: 'Node.js微服务架构设计与实现',
    description:
      '本教程讲解如何使用Node.js设计和实现微服务架构，包括服务发现、API网关、消息队列和数据一致性等关键技术点。',
    coverUrl: COVER_IMAGES[3],
    videoUrl: VIDEO_SOURCES[3],
    duration: 312, // 5:12
    views: 185000,
    likes: 10500,
    favorites: 2850,
    comments: 540,
    createdAt: '2025-03-20T16:15:00Z',
    author: AUTHORS[1],
    tags: ['后端', 'Node.js', '微服务', '架构设计'],
    sources: [
      {
        url: VIDEO_SOURCES[3],
        type: 'video/mp4',
        size: 1080,
        label: '1080p',
      },
      {
        url: VIDEO_SOURCES[3],
        type: 'video/mp4',
        size: 720,
        label: '720p',
      },
    ],
    subtitles: [],
  },
  {
    id: 'video-5',
    title: 'Vue 3 Composition API实战教程',
    description:
      '全面介绍Vue 3 Composition API的使用方法，从响应式系统原理到复杂组件逻辑抽象，帮助你掌握Vue 3的核心开发模式。',
    coverUrl: COVER_IMAGES[4],
    videoUrl: VIDEO_SOURCES[4],
    duration: 428, // 7:08
    views: 212000,
    likes: 8800,
    favorites: 2300,
    comments: 480,
    createdAt: '2025-03-15T09:30:00Z',
    author: AUTHORS[0],
    tags: ['前端', 'Vue', 'Composition API', 'JavaScript'],
    sources: [
      {
        url: VIDEO_SOURCES[4],
        type: 'video/mp4',
        size: 1080,
        label: '1080p',
      },
      {
        url: VIDEO_SOURCES[4],
        type: 'video/mp4',
        size: 720,
        label: '720p',
      },
    ],
    subtitles: [],
  },
  {
    id: 'video-6',
    title: 'GraphQL API设计最佳实践',
    description:
      '深入讲解GraphQL API的设计原则和最佳实践，包括Schema设计、解析器实现、数据加载优化和权限控制，适合后端开发者学习。',
    coverUrl: COVER_IMAGES[5],
    videoUrl: VIDEO_SOURCES[5],
    duration: 542, // 9:02
    views: 308000,
    likes: 15800,
    favorites: 4200,
    comments: 910,
    createdAt: '2025-03-10T11:45:00Z',
    author: AUTHORS[1],
    tags: ['后端', 'GraphQL', 'API设计', '数据查询'],
    sources: [
      {
        url: VIDEO_SOURCES[5],
        type: 'video/mp4',
        size: 1080,
        label: '1080p',
      },
      {
        url: VIDEO_SOURCES[5],
        type: 'video/mp4',
        size: 720,
        label: '720p',
      },
    ],
    subtitles: [],
  },
];
