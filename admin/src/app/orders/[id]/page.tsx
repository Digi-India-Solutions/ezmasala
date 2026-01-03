'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { isAdminAuthenticated, clearAdminAuth } from '@/utils/adminAuth';
import api from '@/lib/api';

interface OrderDetails {
  _id: string;
  orderId: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    addresses?: Array<{
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phone?: string;
      isDefault?: boolean;
    }>;
  } | null;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  address: {
    name?: string;
    phone?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: string;
  createdAt: string;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/login');
      return;
    }
    if (params.id) {
      fetchOrderDetails();
    }
  }, [params.id, router]);

  const fetchOrderDetails = async () => {
    try {
      const data = await api.get(`/orders/${params.id}`);
      if (data.success) {
        setOrder(data.order);
      } else {
        toast.error('Order not found');
        router.push('/orders');
      }
    } catch (error: any) {
      console.error('Failed to fetch order:', error);
      toast.error(error.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    setUpdating(true);
    try {
      const data = await api.patch(`/orders/${order._id}`, { status: newStatus });
      if (data.success) {
        setOrder({ ...order, status: newStatus });
        toast.success('Order status updated successfully');
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error: any) {
      console.error('Failed to update status:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setUpdating(false);
    }
  };

  const updatePaymentStatus = async (newPaymentStatus: string) => {
    if (!order) return;

    setUpdating(true);
    try {
      const data = await api.patch(`/orders/${order._id}`, { paymentStatus: newPaymentStatus });
      if (data.success) {
        setOrder({ ...order, paymentStatus: newPaymentStatus });
        toast.success('Payment status updated successfully');
      } else {
        toast.error('Failed to update payment status');
      }
    } catch (error: any) {
      console.error('Failed to update payment status:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-black font-semibold">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <Link href="/orders" className="text-amber-600 hover:text-amber-700 font-semibold mt-4 inline-block">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/orders" className="text-amber-600 hover:text-amber-700 font-semibold mb-2 inline-block">
              ← Back to Orders
            </Link>
            <h1 className="text-3xl font-black text-black">Order Details</h1>
            <p className="text-gray-600 font-mono mt-1">{order.orderId}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Order Date</div>
            <div className="font-semibold text-black">{new Date(order.createdAt).toLocaleDateString()}</div>
            <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-black mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center pb-4 border-b last:border-b-0">
                    <div className="w-20 h-20 relative bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-black">{item.title}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                    </div>
                    <div className="font-bold text-black">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-black mb-4">Delivery Address</h2>
              <div className="text-gray-700 space-y-2">
                {order.address.name && (
                  <p className="font-semibold">{order.address.name}</p>
                )}
                {order.address.phone && (
                  <p className="text-gray-600">Phone: <span className="font-semibold text-black">{order.address.phone}</span></p>
                )}
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state} - {order.address.zipCode}</p>
                <p>{order.address.country}</p>
              </div>
            </div>

            {/* Customer Details */}
            {order.userId && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-black mb-4">Customer Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-black">
                      {order.userId.firstName} {order.userId.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-black">{order.userId.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer ID:</span>
                    <span className="font-mono text-sm text-black">{order.userId._id}</span>
                  </div>
                </div>
              </div>
            )}
            {!order.userId && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-black mb-4">Customer Details</h2>
                <div className="text-gray-600 italic">
                  <p>Guest Order (No user account)</p>
                </div>
              </div>
            )}

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-black mb-4">Payment Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold text-black capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.razorpayOrderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Razorpay Order ID:</span>
                    <span className="font-mono text-sm text-black">{order.razorpayOrderId}</span>
                  </div>
                )}
                {order.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Razorpay Payment ID:</span>
                    <span className="font-mono text-sm text-black">{order.razorpayPaymentId}</span>
                  </div>
                )}

                {/* Payment Status Update - Only for COD or if payment is pending */}
                {(order.paymentMethod === 'cod' || order.paymentStatus === 'pending') && (
                  <div className="pt-3 border-t">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Update Payment Status:
                    </label>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => updatePaymentStatus(e.target.value)}
                      disabled={updating}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                    {updating && (
                      <p className="text-sm text-gray-600 mt-2">Updating...</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-black mb-4">Order Status</h2>
              <div className="mb-4">
                <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Update Status:
                </label>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(e.target.value)}
                  disabled={updating}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {updating && (
                  <p className="text-sm text-gray-600 mt-2">Updating...</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-black mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (18% GST):</span>
                  <span>₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping:</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="border-t-2 pt-3">
                  <div className="flex justify-between text-xl font-bold text-black">
                    <span>Total:</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-black mb-4">Invoice</h2>
              <div className="space-y-3">
                <Link
                  href={`/orders/${order._id}/invoice`}
                  className="w-full bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Invoice
                </Link>
                <button
                  onClick={async () => {
                    try {
                      const response = await api.getBlob(`/orders/${order._id}/invoice`);
                      const blob = new Blob([response.data]);
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `invoice-${order.orderId}.html`;
                      a.click();
                      window.URL.revokeObjectURL(url);

                      toast.success("Invoice downloaded");
                    } catch (err) {
                      console.error(err);
                      toast.error("Failed to download invoice");
                    }
                  }}
                  className="w-full bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}