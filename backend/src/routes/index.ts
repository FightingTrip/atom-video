/**
 * API路由索引模块
 *
 * 注册所有API路由
 */

import { Router } from 'express';
import videoRoutes from '../modules/video/routes/video.routes';
// 导入其他模块的路由
// import userRoutes from '../modules/user/routes/user.routes';
// import authRoutes from '../modules/auth/routes/auth.routes';
// import tagRoutes from '../modules/tag/routes/tag.routes';
// import interactionRoutes from '../modules/interaction/routes/interaction.routes';
// import searchRoutes from '../modules/search/routes/search.routes';
// import seriesRoutes from '../modules/series/routes/series.routes';

// 创建主路由实例
const router = Router();

// API前缀
const API_PREFIX = '/api';

// 注册视频路由
router.use(`${API_PREFIX}/videos`, videoRoutes);

// 注册其他模块的路由 - 将在实现对应模块后取消注释
// router.use(`${API_PREFIX}/users`, userRoutes);
// router.use(`${API_PREFIX}/auth`, authRoutes);
// router.use(`${API_PREFIX}/tags`, tagRoutes);
// router.use(`${API_PREFIX}/interactions`, interactionRoutes);
// router.use(`${API_PREFIX}/search`, searchRoutes);
// router.use(`${API_PREFIX}/series`, seriesRoutes);

export default router;
