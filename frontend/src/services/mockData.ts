import { Video, Comment, VideoInteraction } from '@/types';
import { mockVideos } from '@/mock/video';

/**
 * 获取模拟视频数据
 * @param id 视频ID
 */
export function getMockVideo(id: string): Video {
  // 优先使用ID查找
  const video = mockVideos.find(v => v.id === id);

  // 如果没有找到，返回第一个视频
  if (video) {
    return { ...video };
  }

  // 假设生成的视频
  return {
    ...mockVideos[0],
    id,
    title: `视频 ${id}`,
  };
}

/**
 * 获取模拟评论数据
 * @param videoId 视频ID
 */
export function getMockComments(videoId: string): Comment[] {
  // 生成10条模拟评论
  return Array(10)
    .fill(0)
    .map((_, index) => ({
      id: `comment-${videoId}-${index}`,
      content: `这是对视频 ${videoId} 的评论 ${index + 1}。这是一个模拟评论，用于测试评论功能。`,
      createdAt: new Date(Date.now() - index * 3600000).toISOString(),
      likes: Math.floor(Math.random() * 100),
      author: {
        id: `user-${index}`,
        nickname: `用户${index + 1}`,
        avatar: `https://i.pravatar.cc/150?u=${videoId}-${index}`,
      },
      replyCount: Math.floor(Math.random() * 5),
    }));
}

/**
 * 获取模拟视频互动数据
 * @param videoId 视频ID
 */
export function getMockVideoInteraction(videoId: string): VideoInteraction {
  return {
    isLiked: false,
    isFavorited: false,
    isSubscribed: false,
  };
}

/**
 * 获取模拟推荐视频
 * @param videoId 当前视频ID
 * @param count 推荐数量
 */
export function getMockRecommendedVideos(videoId: string, count: number = 5): Video[] {
  // 排除当前视频
  const filteredVideos = mockVideos.filter(v => v.id !== videoId);

  // 如果视频数量不够，就重复使用
  let recommendedVideos = [];
  while (recommendedVideos.length < count) {
    recommendedVideos = recommendedVideos.concat(filteredVideos);
  }

  // 截取需要的数量
  return recommendedVideos.slice(0, count).map(video => ({ ...video }));
}
