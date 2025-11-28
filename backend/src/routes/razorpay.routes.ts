import { Router } from 'express';
import * as razorpayController from '../controllers/razorpayController';

const router = Router();

// Public routes (validation handled in controller/payment gateway)
router.post('/create-order', razorpayController.createOrder);
router.post('/verify-payment', razorpayController.verifyPayment);

export default router;
