import { Router } from 'express';
import * as contactInfoController from '../controllers/contactInfoController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public route
router.get('/', contactInfoController.get);

// Admin route
router.put('/', authenticate, requireAdmin, contactInfoController.update);

export default router;
