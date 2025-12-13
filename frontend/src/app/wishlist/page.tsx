'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setWishlistItems, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { addToCart } from '@/store/slices/cartSlice';
import Breadcrumb from '@/components/Breadcrumb';
import Loader from '@/components/Loader';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.wishlist);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.get('/wishlist');
        if (data.success && data.wishlist?.items) {
          const formattedItems = data.wishlist.items
            .filter((item: any) => item.productId)
            .map((item: any) => ({
              productId: item.productId._id || item.productId,
              title: item.productId.title || 'Unknown Product',
              price: item.productId.price || 0,
              originalPrice: item.productId.originalPrice,
              image: item.productId.image || '',
              stock: item.productId.stock,
              addedAt: item.addedAt,
            }));
          dispatch(setWishlistItems(formattedItems));
        }
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, dispatch]);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`);
      dispatch(removeFromWishlist(productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({
      id: item.productId,
      title: item.title,
      price: item.price,
      image: item.image,
    }));
    toast.success('Added to cart');
  };

  if (loading) return <Loader text="Loading wishlist..." />;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: 'Wishlist' }]} />
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
            <p className="text-gray-600 mb-6">Login to view and manage your wishlist</p>
            <Link
              href="/account"
              className="inline-block bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Login / Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />

        <h1 className="text-3xl md:text-4xl font-bold text-black mb-8">My Wishlist</h1>

        {items.length === 0 ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">Start adding products you love!</p>
            <Link
              href="/collections"
              className="inline-block bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl shadow-lg overflow-hidden group">
                <div className="relative">
                  <Link href={`/product/${item.productId}`}>
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <Link href={`/product/${item.productId}`}>
                    <h3 className="font-semibold text-gray-800 hover:text-black transition mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-black">₹{item.price}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-sm text-gray-400 line-through">₹{item.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-black text-white py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
