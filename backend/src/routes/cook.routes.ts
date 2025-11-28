import { Router } from 'express';
import * as cookController from '../controllers/cookController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', cookController.getAll);
router.get('/slug/:slug', cookController.getBySlug);

// Protected routes (Admin only)
router.post('/', authenticate, requireAdmin, cookController.create);
router.put('/:id', authenticate, requireAdmin, cookController.update);
router.delete('/:id', authenticate, requireAdmin, cookController.deleteCook);

export default router;
