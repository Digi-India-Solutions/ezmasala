import { Router } from 'express';
import * as iconController from '../controllers/iconController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', iconController.getAll);
router.get('/:id', iconController.getById);

// Protected routes (Admin only)
router.post('/', authenticate, requireAdmin, iconController.create);
router.put('/:id', authenticate, requireAdmin, iconController.update);
router.delete('/:id', authenticate, requireAdmin, iconController.deleteIcon);

export default router;
