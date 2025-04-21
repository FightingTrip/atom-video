/**
 * @file videoProgress.ts
 * @description 视频播放进度管理服务
 * @author Atom Video Team
 * @date 2025-04-08
 */

import { VideoProgress } from '@/types';

// 类型定义
interface UserVideoProgress {
  [userId: string]: {
    [videoId: string]: VideoProgress;
  };
}

/**
 * 模拟API延迟
 * @param minDelay 最小延迟时间（毫秒）
 * @param maxDelay 最大延迟时间（毫秒）
 * @returns Promise对象
 */
const delay = (minDelay = 300, maxDelay = 1200): Promise<void> => {
  const delayTime = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  return new Promise(resolve => setTimeout(resolve, delayTime));
};

/**
 * 获取视频播放进度
 * @param userId 用户ID
 * @param videoId 视频ID
 * @returns 播放进度或null
 */
export async function getVideoProgress(
  userId: string,
  videoId: string
): Promise<VideoProgress | null> {
  try {
    // 模拟API延迟
    await delay(100, 500);

    // 从localStorage获取播放进度数据
    const progressJson = localStorage.getItem('userVideoProgress');
    const progress: UserVideoProgress = progressJson ? JSON.parse(progressJson) : {};

    // 检查是否有该用户的该视频的进度记录
    if (progress[userId] && progress[userId][videoId]) {
      return progress[userId][videoId];
    }

    return null;
  } catch (error) {
    console.error('获取视频进度失败:', error);
    return null;
  }
}

/**
 * 保存视频播放进度
 * @param userId 用户ID
 * @param videoId 视频ID
 * @param currentTime 当前播放时间（秒）
 * @param duration 视频总时长（秒）
 * @returns 是否成功
 */
export async function saveVideoProgress(
  userId: string,
  videoId: string,
  currentTime: number,
  duration: number
): Promise<boolean> {
  try {
    // 检查参数
    if (!userId || !videoId || currentTime < 0 || duration <= 0) {
      return false;
    }

    // 保存过于频繁的更新可能导致性能问题，可以考虑设置一个最小更新间隔

    // 从localStorage获取播放进度数据
    const progressJson = localStorage.getItem('userVideoProgress');
    const progress: UserVideoProgress = progressJson ? JSON.parse(progressJson) : {};

    // 初始化用户的进度数据
    if (!progress[userId]) {
      progress[userId] = {};
    }

    // 更新进度数据
    progress[userId][videoId] = {
      videoId,
      currentTime,
      duration,
      percentage: Math.floor((currentTime / duration) * 100),
      lastPlayedAt: new Date().toISOString(),
    };

    // 保存到localStorage
    localStorage.setItem('userVideoProgress', JSON.stringify(progress));

    // 更新观看历史
    await addToWatchHistory(userId, videoId);

    return true;
  } catch (error) {
    console.error('保存视频进度失败:', error);
    return false;
  }
}

/**
 * 获取用户观看历史
 * @param userId 用户ID
 * @param limit 限制返回数量
 * @returns 观看历史视频ID列表
 */
export async function getWatchHistory(userId: string, limit?: number): Promise<string[]> {
  try {
    // 模拟API延迟
    await delay(200, 800);

    const historyJson = localStorage.getItem(`watchHistory_${userId}`);
    const history = historyJson ? JSON.parse(historyJson) : [];

    // 如果指定了限制数量，返回相应数量的历史记录
    return limit ? history.slice(0, limit) : history;
  } catch (error) {
    console.error('获取观看历史失败:', error);
    return [];
  }
}

/**
 * 清除观看历史
 * @param userId 用户ID
 * @returns 是否成功
 */
export async function clearWatchHistory(userId: string): Promise<boolean> {
  try {
    localStorage.removeItem(`watchHistory_${userId}`);
    return true;
  } catch (error) {
    console.error('清除观看历史失败:', error);
    return false;
  }
}

/**
 * 添加到观看历史
 * @param userId 用户ID
 * @param videoId 视频ID
 * @returns 是否成功
 */
async function addToWatchHistory(userId: string, videoId: string): Promise<boolean> {
  try {
    // 获取当前历史记录
    const historyJson = localStorage.getItem(`watchHistory_${userId}`);
    let history = historyJson ? JSON.parse(historyJson) : [];

    // 如果已经在历史记录中，先移除
    history = history.filter((id: string) => id !== videoId);

    // 添加到历史记录开头
    history.unshift(videoId);

    // 限制历史记录长度
    const MAX_HISTORY_LENGTH = 100;
    if (history.length > MAX_HISTORY_LENGTH) {
      history = history.slice(0, MAX_HISTORY_LENGTH);
    }

    // 保存到localStorage
    localStorage.setItem(`watchHistory_${userId}`, JSON.stringify(history));

    return true;
  } catch (error) {
    console.error('添加观看历史失败:', error);
    return false;
  }
}

/**
 * 获取用户所有视频播放进度
 * @param userId 用户ID
 * @returns 所有视频进度
 */
export async function getAllVideoProgresses(userId: string): Promise<VideoProgress[]> {
  try {
    // 模拟API延迟
    await delay(300, 900);

    // 从localStorage获取播放进度数据
    const progressJson = localStorage.getItem('userVideoProgress');
    const progress: UserVideoProgress = progressJson ? JSON.parse(progressJson) : {};

    // 如果没有该用户的进度记录，返回空数组
    if (!progress[userId]) {
      return [];
    }

    // 转换为数组，并按最后播放时间排序
    return Object.values(progress[userId]).sort((a, b) => {
      // 检查lastPlayedAt字段是否存在
      if (a.lastPlayedAt && b.lastPlayedAt) {
        return new Date(b.lastPlayedAt).getTime() - new Date(a.lastPlayedAt).getTime();
      }
      return 0;
    });
  } catch (error) {
    console.error('获取所有视频进度失败:', error);
    return [];
  }
}

/**
 * 删除视频播放进度
 * @param userId 用户ID
 * @param videoId 视频ID
 * @returns 是否成功
 */
export async function deleteVideoProgress(userId: string, videoId: string): Promise<boolean> {
  try {
    // 从localStorage获取播放进度数据
    const progressJson = localStorage.getItem('userVideoProgress');
    const progress: UserVideoProgress = progressJson ? JSON.parse(progressJson) : {};

    // 如果没有该用户的进度记录，返回成功
    if (!progress[userId]) {
      return true;
    }

    // 删除该视频的进度记录
    if (progress[userId][videoId]) {
      delete progress[userId][videoId];

      // 保存到localStorage
      localStorage.setItem('userVideoProgress', JSON.stringify(progress));
    }

    return true;
  } catch (error) {
    console.error('删除视频进度失败:', error);
    return false;
  }
}
