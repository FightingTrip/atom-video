/**
 * @file index.ts
 * @description 模拟数据服务入口文件
 */

import { userHandlers } from './userHandlers';
import { adminHandlers } from './adminHandlers';
import { videoHandlers } from './videoHandlers';
import { playlistHandlers } from './playlistHandlers';
import { creatorHandlers } from './creatorHandlers';

// 导出所有处理程序
export const handlers = [
  ...userHandlers,
  ...adminHandlers,
  ...videoHandlers,
  ...playlistHandlers,
  ...creatorHandlers,
];

// 统一导出所有 mock 数据和 API
export * from './video';
export * from './api';
export * from './data';
export * from './users';
export * from './handlers';
export * from './creatorHandlers';
export * from './adminHandlers';
