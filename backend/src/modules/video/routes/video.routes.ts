/**
 * 视频路由模块
 *
 * 定义视频相关的路由
 * @module video/routes/video
 */

import { Router } from 'express';
import { VideoController } from '../controllers/video.controller';
import { validateRequest } from '../../common/utils/validation';
import { createVideoSchema, idSchema, paginationSchema } from '../../common/utils/validation';
import { authenticateJwt, optionalAuthJwt } from '../../common/middleware/auth.middleware';

// 创建路由实例
const router = Router();

// 初始化控制器
const videoController = new VideoController();

/**
 * @route   GET /api/videos
 * @desc    获取视频列表
 * @access  Public (可选认证)
 */
router.get(
  '/',
  optionalAuthJwt,
  validateRequest(paginationSchema, 'query'),
  videoController.getVideos
);

/**
 * @route   GET /api/videos/:id
 * @desc    获取视频详情
 * @access  Public (可选认证)
 */
router.get(
  '/:id',
  optionalAuthJwt,
  validateRequest(idSchema, 'params'),
  videoController.getVideoById
);

/**
 * @route   POST /api/videos
 * @desc    创建新视频
 * @access  Private
 */
router.post('/', authenticateJwt, validateRequest(createVideoSchema), videoController.createVideo);

/**
 * @route   PUT /api/videos/:id
 * @desc    更新视频
 * @access  Private
 */
router.put(
  '/:id',
  authenticateJwt,
  validateRequest(idSchema, 'params'),
  videoController.updateVideo
);

/**
 * @route   DELETE /api/videos/:id
 * @desc    删除视频
 * @access  Private
 */
router.delete(
  '/:id',
  authenticateJwt,
  validateRequest(idSchema, 'params'),
  videoController.deleteVideo
);

/**
 * @route   POST /api/videos/:videoId/progress
 * @desc    更新视频观看进度
 * @access  Private
 */
router.post('/:videoId/progress', authenticateJwt, videoController.updateVideoProgress);

export default router;
