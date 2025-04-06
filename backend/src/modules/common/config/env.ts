/**
 * 环境配置模块
 *
 * 读取并验证应用所需的环境变量，提供配置对象
 * @module common/config/env
 */

import * as dotenv from 'dotenv';
import { AppError } from '../utils/app-error';

// 加载环境变量
dotenv.config();

/**
 * 必需的环境变量列表
 * 应用启动时会验证这些变量是否存在
 */
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'STORAGE_TYPE', // 'local' | 's3' | 'oss'
  'STORAGE_ENDPOINT', // 存储服务的终端节点
  'STORAGE_ACCESS_KEY',
  'STORAGE_SECRET_KEY',
  'STORAGE_BUCKET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
];

// 验证环境变量
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new AppError(`缺少必需的环境变量: ${envVar}`, 500);
  }
}

/**
 * 应用配置对象
 */
const config = {
  /**
   * 数据库配置
   */
  database: {
    /** 数据库连接URL */
    url: process.env.DATABASE_URL,
  },

  /**
   * JWT配置
   */
  jwt: {
    /** JWT密钥 */
    secret: process.env.JWT_SECRET!,
    /** JWT过期时间 */
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  /**
   * 邮件服务配置
   */
  smtp: {
    /** 邮件服务器主机 */
    host: process.env.SMTP_HOST!,
    /** 邮件服务器端口 */
    port: parseInt(process.env.SMTP_PORT || '587'),
    /** 邮件服务器用户名 */
    user: process.env.SMTP_USER!,
    /** 邮件服务器密码 */
    pass: process.env.SMTP_PASS!,
    /** 邮件发送者地址 */
    from: process.env.SMTP_FROM || 'noreply@atomvideo.com',
  },

  /**
   * 存储服务配置
   */
  storage: {
    /** 存储服务类型: 'local' | 's3' | 'oss' */
    type: process.env.STORAGE_TYPE!,
    /** 存储服务终端节点 */
    endpoint: process.env.STORAGE_ENDPOINT!,
    /** 存储服务访问密钥 */
    accessKey: process.env.STORAGE_ACCESS_KEY!,
    /** 存储服务密钥 */
    secretKey: process.env.STORAGE_SECRET_KEY!,
    /** 存储服务存储桶 */
    bucket: process.env.STORAGE_BUCKET!,
    /** 存储服务区域 */
    region: process.env.STORAGE_REGION || 'us-east-1',
  },

  /**
   * OAuth认证配置
   */
  oauth: {
    /** Google OAuth配置 */
    google: {
      /** Google客户端ID */
      clientId: process.env.GOOGLE_CLIENT_ID!,
      /** Google客户端密钥 */
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      /** Google回调URL */
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    /** GitHub OAuth配置 */
    github: {
      /** GitHub客户端ID */
      clientId: process.env.GITHUB_CLIENT_ID!,
      /** GitHub客户端密钥 */
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      /** GitHub回调URL */
      callbackUrl: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
    },
  },

  /**
   * 应用通用配置
   */
  app: {
    /** 应用端口 */
    port: parseInt(process.env.PORT || '3000'),
    /** 应用环境 */
    env: process.env.NODE_ENV || 'development',
    /** 应用基础URL */
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    /** CORS允许的源 */
    corsOrigin: process.env.CORS_ORIGIN || '*',
  },

  /**
   * 视频配置
   */
  video: {
    /** 最大视频文件大小 */
    maxSize: parseInt(process.env.MAX_VIDEO_SIZE || '104857600'), // 默认 100MB
    /** 允许的视频文件类型 */
    allowedTypes: (process.env.ALLOWED_VIDEO_TYPES || 'mp4,mov,avi').split(','),
    /** 视频存储目录 */
    storageDir: process.env.VIDEO_STORAGE_DIR || 'uploads/videos',
    /** 缩略图存储目录 */
    thumbnailDir: process.env.THUMBNAIL_STORAGE_DIR || 'uploads/thumbnails',
  },
} as const;

export default config;
