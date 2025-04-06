/**
 * 互动路由模块
 *
 * 定义互动相关的API路由
 * @module interaction/routes/interaction
 */

import { Router } from 'express';
import { InteractionController } from '../controllers/interaction.controller';
import { authenticate } from '../../common/middleware/auth.middleware';
import { validateRequest } from '../../common/utils/validation';
import Joi from 'joi';

const router = Router();
const interactionController = new InteractionController();

// 校验规则
const idSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const videoIdSchema = Joi.object({
  videoId: Joi.string().uuid().required(),
});

const commentIdSchema = Joi.object({
  commentId: Joi.string().uuid().required(),
});

const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required().messages({
    'string.empty': '评论内容不能为空',
    'string.min': '评论内容不能为空',
    'string.max': '评论内容最多1000个字符',
    'any.required': '评论内容是必填项'
  }),
  videoId: Joi.string().uuid().required().messages({
    'string.guid': '视频ID必须是有效的UUID',
    'any.required': '视频ID是必填项'
  }),
  parentId: Joi.string().uuid().allow(null, '').messages({
    'string.guid': '父评论ID必须是有效的UUID'
  })
});

const updateCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required().messages({
    'string.empty': '评论内容不能为空',
    'string.min': '评论内容不能为空',
    'string.max': '评论内容最多1000个字符',
    'any.required': '评论内容是必填项'
  })
});

const paginationSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0)
});

// 点赞相关路由
router.post(
  '/videos/:videoId/like',
  authenticate,
  validateRequest({ params: videoIdSchema }),
  interactionController.likeVideo.bind(interactionController)
);

router.delete(
  '/videos/:videoId/like',
  authenticate,
  validateRequest({ params: videoIdSchema }),
  interactionController.unlikeVideo.bind(interactionController)
);

router.get(
  '/videos/:videoId/has-liked',
  authenticate,
  validateRequest({ params: videoIdSchema }),
  interactionController.hasLikedVideo.bind(interactionController)
);

router.get(
  '/likes',
  authenticate,
  validateRequest({ query: paginationSchema }),
  interactionController.getLikedVideos.bind(interactionController)
);

// 评论相关路由
router.post(
  '/comments',
  authenticate,
  validateRequest({ body: createCommentSchema }),
  interactionController.createComment.bind(interactionController)
);

router.get(
  '/videos/:videoId/comments',
  validateRequest({ params: videoIdSchema, query: Joi.object({
    parentId: Joi.string().uuid().allow(null, ''),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0),
    sort: Joi.string().valid('newest', 'oldest', 'popular').default('newest')
  }) }),
  interactionController.getVideoComments.bind(interactionController)
);

router.put(
  '/comments/:commentId',
  authenticate,
  validateRequest({ params: commentIdSchema, body: updateCommentSchema }),
  interactionController.updateComment.bind(interactionController)
);

router.delete(
  '/comments/:commentId',
  authenticate,
  validateRequest({ params: commentIdSchema }),
  interactionController.deleteComment.bind(interactionController)
);

router.post(
  '/comments/:commentId/like',
  authenticate,
  validateRequest({ params: commentIdSchema }),
  interactionController.likeComment.bind(interactionController)
);

router.delete(
  '/comments/:commentId/like',
  authenticate,
  validateRequest({ params: commentIdSchema }),
  interactionController.unlikeComment.bind(interactionController)
);

// 收藏相关路由
router.post(
  '/videos/:videoId/save',
  authenticate,
  validateRequest({ params: videoIdSchema }),
  interactionController.saveVideo.bind(interactionController)
);

router.delete(
  '/videos/:videoId/save',
  authenticate,
  validateRequest({ params: videoIdSchema }),
  interactionController.unsaveVideo.bind(interactionController)
);

router.get(
  '/videos/:videoId/has-saved',
  authenticate,
  validateRequest({ params: videoIdSchema }),
  interactionController.hasSavedVideo.bind(interactionController)
);

router.get(
  '/saved',
  authenticate,
  validateRequest({ query: paginationSchema }),
  interactionController.getSavedVideos.bind(interactionController)
);

export const interactionRoutes = router; 