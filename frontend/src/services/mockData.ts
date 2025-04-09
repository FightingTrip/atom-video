/**
 * 模拟数据服务
 *
 * 这个文件提供模拟数据，用于在开发环境中测试UI组件，不依赖于后端API
 * 在使用 pnpm dev:mock 命令启动时会自动使用这些模拟数据
 */

import type { Video, Comment, User, VideoInteraction } from '@/types';

/**
 * 获取模拟视频数据
 */
export const getMockVideo = (videoId: string): Video => {
  // 更新为更可靠的视频URL列表
  const sampleVideoUrls = [
    'https://vjs.zencdn.net/v/oceans.mp4', // 海洋视频
    'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', // Sintel预告片
    'https://media.w3.org/2010/05/bunny/movie.mp4', // Big Buck Bunny
    'https://vjs.zencdn.net/v/elephantsdream.mp4', // Elephants Dream
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  ];

  // 基于videoId确定一个稳定的视频URL（相同ID总是返回相同视频）
  const videoIndex = parseInt(videoId.replace(/\D/g, '0')) % sampleVideoUrls.length;
  const selectedVideoUrl = sampleVideoUrls[videoIndex];

  const videoTitles = [
    '海洋奇观 - 深海探索纪录片',
    '幻境 - 动画短片',
    '奇妙森林冒险',
    '梦境大象',
    '城市生活 - 现代都市景观',
    '大自然的奥秘 - 野生动物探索',
    '科技与未来 - 创新纪录片',
  ];

  const videoDesc = [
    '这是一段关于海洋生物和深海探索的纪录片片段，展示了海洋的神秘与美丽。',
    '这是一部获奖动画短片的预告，讲述了一个关于梦想与现实的奇幻故事。',
    '跟随我们的镜头进入神秘的森林世界，探索大自然的奇妙与和谐。',
    '这部动画片讲述了大象在梦境世界中的奇幻冒险，充满想象力与创意。',
    '现代都市的快节奏生活，高楼大厦与繁华街道，城市生活的方方面面。',
    '自然界中野生动物的生存智慧与适应能力，令人惊叹的生态系统平衡。',
    '探索最新科技发展与未来趋势，了解创新如何改变我们的生活方式。',
  ];

  // 根据视频索引匹配标题和描述
  const title = videoTitles[videoIndex] || '测试视频 - ' + videoId;
  const description = videoDesc[videoIndex] || '这是一个模拟视频，用于测试视频播放界面效果。';

  // 根据视频URL生成封面图
  const thumbnail = `https://picsum.photos/seed/${videoId}/640/360`;

  return {
    id: videoId,
    title,
    description,
    thumbnail,
    coverUrl: thumbnail,
    videoUrl: selectedVideoUrl,
    // 为每个视频提供多个清晰度选项
    sources: [
      {
        url: selectedVideoUrl,
        type: 'video/mp4',
        label: '720p',
        size: 720,
      },
      {
        url: selectedVideoUrl,
        type: 'video/mp4',
        label: '480p',
        size: 480,
      },
      {
        url: selectedVideoUrl,
        type: 'video/mp4',
        label: '360p',
        size: 360,
      },
    ],
    duration: 120 + Math.floor(Math.random() * 600), // 2-12分钟
    views: 1000 + Math.floor(Math.random() * 1000000),
    likes: 100 + Math.floor(Math.random() * 10000),
    favorites: 50 + Math.floor(Math.random() * 5000),
    comments: 10 + Math.floor(Math.random() * 1000),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000).toISOString(), // 0-90天前
    tags: ['测试', '开发', 'UI设计', '视频播放'],
    subtitles: [], // 空字幕列表
    author: {
      id: 'author-' + videoId,
      nickname: '测试用户-' + videoId,
      avatar: `https://i.pravatar.cc/150?u=${videoId}`,
      verified: true,
      followersCount: 1200 + Math.floor(Math.random() * 100000),
      followingCount: 45 + Math.floor(Math.random() * 1000),
      description:
        '这是一个测试用户账号，用于展示视频详情页的作者信息区域。这位创作者专注于技术教程和编程视频。',
    },
    // 添加可能需要的其他字段
    url: selectedVideoUrl, // 兼容某些组件可能使用的url字段
    previewUrl: thumbnail, // 视频预览
    downloadUrl: selectedVideoUrl, // 下载链接
  };
};

/**
 * 获取模拟评论数据
 */
export const getMockComments = (videoId: string): Comment[] => {
  return Array(5)
    .fill(0)
    .map((_, i) => ({
      id: `comment-${i}`,
      content: `这是测试评论 ${i + 1}，用于展示评论区域的样式和布局效果。评论可以包含用户反馈、问题和讨论。`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      likes: Math.floor(Math.random() * 50),
      author: {
        id: `user-${i}`,
        nickname: `评论用户 ${i + 1}`,
        avatar: `https://i.pravatar.cc/150?u=${i}`,
      },
    }));
};

/**
 * 获取模拟视频互动状态
 */
export const getMockVideoInteraction = (videoId: string): VideoInteraction => {
  // 随机生成互动状态
  return {
    isLiked: Math.random() > 0.5,
    isFavorited: Math.random() > 0.7,
    isSubscribed: Math.random() > 0.3,
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
  // 更可靠的视频源列表
  const videoSources = [
    'https://vjs.zencdn.net/v/oceans.mp4',
    'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    'https://media.w3.org/2010/05/bunny/movie.mp4',
    'https://vjs.zencdn.net/v/elephantsdream.mp4',
  ];

  // 有趣的标题列表
  const titles = [
    '海洋生物探索',
    '数字艺术展示',
    '自然奇观系列',
    '创意动画短片',
    '城市风光记录',
    '科技发展纪实',
    '动物世界探秘',
    '音乐视觉盛宴',
    '旅行与文化',
    '创意短片集锦',
  ];

  return Array(count)
    .fill(0)
    .map((_, i) => {
      const videoSource = videoSources[i % videoSources.length];
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      return {
        id: `rec-${i}`,
        title: `${randomTitle} ${i + 1}`,
        description: '探索创意与技术的无限可能，发现视觉艺术的独特魅力。',
        thumbnail: `https://picsum.photos/seed/rec${i}/480/270`,
        duration: 30 + Math.floor(Math.random() * 300),
        views: 100 + Math.floor(Math.random() * 10000),
        likes: 10 + Math.floor(Math.random() * 1000),
        favorites: 5 + Math.floor(Math.random() * 500),
        comments: 2 + Math.floor(Math.random() * 100),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
        tags: ['推荐', '相关视频'],
        videoUrl: videoSource,
        coverUrl: `https://picsum.photos/seed/rec${i}/480/270`,
        sources: [
          {
            url: videoSource,
            type: 'video/mp4',
            label: '720p',
            size: 720,
          },
          {
            url: videoSource,
            type: 'video/mp4',
            label: '480p',
            size: 480,
          },
        ],
        author: {
          id: `author-rec-${i}`,
          nickname: `创作者 ${i + 1}`,
          avatar: `https://i.pravatar.cc/150?u=auth${i}`,
          verified: Math.random() > 0.7,
        },
      };
    });
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
