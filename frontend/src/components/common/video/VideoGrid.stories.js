import VideoGrid from './VideoGrid.vue';

export default {
  title: 'Common/Video/VideoGrid',
  component: VideoGrid,
  tags: ['autodocs'],
  argTypes: {
    videos: { control: 'object' },
    loading: { control: 'boolean' },
    showAuthor: { control: 'boolean' },
    emptyText: { control: 'text' },
  },
};

// 生成测试视频数据
const generateVideos = (count, startIndex = 0) => {
  return Array(count).fill(0).map((_, index) => ({
    id: `video-${startIndex + index}`,
    title: `示例视频 ${startIndex + index + 1}`,
    thumbnailUrl: `https://picsum.photos/seed/video${startIndex + index}/400/225`,
    duration: Math.floor(Math.random() * 600),
    views: Math.floor(Math.random() * 100000),
    publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      id: `author-${(startIndex + index) % 5}`,
      name: `作者 ${(startIndex + index) % 5}`,
      avatar: `https://i.pravatar.cc/150?u=author${(startIndex + index) % 5}`,
    }
  }));
};

// 默认故事 - 显示多个视频
export const Default = {
  args: {
    videos: generateVideos(8),
    loading: false,
    showAuthor: true,
    emptyText: '暂无视频',
  },
};

// 加载中状态
export const Loading = {
  args: {
    videos: [],
    loading: true,
    showAuthor: true,
    emptyText: '暂无视频',
  },
};

// 空状态
export const Empty = {
  args: {
    videos: [],
    loading: false,
    showAuthor: true,
    emptyText: '暂无视频',
  },
};

// 不显示作者信息
export const WithoutAuthor = {
  args: {
    videos: generateVideos(4),
    loading: false,
    showAuthor: false,
    emptyText: '暂无视频',
  },
};

// 自定义空状态文本
export const CustomEmptyText = {
  args: {
    videos: [],
    loading: false,
    showAuthor: true,
    emptyText: '没有找到符合条件的视频',
  },
}; 