import { Router } from 'express';
import videoRoutes from './video.routes';
import userRoutes from './user';
import authRoutes from './auth';
import tagRoutes from './tag';
import interactionRoutes from './interaction';
import searchRoutes from './search';
import favoriteRoutes from './favorite';

/**
 * API路由聚合模块 - 负责注册所有API路由
 */
const router = Router();

// API前缀
const API_PREFIX = '/api';

// 注册各种路由
router.use(`${API_PREFIX}/videos`, videoRoutes);
router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/tags`, tagRoutes);
router.use(`${API_PREFIX}/interactions`, interactionRoutes);
router.use(`${API_PREFIX}/search`, searchRoutes);
router.use(`${API_PREFIX}/favorites`, favoriteRoutes);

export default router;
