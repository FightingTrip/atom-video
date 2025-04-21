/**
 * 模拟数据服务
 *
 * 这个文件提供模拟数据，用于在开发环境中测试UI组件，不依赖于后端API
 * 在使用 pnpm dev:mock 命令启动时会自动使用这些模拟数据
 */

import type { Video, Comment, User, VideoInteraction } from '@/types';

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

// 统一的视频标题列表
const VIDEO_TITLES = [
  '海洋奇观 - 深海探索纪录片',
  '幻境 - 动画短片',
  '奇妙森林冒险',
  '梦境大象',
  '城市生活 - 现代都市景观',
  '大自然的奥秘 - 野生动物探索',
  '科技与未来 - 创新纪录片',
  '音乐视觉盛宴',
  '旅行与文化',
  '创意短片集锦',
];

// 统一的视频描述列表
const VIDEO_DESCRIPTIONS = [
  '这是一段关于海洋生物和深海探索的纪录片片段，展示了海洋的神秘与美丽。',
  '这是一部获奖动画短片的预告，讲述了一个关于梦想与现实的奇幻故事。',
  '跟随我们的镜头进入神秘的森林世界，探索大自然的奇妙与和谐。',
  '这部动画片讲述了大象在梦境世界中的奇幻冒险，充满想象力与创意。',
  '现代都市的快节奏生活，高楼大厦与繁华街道，城市生活的方方面面。',
  '自然界中野生动物的生存智慧与适应能力，令人惊叹的生态系统平衡。',
  '探索最新科技发展与未来趋势，了解创新如何改变我们的生活方式。',
  '音乐与视觉的完美结合，带来沉浸式的艺术体验。',
  '探索不同文化和地域的风土人情，领略世界多样性的魅力。',
  '汇集了最具创意和新颖性的短片作品，展现创作者的无限想象力。',
];

// 统一的视频标签列表
const VIDEO_TAGS = [
  ['自然', '科学', '海洋', '探索'],
  ['动画', '幻想', '艺术', '短片'],
  ['自然', '森林', '冒险', '生态'],
  ['动画', '梦境', '想象', '奇幻'],
  ['城市', '现代', '生活', '都市'],
  ['自然', '动物', '野生', '生态'],
  ['科技', '未来', '创新', '发展'],
  ['音乐', '艺术', '视觉', '演出'],
  ['旅行', '文化', '探索', '地理'],
  ['创意', '短片', '艺术', '多媒体'],
];

// 统一的作者数据
const AUTHORS = [
  {
    id: 'author-1',
    nickname: '创作者 0',
    avatar: 'https://i.pravatar.cc/150?u=auth0',
    verified: true,
    followersCount: 125000,
    followingCount: 86,
    description: '专注于自然纪录片创作，探索地球上的奇妙生命。',
  },
  {
    id: 'author-2',
    nickname: '创作者 1',
    avatar: 'https://i.pravatar.cc/150?u=auth1',
    verified: true,
    followersCount: 85000,
    followingCount: 124,
    description: '动画创作者，致力于通过视觉艺术讲述引人入胜的故事。',
  },
  {
    id: 'author-3',
    nickname: '创作者 2',
    avatar: 'https://i.pravatar.cc/150?u=auth2',
    verified: true,
    followersCount: 56000,
    followingCount: 67,
    description: '旅行爱好者，记录世界各地的文化和美景。',
  },
];

/**
 * 生成模拟视频数据列表
 * @param count 要生成的视频数量
 * @param startIndex 起始索引，用于生成不同ID
 * @param prefix 标题前缀，如"全部视频标题"或"推荐视频"
 * @returns 统一格式的视频数据数组
 */
export const generateMockVideos = (
  count: number,
  startIndex: number = 0,
  prefix: string = '视频'
): Video[] => {
  return Array(count)
    .fill(0)
    .map((_, i) => {
      const index = startIndex + i;
      const videoIndex = index % VIDEO_SOURCES.length;
      const titleIndex = index % VIDEO_TITLES.length;
      const authorIndex = index % AUTHORS.length;

      // 创建统一的视频格式
      const video: Video = {
        id: `video-${index}`,
        title: `${prefix} ${index + 1}`,
        description: VIDEO_DESCRIPTIONS[titleIndex],
        thumbnail: COVER_IMAGES[index % COVER_IMAGES.length],
        coverUrl: COVER_IMAGES[index % COVER_IMAGES.length],
        videoUrl: VIDEO_SOURCES[videoIndex],
        sources: [
          {
            url: VIDEO_SOURCES[videoIndex],
            type: 'video/mp4',
            label: '720p',
            size: 720,
          },
          {
            url: VIDEO_SOURCES[videoIndex],
            type: 'video/mp4',
            label: '480p',
            size: 480,
          },
          {
            url: VIDEO_SOURCES[videoIndex],
            type: 'video/mp4',
            label: '360p',
            size: 360,
          },
        ],
        duration: 60 + Math.floor(Math.random() * 540), // 1-10分钟
        views: Math.floor(Math.random() * 9 + 1) * 1000000, // 1M-10M 次观看
        likes: Math.floor(Math.random() * 5 + 1) * 10000, // 10K-50K 点赞
        favorites: Math.floor(Math.random() * 3 + 1) * 5000, // 5K-15K 收藏
        comments: Math.floor(Math.random() * 5 + 1) * 1000, // 1K-5K 评论
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(), // 0-30天前
        tags: VIDEO_TAGS[index % VIDEO_TAGS.length],
        author: AUTHORS[authorIndex],
        url: VIDEO_SOURCES[videoIndex], // 兼容某些组件可能使用的url字段
        previewUrl: VIDEO_SOURCES[videoIndex], // 视频预览
        downloadUrl: VIDEO_SOURCES[videoIndex], // 下载链接
      };

      return video;
    });
};

/**
 * 获取模拟首页视频列表
 * @returns 首页视频列表
 */
export const getMockHomeVideos = (): Video[] => {
  return [...generateMockVideos(6, 0, '全部视频标题 1'), ...generateMockVideos(6, 6, '推荐视频')];
};

/**
 * 获取模拟视频数据
 */
export const getMockVideo = (videoId: string): Video => {
  // 从ID中提取索引
  const idMatch = videoId.match(/\d+/);
  const index = idMatch ? parseInt(idMatch[0]) : 0;

  // 从预定义列表中获取数据
  const videoIndex = index % VIDEO_SOURCES.length;
  const titleIndex = index % VIDEO_TITLES.length;
  const authorIndex = index % AUTHORS.length;

  return {
    id: videoId,
    title: VIDEO_TITLES[titleIndex],
    description: VIDEO_DESCRIPTIONS[titleIndex],
    thumbnail: COVER_IMAGES[index % COVER_IMAGES.length],
    coverUrl: COVER_IMAGES[index % COVER_IMAGES.length],
    videoUrl: VIDEO_SOURCES[videoIndex],
    sources: [
      {
        url: VIDEO_SOURCES[videoIndex],
        type: 'video/mp4',
        label: '720p',
        size: 720,
      },
      {
        url: VIDEO_SOURCES[videoIndex],
        type: 'video/mp4',
        label: '480p',
        size: 480,
      },
      {
        url: VIDEO_SOURCES[videoIndex],
        type: 'video/mp4',
        label: '360p',
        size: 360,
      },
    ],
    duration: 60 + Math.floor(Math.random() * 540), // 1-10分钟
    views: Math.floor(Math.random() * 9 + 1) * 1000000, // 1M-10M 次观看
    likes: Math.floor(Math.random() * 5 + 1) * 10000, // 10K-50K 点赞
    favorites: Math.floor(Math.random() * 3 + 1) * 5000, // 5K-15K 收藏
    comments: Math.floor(Math.random() * 5 + 1) * 1000, // 1K-5K 评论
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(), // 0-30天前
    tags: VIDEO_TAGS[titleIndex],
    author: AUTHORS[authorIndex],
    url: VIDEO_SOURCES[videoIndex], // 兼容某些组件可能使用的url字段
    previewUrl: VIDEO_SOURCES[videoIndex], // 视频预览
    downloadUrl: VIDEO_SOURCES[videoIndex], // 下载链接
  };
};

/**
 * 获取模拟评论数据
 */
export const getMockComments = (videoId: string): Comment[] => {
  return Array(5)
    .fill(0)
    .map((_, i) => ({
      id: `comment-${videoId}-${i}`,
      content: `这是测试评论 ${i + 1}，用于展示评论区域的样式和布局效果。评论可以包含用户反馈、问题和讨论。`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      likes: Math.floor(Math.random() * 50),
      author: {
        id: `user-${i}`,
        nickname: `评论用户 ${i + 1}`,
        avatar: `https://i.pravatar.cc/150?u=comment${i}`,
      },
    }));
};

/**
 * 获取模拟视频互动状态
 */
export const getMockVideoInteraction = (videoId: string): VideoInteraction => {
  // 根据videoId生成一致的互动状态
  const idNumber = parseInt(videoId.replace(/\D/g, '0')) || 0;

  return {
    isLiked: idNumber % 3 === 0, // 每3个视频有1个被点赞
    isFavorited: idNumber % 4 === 0, // 每4个视频有1个被收藏
    isSubscribed: idNumber % 2 === 0, // 每2个视频有1个作者被关注
  };
};

/**
 * 获取模拟用户数据
 */
export const getMockUser = (): User => {
  return {
    id: 'current-user',
    nickname: '当前用户',
    avatar: 'https://i.pravatar.cc/150?u=current',
    email: 'user@example.com',
    isVerified: true,
  };
};

/**
 * 获取模拟推荐视频列表
 */
export const getMockRecommendedVideos = (videoId: string, count: number = 5): Video[] => {
  // 提取videoId中的数字作为种子
  const seed = parseInt(videoId.replace(/\D/g, '0')) || 0;

  // 使用种子来生成视频，确保相同videoId总是返回相同推荐
  return generateMockVideos(count, seed + 10, '推荐视频');
};

/**
 * 生成模拟响应
 */
export const createMockResponse = <T>(data: T, success: boolean = true, message: string = '') => {
  return {
    success,
    data,
    message,
  };
};

/**
 * 添加模拟延迟
 */
export const mockDelay = async (ms: number = Math.floor(Math.random() * 300) + 100) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
