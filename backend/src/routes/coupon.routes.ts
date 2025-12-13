import { Router } from 'express';
import * as couponController from '../controllers/couponController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/validate', couponController.validate);
router.post('/apply', couponController.apply);

// Admin routes
router.get('/', authenticate, requireAdmin, couponController.getAll);
router.get('/:id', authenticate, requireAdmin, couponController.getById);
router.post('/', authenticate, requireAdmin, couponController.create);
router.put('/:id', authenticate, requireAdmin, couponController.update);
router.delete('/:id', authenticate, requireAdmin, couponController.remove);

export default router;
