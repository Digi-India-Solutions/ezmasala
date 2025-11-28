import { Router } from 'express';
import * as bannerController from '../controllers/bannerController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', bannerController.getAll);

// Protected routes (Admin only)
router.post('/', authenticate, requireAdmin, bannerController.create);
router.put('/:id', authenticate, requireAdmin, bannerController.update);
router.delete('/:id', authenticate, requireAdmin, bannerController.deleteBanner);

export default router;
