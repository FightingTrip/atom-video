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
import {
  authenticateJwt,
  optionalAuthJwt,
  allowGuest,
  authorize,
  authorizeRoles,
  authorizePermissions,
  UserRole,
} from '../../common/middleware/auth.middleware';

// 创建路由实例
const router = Router();

// 初始化控制器
const videoController = new VideoController();

/**
 * @route   GET /api/videos
 * @desc    获取视频列表
 * @access  Public (所有角色)
 */
router.get(
  '/',
  allowGuest, // 允许游客访问
  validateRequest(paginationSchema, 'query'),
  videoController.getVideos
);

/**
 * @route   GET /api/videos/:id
 * @desc    获取视频详情
 * @access  Public (所有角色)
 */
router.get(
  '/:id',
  allowGuest, // 允许游客访问
  validateRequest(idSchema, 'params'),
  videoController.getVideoById
);

/**
 * @route   POST /api/videos
 * @desc    创建新视频
 * @access  Private (仅创作者和管理员)
 */
router.post(
  '/',
  authenticateJwt,
  authorizeRoles([UserRole.CREATOR, UserRole.ADMIN]),
  authorizePermissions(['creator:upload']),
  validateRequest(createVideoSchema),
  videoController.createVideo
);

/**
 * @route   PUT /api/videos/:id
 * @desc    更新视频
 * @access  Private (仅视频所有者和管理员)
 */
router.put(
  '/:id',
  authenticateJwt,
  authorizePermissions(['creator:manage']),
  validateRequest(idSchema, 'params'),
  videoController.updateVideo
);

/**
 * @route   DELETE /api/videos/:id
 * @desc    删除视频
 * @access  Private (仅视频所有者和管理员)
 */
router.delete(
  '/:id',
  authenticateJwt,
  authorizePermissions(['creator:manage']),
  validateRequest(idSchema, 'params'),
  videoController.deleteVideo
);

/**
 * @route   POST /api/videos/:videoId/progress
 * @desc    更新视频观看进度
 * @access  Private (已登录用户)
 */
router.post(
  '/:videoId/progress',
  authenticateJwt,
  authorizeRoles([UserRole.USER, UserRole.CREATOR, UserRole.ADMIN]),
  videoController.updateVideoProgress
);

/**
 * @route   POST /api/videos/:id/like
 * @desc    点赞/取消点赞视频
 * @access  Private (已登录用户)
 */
router.post(
  '/:id/like',
  authenticateJwt,
  authorizeRoles([UserRole.USER, UserRole.CREATOR, UserRole.ADMIN]),
  validateRequest(idSchema, 'params'),
  videoController.likeVideo
);

/**
 * @route   POST /api/videos/:id/favorite
 * @desc    收藏/取消收藏视频
 * @access  Private (已登录用户)
 */
router.post(
  '/:id/favorite',
  authenticateJwt,
  authorizeRoles([UserRole.USER, UserRole.CREATOR, UserRole.ADMIN]),
  validateRequest(idSchema, 'params'),
  videoController.favoriteVideo
);

// 使用命名导出而不是默认导出
export const videoRoutes = router;
