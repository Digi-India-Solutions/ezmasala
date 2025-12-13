'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const tax = totalAmount * 0.18;
  const totalBeforeDiscount = totalAmount + tax;
  const finalTotal = Math.round(totalBeforeDiscount - discount);

  // Load saved coupon from localStorage on mount
  useEffect(() => {
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      try {
        const couponData = JSON.parse(savedCoupon);
        setAppliedCoupon(couponData.coupon);
        setDiscount(couponData.discount);
        setCouponCode(couponData.coupon?.code || '');
      } catch (e) {
        localStorage.removeItem('appliedCoupon');
      }
    }
  }, []);

  // Revalidate coupon when cart total changes
  useEffect(() => {
    if (appliedCoupon && totalAmount > 0) {
      revalidateCoupon();
    }
  }, [totalAmount]);

  const revalidateCoupon = async () => {
    if (!appliedCoupon?.code) return;

    try {
      const data = await api.post('/coupons/validate', {
        code: appliedCoupon.code,
        orderAmount: totalBeforeDiscount
      });

      if (data.success) {
        setDiscount(data.discountAmount);
        localStorage.setItem('appliedCoupon', JSON.stringify({
          coupon: data.coupon,
          discount: data.discountAmount
        }));
      }
    } catch (error) {
      // Coupon no longer valid, remove it
      handleRemoveCoupon();
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    try {
      const data = await api.post('/coupons/validate', {
        code: couponCode,
        orderAmount: totalBeforeDiscount
      });

      if (data.success) {
        setAppliedCoupon(data.coupon);
        setDiscount(data.discountAmount);
        localStorage.setItem('appliedCoupon', JSON.stringify({
          coupon: data.coupon,
          discount: data.discountAmount
        }));
        toast.success(`Coupon applied! You save ₹${data.discountAmount.toFixed(2)}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      setDiscount(0);
      localStorage.removeItem('appliedCoupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setDiscount(0);
    localStorage.removeItem('appliedCoupon');
    toast.info('Coupon removed');
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-20 text-center bg-white min-h-screen">
        <h1 className="text-2xl md:text-4xl font-black mb-4 text-black">Your Cart is Empty</h1>
        <p className="text-black mb-8">Add some products to get started!</p>
        <Link href="/collections" className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-4xl font-black text-black">Shopping Cart</h1>
          <button onClick={handleClearCart} className="text-red-600 hover:text-red-800 font-semibold text-sm md:text-base">
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-gray-50 p-4 md:p-6 rounded-2xl border border-gray-200">
                <div className="flex gap-4 md:gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 relative flex-shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover rounded-xl" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-xl font-bold text-black mb-1 md:mb-2 truncate">{item.title}</h3>
                    <p className="text-black font-semibold text-sm md:text-base">₹{item.price}</p>

                    <div className="flex items-center gap-4 mt-3 md:mt-4">
                      <div className="flex items-center gap-2 md:gap-4">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 md:w-8 md:h-8 bg-white border border-gray-300 rounded-lg font-bold text-black hover:bg-gray-100 text-sm md:text-base"
                        >
                          -
                        </button>
                        <span className="text-black font-semibold w-6 md:w-8 text-center text-sm md:text-base">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 md:w-8 md:h-8 bg-white border border-gray-300 rounded-lg font-bold text-black hover:bg-gray-100 text-sm md:text-base"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-base md:text-xl font-bold text-black mb-2">₹{item.price * item.quantity}</p>
                    <button onClick={() => handleRemove(item.id)} className="text-red-600 hover:text-red-800 font-semibold text-xs md:text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 lg:sticky lg:top-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-black">Order Summary</h2>

              {/* Coupon Section */}
              <div className="mb-6 pb-4 border-b border-gray-300">
                <h3 className="text-sm font-semibold text-black mb-3">Apply Coupon</h3>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-green-800 text-sm">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-600">You save ₹{discount.toFixed(2)}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black text-sm"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 text-sm"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 md:space-y-4 mb-6">
                <div className="flex justify-between text-black text-sm md:text-base">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-black text-sm md:text-base">
                  <span>Tax (18% GST)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-black text-sm md:text-base">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm md:text-base">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t-2 border-gray-300 pt-3 md:pt-4">
                  <div className="flex justify-between text-black text-lg md:text-xl font-bold">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    toast.info('Please login to proceed with checkout');
                    router.push('/login');
                    return;
                  }
                  router.push('/checkout/address');
                }}
                className="block w-full bg-black text-white py-3 md:py-4 rounded-xl font-bold hover:bg-gray-800 transition mb-4 text-sm md:text-base text-center"
              >
                Proceed to Checkout
              </button>

              <Link href="/collections" className="block text-center text-black font-semibold hover:underline text-sm md:text-base">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
