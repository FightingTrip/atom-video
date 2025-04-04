import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import videoRoutes from './routes/videoRoutes';
import authRoutes from './routes/authRoutes';
import logger from './utils/logger';

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Atom Video API' });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response) => {
  logger.error('Error:', err);
  res.status(500).json({ error: 'Something broke!' });
});

export default app;
