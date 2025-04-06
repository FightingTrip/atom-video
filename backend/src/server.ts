import app from './app';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 启动服务器
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`服务器已启动, 监听端口 ${PORT}`);
});

// 优雅退出
process.on('SIGINT', () => {
  console.log('正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});

export default server;
