'use client';

import Link from 'next/link';
import { toast } from 'sonner';

interface OrderSuccessToastProps {
  orderId: string;
  toastId: string | number;
}

export default function OrderSuccessToast({ orderId, toastId }: OrderSuccessToastProps) {
  return (
    <div className="bg-white border-2 border-green-500 rounded-xl shadow-lg p-4 min-w-[320px]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-col gap-1 flex-1">
          <p className="font-bold text-green-600 text-base">Order Placed Successfully! 🎉</p>
          <p className="text-sm text-gray-700">Order ID: <span className="font-semibold text-black">#{orderId}</span></p>
        </div>
        <button
          onClick={() => toast.dismiss(toastId)}
          className="text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <Link
        href="/collections"
        className="block w-full bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition text-center text-sm"
        onClick={() => toast.dismiss(toastId)}
      >
        Shop More
      </Link>
    </div>
  );
}
