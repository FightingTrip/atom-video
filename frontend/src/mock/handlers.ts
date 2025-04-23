/**
 * @file handlers.ts
 * @description 统一导出所有模拟API处理程序
 */

import { authHandlers, adminHandlers } from './sharedHandlers';
import { videoHandlers } from './videoHandlers';
import { creatorHandlers } from './creatorHandlers';
import { userHandlers } from './userHandlers';
import { playlistHandlers } from './playlistHandlers';
import generateDataEndpoints from './dataGenerationHandler';

// 将所有处理程序合并到一个数组中
export const handlers = [
  ...authHandlers,
  ...adminHandlers,
  ...videoHandlers,
  ...creatorHandlers,
  ...userHandlers,
  ...playlistHandlers,
  ...generateDataEndpoints,
];

export default handlers;
