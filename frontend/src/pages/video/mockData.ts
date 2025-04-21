/**
 * @file mockData.ts
 * @description 临时的模拟数据，用于VideoDetailPage
 */

export interface VideoAuthor {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  verified?: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  videoUrl: string;
  duration?: number;
  views: number;
  likes?: number;
  favorites?: number;
  comments?: number;
  createdAt: string;
  author: VideoAuthor;
  tags?: string[];
}

const mockVideo: Video = {
  id: 'v1',
  title: '视频标题示例',
  description: '这是一个视频描述示例，用于展示视频详情页面的布局和样式。',
  coverUrl: 'https://picsum.photos/800/450',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  duration: 596,
  views: 12345,
  likes: 678,
  favorites: 123,
  comments: 45,
  createdAt: new Date().toISOString(),
  author: {
    id: '1',
    username: 'demo_user',
    nickname: '示例用户',
    avatar: 'https://i.pravatar.cc/150?u=1',
    verified: true,
  },
  tags: ['示例', '视频', '测试'],
};

export function getVideoById(videoId: string): Video | undefined {
  console.log('获取视频ID:', videoId);
  // 始终返回相同的模拟数据，忽略videoId
  return mockVideo;
}
