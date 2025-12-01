'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function AdminReviewsPage() {
  const [spices, setSpices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIndex, setUpdatingIndex] = useState<string | null>(null);
  const [selectedSpiceId, setSelectedSpiceId] = useState<string>('all');

  useEffect(() => {
    fetchSpices();
  }, []);

  const fetchSpices = async () => {
    try {
      const data = await api.get('/spices');
      const spicesData = Array.isArray(data) ? data : [];
      setSpices(spicesData);
    } catch (error: any) {
      console.error('Failed to fetch spices:', error);
      toast.error(error.message || 'Failed to fetch spices');
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Toggle approval with loading
  const toggleApproval = async (spiceId: string, reviewIndex: number, currentApproved: boolean) => {
    const uniqueKey = `${spiceId}-${reviewIndex}`;
    setUpdatingIndex(uniqueKey);

    try {
      await api.put(`/reviews/${spiceId}/${reviewIndex}`, { featured: !currentApproved });
      toast.success(currentApproved ? 'Review unapproved' : 'Review approved');
      await fetchSpices();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update review');
    } finally {
      setUpdatingIndex(null);
    }
  };

  // Get all reviews from all spices for "All Reviews" view
  const getAllReviews = () => {
    const allReviews: { spice: any; review: any; reviewIndex: number }[] = [];
    spices.forEach((spice) => {
      if (spice.reviews && spice.reviews.length > 0) {
        spice.reviews.forEach((review: any, index: number) => {
          allReviews.push({ spice, review, reviewIndex: index });
        });
      }
    });
    return allReviews.sort((a, b) => new Date(b.review.createdAt).getTime() - new Date(a.review.createdAt).getTime());
  };

  const totalReviewsCount = spices.reduce((acc, spice) => acc + (spice.reviews?.length || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-black">Loading reviews...</p>
      </div>
    );
  }

  const selectedSpice = spices.find(s => s._id === selectedSpiceId);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-black mb-8 text-black">Manage Reviews</h1>

      {/* Product Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-black mb-2">Select Product</label>
        <select
          value={selectedSpiceId}
          onChange={(e) => setSelectedSpiceId(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-black focus:border-black"
        >
          <option value="all">All Reviews ({totalReviewsCount} review{totalReviewsCount !== 1 ? 's' : ''})</option>
          {spices.map((spice) => (
            <option key={spice._id} value={spice._id}>
              {spice.title} ({spice.reviews?.length || 0} review{spice.reviews?.length !== 1 ? 's' : ''})
            </option>
          ))}
        </select>
      </div>

      {/* All Reviews View */}
      {selectedSpiceId === 'all' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">All Reviews</h2>
            <span className="bg-black text-white px-3 py-1 rounded-full">
              {totalReviewsCount} Reviews
            </span>
          </div>

          {totalReviewsCount === 0 ? (
            <div className="text-center py-10 text-gray-600">
              <p className="font-semibold text-lg text-black mb-2">No Reviews Yet</p>
              <p>No products have received any reviews.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getAllReviews().map(({ spice, review, reviewIndex }) => {
                const uniqueKey = `${spice._id}-${reviewIndex}`;
                return (
                  <div
                    key={uniqueKey}
                    className={`p-4 rounded-xl border-2 transition ${review.featured ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-black">{review.userName ?? 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">on <span className="font-medium text-gray-700">{spice.title}</span></p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < review.rating ? 'text-yellow-500 text-lg' : 'text-gray-300 text-lg'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleApproval(spice._id, reviewIndex, review.featured)}
                        disabled={updatingIndex === uniqueKey}
                        className={`px-4 py-2 rounded-xl font-semibold transition shrink-0 ${review.featured
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                          } ${updatingIndex === uniqueKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {updatingIndex === uniqueKey
                          ? 'Updating...'
                          : review.featured
                            ? '✓ Approved'
                            : 'Approve'}
                      </button>
                    </div>

                    <p className="text-gray-700 mt-3">{review.text}</p>
                    <p className="text-xs text-gray-500 mt-3">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Single Product View */}
      {selectedSpiceId !== 'all' && !selectedSpice && (
        <p className="text-center text-gray-600">No product selected.</p>
      )}

      {selectedSpiceId !== 'all' && selectedSpice && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">{selectedSpice.title}</h2>
            <span className="bg-black text-white px-3 py-1 rounded-full">
              {selectedSpice.reviews?.length || 0} Reviews
            </span>
          </div>

          {(!selectedSpice.reviews || selectedSpice.reviews.length === 0) ? (
            <div className="text-center py-10 text-gray-600">
              <p className="font-semibold text-lg text-black mb-2">No Reviews Yet</p>
              <p>This product has not received any reviews.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedSpice.reviews.map((review: any, index: number) => {
                const uniqueKey = `${selectedSpice._id}-${index}`;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition ${review.featured ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-black">{review.userName ?? 'Anonymous'}</p>

                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < review.rating ? 'text-yellow-500 text-lg' : 'text-gray-300 text-lg'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleApproval(selectedSpice._id, index, review.featured)}
                        disabled={updatingIndex === uniqueKey}
                        className={`px-4 py-2 rounded-xl font-semibold transition shrink-0 ${review.featured
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                          } ${updatingIndex === uniqueKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {updatingIndex === uniqueKey
                          ? 'Updating...'
                          : review.featured
                            ? '✓ Approved'
                            : 'Approve'}
                      </button>
                    </div>

                    <p className="text-gray-700 mt-3">{review.text}</p>
                    <p className="text-xs text-gray-500 mt-3">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
