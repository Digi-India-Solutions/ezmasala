import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth';

const router = Router();

// Admin only - Get all users
router.get('/', authenticate, requireAdmin, userController.getAll);

// Get user by ID (user can view own profile, admin can view any)
router.get('/:id', optionalAuth, userController.getById);

// Profile update (requires authentication)
router.put('/:id/profile', authenticate, userController.updateProfile);

// Address management (requires authentication)
router.post('/:id/addresses', authenticate, userController.addAddress);
router.put('/:id/addresses', authenticate, userController.updateAddresses);

export default router;
