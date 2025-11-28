import { Router } from 'express';
import * as dealController from '../controllers/dealController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', dealController.getAll);

// Protected routes (Admin only)
router.post('/', authenticate, requireAdmin, dealController.create);
router.put('/:id', authenticate, requireAdmin, dealController.update);
router.delete('/:id', authenticate, requireAdmin, dealController.deleteDeal);

export default router;
