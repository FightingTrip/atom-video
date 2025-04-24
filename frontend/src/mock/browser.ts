/**
 * @file browser.ts
 * @description 浏览器环境的MSW设置
 */

import { setupWorker } from 'msw/browser';
import { authHandlers, adminHandlers } from './sharedHandlers';
import { videoHandlers } from './videoHandlers';
import { userHandlers } from './userHandlers';
import { playlistHandlers } from './playlistHandlers';
import { creatorHandlers } from './creatorHandlers';

// 将所有处理程序合并为一个数组
const handlers = [
  ...authHandlers,
  ...adminHandlers,
  ...videoHandlers,
  ...userHandlers,
  ...playlistHandlers,
  ...creatorHandlers,
];

// 添加日志
console.log(
  '[MSW] 注册处理程序:',
  `认证(${authHandlers.length})`,
  `管理(${adminHandlers.length})`,
  `视频(${videoHandlers.length})`,
  `用户(${userHandlers.length})`,
  `播放列表(${playlistHandlers.length})`,
  `创作者(${creatorHandlers.length})`
);

// 创建浏览器worker实例
export const worker = setupWorker(...handlers);

// 定义worker配置函数
export const setupMockWorker = async () => {
  // 打印启动信息
  console.log('[MSW] 模拟API已启动');
  console.log('[MSW] 共注册了', handlers.length, '个API处理程序');

  // 启动worker并启用详细调试
  await worker.start({
    // 只警告API请求的未处理情况，忽略其他资源
    onUnhandledRequest(request, print) {
      // 只对API请求发出警告
      const url = new URL(request.url);
      if (url.pathname.startsWith('/api/')) {
        // 对API请求显示警告
        print.warning();
      } else {
        // 忽略非API请求，如Vue组件、静态资源等
        // 不输出任何内容
      }
    },

    // 添加详细日志
    serviceWorker: {
      url: '/mockServiceWorker.js',
      options: {
        // 使用scope '/'确保捕获所有API请求
        scope: '/',
      },
    },
  });

  console.log('[MSW] 服务工作器已启动和激活');

  return worker;
};

export default { worker, setupMockWorker };
