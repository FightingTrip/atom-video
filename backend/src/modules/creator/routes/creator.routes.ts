import { Router } from 'express';
import { CreatorController } from '../controllers/creator.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';
import { UserRole } from '../../common/middleware/auth.middleware';

const router = Router();
const creatorController = new CreatorController();

// 创作者申请相关路由
router.post(
  '/applications',
  authMiddleware([UserRole.USER]),
  creatorController.applyForCreator.bind(creatorController)
);

router.get(
  '/applications',
  authMiddleware([UserRole.ADMIN]),
  creatorController.getCreatorApplications.bind(creatorController)
);

router.get(
  '/applications/:id',
  authMiddleware([UserRole.ADMIN]),
  creatorController.getCreatorApplicationById.bind(creatorController)
);

router.post(
  '/applications/:id/review',
  authMiddleware([UserRole.ADMIN]),
  creatorController.reviewCreatorApplication.bind(creatorController)
);

router.get(
  '/my-applications',
  authMiddleware([UserRole.USER]),
  creatorController.getUserApplications.bind(creatorController)
);

// 创作者资料相关路由
router.put(
  '/profile',
  authMiddleware([UserRole.CREATOR]),
  creatorController.updateCreatorProfile.bind(creatorController)
);

router.get(
  '/stats',
  authMiddleware([UserRole.CREATOR]),
  creatorController.getCreatorStats.bind(creatorController)
);

router.get(
  '/top',
  creatorController.getTopCreators.bind(creatorController)
);

export default router; 