/**
 * 服务器启动模块
 *
 * 负责启动Express应用并监听请求
 */

import app from './app';
import { getPrismaClient } from './modules/common/utils/db-helpers';
import config from './modules/common/config/env';

// 获取端口
const PORT = config.app.port || 3000;

// 初始化Prisma客户端
const prisma = getPrismaClient();

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`🚀 服务器运行在: http://localhost:${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});

// 处理进程终止信号
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM 收到, 正在优雅关闭服务器...');
  server.close(() => {
    console.log('👋 HTTP服务器已关闭');
    prisma.$disconnect();
  });
});

export default server;
