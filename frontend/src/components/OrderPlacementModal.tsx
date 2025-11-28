'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

interface OrderPlacementModalProps {
  isOpen: boolean;
  orderId?: string;
  paymentId?: string;
}

export default function OrderPlacementModal({ isOpen, orderId, paymentId }: OrderPlacementModalProps) {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [stage, setStage] = useState<'processing' | 'success'>('processing');

  useEffect(() => {
    if (isOpen) {
      setStage('processing');
      // Show processing for minimum 3 seconds
      const processingTimer = setTimeout(() => {
        setStage('success');
        // After showing success, redirect to user profile after minimum 2.5 seconds
        const successTimer = setTimeout(() => {
          // Redirect to user's profile page using their username or email
          const username = user?.email?.split('@')[0] || 'profile';
          router.push(`/${username}`);
        }, 2500); // 2.5 seconds success display (total: 5.5 seconds)

        return () => clearTimeout(successTimer);
      }, 3000); // 3 seconds processing time

      return () => clearTimeout(processingTimer);
    }
  }, [isOpen, router, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full mx-4 shadow-2xl transform transition-all">
        {stage === 'processing' ? (
          <div className="text-center">
            {/* Processing Animation */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
              </div>
            </div>

            <h2 className="text-2xl font-black text-black mb-3">Processing Order</h2>
            <p className="text-gray-600 mb-6">Please wait while we process your order...</p>

            {/* Animated dots */}
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            {/* Success Animation */}
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center relative overflow-hidden">
                {/* Animated checkmark */}
                <svg
                  className="w-12 h-12 text-green-600 animate-[checkmark_0.5s_ease-in-out]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                    className="animate-[draw_0.5s_ease-in-out]"
                  />
                </svg>

                {/* Success ripple effect */}
                <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-75"></div>
              </div>
            </div>

            <h2 className="text-3xl font-black text-black mb-3">Order Placed!</h2>
            <p className="text-gray-600 mb-2">Your order has been successfully placed</p>

            {orderId && (
              <p className="text-sm text-gray-500 font-mono mb-6">Order ID: {orderId}</p>
            )}

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-800 font-semibold">✓ Payment Confirmed</p>
              <p className="text-sm text-green-700 mt-1">We'll send you a confirmation email shortly</p>
            </div>

            <p className="text-sm text-gray-500">Redirecting to your profile...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(45deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes draw {
          0% {
            stroke-dasharray: 0 100;
          }
          100% {
            stroke-dasharray: 100 0;
          }
        }
      `}</style>
    </div>
  );
}
