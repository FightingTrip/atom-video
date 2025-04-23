/**
 * @file streamingUtils.ts
 * @description 处理HLS和MPEG-DASH流媒体的工具
 */

// 检查是否支持HLS原生播放
export function isHlsSupported(): boolean {
  const video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl') !== '';
}

// 检查是否支持DASH原生播放
export function isDashSupported(): boolean {
  const video = document.createElement('video');
  return video.canPlayType('application/dash+xml') !== '';
}

// 动态加载Hls.js库
export async function loadHlsJs(): Promise<any> {
  // 如果已经加载，直接返回
  if ((window as any).Hls) {
    return (window as any).Hls;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = () => resolve((window as any).Hls);
    script.onerror = error => reject(new Error(`加载Hls.js失败: ${error}`));
    document.head.appendChild(script);
  });
}

// 动态加载dash.js库
export async function loadDashJs(): Promise<any> {
  // 如果已经加载，直接返回
  if ((window as any).dashjs) {
    return (window as any).dashjs;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/dashjs@latest/dist/dash.all.min.js';
    script.onload = () => resolve((window as any).dashjs);
    script.onerror = error => reject(new Error(`加载dash.js失败: ${error}`));
    document.head.appendChild(script);
  });
}

// 初始化HLS视频播放
export async function initHlsPlayer(
  videoElement: HTMLVideoElement,
  hlsUrl: string,
  options: {
    autoPlay?: boolean;
    startTime?: number;
    onLevelSwitched?: (level: number) => void;
    onError?: (error: any) => void;
  } = {}
): Promise<any> {
  try {
    // 判断浏览器是否原生支持HLS
    if (isHlsSupported()) {
      videoElement.src = hlsUrl;
      if (options.startTime && options.startTime > 0) {
        videoElement.currentTime = options.startTime;
      }
      if (options.autoPlay) {
        try {
          await videoElement.play();
        } catch (err) {
          console.warn('自动播放失败，可能需要用户交互:', err);
        }
      }
      return null; // 不需要返回Hls实例
    }

    // 加载Hls.js库
    const Hls = await loadHlsJs();

    // 检查Hls.js是否支持当前浏览器
    if (!Hls.isSupported()) {
      throw new Error('当前浏览器不支持HLS播放');
    }

    // 创建HLS实例
    const hls = new Hls({
      capLevelToPlayerSize: true, // 根据播放器大小选择质量
      maxBufferLength: 30, // 缓冲区长度
      maxMaxBufferLength: 60, // 最大缓冲区长度
    });

    // 监听事件
    hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
      if (options.onLevelSwitched) {
        options.onLevelSwitched(data.level);
      }
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            // 尝试恢复网络错误
            console.error('HLS网络错误，尝试恢复', data);
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            // 尝试恢复媒体错误
            console.error('HLS媒体错误，尝试恢复', data);
            hls.recoverMediaError();
            break;
          default:
            // 不可恢复的错误
            console.error('HLS致命错误', data);
            hls.destroy();
            break;
        }
      }

      if (options.onError) {
        options.onError(data);
      }
    });

    // 加载视频源
    hls.loadSource(hlsUrl);
    hls.attachMedia(videoElement);

    // 准备好后开始播放
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (options.startTime && options.startTime > 0) {
        videoElement.currentTime = options.startTime;
      }
      if (options.autoPlay) {
        try {
          videoElement.play().catch(err => {
            console.warn('自动播放失败，可能需要用户交互:', err);
          });
        } catch (err) {
          console.warn('自动播放失败，可能需要用户交互:', err);
        }
      }
    });

    return hls;
  } catch (error) {
    console.error('初始化HLS播放器失败:', error);
    // 回退到默认视频播放
    videoElement.src = hlsUrl;
    return null;
  }
}

// 初始化DASH视频播放
export async function initDashPlayer(
  videoElement: HTMLVideoElement,
  dashUrl: string,
  options: {
    autoPlay?: boolean;
    startTime?: number;
    onQualityChanged?: (quality: any) => void;
    onError?: (error: any) => void;
  } = {}
): Promise<any> {
  try {
    // 判断浏览器是否原生支持DASH
    if (isDashSupported()) {
      videoElement.src = dashUrl;
      if (options.startTime && options.startTime > 0) {
        videoElement.currentTime = options.startTime;
      }
      if (options.autoPlay) {
        try {
          await videoElement.play();
        } catch (err) {
          console.warn('自动播放失败，可能需要用户交互:', err);
        }
      }
      return null; // 不需要返回dash实例
    }

    // 加载dash.js库
    const dashjs = await loadDashJs();

    // 创建dash播放器
    const player = dashjs.MediaPlayer().create();

    // 配置播放器
    player.updateSettings({
      streaming: {
        abr: {
          autoSwitchBitrate: { video: true }, // 自动切换比特率
          limitBitrateByPortal: true, // 限制比特率基于播放区域大小
        },
        buffer: {
          stableBufferTime: 30, // 稳定缓冲时间
          bufferTimeAtTopQuality: 60, // 最高质量时的缓冲时间
        },
      },
    });

    // 注册事件
    player.on('qualityChangeRendered', (e: any) => {
      if (options.onQualityChanged) {
        options.onQualityChanged(e);
      }
    });

    player.on('error', (e: any) => {
      console.error('DASH播放器错误:', e);
      if (options.onError) {
        options.onError(e);
      }
    });

    // 初始化播放器
    player.initialize(videoElement, dashUrl, options.autoPlay);

    // 设置起始时间
    if (options.startTime && options.startTime > 0) {
      player.seek(options.startTime);
    }

    return player;
  } catch (error) {
    console.error('初始化DASH播放器失败:', error);
    // 回退到默认视频播放
    videoElement.src = dashUrl;
    return null;
  }
}

// 获取最佳的初始视频质量
export function getOptimalInitialQuality(videoElement: HTMLVideoElement): string {
  // 检测网络情况
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  // 视频播放区域大小
  const videoWidth = videoElement.clientWidth;

  // 基于网络类型和播放器尺寸选择初始质量
  if (connection) {
    const effectiveType = connection.effectiveType;

    if (effectiveType === '4g' && videoWidth > 1280) {
      return '1080p';
    } else if (
      (effectiveType === '4g' && videoWidth <= 1280) ||
      (effectiveType === '3g' && videoWidth > 640)
    ) {
      return '720p';
    } else if (
      (effectiveType === '3g' && videoWidth <= 640) ||
      (effectiveType === '2g' && videoWidth > 320)
    ) {
      return '480p';
    } else {
      return '360p';
    }
  } else {
    // 根据播放器尺寸选择
    if (videoWidth > 1280) {
      return '720p'; // 保守选择
    } else if (videoWidth > 640) {
      return '480p';
    } else {
      return '360p';
    }
  }
}

// 销毁流媒体播放器实例
export function destroyStreamingPlayer(player: any, type: 'hls' | 'dash'): void {
  if (!player) return;

  try {
    if (type === 'hls') {
      player.destroy();
    } else if (type === 'dash') {
      player.reset();
    }
  } catch (error) {
    console.error(`销毁${type}播放器失败:`, error);
  }
}
