'use client';

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { removeFromCart, updateQuantity } from "@/store/slices/cartSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push('/cart');
  };

  return (
    <>
      <div className={`fixed top-0 right-0 h-screen w-full md:w-96 bg-white shadow-2xl z-10000 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} hidden md:block`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-black">Cart ({items.length})</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500 text-lg">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-gray-50 rounded-xl p-4">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-black text-sm mb-1 truncate">{item.title}</h3>
                      <p className="text-lg font-bold text-black mb-2">₹{item.price}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              dispatch(removeFromCart(item.id));
                            } else {
                              dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
                            }
                          }}
                          className="w-7 h-7 bg-black text-white rounded-md flex items-center justify-center hover:bg-gray-800 transition"
                        >
                          -
                        </button>
                        <span className="text-black font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="w-7 h-7 bg-black text-white rounded-md flex items-center justify-center hover:bg-gray-800 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-gray-700">Subtotal:</span>
                <span className="font-bold text-black text-xl">₹{totalAmount}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
