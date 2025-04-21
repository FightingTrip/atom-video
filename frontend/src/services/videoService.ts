/**
 * @file videoService.ts
 * @description 视频服务 - 负责处理与视频相关的操作
 */

import {
  getVideos as getMockVideos,
  getVideoById as getMockVideoById,
  getVideoComments as getMockVideoComments,
  getUserVideoInteraction,
  updateUserVideoInteraction,
  getVideoProgress,
  saveVideoProgress,
  getWatchHistory,
} from '@/utils/mockData';
import type {
  User,
  Video,
  Comment,
  VideoInteraction,
  VideoProgress,
  VideoSearchParams,
} from '@/types';

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
    await new Promise(resolve => setTimeout(resolve, 300));

    let videos = getMockVideos(limit);

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
        videos = videos.filter(video => video.tags.some(tag => params.tags?.includes(tag)));
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
      hasMore: false, // 模拟数据中默认没有更多
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
    await new Promise(resolve => setTimeout(resolve, 300));

    let videos = getMockVideos();

    // 排除指定视频
    if (excludeVideoId) {
      videos = videos.filter(video => video.id !== excludeVideoId);
    }

    // 模拟推荐算法，这里简单随机打乱顺序
    videos = videos.sort(() => Math.random() - 0.5);

    return videos.slice(0, limit);
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
    await new Promise(resolve => setTimeout(resolve, 200));

    const video = getMockVideoById(videoId);

    if (!video) {
      return null;
    }

    // 如果提供了用户ID，增加播放量
    if (userId) {
      video.views += 1;
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
    await new Promise(resolve => setTimeout(resolve, 400));

    const comments = getMockVideoComments(videoId);

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
    await new Promise(resolve => setTimeout(resolve, 500));

    const video = getMockVideoById(videoId);
    if (!video) {
      throw new Error('视频不存在');
    }

    // 获取用户信息
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      throw new Error('用户未登录');
    }

    const user = JSON.parse(userJson);

    // 创建新评论
    const newComment: Comment = {
      id: `c${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      videoTitle: video.title,
      user: {
        nickname: user.nickname,
        avatar: user.avatar,
      },
      likes: 0,
      replyCount: 0,
    };

    // 在实际应用中，这里应该调用API保存评论
    // 这里我们模拟成功并返回新评论

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
  return getUserVideoInteraction(userId, videoId);
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
    await new Promise(resolve => setTimeout(resolve, 300));

    updateUserVideoInteraction(userId, videoId, { isLiked });

    return true;
  } catch (error) {
    console.error('点赞操作失败:', error);
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
    await new Promise(resolve => setTimeout(resolve, 300));

    updateUserVideoInteraction(userId, videoId, { isFavorited });

    return true;
  } catch (error) {
    console.error('收藏操作失败:', error);
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
    await new Promise(resolve => setTimeout(resolve, 400));

    // 获取用户的订阅列表
    const subscriptionsJson = localStorage.getItem(`subscriptions_${userId}`);
    let subscriptions: string[] = subscriptionsJson ? JSON.parse(subscriptionsJson) : [];

    if (isSubscribed) {
      // 添加订阅
      if (!subscriptions.includes(creatorId)) {
        subscriptions.push(creatorId);
      }
    } else {
      // 取消订阅
      subscriptions = subscriptions.filter(id => id !== creatorId);
    }

    // 保存到localStorage
    localStorage.setItem(`subscriptions_${userId}`, JSON.stringify(subscriptions));

    return true;
  } catch (error) {
    console.error('订阅操作失败:', error);
    return false;
  }
}

/**
 * 获取用户是否订阅了创作者
 * @param userId 用户ID
 * @param creatorId 创作者ID
 */
export function isUserSubscribed(userId: string, creatorId: string): boolean {
  const subscriptionsJson = localStorage.getItem(`subscriptions_${userId}`);
  if (!subscriptionsJson) return false;

  const subscriptions: string[] = JSON.parse(subscriptionsJson);
  return subscriptions.includes(creatorId);
}

/**
 * 保存视频播放进度
 * @param userId 用户ID
 * @param videoId 视频ID
 * @param currentTime 当前播放时间（秒）
 * @param duration 视频总时长（秒）
 */
export function savePlaybackProgress(
  userId: string,
  videoId: string,
  currentTime: number,
  duration: number
): void {
  saveVideoProgress(userId, videoId, currentTime, duration);
}

/**
 * 获取视频播放进度
 * @param userId 用户ID
 * @param videoId 视频ID
 */
export function getPlaybackProgress(userId: string, videoId: string): VideoProgress | null {
  return getVideoProgress(userId, videoId);
}

/**
 * 获取用户观看历史
 * @param userId 用户ID
 * @param limit 限制数量
 */
export async function getUserWatchHistory(userId: string, limit?: number): Promise<Video[]> {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    // 获取观看历史ID列表
    const videoIds = getWatchHistory(userId);

    // 根据ID获取视频详情
    let videos: Video[] = [];
    for (const videoId of videoIds) {
      const video = getMockVideoById(videoId);
      if (video) {
        videos.push(video);
      }
    }

    // 如果有限制，截取指定数量
    if (limit && videos.length > limit) {
      videos = videos.slice(0, limit);
    }

    return videos;
  } catch (error) {
    console.error('获取观看历史失败:', error);
    return [];
  }
}

/**
 * 获取视频分类
 */
export async function getVideoCategories(): Promise<string[]> {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 200));

  // 返回模拟的视频分类
  return ['全部', '技术', '教育', '娱乐', '游戏', '音乐', '旅行', '健康', '生活'];
}

export default {
  getVideos,
  getRecommendedVideos,
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
};
