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

// 导入模拟数据库和映射器
import mockDb from '@/mock/mockDb';
import { mapDbVideoToFrontend, mapDbVideosToFrontend, videoCategories } from '@/utils/mockMapper';
import { mockDelay } from '@/utils/mockInitializer';

// 用于存储用户观看进度
const userVideoProgress: Record<string, Record<string, VideoProgress>> = {};

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
    // 使用模拟延迟
    await mockDelay(300);

    // 使用模拟数据库获取视频
    const result = mockDb.getVideos({
      page: params?.page || 1,
      limit: limit || 12,
      search: params?.keyword || '',
      // 将参数适配到模拟数据库API
      category: params?.tags?.[0] || '',
      status: 'published', // 只获取已发布的视频
      sortBy:
        params?.sort === 'latest'
          ? 'createdAt'
          : params?.sort === 'popular'
            ? 'views'
            : 'createdAt',
      sortOrder: 'desc',
    });

    // 使用映射器转换数据
    const videos = mapDbVideosToFrontend(result.items);

    return {
      videos,
      hasMore: (params?.page || 1) < result.totalPages,
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
    // 使用模拟延迟
    await mockDelay(300);

    // 使用模拟数据库获取视频
    const result = mockDb.getVideos({
      page: 1,
      limit: limit + 1, // 多取一个，以防排除后数量不足
      status: 'published',
      sortBy: 'views', // 按观看量排序作为推荐
      sortOrder: 'desc',
    });

    // 使用映射器转换数据
    const videos = mapDbVideosToFrontend(result.items);

    // 排除当前视频，并限制数量
    return videos.filter(video => video.id !== excludeVideoId).slice(0, limit);
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
    // 使用模拟延迟
    await mockDelay(200);

    // 使用模拟数据库获取视频
    const dbVideo = mockDb.getVideoById(videoId);

    // 转换为前端类型
    const video = mapDbVideoToFrontend(dbVideo);

    // 如果提供了用户ID，添加到历史
    if (userId && video) {
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
    // 使用模拟延迟
    await mockDelay(400);

    // 这里可以扩展为使用模拟数据库获取评论
    // 暂时使用生成模拟评论
    const mockComments: Comment[] = Array(15)
      .fill(0)
      .map((_, i) => ({
        id: `comment-${videoId}-${i}`,
        content: `这是测试评论 ${i + 1}，用于展示评论区域的样式和布局效果。评论可以包含用户反馈、问题和讨论。`,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        likes: Math.floor(Math.random() * 50),
        user: {
          nickname: `评论用户 ${i + 1}`,
          avatar: `https://i.pravatar.cc/150?u=comment${i}`,
        },
        videoTitle: `视频标题`,
        replyCount: Math.floor(Math.random() * 5),
      }));

    const start = (page - 1) * limit;
    const end = start + limit;
    const comments = mockComments.slice(start, end);

    return {
      comments,
      hasMore: end < mockComments.length,
    };
  } catch (error) {
    console.error(`获取视频 ${videoId} 的评论失败:`, error);
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
    // 使用模拟延迟
    await mockDelay(500);

    // 创建新评论
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      user: {
        nickname: `用户 ${userId.slice(0, 5)}`,
        avatar: `https://i.pravatar.cc/150?u=${userId}`,
      },
      videoTitle: '视频标题',
      replyCount: 0,
    };

    return comment;
  } catch (error) {
    console.error('添加评论失败:', error);
    return null;
  }
}

/**
 * 获取视频互动状态
 * @param userId 用户ID
 * @param videoId 视频ID
 */
export function getVideoInteraction(userId: string, videoId: string): VideoInteraction {
  // 这里可以扩展为从模拟数据库获取用户互动数据
  return {
    isLiked: false,
    isFavorited: false,
    isSubscribed: false,
  };
}

/**
 * 获取视频分类列表
 */
export async function getVideoCategories(): Promise<string[]> {
  // 使用模拟延迟
  await mockDelay(100);

  // 返回分类列表
  return videoCategories.map(cat => cat.label);
}

/**
 * 按分类获取视频
 * @param category 分类名称
 * @param limit 限制数量
 */
export async function getVideosByCategory(
  category: string,
  limit: number = 12
): Promise<{ videos: Video[]; hasMore: boolean }> {
  return getVideos(limit, { tags: [category] });
}

/**
 * 获取热门视频
 * @param limit 限制数量
 */
export async function getTrendingVideos(limit: number = 10): Promise<TrendingItem[]> {
  try {
    // 使用模拟延迟
    await mockDelay(400);

    // 使用模拟数据库获取热门视频
    const result = mockDb.getVideos({
      page: 1,
      limit,
      sortBy: 'views',
      sortOrder: 'desc',
      status: 'published',
    });

    // 映射为前端类型
    const videos = mapDbVideosToFrontend(result.items);

    // 转换为趋势项
    return videos.map(video => ({
      id: video.id,
      title: video.title,
      coverUrl: video.coverUrl,
      views: video.views,
      likes: video.likes,
      author: {
        id: video.author.id,
        nickname: video.author.nickname,
        avatar: video.author.avatar,
      },
      trend: Math.floor(Math.random() * 200) - 100, // 模拟趋势变化
    }));
  } catch (error) {
    console.error('获取热门视频失败:', error);
    return [];
  }
}

/**
 * 获取用户观看历史
 * @param userId 用户ID
 */
function getWatchHistory(userId: string): string[] {
  const historyJson = localStorage.getItem(`watch_history_${userId}`);
  return historyJson ? JSON.parse(historyJson) : [];
}

/**
 * 添加视频到观看历史
 * @param userId 用户ID
 * @param videoId 视频ID
 */
function addToWatchHistory(userId: string, videoId: string): void {
  let history = getWatchHistory(userId);

  // 如果已存在，先移除
  history = history.filter(id => id !== videoId);

  // 添加到历史开头
  history.unshift(videoId);

  // 限制历史记录长度
  if (history.length > 50) {
    history = history.slice(0, 50);
  }

  // 保存到本地存储
  localStorage.setItem(`watch_history_${userId}`, JSON.stringify(history));
}

/**
 * 获取用户观看历史的视频列表
 * @param userId 用户ID
 * @param limit 限制数量
 */
export async function getUserWatchHistory(userId: string, limit?: number): Promise<Video[]> {
  try {
    // 获取历史记录
    const history = getWatchHistory(userId);

    if (history.length === 0) {
      return [];
    }

    // 限制记录数量
    const limitedHistory = limit ? history.slice(0, limit) : history;

    // 获取每个历史记录对应的视频
    const historyVideos: Video[] = [];

    // 使用模拟延迟
    await mockDelay(300);

    // 获取历史记录中的每个视频
    for (const videoId of limitedHistory) {
      const video = await getVideoById(videoId);
      if (video) {
        historyVideos.push(video);
      }
    }

    return historyVideos;
  } catch (error) {
    console.error('获取观看历史失败:', error);
    return [];
  }
}

/**
 * 获取播放进度
 * @param userId 用户ID
 * @param videoId 视频ID
 */
export function getPlaybackProgress(userId: string, videoId: string): VideoProgress | null {
  // 从内存缓存中获取
  if (userVideoProgress[userId] && userVideoProgress[userId][videoId]) {
    return userVideoProgress[userId][videoId];
  }

  // 如果内存中没有，尝试从localStorage获取
  const key = `video_progress_${userId}_${videoId}`;
  const savedProgress = localStorage.getItem(key);

  if (savedProgress) {
    try {
      const progress = JSON.parse(savedProgress) as VideoProgress;

      // 保存到内存缓存
      if (!userVideoProgress[userId]) {
        userVideoProgress[userId] = {};
      }
      userVideoProgress[userId][videoId] = progress;

      return progress;
    } catch (e) {
      return null;
    }
  }

  return null;
}

/**
 * 保存播放进度
 * @param userId 用户ID
 * @param videoId 视频ID
 * @param currentTime 当前时间
 * @param duration 总时长
 */
export function savePlaybackProgress(
  userId: string,
  videoId: string,
  currentTime: number,
  duration: number
): void {
  // 创建进度对象
  const progress: VideoProgress = {
    videoId,
    currentTime,
    duration,
    percentage: Math.floor((currentTime / duration) * 100),
    lastPlayedAt: new Date().toISOString(),
  };

  // 保存到内存缓存
  if (!userVideoProgress[userId]) {
    userVideoProgress[userId] = {};
  }
  userVideoProgress[userId][videoId] = progress;

  // 保存到localStorage
  const key = `video_progress_${userId}_${videoId}`;
  localStorage.setItem(key, JSON.stringify(progress));

  // 同时更新观看历史
  addToWatchHistory(userId, videoId);
}

/**
 * 点赞视频
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
    return true;
  } catch (error) {
    console.error('更新点赞状态失败:', error);
    return false;
  }
}

/**
 * 收藏视频
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
    return true;
  } catch (error) {
    console.error('更新收藏状态失败:', error);
    return false;
  }
}

/**
 * 订阅创作者
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
    return true;
  } catch (error) {
    console.error('更新订阅状态失败:', error);
    return false;
  }
}

/**
 * 检查用户是否已订阅创作者
 * @param userId 用户ID
 * @param creatorId 创作者ID
 */
export function isUserSubscribed(userId: string, creatorId: string): boolean {
  // 模拟订阅检查
  return false;
}

export default {
  getVideos,
  getVideoById,
  getRecommendedVideos,
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
};
