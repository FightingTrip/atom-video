import express from 'express';
import { auth } from '../middleware/auth';
import * as interactionController from '../controllers/interaction.controller';
import * as commentController from '../controllers/comment.controller';

const router = express.Router();

// 互动相关路由
router.get('/videos/:videoId/interaction', auth(), interactionController.getInteraction);
router.post('/videos/:videoId/like', auth(), interactionController.toggleLike);
router.post('/videos/:videoId/favorite', auth(), interactionController.toggleFavorite);
router.get('/users/favorites', auth(), interactionController.getFavorites);

// 评论相关路由
router.get('/videos/:videoId/comments', commentController.getComments);
router.post('/videos/:videoId/comments', auth(), commentController.createComment);
router.delete('/videos/:videoId/comments/:commentId', auth(), commentController.deleteComment);
router.patch('/videos/:videoId/comments/:commentId', auth(), commentController.updateComment);

export default router;
