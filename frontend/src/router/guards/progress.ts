/**
 * @file progress.ts
 * @description 视频播放进度相关的路由守卫
 * @author Atom Video Team
 * @date 2025-04-08
 */

import { Router } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getAllVideoProgresses, getWatchHistory } from '@/services/video/videoProgress';

// 用于保存正在进行的任务，避免重复请求
let progressTaskRunning = false;

/**
 * 注册视频进度相关的路由守卫
 * @param router Vue Router实例
 */
export function registerProgressGuard(router: Router): void {
  // 在进入视频详情页时，预加载用户的播放进度
  router.beforeEach(async (to, from, next) => {
    // 只处理视频详情页面
    if (to.name === 'video-detail' && to.params.id) {
      const authStore = useAuthStore();

      // 如果用户已登录，预加载该视频的播放进度
      if (authStore.isAuthenticated && !progressTaskRunning) {
        try {
          progressTaskRunning = true;

          // 异步加载进度数据，但不阻塞路由导航
          setTimeout(async () => {
            try {
              console.log(`[Progress] Preloading progress data for video ${to.params.id}`);

              // 这里不等待结果，让它在后台加载，提高用户体验
              getAllVideoProgresses(authStore.userId).then(() =>
                console.log('[Progress] Progress data preloaded successfully')
              );

              // 同时预加载观看历史
              getWatchHistory(authStore.userId).then(() =>
                console.log('[Progress] Watch history preloaded successfully')
              );
            } catch (error) {
              console.error('[Progress] Error preloading progress data:', error);
            } finally {
              progressTaskRunning = false;
            }
          }, 0);
        } catch (error) {
          console.error('[Progress] Error in progress guard:', error);
          progressTaskRunning = false;
        }
      }
    }

    // 继续路由导航
    next();
  });
}
