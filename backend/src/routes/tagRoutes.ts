import express from 'express';
import { getTagTrends } from '../controllers/tagController';

const router = express.Router();

// 获取标签趋势
router.get('/trends', getTagTrends);

export default router;
