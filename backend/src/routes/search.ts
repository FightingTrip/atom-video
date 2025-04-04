import { Router } from 'express';
import { searchController } from '../controllers/search';

const router = Router();

// 搜索视频
router.get('/videos', searchController.searchVideos);

// 搜索用户
router.get('/users', searchController.searchUsers);

// 获取热门搜索
router.get('/hot', searchController.getHotSearches);

// 获取搜索建议
router.get('/suggestions', searchController.getSearchSuggestions);

export default router;
