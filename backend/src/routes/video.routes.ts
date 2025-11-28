import { Router } from 'express';
import * as videoController from '../controllers/videoController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', videoController.getAll);
router.get('/:id', videoController.getById);

// Protected routes (Admin only)
router.post('/', authenticate, requireAdmin, videoController.create);
router.put('/:id', authenticate, requireAdmin, videoController.update);
router.delete('/:id', authenticate, requireAdmin, videoController.deleteVideo);

export default router;
