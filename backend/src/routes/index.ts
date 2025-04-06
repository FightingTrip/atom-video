import { Router } from 'express';
import videoRoutes from './video.routes';
// 导入其他路由...

const router = Router();

// API前缀
const API_PREFIX = '/api';

// 注册视频路由
router.use(`${API_PREFIX}/videos`, videoRoutes);

// 其他路由...
// router.use(`${API_PREFIX}/users`, userRoutes);
// router.use(`${API_PREFIX}/auth`, authRoutes);
// router.use(`${API_PREFIX}/series`, seriesRoutes);
// 等等...

export default router;
