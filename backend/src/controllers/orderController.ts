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

    console.log('Creating order with data:', { orderId, paymentMethod, total, itemsCount: items.length });

    const order = await Order.create(orderData);

    console.log('Order created successfully:', { orderId: order.orderId, _id: order._id, paymentStatus: order.paymentStatus });

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
    const { status } = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
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
