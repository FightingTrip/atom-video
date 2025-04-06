/**
 * @file index.ts
 * @description 常量配置文件
 * @author Atom Video Team
 * @date 2025-04-06
 */

// 应用配置
export const APP_CONFIG = {
  name: 'Atom Video',
  version: '1.0.0',
  description: 'A modern video sharing platform',
};

// 视频配置
export const VIDEO_CONFIG = {
  maxFileSize: 500 * 1024 * 1024, // 500MB
  allowedTypes: ['video/mp4', 'video/webm', 'video/ogg'],
  maxDuration: 3600, // 1小时
  thumbnailSize: {
    width: 1280,
    height: 720,
  },
};

// 用户配置
export const USER_CONFIG = {
  maxAvatarSize: 5 * 1024 * 1024, // 5MB
  allowedAvatarTypes: ['image/jpeg', 'image/png', 'image/gif'],
  maxBioLength: 500,
  maxUsernameLength: 30,
};

// 分页配置
export const PAGINATION_CONFIG = {
  defaultPageSize: 20,
  maxPageSize: 100,
};

// 缓存配置
export const CACHE_CONFIG = {
  videoCacheDuration: 3600, // 1小时
  userCacheDuration: 1800, // 30分钟
  tagCacheDuration: 7200, // 2小时
};

// 主题配置
export const THEME_CONFIG = {
  light: {
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    background: '#ffffff',
    text: '#000000',
  },
  dark: {
    primary: '#177ddc',
    success: '#49aa19',
    warning: '#d89614',
    error: '#d32029',
    background: '#141414',
    text: '#ffffff',
  },
};
