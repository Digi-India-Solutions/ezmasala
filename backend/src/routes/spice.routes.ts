import { Router } from 'express';
import * as spiceController from '../controllers/spiceController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', spiceController.getAll);
router.get('/:id', spiceController.getById);

// Protected routes (Admin only)
router.post('/', authenticate, requireAdmin, spiceController.create);
router.put('/:id', authenticate, requireAdmin, spiceController.update);
router.delete('/:id', authenticate, requireAdmin, spiceController.deleteSpice);

// Review routes
router.post('/:id/reviews', spiceController.addReview);

export default router;
