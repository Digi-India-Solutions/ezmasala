'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/store/slices/cartSlice';
import Loader from '@/components/Loader';
import OrderPlacementModal from '@/components/OrderPlacementModal';
import { toast } from 'sonner';
import { RazorpayPaymentResponse } from '@/types/razorpay';
import OrderSuccessToast from '@/components/OrderSuccessToast';
import api from '@/lib/api';

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [showOrderModal, setShowOrderModal] = useState(false);

  const tax = totalAmount * 0.18;
  const total = Math.round(totalAmount + tax);

  useEffect(() => {
    if (!window.location.pathname.startsWith('/checkout/payment')) {
      return;
    }

    const savedAddress = localStorage.getItem('selectedAddress');

    if (!savedAddress || items.length === 0) {
      router.replace('/checkout/address');
      return;
    }

    setLoading(false);
  }, [router]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCODOrder = async () => {
    setProcessing(true);
    try {
      const savedAddress = localStorage.getItem('selectedAddress');
      let address = null;

      if (savedAddress) {
        try {
          address = JSON.parse(savedAddress);
        } catch (error) {
          console.error('Failed to parse saved address:', error);
          toast.error('Invalid address data. Please select address again.');
          router.push('/checkout/address');
          return;
        }
      }

      const orderData = {
        userId: user?.id || null,
        items: items.map(item => ({
          productId: item.id,
          title: item.title,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          image: item.image || ''
        })),
        address: address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        subtotal: Number(totalAmount.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total: total,
        paymentMethod: 'cod'
      };

      const data = await api.post('/orders', orderData);

      if (data.success) {
        dispatch(clearCart());
        localStorage.removeItem('selectedAddress');
        toast.custom((t) => <OrderSuccessToast orderId={data.order.orderId} toastId={t} />, {
          duration: 10000,
        });
        setProcessing(false);

        // Redirect to user profile page
        setTimeout(() => {
          const username = user?.firstName?.toLowerCase() || 'profile';
          router.push(`/${username}`);
        }, 1500);
        return;
      } else {
        console.error('Failed to place order:', data);
        toast.error(data.message || 'Failed to place order. Please try again.');
        setProcessing(false);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      setProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setProcessing(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create Razorpay order
      const orderData = await api.post('/razorpay/create-order', {
        amount: total,
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
        description: 'Masala Order Payment',
        order_id: orderData.order.id,
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            // Verify payment
            const verifyData = await api.post('/razorpay/verify-payment', response);

            if (verifyData.success) {
              // Create order in database
              const savedAddress = localStorage.getItem('selectedAddress');
              let address = null;

              if (savedAddress) {
                try {
                  address = JSON.parse(savedAddress);
                } catch (error) {
                  console.error('Failed to parse saved address:', error);
                  toast.error('Invalid address data');
                  return;
                }
              }

              const dbOrderData = {
                userId: user?.id || null,
                items: items.map(item => ({
                  productId: item.id,
                  title: item.title,
                  price: Number(item.price) || 0,
                  quantity: Number(item.quantity) || 1,
                  image: item.image || ''
                })),
                address: address || {
                  street: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  country: ''
                },
                subtotal: Number(totalAmount.toFixed(2)),
                tax: Number(tax.toFixed(2)),
                total: total,
                paymentMethod: 'razorpay',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              };

              const dbData = await api.post('/orders', dbOrderData);

              if (dbData.success) {
                dispatch(clearCart());
                localStorage.removeItem('selectedAddress');
                toast.custom((t) => <OrderSuccessToast orderId={dbData.order.orderId} toastId={t} />, {
                  duration: 10000,
                });
                setProcessing(false);

                // Redirect to user profile page
                setTimeout(() => {
                  const username = user?.firstName?.toLowerCase() || 'profile';
                  router.push(`/${username}`);
                }, 1500);
                return;
              } else {
                console.error('Failed to save order:', dbData);
                toast.error(dbData.message || 'Failed to save order');
                throw new Error(dbData.message || 'Failed to save order');
              }
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error: any) {
            toast.error(error.message || 'Payment failed');
            router.push(`/payment/failure?error=${encodeURIComponent(error.message)}`);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
      setProcessing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'cod') {
      handleCODOrder();
    } else {
      handleRazorpayPayment();
    }
  };

  if (loading || processing) return <Loader text={processing ? "Processing your order..." : "Loading..."} />;

  return (
    <>
      <OrderPlacementModal isOpen={showOrderModal} />
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
          <h1 className="text-2xl md:text-4xl font-black text-black mb-8">Payment</h1>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-black mb-4">Select Payment Method</h2>
              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'razorpay' ? 'border-black bg-white' : 'border-gray-300'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                    />
                    <div>
                      <p className="font-bold text-black">Online Payment (Razorpay)</p>
                      <p className="text-sm text-black">Pay securely via Card, UPI, Net Banking</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'cod' ? 'border-black bg-white' : 'border-gray-300'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <div>
                      <p className="font-bold text-black">Cash on Delivery</p>
                      <p className="text-sm text-black">Pay when you receive your order</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-black mb-4">Order Total</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-black">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-black">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between text-black text-xl font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition text-lg"
            >
              {paymentMethod === 'razorpay' ? `Pay Now - ₹${total}` : `Place Order - ₹${total}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
