import express from 'express';
import { auth } from '../middleware/auth';
import * as favoriteController from '../controllers/favorite';

const router = express.Router();

// 获取视频收藏状态
router.get('/videos/:videoId/favorite', auth(), favoriteController.getFavoriteStatus);

// 切换收藏状态
router.post('/videos/:videoId/favorite', auth(), favoriteController.toggleFavorite);

// 获取用户收藏的视频列表
router.get('/users/favorites', auth(), favoriteController.getUserFavorites);

export default router;
