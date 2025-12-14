import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth';

const router = Router();

// Admin only - Get all users
router.get('/', authenticate, requireAdmin, userController.getAll);

// Get user by ID (user can view own profile, admin can view any)
router.get('/:id', optionalAuth, userController.getById);

// Profile update (uses optionalAuth for cookie-independent auth)
router.put('/:id/profile', optionalAuth, userController.updateProfile);

// Address management (uses optionalAuth for cookie-independent auth)
router.post('/:id/addresses', optionalAuth, userController.addAddress);
router.put('/:id/addresses', optionalAuth, userController.updateAddresses);

export default router;
