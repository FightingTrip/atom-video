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

// 创建浏览器worker实例
export const worker = setupWorker(...handlers);

// 定义worker配置函数
export const setupMockWorker = async () => {
  // 打印启动信息
  console.log('[MSW] 模拟API已启动');

  // 启动worker
  await worker.start({
    // 静默启动，不显示默认的MSW浏览器通知
    onUnhandledRequest: 'bypass',
  });

  return worker;
};

export default { worker, setupMockWorker };
