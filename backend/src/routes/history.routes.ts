import express from 'express';
import { authMiddleware } from '../modules/auth/middleware';
import { HistoryController } from '../modules/history/history.controller';

const router = express.Router();
const historyController = new HistoryController();

// 观看历史相关路由
router.get('/watch', authMiddleware, historyController.getWatchHistory);
router.post('/watch/:videoId', authMiddleware, historyController.addToWatchHistory);
router.delete('/watch', authMiddleware, historyController.clearWatchHistory);
router.delete('/watch/:videoId', authMiddleware, historyController.removeFromWatchHistory);

// 实时观看中的视频（用于websocket订阅）
router.get('/watch/live', authMiddleware, historyController.getWatchingNow);

// 搜索历史相关路由
router.get('/search', authMiddleware, historyController.getSearchHistory);
router.post('/search/:keyword', authMiddleware, historyController.addToSearchHistory);
router.delete('/search', authMiddleware, historyController.clearSearchHistory);
router.delete('/search/:keyword', authMiddleware, historyController.removeFromSearchHistory);

export default router;
