import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Create admin (protected - only existing admins can create new admins)
router.post('/create', authenticate, requireAdmin, authController.createAdmin);

export default router;
