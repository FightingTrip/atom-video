/**
 * 创作者模块路由
 */
import { Router } from 'express';
import { CreatorBrandingController } from '../controllers/creator.branding.controller';
import { authenticate } from '../../auth/middleware/authenticate.middleware';
import { checkCreatorRole } from '../../auth/middleware/roles.middleware';

// 创建路由实例
const router = Router();
const brandingController = new CreatorBrandingController();

// 品牌设置路由
router.get(
  '/branding/settings',
  authenticate,
  checkCreatorRole,
  brandingController.getBrandingSettings
);

router.post(
  '/branding/settings',
  authenticate,
  checkCreatorRole,
  brandingController.saveBrandingSettings
);

export const creatorRoutes = router;
