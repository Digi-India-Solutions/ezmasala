'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { RazorpayPaymentResponse } from '@/types/razorpay';
import api from '@/lib/api';

interface CheckoutButtonProps {
  onSuccess?: (paymentId: string) => void;
  onFailure?: (error: string) => void;
}

export default function CheckoutButton({ onSuccess, onFailure }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order
      const orderData = await api.post('/razorpay/create-order', {
        amount: totalAmount,
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          items: items.map(item => `${item.title} x ${item.quantity}`).join(', '),
        },
      });

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Razorpay options
      const options = {
        key: 'your_razorpay_key_id', // TODO: Replace with actual Razorpay key
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'EZ Masala',
        description: 'Spice Order Payment',
        order_id: orderData.order.id,
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            // Verify payment
            const verifyData = await api.post('/razorpay/verify-payment', response);

            if (verifyData.success) {
              onSuccess?.(verifyData.paymentId);
              window.location.href = `/payment/success?payment_id=${verifyData.paymentId}`;
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error: any) {
            onFailure?.(error.message);
            window.location.href = `/payment/failure?error=${encodeURIComponent(error.message)}`;
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#d97706',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed');
      onFailure?.(error.message);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || items.length === 0}
      className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)}`}
    </button>
  );
}
