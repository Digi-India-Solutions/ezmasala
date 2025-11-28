import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Public/Optional auth routes
router.get('/', optionalAuth, orderController.getAll);
router.post('/', optionalAuth, orderController.create);
router.get('/:id', optionalAuth, orderController.getById);

// Admin only routes
router.patch('/:id', authenticate, requireAdmin, orderController.updateStatus);

export default router;
