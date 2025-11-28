'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from "@/lib/api";

export default function AdminReviewsPage() {
  const [spices, setSpices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpiceId, setSelectedSpiceId] = useState<string>('');

  useEffect(() => {
    fetchSpices();
  }, []);

  const fetchSpices = async () => {
    try {
      const data = await api.get('/spices');
      // API returns array directly, not wrapped in object
      const spicesData = Array.isArray(data) ? data : [];
      setSpices(spicesData);

      // Auto-select first product with reviews
      const firstWithReviews = spicesData.find((s: any) => s.reviews && s.reviews.length > 0);
      if (firstWithReviews) {
        setSelectedSpiceId(firstWithReviews._id);
      }
    } catch (error) {
      console.error('Failed to fetch spices:', error);
      toast.error('Failed to fetch spices');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (spiceId: string, reviewIndex: number, currentFeatured: boolean) => {
    try {
      await api.put(`/reviews/${spiceId}/${reviewIndex}`, { featured: !currentFeatured });
      toast.success(currentFeatured ? 'Review unfeatured' : 'Review featured');
      fetchSpices();
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-black">Loading reviews...</p>
      </div>
    );
  }

  const spicesWithReviews = spices.filter(spice => spice.reviews && spice.reviews.length > 0);
  const selectedSpice = spices.find(s => s._id === selectedSpiceId);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-black mb-8 text-black">Manage Reviews</h1>

      {spicesWithReviews.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-black mb-2">No Reviews Yet</h3>
          <p className="text-gray-600">
            Products will appear here once customers submit reviews.
          </p>
        </div>
      ) : (
        <>
          {/* Product Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-black mb-2">
              Select Product
            </label>
            <select
              value={selectedSpiceId}
              onChange={(e) => setSelectedSpiceId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-black focus:border-black focus:outline-none"
            >
              {spicesWithReviews.map((spice) => (
                <option key={spice._id} value={spice._id}>
                  {spice.title} ({spice.reviews.length} review{spice.reviews.length !== 1 ? 's' : ''})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Product Reviews */}
          {selectedSpice && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">{selectedSpice.title}</h2>
                <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedSpice.reviews.length} Review{selectedSpice.reviews.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-4">
                {selectedSpice.reviews.map((review: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition ${
                      review.featured ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-black">{review.userName || 'Anonymous'}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-500 text-lg' : 'text-gray-300 text-lg'}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFeatured(selectedSpice._id, index, review.featured)}
                        className={`px-4 py-2 rounded-xl font-semibold transition shrink-0 ${
                          review.featured
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                        }`}
                      >
                        {review.featured ? '✓ Featured' : 'Feature'}
                      </button>
                    </div>
                    <p className="text-gray-700 mt-3 leading-relaxed">{review.text}</p>
                    <p className="text-xs text-gray-500 mt-3">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
