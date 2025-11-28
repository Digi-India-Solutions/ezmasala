'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import Loader from '@/components/Loader';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export default function AddressPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    if (!window.location.pathname.startsWith('/checkout/address')) {
      return;
    }

    if (user) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const data = await api.get(`/user/${user.id}`);
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error('Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!user) {
      toast.error('Please login to add address');
      return;
    }

    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.country || !newAddress.phone) {
      toast.error('Please fill all fields');
      return;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(newAddress.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const updatedAddresses = await api.post(`/user/${user.id}/addresses`, newAddress);
      setAddresses(updatedAddresses);
      setNewAddress({ street: '', city: '', state: '', zipCode: '', country: '', phone: '', isDefault: false });
      setShowForm(false);
      toast.success('Address added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedIndex === null) {
      toast.error('Please select an address');
      return;
    }
    setLoading(true);
    const selected = addresses[selectedIndex];
    if (selected) {
      localStorage.setItem('selectedAddress', JSON.stringify(selected));
    }
    setTimeout(() => {
      router.push('/checkout/summary');
    }, 500);
  };

  if (loading) return <Loader text="Loading..." />;

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
          <h1 className="text-2xl md:text-4xl font-black text-black mb-8">Select Delivery Address</h1>
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12 bg-gray-50 rounded-2xl mb-6">
              <p className="text-black text-lg mb-4">Please login to continue with checkout</p>
              <button
                onClick={() => {
                  toast.info('Please login to add delivery address');
                  router.push('/login');
                }}
                className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800"
              >
                Login to Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        <h1 className="text-2xl md:text-4xl font-black text-black mb-8">Select Delivery Address</h1>

        <div className="max-w-4xl mx-auto">
          {addresses.length === 0 && !showForm && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl mb-6">
              <p className="text-black text-lg mb-4">No addresses added yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800"
              >
                Add Your First Address
              </button>
            </div>
          )}

          {addresses.length > 0 && (
            <div className="space-y-4 mb-6">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition ${selectedIndex === index
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="radio"
                      checked={selectedIndex === index}
                      onChange={() => setSelectedIndex(index)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-black mb-2">
                        {address.isDefault && <span className="text-green-600 text-sm">(Default) </span>}
                        Address {index + 1}
                      </h3>
                      <p className="text-black">{address.street}</p>
                      <p className="text-black">{address.city}, {address.state} - {address.zipCode}</p>
                      <p className="text-black">{address.country}</p>
                      {address.phone ? (
                        <p className="text-black font-semibold mt-2">Phone: {address.phone}</p>
                      ) : (
                        <p className="text-orange-600 text-sm mt-2">⚠ Phone number missing - you can add it in the next step</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showForm && addresses.length > 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full p-6 rounded-2xl border-2 border-dashed border-gray-300 text-black font-bold hover:border-black transition mb-6"
            >
              + Add New Address
            </button>
          )}

          {showForm && (
            <div className="p-6 rounded-2xl border-2 border-black mb-6">
              <h3 className="text-xl font-bold text-black mb-4">Add New Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="p-3 border border-gray-300 rounded-xl text-black md:col-span-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="p-3 border border-gray-300 rounded-xl text-black"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="p-3 border border-gray-300 rounded-xl text-black"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                  className="p-3 border border-gray-300 rounded-xl text-black"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  className="p-3 border border-gray-300 rounded-xl text-black"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="p-3 border border-gray-300 rounded-xl text-black md:col-span-2"
                  maxLength={10}
                />
                <div className="flex items-center md:col-span-2">
                  <label className="flex items-center text-black">
                    <input
                      type="checkbox"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      className="mr-2"
                    />
                    Set as default address
                  </label>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleAddAddress}
                  className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800"
                >
                  Save Address
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-black py-3 rounded-xl font-bold hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {addresses.length > 0 && (
            <button
              onClick={handleContinue}
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition text-lg"
            >
              Continue to Summary
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
