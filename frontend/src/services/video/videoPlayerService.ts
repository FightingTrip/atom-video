/**
 * @file videoPlayerService.ts
 * @description 视频播放器服务，提供视频播放相关功能
 */

import { safeGetItem, safeSetItem } from '@/utils/storageUtils';

// 本地存储键
const PLAYBACK_PROGRESS_KEY = 'atom-video-playback-progress';
const PLAYER_SETTINGS_KEY = 'atom-video-player-settings';
const AUTOPLAY_NEXT_KEY = 'atom-video-autoplay-next';
const LAST_WATCHED_KEY = 'atom-video-last-watched';

// 视频质量类型
export type VideoQuality = '1080p' | '720p' | '480p' | '360p' | 'auto';

// 播放进度接口
export interface PlaybackProgress {
  videoId: string;
  currentTime: number;
  duration: number;
  percentage: number;
  lastPlayedAt: string;
}

// 播放器设置接口
export interface PlayerSettings {
  volume: number;
  muted: boolean;
  playbackRate: number;
  quality: VideoQuality;
  autoplaySeries: boolean;
  autoplayRecommended: boolean;
  pictureInPicture: boolean;
  captionsEnabled: boolean;
  captionsLanguage: string;
}

// 视频源接口
export interface VideoSource {
  quality: VideoQuality;
  url: string;
  type: string;
  label: string;
  bitrate?: number;
}

// 默认播放器设置
const DEFAULT_PLAYER_SETTINGS: PlayerSettings = {
  volume: 100,
  muted: false,
  playbackRate: 1,
  quality: 'auto',
  autoplaySeries: true,
  autoplayRecommended: false,
  pictureInPicture: false,
  captionsEnabled: false,
  captionsLanguage: 'zh-CN',
};

// 用户播放进度缓存
const userProgressCache: Record<string, Record<string, PlaybackProgress>> = {};

/**
 * 视频播放器服务
 */
export const videoPlayerService = {
  /**
   * 保存播放进度
   * @param userId 用户ID
   * @param videoId 视频ID
   * @param currentTime 当前播放时间
   * @param duration 视频总时长
   * @returns 是否保存成功
   */
  savePlaybackProgress(
    userId: string,
    videoId: string,
    currentTime: number,
    duration: number
  ): boolean {
    try {
      if (!userId || !videoId || currentTime < 0 || duration <= 0) {
        return false;
      }

      // 如果视频已看完90%以上，标记为已看完，进度设为0
      // 这样下次播放会从头开始，而不是接近结尾的位置
      if (currentTime / duration > 0.9) {
        currentTime = 0;
      }

      // 创建进度对象
      const progress: PlaybackProgress = {
        videoId,
        currentTime,
        duration,
        percentage: Math.floor((currentTime / duration) * 100),
        lastPlayedAt: new Date().toISOString(),
      };

      // 从本地存储中获取所有进度
      const progressData = safeGetItem<Record<string, Record<string, PlaybackProgress>>>(
        PLAYBACK_PROGRESS_KEY,
        {}
      );

      // 初始化用户的进度数据
      if (!progressData[userId]) {
        progressData[userId] = {};
      }

      // 更新进度数据
      progressData[userId][videoId] = progress;

      // 保存到本地存储
      safeSetItem(PLAYBACK_PROGRESS_KEY, progressData);

      // 更新内存缓存
      if (!userProgressCache[userId]) {
        userProgressCache[userId] = {};
      }
      userProgressCache[userId][videoId] = progress;

      // 更新最后观看视频
      this.updateLastWatched(userId, videoId);

      return true;
    } catch (error) {
      console.error('保存播放进度失败:', error);
      return false;
    }
  },

  /**
   * 获取播放进度
   * @param userId 用户ID
   * @param videoId 视频ID
   * @returns 播放进度信息
   */
  getPlaybackProgress(userId: string, videoId: string): PlaybackProgress | null {
    try {
      if (!userId || !videoId) {
        return null;
      }

      // 优先从内存缓存获取
      if (userProgressCache[userId]?.[videoId]) {
        return userProgressCache[userId][videoId];
      }

      // 从本地存储获取
      const progressData = safeGetItem<Record<string, Record<string, PlaybackProgress>>>(
        PLAYBACK_PROGRESS_KEY,
        {}
      );

      if (progressData[userId]?.[videoId]) {
        // 更新内存缓存
        if (!userProgressCache[userId]) {
          userProgressCache[userId] = {};
        }
        userProgressCache[userId][videoId] = progressData[userId][videoId];

        return progressData[userId][videoId];
      }

      return null;
    } catch (error) {
      console.error('获取播放进度失败:', error);
      return null;
    }
  },

  /**
   * 清除播放进度
   * @param userId 用户ID
   * @param videoId 视频ID（可选，不提供则清除所有）
   * @returns 是否清除成功
   */
  clearPlaybackProgress(userId: string, videoId?: string): boolean {
    try {
      if (!userId) {
        return false;
      }

      const progressData = safeGetItem<Record<string, Record<string, PlaybackProgress>>>(
        PLAYBACK_PROGRESS_KEY,
        {}
      );

      if (!progressData[userId]) {
        return true; // 没有进度数据，视为成功
      }

      if (videoId) {
        // 仅清除指定视频的进度
        if (progressData[userId][videoId]) {
          delete progressData[userId][videoId];

          // 更新内存缓存
          if (userProgressCache[userId]?.[videoId]) {
            delete userProgressCache[userId][videoId];
          }
        }
      } else {
        // 清除所有进度
        delete progressData[userId];

        // 更新内存缓存
        if (userProgressCache[userId]) {
          delete userProgressCache[userId];
        }
      }

      safeSetItem(PLAYBACK_PROGRESS_KEY, progressData);
      return true;
    } catch (error) {
      console.error('清除播放进度失败:', error);
      return false;
    }
  },

  /**
   * 保存播放器设置
   * @param userId 用户ID
   * @param settings 播放器设置
   * @returns 是否保存成功
   */
  savePlayerSettings(userId: string, settings: Partial<PlayerSettings>): boolean {
    try {
      if (!userId) {
        return false;
      }

      // 获取当前设置
      const allSettings = safeGetItem<Record<string, PlayerSettings>>(PLAYER_SETTINGS_KEY, {});

      // 合并设置
      const currentSettings = allSettings[userId] || { ...DEFAULT_PLAYER_SETTINGS };
      allSettings[userId] = { ...currentSettings, ...settings };

      // 保存设置
      safeSetItem(PLAYER_SETTINGS_KEY, allSettings);
      return true;
    } catch (error) {
      console.error('保存播放器设置失败:', error);
      return false;
    }
  },

  /**
   * 获取播放器设置
   * @param userId 用户ID
   * @returns 播放器设置
   */
  getPlayerSettings(userId: string): PlayerSettings {
    try {
      if (!userId) {
        return { ...DEFAULT_PLAYER_SETTINGS };
      }

      const allSettings = safeGetItem<Record<string, PlayerSettings>>(PLAYER_SETTINGS_KEY, {});
      return allSettings[userId] || { ...DEFAULT_PLAYER_SETTINGS };
    } catch (error) {
      console.error('获取播放器设置失败:', error);
      return { ...DEFAULT_PLAYER_SETTINGS };
    }
  },

  /**
   * 支持画中画模式
   * @param videoElement 视频元素
   * @returns 是否支持
   */
  supportsPictureInPicture(videoElement: HTMLVideoElement | null): boolean {
    return (
      !!videoElement && !!document.pictureInPictureEnabled && !videoElement.disablePictureInPicture
    );
  },

  /**
   * 切换画中画模式
   * @param videoElement 视频元素
   * @returns 当前是否处于画中画模式
   */
  async togglePictureInPicture(videoElement: HTMLVideoElement | null): Promise<boolean> {
    try {
      if (!videoElement || !document.pictureInPictureEnabled) {
        return false;
      }

      if (document.pictureInPictureElement === videoElement) {
        await document.exitPictureInPicture();
        return false;
      } else {
        await videoElement.requestPictureInPicture();
        return true;
      }
    } catch (error) {
      console.error('切换画中画模式失败:', error);
      return false;
    }
  },

  /**
   * 设置视频质量
   * @param videoElement 视频元素
   * @param quality 视频质量
   * @param sources 可用视频源
   * @returns 是否设置成功
   */
  setVideoQuality(
    videoElement: HTMLVideoElement | null,
    quality: VideoQuality,
    sources: VideoSource[]
  ): boolean {
    try {
      if (!videoElement || !sources || sources.length === 0) {
        return false;
      }

      // 记住当前播放时间和状态
      const currentTime = videoElement.currentTime;
      const isPaused = videoElement.paused;

      // 如果是自动模式，选择基于网络情况的最佳质量
      let targetQuality = quality;
      if (quality === 'auto') {
        // 简单的网络状况检测
        const connection =
          (navigator as any).connection ||
          (navigator as any).mozConnection ||
          (navigator as any).webkitConnection;

        if (connection) {
          const effectiveType = connection.effectiveType;
          // 基于网络类型选择合适的质量
          if (effectiveType === '4g') {
            targetQuality = '1080p';
          } else if (effectiveType === '3g') {
            targetQuality = '720p';
          } else if (effectiveType === '2g') {
            targetQuality = '480p';
          } else {
            targetQuality = '360p';
          }
        } else {
          // 如果无法获取网络状况，默认使用720p
          targetQuality = '720p';
        }
      }

      // 查找对应质量的视频源
      let source = sources.find(s => s.quality === targetQuality);

      // 如果找不到精确匹配，选择最接近的质量
      if (!source) {
        const qualityLevels: VideoQuality[] = ['1080p', '720p', '480p', '360p'];
        const targetIndex = qualityLevels.indexOf(targetQuality as VideoQuality);

        // 向下查找可用的最高质量
        for (let i = targetIndex; i < qualityLevels.length; i++) {
          source = sources.find(s => s.quality === qualityLevels[i]);
          if (source) break;
        }

        // 如果向下查找不到，向上查找可用的最低质量
        if (!source && targetIndex > 0) {
          for (let i = targetIndex - 1; i >= 0; i--) {
            source = sources.find(s => s.quality === qualityLevels[i]);
            if (source) break;
          }
        }
      }

      // 如果找到了视频源，设置到视频元素
      if (source) {
        videoElement.src = source.url;
        videoElement.currentTime = currentTime;

        // 恢复之前的播放状态
        if (!isPaused) {
          videoElement.play().catch(err => console.error('重新播放失败:', err));
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('设置视频质量失败:', error);
      return false;
    }
  },

  /**
   * 更新最后观看的视频
   * @param userId 用户ID
   * @param videoId 视频ID
   */
  updateLastWatched(userId: string, videoId: string): void {
    try {
      if (!userId || !videoId) {
        return;
      }

      const lastWatched = safeGetItem<Record<string, string>>(LAST_WATCHED_KEY, {});
      lastWatched[userId] = videoId;
      safeSetItem(LAST_WATCHED_KEY, lastWatched);
    } catch (error) {
      console.error('更新最后观看视频失败:', error);
    }
  },

  /**
   * 获取最后观看的视频
   * @param userId 用户ID
   * @returns 视频ID
   */
  getLastWatched(userId: string): string | null {
    try {
      if (!userId) {
        return null;
      }

      const lastWatched = safeGetItem<Record<string, string>>(LAST_WATCHED_KEY, {});
      return lastWatched[userId] || null;
    } catch (error) {
      console.error('获取最后观看视频失败:', error);
      return null;
    }
  },

  /**
   * 设置自动播放下一个
   * @param userId 用户ID
   * @param enabled 是否启用
   * @param type 自动播放类型 ('series' | 'recommended')
   */
  setAutoplayNext(
    userId: string,
    enabled: boolean,
    type: 'series' | 'recommended' = 'series'
  ): void {
    try {
      if (!userId) {
        return;
      }

      const settings = this.getPlayerSettings(userId);

      if (type === 'series') {
        settings.autoplaySeries = enabled;
      } else {
        settings.autoplayRecommended = enabled;
      }

      this.savePlayerSettings(userId, settings);
    } catch (error) {
      console.error('设置自动播放失败:', error);
    }
  },

  /**
   * 获取自动播放设置
   * @param userId 用户ID
   * @param type 自动播放类型 ('series' | 'recommended')
   * @returns 是否启用
   */
  getAutoplayNext(userId: string, type: 'series' | 'recommended' = 'series'): boolean {
    try {
      if (!userId) {
        return false;
      }

      const settings = this.getPlayerSettings(userId);
      return type === 'series' ? settings.autoplaySeries : settings.autoplayRecommended;
    } catch (error) {
      console.error('获取自动播放设置失败:', error);
      return false;
    }
  },
};

export default videoPlayerService;
