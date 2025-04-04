import express from 'express';
import { authenticate } from '../middleware/auth';
import { upload } from '../utils/storage';
import {
  uploadVideo,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/videoController';

const router = express.Router();

// 上传视频
router.post('/upload', authenticate, upload.single('video'), uploadVideo);

// 获取视频列表
router.get('/', getVideos);

// 获取单个视频
router.get('/:id', getVideo);

// 更新视频
router.patch('/:id', authenticate, updateVideo);

// 删除视频
router.delete('/:id', authenticate, deleteVideo);

export default router;
