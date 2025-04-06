import dotenv from 'dotenv';
import { AppError } from '../utils/app-error';

// 加载环境变量
dotenv.config();

// 必需的环境变量
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
    throw new AppError(500, `Missing required environment variable: ${envVar}`);
  }
}

export default {
  // 数据库
  database: {
    url: process.env.DATABASE_URL,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // 邮件服务
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'noreply@atomvideo.com',
  },

  // 存储服务
  storage: {
    type: process.env.STORAGE_TYPE,
    endpoint: process.env.STORAGE_ENDPOINT,
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secretKey: process.env.STORAGE_SECRET_KEY,
    bucket: process.env.STORAGE_BUCKET,
    region: process.env.STORAGE_REGION || 'us-east-1',
  },

  // OAuth
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackUrl: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
    },
  },

  // 应用配置
  app: {
    port: parseInt(process.env.PORT || '3000'),
    env: process.env.NODE_ENV || 'development',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    corsOrigin: process.env.CORS_ORIGIN || '*',
  },

  // 视频配置
  video: {
    maxSize: parseInt(process.env.MAX_VIDEO_SIZE || '104857600'), // 默认 100MB
    allowedTypes: (process.env.ALLOWED_VIDEO_TYPES || 'mp4,mov,avi').split(','),
    storageDir: process.env.VIDEO_STORAGE_DIR || 'uploads/videos',
    thumbnailDir: process.env.THUMBNAIL_STORAGE_DIR || 'uploads/thumbnails',
  },
} as const;
