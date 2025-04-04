import app from './app';
import dotenv from 'dotenv';
import logger from './utils/logger';

// 加载环境变量
dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
