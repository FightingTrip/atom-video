import type { Video } from '@/types';

export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Vue 3 完整指南',
    description: '从零开始学习 Vue 3 的完整教程',
    thumbnail: 'https://picsum.photos/seed/vue3/640/360',
    duration: 3600,
    views: 10000,
    likes: 500,
    createdAt: '2024-04-01T00:00:00Z',
    tags: [
      { id: 'vue', name: 'Vue', slug: 'vue', icon: 'fa-vuejs' },
      { id: 'javascript', name: 'JavaScript', slug: 'javascript', icon: 'fa-js' },
    ],
    user: {
      id: '1',
      username: 'admin',
      nickname: '管理员',
      avatar: 'https://picsum.photos/seed/admin/200/200',
      createdAt: '2024-01-01T00:00:00Z',
    },
  },
  {
    id: '2',
    title: 'TypeScript 实战教程',
    description: 'TypeScript 在实际项目中的应用',
    thumbnail: 'https://picsum.photos/seed/typescript/640/360',
    duration: 2700,
    views: 8000,
    likes: 400,
    createdAt: '2024-04-02T00:00:00Z',
    tags: [
      { id: 'typescript', name: 'TypeScript', slug: 'typescript', icon: 'fa-code' },
      { id: 'javascript', name: 'JavaScript', slug: 'javascript', icon: 'fa-js' },
    ],
    user: {
      id: '2',
      username: 'teacher',
      nickname: '讲师',
      avatar: 'https://picsum.photos/seed/teacher/200/200',
      createdAt: '2024-01-02T00:00:00Z',
    },
  },
  {
    id: '3',
    title: 'Node.js 后端开发',
    description: '使用 Node.js 构建现代后端服务',
    thumbnail: 'https://picsum.photos/seed/nodejs/640/360',
    duration: 4500,
    views: 12000,
    likes: 600,
    createdAt: '2024-04-03T00:00:00Z',
    tags: [
      { id: 'nodejs', name: 'Node.js', slug: 'nodejs', icon: 'fa-node' },
      { id: 'javascript', name: 'JavaScript', slug: 'javascript', icon: 'fa-js' },
    ],
    user: {
      id: '3',
      username: 'developer',
      nickname: '开发者',
      avatar: 'https://picsum.photos/seed/developer/200/200',
      createdAt: '2024-01-03T00:00:00Z',
    },
  },
];
