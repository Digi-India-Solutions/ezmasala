"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createOrder = void 0;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = require("../config/razorpay");
// POST /api/razorpay/create-order
const createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt, notes } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        const razorpay = (0, razorpay_1.getRazorpayInstance)();
        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            notes: notes || {},
        });
        res.json({ success: true, order });
    }
    catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.createOrder = createOrder;
// POST /api/razorpay/verify-payment
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment details' });
        }
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');
        const isValid = expectedSignature === razorpay_signature;
        if (isValid) {
            // Here you can update your database with order status
            // For example: await updateOrderStatus(razorpay_order_id, 'paid');
            res.json({
                success: true,
                message: 'Payment verified successfully',
                paymentId: razorpay_payment_id,
            });
        }
        else {
            res.status(400).json({ error: 'Invalid signature' });
        }
    }
    catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            error: error.message || 'Payment verification failed'
        });
    }
};
exports.verifyPayment = verifyPayment;
//# sourceMappingURL=razorpayController.js.map