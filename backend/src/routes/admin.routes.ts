import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

// Create admin (should be protected in production)
router.post('/create', authController.createAdmin);

export default router;
