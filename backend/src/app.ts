import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { getPrismaClient } from './utils/db-helpers';

// 加载环境变量
dotenv.config();

// 初始化Prisma客户端
const prisma = getPrismaClient();

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

// 注册API路由
app.use(routes);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'Not Found',
    timestamp: new Date().toISOString(),
  });
});

// 错误处理中间件
app.use(errorHandler);

// 进程关闭时断开数据库连接
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
