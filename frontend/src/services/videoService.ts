/**
 * @file videoService.ts
 * @description 视频服务 - 负责处理与视频相关的操作
 */

import type {
  User,
  Video,
  Comment,
  VideoInteraction,
  VideoProgress,
  VideoSearchParams,
  TrendingItem,
} from '@/types';

// 用于存储用户观看进度
const userVideoProgress: Record<string, Record<string, VideoProgress>> = {};

// 视频类别列表
const videoCategories = ['全部', '音乐', '游戏', '教育', '娱乐', '体育', '科技', '生活'];

// 模拟延迟函数
const mockDelay = async (ms: number = Math.floor(Math.random() * 300) + 100) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 引入视频数据
import { mockVideos } from '@/mock/video';

// 生成模拟视频数据
const generateMockVideos = (
  count: number = 10,
  startIndex: number = 0,
  prefix: string = '视频'
): Video[] => {
  return mockVideos.slice(0, count).map((video, i) => {
    const index = startIndex + i;
    return {
      ...video,
      id: `video-${index}`,
      title: `${prefix} ${index + 1}`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(),
    };
  });
};

/**
 * 获取视频列表
 * @param limit 限制数量
 * @param params 搜索参数
 */
export async function getVideos(
  limit?: number,
  params?: VideoSearchParams
): Promise<{ videos: Video[]; hasMore: boolean }> {
  try {
    // 模拟API请求延迟
    await mockDelay(300);

    // 生成模拟视频数据
    let videos = generateMockVideos(limit || 12, 0, params?.keyword || '全部视频标题');

    // 如果有搜索参数，进行过滤
    if (params) {
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        videos = videos.filter(
          video =>
            video.title.toLowerCase().includes(keyword) ||
            video.description.toLowerCase().includes(keyword)
        );
      }

      if (params.tags?.length) {
        // 如果是"全部"类别，不过滤
        if (!(params.tags.length === 1 && params.tags[0] === '全部')) {
          videos = videos.filter(video => video.tags.some(tag => params.tags?.includes(tag)));
        }
      }

      // 根据排序参数排序
      if (params.sort) {
        switch (params.sort) {
          case 'latest':
            videos.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            break;
          case 'popular':
            videos.sort((a, b) => b.views - a.views);
            break;
          case 'relevant':
            // 相关性排序通常由后端实现，这里简单模拟
            break;
        }
      }
    }

    return {
      videos,
      hasMore: videos.length >= (limit || 12), // 如果返回数量等于或超过请求数量，则可能有更多
    };
  } catch (error) {
    console.error('获取视频列表失败:', error);
    return { videos: [], hasMore: false };
  }
}

/**
 * 获取推荐视频
 * @param excludeVideoId 要排除的视频ID
 * @param limit 限制数量
 */
export async function getRecommendedVideos(
  excludeVideoId?: string,
  limit: number = 5
): Promise<Video[]> {
  try {
    // 模拟API请求延迟
    await mockDelay(300);

    // 提取videoId中的数字作为种子
    const seed = excludeVideoId ? parseInt(excludeVideoId.replace(/\D/g, '0')) || 0 : 0;

    // 使用种子来生成视频，确保相同videoId总是返回相同推荐
    return generateMockVideos(limit, seed + 10, '推荐视频');
  } catch (error) {
    console.error('获取推荐视频失败:', error);
    return [];
  }
}

/**
 * 根据ID获取视频详情
 * @param videoId 视频ID
 * @param userId 用户ID，可选
 */
export async function getVideoById(videoId: string, userId?: string): Promise<Video | null> {
  try {
    // 模拟API请求延迟
    await mockDelay(200);

    // 查找匹配的视频
    const video = mockVideos.find(v => v.id === videoId) || mockVideos[0];

    // 如果提供了用户ID，增加播放量并添加到历史
    if (userId) {
      // 模拟播放量增加
      addToWatchHistory(userId, videoId);
    }

    return video;
  } catch (error) {
    console.error(`获取视频 ${videoId} 失败:`, error);
    return null;
  }
}

/**
 * 获取视频评论
 * @param videoId 视频ID
 * @param page 页码
 * @param limit 每页评论数
 */
export async function getVideoComments(
  videoId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ comments: Comment[]; hasMore: boolean }> {
  try {
    // 模拟API请求延迟
    await mockDelay(400);

    // 生成模拟评论
    const comments: Comment[] = Array(15)
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

    // 计算分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = comments.slice(startIndex, endIndex);

    return {
      comments: paginatedComments,
      hasMore: endIndex < comments.length,
    };
  } catch (error) {
    console.error(`获取视频 ${videoId} 评论失败:`, error);
    return { comments: [], hasMore: false };
  }
}

/**
 * 添加评论
 * @param videoId 视频ID
 * @param userId 用户ID
 * @param content 评论内容
 */
export async function addComment(
  videoId: string,
  userId: string,
  content: string
): Promise<Comment | null> {
  try {
    // 模拟API请求延迟
    await mockDelay(500);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // 创建新评论
    const newComment: Comment = {
      id: `c${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      author: {
        id: userId,
        nickname: user.nickname || '用户',
        avatar: user.avatar || `https://i.pravatar.cc/150?u=${userId}`,
      },
    };

    return newComment;
  } catch (error) {
    console.error('添加评论失败:', error);
    return null;
  }
}

/**
 * 获取用户与视频的互动状态
 * @param userId 用户ID
 * @param videoId 视频ID
 */
export function getVideoInteraction(userId: string, videoId: string): VideoInteraction {
  // 根据videoId生成一致的互动状态
  const idNumber = parseInt(videoId.replace(/\D/g, '0')) || 0;

  return {
    isLiked: idNumber % 3 === 0, // 每3个视频有1个被点赞
    isFavorited: idNumber % 4 === 0, // 每4个视频有1个被收藏
    isSubscribed: idNumber % 2 === 0, // 每2个视频有1个作者被关注
  };
}

/**
 * 点赞/取消点赞视频
 * @param userId 用户ID
 * @param videoId 视频ID
 * @param isLiked 是否点赞
 */
export async function likeVideo(
  userId: string,
  videoId: string,
  isLiked: boolean
): Promise<boolean> {
  try {
    // 模拟API请求延迟
    await mockDelay(300);

    // 模拟更新用户互动
    return true;
  } catch (error) {
    console.error('点赞视频失败:', error);
    return false;
  }
}

/**
 * 收藏/取消收藏视频
 * @param userId 用户ID
 * @param videoId 视频ID
 * @param isFavorited 是否收藏
 */
export async function favoriteVideo(
  userId: string,
  videoId: string,
  isFavorited: boolean
): Promise<boolean> {
  try {
    // 模拟API请求延迟
    await mockDelay(300);

    // 模拟更新用户互动
    return true;
  } catch (error) {
    console.error('收藏视频失败:', error);
    return false;
  }
}

/**
 * 订阅/取消订阅创作者
 * @param userId 用户ID
 * @param creatorId 创作者ID
 * @param isSubscribed 是否订阅
 */
export async function subscribeToCreator(
  userId: string,
  creatorId: string,
  isSubscribed: boolean
): Promise<boolean> {
  try {
    // 模拟API请求延迟
    await mockDelay(300);

    // 在实际应用中，这里应该调用API更新订阅状态
    // 这里我们模拟成功
    return true;
  } catch (error) {
    console.error('订阅创作者失败:', error);
    return false;
  }
}

/**
 * 判断用户是否已订阅创作者
 * @param userId 用户ID
 * @param creatorId 创作者ID
 */
export function isUserSubscribed(userId: string, creatorId: string): boolean {
  // 模拟订阅状态，这里简单返回固定值
  // 在实际应用中，应该从服务器获取真实状态
  return Math.random() > 0.5;
}

/**
 * 保存视频播放进度
 * @param userId 用户ID
 * @param videoId 视频ID
 * @param currentTime 当前播放时间，单位秒
 * @param duration 视频总时长，单位秒
 */
export function savePlaybackProgress(
  userId: string,
  videoId: string,
  currentTime: number,
  duration: number
): void {
  // 初始化用户进度记录
  if (!userVideoProgress[userId]) {
    userVideoProgress[userId] = {};
  }

  // 保存进度
  userVideoProgress[userId][videoId] = {
    videoId,
    currentTime,
    duration,
    lastUpdated: new Date().toISOString(),
    percentage: Math.floor((currentTime / duration) * 100),
  };

  // 添加到观看历史
  addToWatchHistory(userId, videoId);
}

/**
 * 获取视频播放进度
 * @param userId 用户ID
 * @param videoId 视频ID
 */
export function getPlaybackProgress(userId: string, videoId: string): VideoProgress | null {
  return userVideoProgress[userId]?.[videoId] || null;
}

/**
 * 获取用户观看历史
 * @param userId 用户ID
 * @param limit 限制数量
 */
export async function getUserWatchHistory(userId: string, limit?: number): Promise<Video[]> {
  try {
    // 模拟API请求延迟
    await mockDelay(300);

    // 从localStorage获取观看历史
    const history = getWatchHistory(userId);

    // 获取详细视频信息
    const videos: Video[] = [];

    // 限制获取的数量
    const limitedHistory = limit ? history.slice(0, limit) : history;

    // 模拟获取视频详情
    for (const videoId of limitedHistory) {
      const video = await getVideoById(videoId);
      if (video) videos.push(video);
    }

    return videos;
  } catch (error) {
    console.error('获取观看历史失败:', error);
    return [];
  }
}

/**
 * 获取视频类别列表
 */
export async function getVideoCategories(): Promise<string[]> {
  // 模拟API请求延迟
  await mockDelay(200);

  return videoCategories;
}

/**
 * 根据类别获取视频
 * @param category 类别
 * @param limit 限制数量
 */
export async function getVideosByCategory(
  category: string,
  limit: number = 12
): Promise<{ videos: Video[]; hasMore: boolean }> {
  return getVideos(limit, { tags: category === '全部' ? [] : [category] });
}

/**
 * 获取热门视频
 * @param limit 限制数量
 */
export async function getTrendingVideos(limit: number = 10): Promise<TrendingItem[]> {
  // 模拟API请求延迟
  await mockDelay(400);

  // 生成热门视频数据
  const videos = generateMockVideos(limit, 0, '热门视频');

  // 按播放量排序
  videos.sort((a, b) => b.views - a.views);

  // 转换为TrendingItem格式
  return videos.map(video => ({
    id: video.id,
    title: video.title,
    views: video.views,
    likes: video.likes,
    author: {
      id: video.author.id,
      nickname: video.author.nickname,
      avatar: video.author.avatar,
    },
  }));
}

/**
 * 获取观看历史
 * @param userId 用户ID
 */
function getWatchHistory(userId: string): string[] {
  try {
    const historyJson = localStorage.getItem(`watch_history_${userId}`);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('获取观看历史失败:', error);
    return [];
  }
}

/**
 * 添加视频到观看历史
 * @param userId 用户ID
 * @param videoId 视频ID
 */
function addToWatchHistory(userId: string, videoId: string): void {
  try {
    // 获取当前历史
    let history = getWatchHistory(userId);

    // 如果已存在，先移除再添加到最前面
    history = history.filter(id => id !== videoId);
    history.unshift(videoId);

    // 限制历史记录数量，保留最近的100条
    if (history.length > 100) {
      history = history.slice(0, 100);
    }

    // 保存历史
    localStorage.setItem(`watch_history_${userId}`, JSON.stringify(history));
  } catch (error) {
    console.error('添加观看历史失败:', error);
  }
}

// 导出默认对象
export default {
  getVideos,
  getVideoById,
  getVideoComments,
  addComment,
  getVideoInteraction,
  likeVideo,
  favoriteVideo,
  subscribeToCreator,
  isUserSubscribed,
  savePlaybackProgress,
  getPlaybackProgress,
  getUserWatchHistory,
  getVideoCategories,
  getVideosByCategory,
  getTrendingVideos,
  getRecommendedVideos,
};
