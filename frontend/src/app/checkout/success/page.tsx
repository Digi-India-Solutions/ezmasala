'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/${localStorage.getItem('username') || 'profile'}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId, router]);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-6 py-12 text-center max-w-2xl">
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-black mb-4">Order Placed Successfully!</h1>
          <p className="text-xl text-black mb-2">Thank you for your order</p>
          <p className="text-lg text-black font-semibold">Order ID: #{orderId}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
          <p className="text-black mb-2">You will receive an order confirmation email shortly.</p>
          <p className="text-black">Track your order status in your profile.</p>
        </div>

        <div className="space-y-4">
          <Link
            href={`/${localStorage.getItem('username') || 'profile'}`}
            className="block w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition"
          >
            View My Orders
          </Link>
          <Link
            href="/collections"
            className="block w-full bg-gray-200 text-black py-4 rounded-xl font-bold hover:bg-gray-300 transition"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="text-black mt-8 text-sm">
          Redirecting to your orders in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
