"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCancellationRequests = exports.rejectCancellation = exports.approveCancellation = exports.requestCancellation = exports.generateInvoice = exports.exportOrders = exports.updateStatus = exports.getById = exports.getAll = exports.create = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const email_1 = require("../utils/email");
// POST /api/orders
const create = async (req, res) => {
    try {
        const userId = req.user?.id || null;
        const body = req.body;
        const { userId: requestUserId, items, address, subtotal, tax, total, discount, couponCode, paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;
        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Items are required'
            });
        }
        if (typeof subtotal !== 'number' || subtotal < 0) {
            return res.status(400).json({
                success: false,
                message: 'Subtotal must be a valid number'
            });
        }
        if (typeof tax !== 'number' || tax < 0) {
            return res.status(400).json({
                success: false,
                message: 'Tax must be a valid number'
            });
        }
        if (typeof total !== 'number' || total < 0) {
            return res.status(400).json({
                success: false,
                message: 'Total must be a valid number'
            });
        }
        // Validate items structure
        for (const item of items) {
            if (!item.productId || !item.title || !item.price || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have productId, title, price, and quantity'
                });
            }
        }
        // Validate address has phone number
        if (!address || !address.phone) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required for delivery'
            });
        }
        // Validate payment method
        const validPaymentMethods = ['cod', 'razorpay'];
        if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment method. Must be one of: cod, razorpay'
            });
        }
        const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
        const orderData = {
            orderId,
            userId: requestUserId || userId || null,
            items: items.map((item) => ({
                productId: item.productId,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                image: item.image || ''
            })),
            address: address || {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            },
            subtotal,
            tax,
            total,
            discount: discount || 0,
            couponCode: couponCode || null,
            paymentMethod: paymentMethod || 'cod',
            paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
            razorpayOrderId: razorpayOrderId || null,
            razorpayPaymentId: razorpayPaymentId || null,
            razorpaySignature: razorpaySignature || null,
            status: 'pending'
        };
        const order = await Order_1.default.create(orderData);
        // Send order confirmation email to customer and notification to admin
        try {
            let customerEmail = address?.email || null;
            let customerName = address?.name || 'Customer';
            // If user is logged in, get their details
            const finalUserId = requestUserId || userId;
            if (finalUserId) {
                const user = await User_1.default.findById(finalUserId);
                if (user) {
                    customerEmail = user.email;
                    customerName = `${user.firstName} ${user.lastName}`.trim() || customerName;
                }
            }
            // Send confirmation email to customer
            if (customerEmail) {
                const emailHtml = (0, email_1.getOrderConfirmationTemplate)(order.toObject(), customerName);
                await (0, email_1.sendEmail)({
                    to: customerEmail,
                    subject: `Order Confirmed - ${order.orderId}`,
                    html: emailHtml
                });
                console.log(`Order confirmation email sent to ${customerEmail}`);
            }
            // Send notification email to admin/website owner
            const notificationEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_FROM_EMAIL;
            if (notificationEmail) {
                const adminEmailHtml = (0, email_1.getOrderNotificationTemplate)(order.toObject(), customerName);
                (0, email_1.sendEmail)({
                    to: notificationEmail,
                    subject: `New Order Received - ${order.orderId} - ₹${order.total?.toFixed(2)}`,
                    html: adminEmailHtml
                }).catch(err => console.error('Failed to send admin order notification:', err));
                console.log(`Order notification email sent to admin: ${notificationEmail}`);
            }
        }
        catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError.message);
            // Don't fail the order if email fails
        }
        res.json({
            success: true,
            orderId: order.orderId,
            order: order,
            message: 'Order placed successfully'
        });
    }
    catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to place order'
        });
    }
};
exports.create = create;
// GET /api/orders
const getAll = async (req, res) => {
    try {
        const { userId } = req.query;
        const authenticatedUserId = req.user?.id || null;
        const queryUserId = userId || authenticatedUserId;
        const query = queryUserId ? { userId: queryUserId } : {};
        const orders = await Order_1.default.find(query).sort({ createdAt: -1 }).lean();
        res.json({ success: true, orders });
    }
    catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch orders'
        });
    }
};
exports.getAll = getAll;
// GET /api/orders/:id
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid order ID format'
            });
        }
        const order = await Order_1.default.findById(id)
            .populate('userId', 'firstName lastName email')
            .lean();
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }
        res.json({ success: true, order });
    }
    catch (error) {
        console.error('Fetch order error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch order'
        });
    }
};
exports.getById = getById;
// PATCH /api/orders/:id
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus } = req.body;
        // Validate ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid order ID format'
            });
        }
        const updateData = {};
        // Validate and add status if provided
        if (status) {
            const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                });
            }
            updateData.status = status;
        }
        // Validate and add paymentStatus if provided
        if (paymentStatus) {
            const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
            if (!validPaymentStatuses.includes(paymentStatus)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(', ')}`
                });
            }
            updateData.paymentStatus = paymentStatus;
        }
        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid fields to update. Provide status or paymentStatus.'
            });
        }
        const order = await Order_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('userId', 'firstName lastName email');
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }
        res.json({ success: true, order });
    }
    catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update order'
        });
    }
};
exports.updateStatus = updateStatus;
// POST /api/orders/export
const exportOrders = async (req, res) => {
    try {
        const { orderIds } = req.body;
        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Order IDs are required'
            });
        }
        const orders = await Order_1.default.find({ _id: { $in: orderIds } })
            .populate('userId', 'firstName lastName email')
            .lean();
        // Create CSV content
        const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Address', 'Items', 'Subtotal', 'Tax', 'Total', 'Payment Method', 'Payment Status', 'Order Status', 'Date'];
        const rows = orders.map((order) => {
            const customerName = order.userId
                ? `${order.userId.firstName || ''} ${order.userId.lastName || ''}`.trim()
                : 'Guest';
            const email = order.userId?.email || order.address?.email || 'N/A';
            const phone = order.address?.phone || 'N/A';
            const address = order.address
                ? `${order.address.street || ''}, ${order.address.city || ''}, ${order.address.state || ''} ${order.address.zipCode || ''}`.replace(/,\s*,/g, ',').trim()
                : 'N/A';
            const items = order.items?.map((item) => `${item.title} x${item.quantity}`).join('; ') || 'N/A';
            const date = new Date(order.createdAt).toLocaleDateString('en-IN');
            return [
                order.orderId || order._id,
                customerName,
                email,
                phone,
                `"${address}"`,
                `"${items}"`,
                order.subtotal || 0,
                order.tax || 0,
                order.total || 0,
                order.paymentMethod || 'N/A',
                order.paymentStatus || 'N/A',
                order.status || 'N/A',
                date
            ].join(',');
        });
        const csv = [headers.join(','), ...rows].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=orders-export-${Date.now()}.csv`);
        res.send(csv);
    }
    catch (error) {
        console.error('Export orders error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to export orders'
        });
    }
};
exports.exportOrders = exportOrders;
// GET /api/orders/:id/invoice
const generateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid order ID format'
            });
        }
        const order = await Order_1.default.findById(id)
            .populate('userId', 'firstName lastName email')
            .lean();
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }
        // Generate simple HTML invoice
        const customerName = order.userId
            ? `${order.userId.firstName || ''} ${order.userId.lastName || ''}`.trim()
            : 'Guest Customer';
        const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${order.orderId}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; }
    .header h1 { color: #333; margin-bottom: 5px; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .info-box { width: 45%; }
    .info-box h3 { margin-bottom: 10px; color: #666; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; }
    .totals { text-align: right; }
    .totals p { margin: 5px 0; }
    .total-final { font-size: 18px; font-weight: bold; }
    .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>EZ Masala</h1>
    <p>Tax Invoice</p>
  </div>

  <div class="info-row">
    <div class="info-box">
      <h3>BILL TO</h3>
      <p><strong>${customerName}</strong></p>
      <p>${order.address?.street || ''}</p>
      <p>${order.address?.city || ''}, ${order.address?.state || ''} ${order.address?.zipCode || ''}</p>
      <p>Phone: ${order.address?.phone || 'N/A'}</p>
    </div>
    <div class="info-box">
      <h3>INVOICE DETAILS</h3>
      <p><strong>Invoice #:</strong> ${order.orderId}</p>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod?.toUpperCase() || 'N/A'}</p>
      <p><strong>Status:</strong> ${order.paymentStatus || 'N/A'}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${(order.items || []).map((item) => `
        <tr>
          <td>${item.title}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price}</td>
          <td>₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <p>Subtotal: ₹${order.subtotal?.toFixed(2) || '0.00'}</p>
    <p>Tax: ₹${order.tax?.toFixed(2) || '0.00'}</p>
    <p class="total-final">Total: ₹${order.total?.toFixed(2) || '0.00'}</p>
  </div>

  <div class="footer">
    <p>Thank you for shopping with EZ Masala!</p>
    <p>For queries, contact us at support@ezmasala.com</p>
  </div>
</body>
</html>`;
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderId}.html`);
        res.send(invoiceHtml);
    }
    catch (error) {
        console.error('Generate invoice error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate invoice'
        });
    }
};
exports.generateInvoice = generateInvoice;
// POST /api/orders/:id/request-cancellation - User requests order cancellation
const requestCancellation = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const userId = req.user?.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid order ID format'
            });
        }
        const order = await Order_1.default.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }
        // Verify user owns this order
        if (order.userId && order.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You are not authorized to cancel this order'
            });
        }
        // Check if order can be cancelled
        if (['delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                error: `Cannot request cancellation for ${order.status} orders`
            });
        }
        if (order.cancellationRequested) {
            return res.status(400).json({
                success: false,
                error: 'Cancellation already requested for this order'
            });
        }
        order.cancellationRequested = true;
        order.cancellationReason = reason || 'No reason provided';
        order.cancellationStatus = 'pending';
        order.cancellationRequestedAt = new Date();
        await order.save();
        res.json({
            success: true,
            message: 'Cancellation request submitted successfully',
            order
        });
    }
    catch (error) {
        console.error('Request cancellation error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to request cancellation'
        });
    }
};
exports.requestCancellation = requestCancellation;
// POST /api/orders/:id/approve-cancellation - Admin approves cancellation
const approveCancellation = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid order ID format'
            });
        }
        const order = await Order_1.default.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }
        if (!order.cancellationRequested || order.cancellationStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                error: 'No pending cancellation request for this order'
            });
        }
        order.cancellationStatus = 'approved';
        order.status = 'cancelled';
        order.cancellationProcessedAt = new Date();
        await order.save();
        res.json({
            success: true,
            message: 'Cancellation approved',
            order
        });
    }
    catch (error) {
        console.error('Approve cancellation error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to approve cancellation'
        });
    }
};
exports.approveCancellation = approveCancellation;
// POST /api/orders/:id/reject-cancellation - Admin rejects cancellation
const rejectCancellation = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid order ID format'
            });
        }
        const order = await Order_1.default.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }
        if (!order.cancellationRequested || order.cancellationStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                error: 'No pending cancellation request for this order'
            });
        }
        order.cancellationStatus = 'rejected';
        order.cancellationProcessedAt = new Date();
        await order.save();
        res.json({
            success: true,
            message: 'Cancellation rejected',
            order
        });
    }
    catch (error) {
        console.error('Reject cancellation error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to reject cancellation'
        });
    }
};
exports.rejectCancellation = rejectCancellation;
// GET /api/orders/cancellation-requests - Get all orders with pending cancellation requests (admin)
const getCancellationRequests = async (req, res) => {
    try {
        const orders = await Order_1.default.find({
            cancellationRequested: true,
            cancellationStatus: 'pending'
        })
            .populate('userId', 'firstName lastName email')
            .sort({ cancellationRequestedAt: -1 })
            .lean();
        res.json({ success: true, orders });
    }
    catch (error) {
        console.error('Fetch cancellation requests error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch cancellation requests'
        });
    }
};
exports.getCancellationRequests = getCancellationRequests;
//# sourceMappingURL=orderController.js.map