/**
 * @deprecated 此文件已废弃，请使用 video.routes.ts
 * 此文件将在后续版本中移除
 */

import { Router } from 'express';
import { VideoController } from '../controllers/videoController';
import { authenticate } from '../middleware/auth';

const router = Router();

// 获取视频列表
router.get('/', VideoController.getVideos);

// 获取视频详情
router.get('/:id', VideoController.getVideo);

// 需要认证的路由
router.use(authenticate);

// 上传视频
router.post('/upload', VideoController.uploadVideo);

// 更新视频信息
router.put('/:id', VideoController.updateVideo);

// 删除视频
router.delete('/:id', VideoController.deleteVideo);

// 点赞/取消点赞视频
router.post('/:id/like', VideoController.toggleLike);

export default router;
