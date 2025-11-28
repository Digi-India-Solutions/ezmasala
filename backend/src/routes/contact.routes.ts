import { Router } from 'express';
import * as contactController from '../controllers/contactController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes (anyone can submit contact form)
router.post('/', contactController.create);

// Protected routes (Admin only)
router.get('/', authenticate, requireAdmin, contactController.getAll);
router.get('/:id', authenticate, requireAdmin, contactController.getById);
router.delete('/:id', authenticate, requireAdmin, contactController.deleteContact);

export default router;
