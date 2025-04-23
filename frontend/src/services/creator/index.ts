/**
 * @file index.ts
 * @description 导出创作者服务相关模块和类型
 */

import creatorService from './creatorService';
import type {
  CreatorStats,
  VideoAnalytics,
  CreatorVideo,
  CreatorComment,
  ChannelSettings,
  PaginatedResult,
} from './types';

export {
  creatorService,
  type CreatorStats,
  type VideoAnalytics,
  type CreatorVideo,
  type CreatorComment,
  type ChannelSettings,
  type PaginatedResult,
};
