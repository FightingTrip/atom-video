/**
 * @file interactionService.ts
 * @description 交互服务，统一处理各种内容互动，如点赞、收藏等
 */

import { apiClient, apiRequest } from '@/services/api/client';
import { ApiResponse } from '@/services/api/types';
import { shouldUseMockData } from '@/utils/helpers';
import { safeGetItem, safeSetItem } from '@/utils/storageUtils';

// 本地存储键
const LIKED_VIDEOS_KEY = 'atom-video-liked-videos';
const SAVED_VIDEOS_KEY = 'atom-video-saved-videos';
const LIKED_COMMENTS_KEY = 'atom-video-liked-comments';
const USER_SUBSCRIPTIONS_KEY = 'atom-video-user-subscriptions';

// 互动类型枚举
export enum InteractionType {
  LIKE = 'like',
  UNLIKE = 'unlike',
  FAVORITE = 'favorite',
  UNFAVORITE = 'unfavorite',
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
}

// 目标类型枚举
export enum TargetType {
  VIDEO = 'video',
  COMMENT = 'comment',
  USER = 'user',
  PLAYLIST = 'playlist',
}

// 互动响应接口
export interface InteractionResponse {
  success: boolean;
  count?: number;
  state?: boolean;
  message?: string;
}

/**
 * 交互服务类
 */
export const interactionService = {
  /**
   * 点赞内容
   * @param targetType 目标类型（视频、评论等）
   * @param targetId 目标ID
   * @param action 操作类型（点赞或取消点赞）
   */
  async toggleLike(
    targetType: TargetType,
    targetId: string,
    action: InteractionType.LIKE | InteractionType.UNLIKE
  ): Promise<InteractionResponse> {
    try {
      // 构建API路径
      let apiPath = '';

      switch (targetType) {
        case TargetType.VIDEO:
          apiPath = `/api/videos/${targetId}/${action}`;
          break;
        case TargetType.COMMENT:
          apiPath = `/api/comments/${targetId}/like`;
          break;
        default:
          throw new Error(`不支持的目标类型: ${targetType}`);
      }

      // 调用API
      const response = await apiRequest<{ liked: boolean; count?: number }>(
        apiClient.post(apiPath)
      );

      return {
        success: true,
        state: response.liked,
        count: response.count,
      };
    } catch (error) {
      console.error(`${action === InteractionType.LIKE ? '点赞' : '取消点赞'}失败:`, error);

      // 如果启用了mock数据，使用本地存储模拟
      if (shouldUseMockData()) {
        return this.handleMockInteraction(targetType, targetId, action === InteractionType.LIKE);
      }

      return {
        success: false,
        message: `操作失败: ${(error as Error).message}`,
      };
    }
  },

  /**
   * 收藏内容
   * @param targetType 目标类型
   * @param targetId 目标ID
   * @param action 操作类型（收藏或取消收藏）
   */
  async toggleFavorite(
    targetType: TargetType,
    targetId: string,
    action: InteractionType.FAVORITE | InteractionType.UNFAVORITE
  ): Promise<InteractionResponse> {
    try {
      // 目前仅支持视频收藏
      if (targetType !== TargetType.VIDEO) {
        throw new Error(`不支持的目标类型: ${targetType}`);
      }

      // 调用API
      const apiPath = `/api/videos/${targetId}/favorite`;
      const response = await apiRequest<{ favorited: boolean; count?: number }>(
        apiClient.post(apiPath)
      );

      return {
        success: true,
        state: response.favorited,
        count: response.count,
      };
    } catch (error) {
      console.error(`${action === InteractionType.FAVORITE ? '收藏' : '取消收藏'}失败:`, error);

      // 如果启用了mock数据，使用本地存储模拟
      if (shouldUseMockData()) {
        const storageKey = targetType === TargetType.VIDEO ? SAVED_VIDEOS_KEY : '';
        if (!storageKey) {
          return { success: false, message: '不支持的目标类型' };
        }

        const savedItems = safeGetItem<string[]>(storageKey, []);
        const isSaved = savedItems.includes(targetId);

        if (
          (action === InteractionType.FAVORITE && !isSaved) ||
          (action === InteractionType.UNFAVORITE && isSaved)
        ) {
          // 切换状态
          const newSavedItems = isSaved
            ? savedItems.filter(id => id !== targetId)
            : [...savedItems, targetId];

          safeSetItem(storageKey, newSavedItems);

          return {
            success: true,
            state: !isSaved,
            message: `${!isSaved ? '收藏' : '取消收藏'}成功（模拟数据）`,
          };
        }

        return {
          success: true,
          state: isSaved,
          message: `${isSaved ? '已收藏' : '未收藏'}（模拟数据）`,
        };
      }

      return {
        success: false,
        message: `操作失败: ${(error as Error).message}`,
      };
    }
  },

  /**
   * 订阅用户或频道
   * @param targetId 目标ID（用户ID）
   * @param action 操作类型（订阅或取消订阅）
   */
  async toggleSubscribe(
    targetId: string,
    action: InteractionType.SUBSCRIBE | InteractionType.UNSUBSCRIBE
  ): Promise<InteractionResponse> {
    try {
      // 调用API
      const apiPath = `/api/users/${targetId}/subscribe`;
      const response = await apiRequest<{ subscribed: boolean; count?: number }>(
        apiClient.post(apiPath)
      );

      return {
        success: true,
        state: response.subscribed,
        count: response.count,
      };
    } catch (error) {
      console.error(`${action === InteractionType.SUBSCRIBE ? '订阅' : '取消订阅'}失败:`, error);

      // 如果启用了mock数据，使用本地存储模拟
      if (shouldUseMockData()) {
        const subscriptions = safeGetItem<string[]>(USER_SUBSCRIPTIONS_KEY, []);
        const isSubscribed = subscriptions.includes(targetId);

        if (
          (action === InteractionType.SUBSCRIBE && !isSubscribed) ||
          (action === InteractionType.UNSUBSCRIBE && isSubscribed)
        ) {
          // 切换状态
          const newSubscriptions = isSubscribed
            ? subscriptions.filter(id => id !== targetId)
            : [...subscriptions, targetId];

          safeSetItem(USER_SUBSCRIPTIONS_KEY, newSubscriptions);

          return {
            success: true,
            state: !isSubscribed,
            message: `${!isSubscribed ? '订阅' : '取消订阅'}成功（模拟数据）`,
          };
        }

        return {
          success: true,
          state: isSubscribed,
          message: `${isSubscribed ? '已订阅' : '未订阅'}（模拟数据）`,
        };
      }

      return {
        success: false,
        message: `操作失败: ${(error as Error).message}`,
      };
    }
  },

  /**
   * 获取用户与内容的互动状态
   * @param targetType 目标类型
   * @param targetId 目标ID
   */
  async getInteractionState(
    targetType: TargetType,
    targetId: string
  ): Promise<{ isLiked: boolean; isFavorited?: boolean; isSubscribed?: boolean }> {
    try {
      let apiPath = '';

      switch (targetType) {
        case TargetType.VIDEO:
          apiPath = `/api/videos/${targetId}/interaction`;
          break;
        case TargetType.COMMENT:
          apiPath = `/api/comments/${targetId}/interaction`;
          break;
        case TargetType.USER:
          apiPath = `/api/users/${targetId}/interaction`;
          break;
        default:
          throw new Error(`不支持的目标类型: ${targetType}`);
      }

      const response = await apiRequest(apiClient.get(apiPath));
      return response;
    } catch (error) {
      console.error('获取互动状态失败:', error);

      // 如果启用了mock数据，使用本地存储模拟
      if (shouldUseMockData()) {
        return this.getMockInteractionState(targetType, targetId);
      }

      // 默认状态
      return { isLiked: false, isFavorited: false, isSubscribed: false };
    }
  },

  /**
   * 处理模拟互动（用于离线模式）
   * @private
   */
  handleMockInteraction(
    targetType: TargetType,
    targetId: string,
    shouldLike: boolean
  ): InteractionResponse {
    // 根据目标类型选择存储键
    let storageKey = '';
    switch (targetType) {
      case TargetType.VIDEO:
        storageKey = LIKED_VIDEOS_KEY;
        break;
      case TargetType.COMMENT:
        storageKey = LIKED_COMMENTS_KEY;
        break;
      default:
        return { success: false, message: '不支持的目标类型' };
    }

    // 获取当前状态
    const likedItems = safeGetItem<string[]>(storageKey, []);
    const isLiked = likedItems.includes(targetId);

    // 如果当前状态与目标状态相同，不执行操作
    if ((shouldLike && isLiked) || (!shouldLike && !isLiked)) {
      return {
        success: true,
        state: isLiked,
        message: `${isLiked ? '已点赞' : '未点赞'}（模拟数据）`,
      };
    }

    // 切换状态
    const newLikedItems = isLiked
      ? likedItems.filter(id => id !== targetId)
      : [...likedItems, targetId];

    safeSetItem(storageKey, newLikedItems);

    return {
      success: true,
      state: !isLiked,
      message: `${!isLiked ? '点赞' : '取消点赞'}成功（模拟数据）`,
    };
  },

  /**
   * 获取模拟互动状态（用于离线模式）
   * @private
   */
  getMockInteractionState(
    targetType: TargetType,
    targetId: string
  ): { isLiked: boolean; isFavorited?: boolean; isSubscribed?: boolean } {
    // 获取点赞状态
    const likedItems =
      targetType === TargetType.VIDEO
        ? safeGetItem<string[]>(LIKED_VIDEOS_KEY, [])
        : targetType === TargetType.COMMENT
          ? safeGetItem<string[]>(LIKED_COMMENTS_KEY, [])
          : [];

    const isLiked = likedItems.includes(targetId);

    // 如果目标是视频，还需获取收藏状态
    let isFavorited: boolean | undefined;
    if (targetType === TargetType.VIDEO) {
      const savedVideos = safeGetItem<string[]>(SAVED_VIDEOS_KEY, []);
      isFavorited = savedVideos.includes(targetId);
    }

    // 如果目标是用户，还需获取订阅状态
    let isSubscribed: boolean | undefined;
    if (targetType === TargetType.USER) {
      const subscriptions = safeGetItem<string[]>(USER_SUBSCRIPTIONS_KEY, []);
      isSubscribed = subscriptions.includes(targetId);
    }

    return { isLiked, isFavorited, isSubscribed };
  },
};

export default interactionService;
