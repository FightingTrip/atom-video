/**
 * @file video.ts
 * @description 模拟视频数据
 */

import type { Video } from '@/types';

// 视频封面图片，用于统一开发环境
const COVER_IMAGES = [
  'https://picsum.photos/seed/video1/640/360',
  'https://picsum.photos/seed/video2/640/360',
  'https://picsum.photos/seed/video3/640/360',
  'https://picsum.photos/seed/video4/640/360',
  'https://picsum.photos/seed/video5/640/360',
  'https://picsum.photos/seed/video6/640/360',
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

// 作者数据
const AUTHORS = [
  {
    id: 'author-1',
    username: 'creator1',
    nickname: '创作者 0',
    avatar: 'https://i.pravatar.cc/150?u=auth0',
    verified: true,
    followersCount: 125000,
    followingCount: 86,
    description: '专注于自然纪录片创作，探索地球上的奇妙生命。',
  },
  {
    id: 'author-2',
    username: 'creator2',
    nickname: '创作者 1',
    avatar: 'https://i.pravatar.cc/150?u=auth1',
    verified: true,
    followersCount: 85000,
    followingCount: 124,
    description: '动画创作者，致力于通过视觉艺术讲述引人入胜的故事。',
  },
  {
    id: 'author-3',
    username: 'creator3',
    nickname: '创作者 2',
    avatar: 'https://i.pravatar.cc/150?u=auth2',
    verified: true,
    followersCount: 56000,
    followingCount: 67,
    description: '旅行爱好者，记录世界各地的文化和美景。',
  },
];

// 模拟视频数据
export const mockVideos: Video[] = [
  {
    id: 'video-1',
    title: '海洋奇观 - 深海探索纪录片',
    description: '这是一段关于海洋生物和深海探索的纪录片片段，展示了海洋的神秘与美丽。',
    coverUrl: COVER_IMAGES[0],
    videoUrl: VIDEO_SOURCES[0],
    duration: 325, // 5:25
    views: 3280000,
    likes: 142000,
    favorites: 36500,
    comments: 8200,
    createdAt: '2025-04-01T08:30:00Z',
    author: AUTHORS[0],
    tags: ['自然', '科学', '海洋', '探索'],
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
    title: '幻境 - 动画短片',
    description: '这是一部获奖动画短片的预告，讲述了一个关于梦想与现实的奇幻故事。',
    coverUrl: COVER_IMAGES[1],
    videoUrl: VIDEO_SOURCES[1],
    duration: 253, // 4:13
    views: 1450000,
    likes: 98000,
    favorites: 42500,
    comments: 6300,
    createdAt: '2025-03-28T14:45:00Z',
    author: AUTHORS[1],
    tags: ['动画', '幻想', '艺术', '短片'],
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
    title: '奇妙森林冒险',
    description: '跟随我们的镜头进入神秘的森林世界，探索大自然的奇妙与和谐。',
    coverUrl: COVER_IMAGES[2],
    videoUrl: VIDEO_SOURCES[2],
    duration: 485, // 8:05
    views: 2640000,
    likes: 124000,
    favorites: 32000,
    comments: 7800,
    createdAt: '2025-03-25T10:20:00Z',
    author: AUTHORS[2],
    tags: ['自然', '森林', '冒险', '生态'],
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
    title: '梦境大象',
    description: '这部动画片讲述了大象在梦境世界中的奇幻冒险，充满想象力与创意。',
    coverUrl: COVER_IMAGES[3],
    videoUrl: VIDEO_SOURCES[3],
    duration: 312, // 5:12
    views: 1850000,
    likes: 105000,
    favorites: 28500,
    comments: 5400,
    createdAt: '2025-03-20T16:15:00Z',
    author: AUTHORS[1],
    tags: ['动画', '梦境', '想象', '奇幻'],
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
    title: '城市生活 - 现代都市景观',
    description: '现代都市的快节奏生活，高楼大厦与繁华街道，城市生活的方方面面。',
    coverUrl: COVER_IMAGES[4],
    videoUrl: VIDEO_SOURCES[4],
    duration: 428, // 7:08
    views: 2120000,
    likes: 88000,
    favorites: 23000,
    comments: 4800,
    createdAt: '2025-03-15T09:30:00Z',
    author: AUTHORS[2],
    tags: ['城市', '现代', '生活', '都市'],
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
    title: '大自然的奥秘 - 野生动物探索',
    description: '自然界中野生动物的生存智慧与适应能力，令人惊叹的生态系统平衡。',
    coverUrl: COVER_IMAGES[5],
    videoUrl: VIDEO_SOURCES[5],
    duration: 542, // 9:02
    views: 3080000,
    likes: 158000,
    favorites: 42000,
    comments: 9100,
    createdAt: '2025-03-10T11:45:00Z',
    author: AUTHORS[0],
    tags: ['自然', '动物', '野生', '生态'],
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
  {
    id: 'video-7',
    title: '科技与未来 - 创新纪录片',
    description: '探索最新科技发展与未来趋势，了解创新如何改变我们的生活方式。',
    coverUrl: COVER_IMAGES[0],
    videoUrl: VIDEO_SOURCES[0],
    duration: 495, // 8:15
    views: 2740000,
    likes: 132000,
    favorites: 36000,
    comments: 7500,
    createdAt: '2025-03-05T14:00:00Z',
    author: AUTHORS[1],
    tags: ['科技', '未来', '创新', '发展'],
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
    ],
    subtitles: [],
  },
  {
    id: 'video-8',
    title: '音乐视觉盛宴',
    description: '音乐与视觉的完美结合，带来沉浸式的艺术体验。',
    coverUrl: COVER_IMAGES[1],
    videoUrl: VIDEO_SOURCES[1],
    duration: 368, // 6:08
    views: 1920000,
    likes: 114000,
    favorites: 31000,
    comments: 6200,
    createdAt: '2025-02-28T16:30:00Z',
    author: AUTHORS[2],
    tags: ['音乐', '艺术', '视觉', '演出'],
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
    id: 'video-9',
    title: '旅行与文化',
    description: '探索不同文化和地域的风土人情，领略世界多样性的魅力。',
    coverUrl: COVER_IMAGES[2],
    videoUrl: VIDEO_SOURCES[2],
    duration: 512, // 8:32
    views: 2580000,
    likes: 128000,
    favorites: 34000,
    comments: 8000,
    createdAt: '2025-02-25T10:15:00Z',
    author: AUTHORS[0],
    tags: ['旅行', '文化', '探索', '地理'],
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
    id: 'video-10',
    title: '创意短片集锦',
    description: '汇集了最具创意和新颖性的短片作品，展现创作者的无限想象力。',
    coverUrl: COVER_IMAGES[3],
    videoUrl: VIDEO_SOURCES[3],
    duration: 438, // 7:18
    views: 1650000,
    likes: 92000,
    favorites: 25000,
    comments: 5100,
    createdAt: '2025-02-20T15:45:00Z',
    author: AUTHORS[1],
    tags: ['创意', '短片', '艺术', '多媒体'],
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
    id: 'video-11',
    title: '游戏开发教程',
    description: '从零开始学习游戏开发，包括引擎选择、编程基础和游戏设计原则。',
    coverUrl: COVER_IMAGES[4],
    videoUrl: VIDEO_SOURCES[4],
    duration: 620, // 10:20
    views: 1840000,
    likes: 108000,
    favorites: 42000,
    comments: 7200,
    createdAt: '2025-02-15T13:00:00Z',
    author: AUTHORS[2],
    tags: ['游戏', '教育', '编程', '设计'],
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
    id: 'video-12',
    title: '体育精神 - 不屈的意志',
    description: '通过体育精神展现人类不屈的意志和克服困难的勇气。',
    coverUrl: COVER_IMAGES[5],
    videoUrl: VIDEO_SOURCES[5],
    duration: 475, // 7:55
    views: 2240000,
    likes: 118000,
    favorites: 29000,
    comments: 6800,
    createdAt: '2025-02-10T09:30:00Z',
    author: AUTHORS[0],
    tags: ['体育', '意志', '励志', '精神'],
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
