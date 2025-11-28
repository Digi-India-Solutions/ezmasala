import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Public/Optional auth routes
router.get('/', optionalAuth, orderController.getAll);
router.post('/', optionalAuth, orderController.create);

// Admin only routes - must be before /:id to avoid conflicts
router.post('/export', authenticate, requireAdmin, orderController.exportOrders);

// Order by ID routes
router.get('/:id', optionalAuth, orderController.getById);
router.get('/:id/invoice', authenticate, requireAdmin, orderController.generateInvoice);
router.patch('/:id', authenticate, requireAdmin, orderController.updateStatus);

export default router;
