/**
 * 服务层集中导出
 * 提供所有API服务的统一入口
 */

// 导出核心API服务
export * from './api';
export * from './api/client';
export * from './api/types';
export * from './api/errorHandler';

// 导出业务模块服务
export * from './auth';
export { default as videoService } from './video';
export * from './comment';
export * from './user';

// 导出Mock相关服务
export * from './mockHandlers';
export * from './mockData';

// 导出OAuth服务
export * from './oauth';
