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
export * from './user/index';

// 导出Mock相关服务
export * from './mockHandlers';

// 导出OAuth服务
// 将auth中已经导出的OAuth服务重命名，避免冲突
export { OAuthService as OAuthServiceBase } from './oauth';
export type { OAuthProvider as OAuthProviderBase } from './oauth';
