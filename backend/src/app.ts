import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import videoRoutes from './routes/videoRoutes';
import authRoutes from './routes/auth';
import favoriteRoutes from './routes/favorite.routes';
import logger from './utils/logger';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/errorHandler';

// 加载环境变量
dotenv.config();

const app = express();

// 安全中间件
app.use(helmet());
app.use(cors());

// 性能中间件
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
});
app.use(limiter);

// 认证中间件
app.use(passport.initialize());

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Atom Video API',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api', favoriteRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 错误处理中间件
app.use(errorHandler);

export default app;
