import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

// Admin routes
router.post('/admin/login', authController.adminLogin);
router.post('/admin/logout', authController.adminLogout);

// User routes - OTP based signup
router.post('/user/send-otp', authController.sendSignupOTP);
router.post('/user/verify-otp', authController.verifySignupOTP);
router.post('/user/resend-otp', authController.resendSignupOTP);

// User routes - Legacy signup (kept for compatibility)
router.post('/user/signup', authController.userSignup);
router.post('/user/login', authController.userLogin);
router.post('/user/logout', authController.userLogout);

// User routes - Forgot Password
router.post('/user/forgot-password', authController.forgotPassword);
router.post('/user/verify-reset-otp', authController.verifyResetOTP);
router.post('/user/reset-password', authController.resetPassword);
router.post('/user/resend-reset-otp', authController.resendResetOTP);

export default router;
