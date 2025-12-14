'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { isAdminAuthenticated } from '@/utils/adminAuth';
import api from '@/lib/api';

interface OrderDetails {
  _id: string;
  orderId: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
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

export default function InvoicePage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handlePrint = () => {
    window.print();
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cod': return 'Cash on Delivery';
      case 'razorpay': return 'Online Payment (Razorpay)';
      default: return method;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  const getOrderStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-black font-semibold">Loading invoice...</p>
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

  const customerName = order.userId
    ? `${order.userId.firstName} ${order.userId.lastName}`.trim()
    : order.address.name || 'Guest Customer';

  const customerEmail = order.userId?.email || 'N/A';

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5cm;
            size: A4 portrait;
          }
          html, body {
            height: auto !important;
            overflow: visible !important;
          }
          body * {
            visibility: hidden;
          }
          .invoice-container, .invoice-container * {
            visibility: visible;
          }
          .invoice-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            page-break-after: avoid;
            page-break-before: avoid;
            page-break-inside: avoid;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          /* Compact spacing for print */
          .invoice-container h1 {
            font-size: 18px !important;
          }
          .invoice-container h2 {
            font-size: 16px !important;
          }
          .invoice-container h3 {
            font-size: 10px !important;
          }
          .invoice-container .p-8 {
            padding: 10px !important;
          }
          .invoice-container .mb-4 {
            margin-bottom: 8px !important;
          }
          .invoice-container .pb-4 {
            padding-bottom: 8px !important;
          }
          .invoice-container .pb-5 {
            padding-bottom: 10px !important;
          }
          .invoice-container .mb-6 {
            margin-bottom: 10px !important;
          }
          .invoice-container .mt-1 {
            margin-top: 6px !important;
          }
          .invoice-container .mt-6 {
            margin-top: 10px !important;
          }
          .invoice-container .pt-4 {
            padding-top: 6px !important;
          }
          .invoice-container .gap-4 {
            gap: 6px !important;
          }
          .invoice-container .gap-5 {
            gap: 8px !important;
          }
          .invoice-container .gap-6 {
            gap: 10px !important;
          }
          .invoice-container .mb-3 {
            margin-bottom: 6px !important;
          }
          .invoice-container table {
            font-size: 11px !important;
          }
          .invoice-container table td,
          .invoice-container table th {
            padding: 3px 4px !important;
            font-size: 10px !important;
          }
          .invoice-container .bg-gradient-to-r {
            padding: 12px !important;
          }
          .invoice-container img {
            height: 35px !important;
          }
          .invoice-container .bg-gray-50 {
            padding: 8px !important;
          }
          .invoice-container .space-y-2 > * + * {
            margin-top: 4px !important;
          }
          /* Remove extra margins at container level */
          .container {
            padding: 0 !important;
            margin: 0 !important;
          }
          .min-h-screen {
            min-height: auto !important;
          }
        }
        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-100">
        {/* Action Bar - Hidden on print */}
        <div className="no-print bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href={`/orders/${order._id}`} className="text-amber-600 hover:text-amber-700 font-semibold">
              ← Back to Order
            </Link>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-900 transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="invoice-container bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img src="/logo.png" alt="EZ Masala" className="h-16 w-auto bg-white rounded-lg px-2 py-1" />
                  <div>
                    <h1 className="text-3xl font-black">EZ MASALA</h1>
                    <p className="text-amber-100 mt-1">Premium Quality Spices</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold">TAX INVOICE</h2>
                  <p className="text-amber-100 mt-1">#{order.orderId}</p>
                </div>
              </div>
            </div>

            {/* Invoice Body */}
            <div className="p-8">
              {/* Invoice Details Row - 3 Column Layout */}
              <div className="grid grid-cols-3 gap-6 mb-6 pb-5 border-b">
                {/* Bill To */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
                  <p className="font-bold text-sm text-black">{customerName}</p>
                  {order.address.phone && (
                    <p className="text-gray-600 text-xs mt-1">
                      <span className="font-medium">Phone:</span> {order.address.phone}
                    </p>
                  )}
                  {customerEmail !== 'N/A' && (
                    <p className="text-gray-600 text-xs">
                      <span className="font-medium">Email:</span> {customerEmail}
                    </p>
                  )}
                </div>

                {/* Ship To */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ship To</h3>
                  <p className="text-gray-700 text-xs">{order.address.street}</p>
                  <p className="text-gray-700 text-xs">
                    {order.address.city}, {order.address.state} - {order.address.zipCode}
                  </p>
                  <p className="text-gray-700 text-xs">{order.address.country}</p>
                </div>

                {/* Invoice Details */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Invoice Details</h3>
                  <div className="space-y-1">
                    <p className="text-gray-700 text-xs">
                      <span className="font-medium">Date:</span>{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-700 text-xs">
                      <span className="font-medium">Order Status:</span>{' '}
                      <span className={`font-semibold ${
                        order.status === 'delivered' ? 'text-green-600' :
                        order.status === 'cancelled' ? 'text-red-600' :
                        order.status === 'shipped' ? 'text-purple-600' :
                        order.status === 'confirmed' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6 mt-1">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Order Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-2 px-2 text-gray-600 font-bold">#</th>
                        <th className="text-left py-2 px-2 text-gray-600 font-bold">Product</th>
                        <th className="text-center py-2 px-2 text-gray-600 font-bold">Qty</th>
                        <th className="text-right py-2 px-2 text-gray-600 font-bold">Unit Price</th>
                        <th className="text-right py-2 px-2 text-gray-600 font-bold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2 px-2 text-gray-600">{index + 1}</td>
                          <td className="py-2 px-2">
                            <p className="font-semibold text-black">{item.title}</p>
                          </td>
                          <td className="py-2 px-2 text-center text-gray-700">{item.quantity}</td>
                          <td className="py-2 px-2 text-right text-gray-700">₹{item.price.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right font-semibold text-black">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm mt-1">
                {/* Payment Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Payment Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-semibold text-black">{getPaymentMethodLabel(order.paymentMethod)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`font-semibold ${
                        order.paymentStatus === 'paid' ? 'text-green-600' :
                        order.paymentStatus === 'failed' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </span>
                    </div>
                    {order.razorpayPaymentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-xs text-black">{order.razorpayPaymentId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Totals */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-black">₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (18% GST):</span>
                      <span className="text-black">₹{order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="text-green-600 font-semibold">FREE</span>
                    </div>
                    <div className="border-t-2 border-gray-300 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-black">Grand Total:</span>
                        <span className="text-lg font-bold text-amber-600">₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t text-center">
                <div className="mb-2">
                  <p className="text-gray-600 text-sm">Thank you for shopping with <span className="font-bold text-amber-600">EZ Masala</span>!</p>
                </div>
                <div className="text-xs text-gray-500">
                  <p className="font-medium">Email: support@ezmasalaa.com | Website: www.ezmasalaa.com</p>
                </div>
              </div>

              {/* Terms & Conditions - Print Only */}
              <div className="print-only mt-4 pt-3 border-t text-xs text-gray-500">
                <p className="font-bold mb-1">Terms & Conditions:</p>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Goods once sold will not be taken back or exchanged.</li>
                  <li>All disputes are subject to local jurisdiction only.</li>
                  <li>This is a computer-generated invoice and does not require a signature.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
