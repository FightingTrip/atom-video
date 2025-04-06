/**
 * API路由索引模块
 *
 * 注册所有API路由
 */

import { Router } from 'express';
import videoRoutes from '../modules/video/routes/video.routes';
// 导入其他模块的路由

// 创建主路由实例
const router = Router();

// API前缀
const API_PREFIX = '/api';

// 注册视频路由
router.use(`${API_PREFIX}/videos`, videoRoutes);

// 注册其他模块的路由
// 将在后续实现中添加

export default router;
