import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

// Admin routes
router.post('/admin/login', authController.adminLogin);
router.post('/admin/logout', authController.adminLogout);

// User routes
router.post('/user/signup', authController.userSignup);
router.post('/user/login', authController.userLogin);
router.post('/user/logout', authController.userLogout);

export default router;
