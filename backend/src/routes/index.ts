/**
 * API路由索引模块
 *
 * 集中管理和注册所有模块的路由
 * @module routes/index
 */

import { Router } from 'express';
import { videoRoutes } from '../modules/video/routes/video.routes';
import { userRoutes } from '../modules/user/routes/user.routes';
import { authRoutes } from '../modules/auth/routes/auth.routes';
import { tagRoutes } from '../modules/tag/routes/tag.routes';
import { interactionRoutes } from '../modules/interaction/routes/interaction.routes';
// 以下路由将在后续实现
// import { searchRoutes } from '../modules/search/routes/search.routes';
// import { seriesRoutes } from '../modules/series/routes/series.routes';

// API路由前缀
const API_PREFIX = '/api';

// 创建主路由实例
const router = Router();

// 注册视频模块路由
router.use(`${API_PREFIX}/videos`, videoRoutes);

// 注册用户模块路由
router.use(`${API_PREFIX}/users`, userRoutes);

// 注册认证模块路由
router.use(`${API_PREFIX}/auth`, authRoutes);

// 注册标签模块路由
router.use(`${API_PREFIX}/tags`, tagRoutes);

// 注册交互模块路由
router.use(`${API_PREFIX}/interactions`, interactionRoutes);

// 注册搜索模块路由 (将在后续实现)
// router.use(`${API_PREFIX}/search`, searchRoutes);

// 注册系列模块路由 (将在后续实现)
// router.use(`${API_PREFIX}/series`, seriesRoutes);

export default router;
