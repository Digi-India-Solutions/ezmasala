import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/auth';

// POST /api/orders
export const create = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || null;
    const body = req.body;
    const {
      userId: requestUserId,
      items,
      address,
      subtotal,
      tax,
      total,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = body;

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

    const orderData: any = {
      orderId,
      userId: requestUserId || userId || null,
      items: items.map((item: any) => ({
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
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
      razorpayOrderId: razorpayOrderId || null,
      razorpayPaymentId: razorpayPaymentId || null,
      razorpaySignature: razorpaySignature || null,
      status: 'pending'
    };

    const order = await Order.create(orderData);

    res.json({
      success: true,
      orderId: order.orderId,
      order: order,
      message: 'Order placed successfully'
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to place order'
    });
  }
};

// GET /api/orders
export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.query;
    const authenticatedUserId = req.user?.id || null;

    const queryUserId = userId || authenticatedUserId;
    const query = queryUserId ? { userId: queryUserId } : {};

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    res.json({ success: true, orders });
  } catch (error: any) {
    console.error('Fetch orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders'
    });
  }
};

// GET /api/orders/:id
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(id)
      .populate('userId', 'firstName lastName email')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({ success: true, order });
  } catch (error: any) {
    console.error('Fetch order error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch order'
    });
  }
};

// PATCH /api/orders/:id
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    const updateData: any = {};

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

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({ success: true, order });
  } catch (error: any) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update order'
    });
  }
};

// POST /api/orders/export
export const exportOrders = async (req: Request, res: Response) => {
  try {
    const { orderIds } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order IDs are required'
      });
    }

    const orders = await Order.find({ _id: { $in: orderIds } })
      .populate('userId', 'firstName lastName email')
      .lean();

    // Create CSV content
    const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Address', 'Items', 'Subtotal', 'Tax', 'Total', 'Payment Method', 'Payment Status', 'Order Status', 'Date'];

    const rows = orders.map((order: any) => {
      const customerName = order.userId
        ? `${order.userId.firstName || ''} ${order.userId.lastName || ''}`.trim()
        : 'Guest';
      const email = order.userId?.email || order.address?.email || 'N/A';
      const phone = order.address?.phone || 'N/A';
      const address = order.address
        ? `${order.address.street || ''}, ${order.address.city || ''}, ${order.address.state || ''} ${order.address.zipCode || ''}`.replace(/,\s*,/g, ',').trim()
        : 'N/A';
      const items = order.items?.map((item: any) => `${item.title} x${item.quantity}`).join('; ') || 'N/A';
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
  } catch (error: any) {
    console.error('Export orders error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to export orders'
    });
  }
};

// GET /api/orders/:id/invoice
export const generateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(id)
      .populate('userId', 'firstName lastName email')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Generate simple HTML invoice
    const customerName = (order as any).userId
      ? `${(order as any).userId.firstName || ''} ${(order as any).userId.lastName || ''}`.trim()
      : 'Guest Customer';

    const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${(order as any).orderId}</title>
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
      <p>${(order as any).address?.street || ''}</p>
      <p>${(order as any).address?.city || ''}, ${(order as any).address?.state || ''} ${(order as any).address?.zipCode || ''}</p>
      <p>Phone: ${(order as any).address?.phone || 'N/A'}</p>
    </div>
    <div class="info-box">
      <h3>INVOICE DETAILS</h3>
      <p><strong>Invoice #:</strong> ${(order as any).orderId}</p>
      <p><strong>Date:</strong> ${new Date((order as any).createdAt).toLocaleDateString('en-IN')}</p>
      <p><strong>Payment:</strong> ${(order as any).paymentMethod?.toUpperCase() || 'N/A'}</p>
      <p><strong>Status:</strong> ${(order as any).paymentStatus || 'N/A'}</p>
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
      ${((order as any).items || []).map((item: any) => `
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
    <p>Subtotal: ₹${(order as any).subtotal?.toFixed(2) || '0.00'}</p>
    <p>Tax: ₹${(order as any).tax?.toFixed(2) || '0.00'}</p>
    <p class="total-final">Total: ₹${(order as any).total?.toFixed(2) || '0.00'}</p>
  </div>

  <div class="footer">
    <p>Thank you for shopping with EZ Masala!</p>
    <p>For queries, contact us at support@ezmasala.com</p>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${(order as any).orderId}.html`);
    res.send(invoiceHtml);
  } catch (error: any) {
    console.error('Generate invoice error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate invoice'
    });
  }
};
