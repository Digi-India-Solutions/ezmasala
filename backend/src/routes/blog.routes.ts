import { Router } from 'express';
import * as blogController from '../controllers/blogController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', blogController.getAll);
router.get('/slug/:slug', blogController.getBySlug);
router.get('/:id', blogController.getById);

// Protected routes (Admin only)
router.post('/', authenticate, requireAdmin, blogController.create);
router.put('/:id', authenticate, requireAdmin, blogController.update);
router.delete('/:id', authenticate, requireAdmin, blogController.deleteBlog);

export default router;
