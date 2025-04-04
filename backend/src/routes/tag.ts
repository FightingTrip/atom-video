import express from 'express';
import { getPopularTags, getTagVideos, getTagStats } from '../controllers/tag';

const router = express.Router();

// 获取热门标签
router.get('/popular', getPopularTags);

// 获取标签视频
router.get('/:tag/videos', getTagVideos);

// 获取标签统计
router.get('/stats', getTagStats);

export default router;
