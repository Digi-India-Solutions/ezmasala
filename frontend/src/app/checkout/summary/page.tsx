'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import Image from 'next/image';
import Loader from '@/components/Loader';

export default function SummaryPage() {
  const router = useRouter();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const tax = totalAmount * 0.18;
  const total = totalAmount + tax;

  useEffect(() => {
    const savedAddress = localStorage.getItem('selectedAddress');

    if (!window.location.pathname.startsWith('/checkout/summary')) {
      return;
    }


    try {
      if (savedAddress) {
        const parsedAddress = JSON.parse(savedAddress);
        setAddress(parsedAddress);
        setPhoneNumber(parsedAddress.phone || '');
      }
    } catch (error) {
      console.error('Failed to parse saved address:', error);
      localStorage.removeItem('selectedAddress');

      if (window.location.pathname.startsWith('/checkout')) {
        router.replace('/checkout/address');
        return;
      }
    }

    setLoading(false);
  }, [router]);

  const handleSavePhone = () => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    const updatedAddress = { ...address, phone: phoneNumber };
    setAddress(updatedAddress);
    localStorage.setItem('selectedAddress', JSON.stringify(updatedAddress));
    setEditingPhone(false);
  };

  const handleContinue = () => {
    if (!phoneNumber || phoneNumber === '') {
      alert('Phone number is required. Please add a phone number.');
      setEditingPhone(true);
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert('Please enter a valid 10-digit phone number');
      setEditingPhone(true);
      return;
    }

    const updatedAddress = { ...address, phone: phoneNumber };
    localStorage.setItem('selectedAddress', JSON.stringify(updatedAddress));

    setLoading(true);
    setTimeout(() => {
      router.push('/checkout/payment');
    }, 500);
  };

  if (loading) return <Loader text="Loading..." />;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        <h1 className="text-2xl md:text-4xl font-black text-black mb-8">Order Summary</h1>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-black mb-4">Delivery Address</h2>
            {address && (
              <div className="text-black">
                <div className="text-black space-y-1">
                  {address.name && <p className="font-bold">{address.name}</p>}

                  <p>{address.addressLine || address.street}</p>

                  <p>
                    {(address.city || "")}, {(address.state || "")} - {(address.pincode || address.zipCode || "")}
                  </p>

                  {address.country && <p>{address.country}</p>}

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Contact Phone Number</p>

                      {!editingPhone ? (
                        <p className="font-bold text-lg">{phoneNumber || 'Not provided'}</p>
                      ) : (
                        <div className="flex items-center gap-3">
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter 10-digit phone"
                            maxLength={10}
                            className="flex-1 p-2 border-2 border-gray-300 rounded-lg text-black focus:border-black outline-none"
                          />

                          <button
                            onClick={handleSavePhone}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 text-sm"
                          >
                            Save
                          </button>

                          <button
                            onClick={() => {
                              setEditingPhone(false);
                              setPhoneNumber(address.phone || '');
                            }}
                            className="bg-gray-300 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {!editingPhone && (
                      <button
                        onClick={() => setEditingPhone(true)}
                        className="ml-4 bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 text-sm"
                      >
                        {phoneNumber ? 'Change' : 'Add'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => router.push('/checkout/address')}
              className="mt-4 text-black font-semibold hover:underline"
            >
              Change Address
            </button>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-black mb-4">Order Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover rounded-lg" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{item.title}</h3>
                    <p className="text-black text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-black">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-black mb-4">Price Breakdown</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-black">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-black">
                <span>Tax (18% GST)</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t-2 border-gray-300 pt-3">
                <div className="flex justify-between text-black text-xl font-bold">
                  <span>Total Amount</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition text-lg"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
