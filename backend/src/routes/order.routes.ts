import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Public/Optional auth routes
router.get('/', optionalAuth, orderController.getAll);
router.post('/', optionalAuth, orderController.create);

// Admin only routes - must be before /:id to avoid conflicts
router.post('/export', authenticate, requireAdmin, orderController.exportOrders);
router.get('/cancellation-requests', authenticate, requireAdmin, orderController.getCancellationRequests);

// Order by ID routes
router.get('/:id', optionalAuth, orderController.getById);
router.get('/:id/invoice', authenticate, requireAdmin, orderController.generateInvoice);
router.patch('/:id', authenticate, requireAdmin, orderController.updateStatus);

// Cancellation routes
router.post('/:id/request-cancellation', authenticate, orderController.requestCancellation);
router.post('/:id/approve-cancellation', authenticate, requireAdmin, orderController.approveCancellation);
router.post('/:id/reject-cancellation', authenticate, requireAdmin, orderController.rejectCancellation);

export default router;
