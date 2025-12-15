'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutUser, updateUserProfile } from '@/store/slices/authSlice';
import { clearWishlist } from '@/store/slices/wishlistSlice';
import { toast } from 'sonner';
import Loader from '@/components/Loader';
import Image from 'next/image';
import api from '@/lib/api';

export default function UserProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserOrders();
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const data = await api.get(`/user/${user.id}`);
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    if (!user) return;
    try {
      const data = await api.get(`/orders?userId=${user.id}`);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!newAddress.phone || !phoneRegex.test(newAddress.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const updatedAddresses = await api.post(`/user/${user.id}/addresses`, newAddress);
      setAddresses(updatedAddresses);
      setShowAddForm(false);
      setNewAddress({ street: '', city: '', state: '', zipCode: '', country: '', phone: '', isDefault: false });
      toast.success('Address added successfully!');
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profileData.email || !emailRegex.test(profileData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate names
    if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    // Validate phone number if provided
    if (profileData.phone && profileData.phone.trim()) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(profileData.phone)) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }
    }

    setEditLoading(true);
    try {
      const response = await api.put(`/user/${user.id}/profile`, profileData);

      // Show success message with email confirmation
      toast.success('Profile updated successfully!', {
        description: 'A confirmation email has been sent to your email address.',
        duration: 5000,
      });

      setShowEditProfile(false);

      // Update Redux store with new user data
      if (response.user) {
        dispatch(updateUserProfile({
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          phone: response.user.phone,
        }));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/user/logout');
    } catch (error) {
      // Ignore logout errors
    }
    dispatch(logoutUser());
    dispatch(clearWishlist());
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleRequestCancellation = async () => {
    if (!selectedOrder) return;

    setCancelLoading(true);
    try {
      const data = await api.post(`/orders/${selectedOrder._id}/request-cancellation`, {
        reason: cancelReason || 'No reason provided'
      });

      if (data.success) {
        toast.success('Cancellation request submitted successfully');
        setShowCancelModal(false);
        setSelectedOrder(null);
        setCancelReason('');
        fetchUserOrders();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit cancellation request');
    } finally {
      setCancelLoading(false);
    }
  };

  const canRequestCancellation = (order: any) => {
    return !['delivered', 'cancelled'].includes(order.status) &&
           !order.cancellationRequested;
  };

  const getOrderStatusSteps = (status: string) => {
    const allSteps = ['pending', 'confirmed', 'shipped', 'delivered'];
    const currentIndex = allSteps.indexOf(status);
    return allSteps.map((step, index) => ({
      label: step.charAt(0).toUpperCase() + step.slice(1),
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  if (loading) return <Loader text="Loading profile..." />;

  if (!user) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 bg-white min-h-screen">
        <p className="text-center text-black">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-black">{user.firstName} {user.lastName}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditProfile(!showEditProfile)}
              className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition text-sm md:text-base"
            >
              {showEditProfile ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition text-sm md:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Edit Profile Form */}
        {showEditProfile && (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6 md:mb-8 border border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-black">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-black font-semibold mb-2 text-sm md:text-base">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none text-black text-sm md:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold mb-2 text-sm md:text-base">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none text-black text-sm md:text-base"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-black font-semibold mb-2 text-sm md:text-base">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none text-black text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-2 text-sm md:text-base">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none text-black text-sm md:text-base"
                />
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Note:</span> When you update your profile, you will receive a confirmation email with details of the changes made.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {editLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProfile(false);
                    setProfileData({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      email: user.email || '',
                      phone: user.phone || '',
                    });
                  }}
                  className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6 md:mb-8 border border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-black">Recent Orders</h2>
          <div className="space-y-6">
            {orders.length === 0 ? (
              <p className="text-black text-sm md:text-base">No orders yet.</p>
            ) : (
              orders.slice(0, 5).map((order) => {
                const statusSteps = getOrderStatusSteps(order.status || 'pending');
                return (
                  <div key={order._id} className="border-2 border-gray-200 p-4 md:p-6 rounded-xl hover:border-black transition">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                      <div>
                        <p className="text-black font-bold text-base md:text-lg mb-1">Order #{order.orderId || order._id.slice(-8)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`text-sm font-bold px-4 py-2 rounded-full w-fit ${
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                        }`}>
                        {(order.status || 'Pending').toUpperCase()}
                      </span>
                    </div>

                    {/* Order Tracking */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between relative">
                        {statusSteps.map((step, index) => (
                          <div key={step.label} className="flex flex-col items-center relative z-20 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step.completed ? 'bg-green-600 text-white' :
                              step.active ? 'bg-blue-600 text-white' :
                                'bg-gray-200 text-gray-500'
                              }`}>
                              {step.completed ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span className="text-sm font-bold">{index + 1}</span>
                              )}
                            </div>

                            <p className={`text-xs font-semibold ${step.completed || step.active ? 'text-black' : 'text-gray-400'
                              }`}>
                              {step.label}
                            </p>
                            {index < statusSteps.length - 1 && (
                              <div
                                className={`absolute top-5 h-1 ${statusSteps[index + 1].completed ? 'bg-green-600' : 'bg-gray-300'
                                  }`}
                                style={{
                                  left: 'calc(50% + 20px)',
                                  width: 'calc(100% - 40px)',
                                  transform: 'translateY(-50%)',
                                  zIndex: 0,
                                }}
                              ></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {order.address && (
                      <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-bold text-black mb-2">Delivery Address:</p>
                        <div className="text-sm text-gray-700">
                          {order.address.name && <p className="font-semibold text-black">{order.address.name}</p>}
                          {order.address.addressLine && <p>{order.address.addressLine}</p>}
                          {order.address.street && <p>{order.address.street}</p>}
                          <p>
                            {[order.address.city, order.address.state, order.address.pincode || order.address.zipCode].filter(Boolean).join(', ')}
                          </p>
                          {order.address.country && <p>{order.address.country}</p>}
                          {order.address.phone && <p className="mt-1">Phone: {order.address.phone}</p>}
                        </div>
                      </div>
                    )}

                    {/* Product Images & Titles */}
                    {order.items && order.items.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-bold text-black mb-3">Items ({order.items.length}):</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                  src={item.image || '/spice/1.jpg'}
                                  alt={item.title || 'Product'}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-black text-sm truncate">{item.title || 'Product'}</p>
                                <p className="text-xs text-gray-600">Qty: {item.quantity || 1}</p>
                                <p className="text-sm font-bold text-black">₹{item.price || 0}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <p className="text-black font-bold text-lg">
                        Total: ₹{order.total || order.totalAmount}
                      </p>
                      {order.cancellationRequested ? (
                        <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          order.cancellationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.cancellationStatus === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          Cancellation {order.cancellationStatus}
                        </div>
                      ) : canRequestCancellation(order) && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowCancelModal(true);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                        >
                          Request Cancellation
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-black">My Addresses</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-black text-white px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-gray-800 text-sm md:text-base"
            >
              {showAddForm ? 'Cancel' : 'Add Address'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddAddress} className="bg-gray-50 p-4 md:p-6 rounded-xl mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-black font-semibold mb-2 text-sm md:text-base">Street</label>
                  <input
                    type="text"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none text-black text-sm md:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold mb-2 text-sm md:text-base">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none text-black text-sm md:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold mb-2 text-sm md:text-base">State</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none text-black text-sm md:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold mb-2 text-sm md:text-base">Zip Code</label>
                  <input
                    type="text"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none text-black text-sm md:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold mb-2 text-sm md:text-base">Country</label>
                  <input
                    type="text"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none text-black text-sm md:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-semibold mb-2 text-sm md:text-base">Phone Number</label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    placeholder="10-digit phone number"
                    maxLength={10}
                    className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none text-black text-sm md:text-base"
                    required
                  />
                </div>
                <div className="flex items-center md:col-span-2">
                  <label className="flex items-center text-black text-sm md:text-base">
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
              <button type="submit" className="mt-4 bg-black text-white px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-gray-800 text-sm md:text-base">
                Save Address
              </button>
            </form>
          )}

          <div className="space-y-3 md:space-y-4">
            {addresses.length === 0 ? (
              <p className="text-black text-sm md:text-base">No addresses added yet.</p>
            ) : (
              addresses.map((address, index) => (
                <div key={index} className="border-2 border-gray-200 p-3 md:p-4 rounded-xl">
                  <p className="text-black font-semibold text-sm md:text-base break-words">{address.street}</p>
                  <p className="text-black text-sm md:text-base break-words">{address.city}, {address.state} {address.zipCode}</p>
                  <p className="text-black text-sm md:text-base break-words">{address.country}</p>
                  {address.phone && <p className="text-black text-sm md:text-base mt-1"><span className="font-semibold">Phone:</span> {address.phone}</p>}
                  {address.isDefault && <span className="text-green-600 font-semibold text-xs md:text-sm">Default</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Cancellation Request Modal */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-black">Request Cancellation</h2>
              <p className="text-gray-600 text-sm mt-1">Order #{selectedOrder.orderId || selectedOrder._id.slice(-8)}</p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please tell us why you want to cancel this order..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-black focus:border-transparent text-black"
              />
              <p className="text-sm text-gray-500 mt-2">
                Note: Cancellation requests are reviewed by our team. You will be notified once processed.
              </p>
            </div>
            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedOrder(null);
                  setCancelReason('');
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestCancellation}
                disabled={cancelLoading}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
