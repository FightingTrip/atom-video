import VideoCard from './VideoCard.vue';

export default {
  title: 'Common/Video/VideoCard',
  component: VideoCard,
  tags: ['autodocs'],
  argTypes: {
    video: { control: 'object' },
    showAuthor: { control: 'boolean' },
  },
};

// 创建视频对象模板
const videoTemplate = {
  id: 'video-1',
  title: '示例视频标题：如何使用Storybook构建组件库',
  thumbnailUrl: 'https://picsum.photos/seed/storybook/400/225',
  duration: 360, // 6分钟
  views: 12500,
  publishedAt: new Date().toISOString(),
  author: {
    id: 'author-1',
    name: '示例作者',
    avatar: 'https://i.pravatar.cc/150?u=example-author',
  }
};

// 默认故事
export const Default = {
  args: {
    video: videoTemplate,
    showAuthor: true,
  },
};

// 无作者信息故事
export const WithoutAuthor = {
  args: {
    video: videoTemplate,
    showAuthor: false,
  },
};

// 长标题故事
export const LongTitle = {
  args: {
    video: {
      ...videoTemplate,
      title: '这是一个非常长的视频标题，用于测试标题文本溢出时的显示效果。这是一个非常长的视频标题，用于测试标题文本溢出时的显示效果。'
    },
    showAuthor: true,
  },
};

// 高播放量故事
export const HighViewCount = {
  args: {
    video: {
      ...videoTemplate,
      views: 1250000,
    },
    showAuthor: true,
  },
}; 