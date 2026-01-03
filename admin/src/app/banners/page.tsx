'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      // Fetch all banners including inactive ones for admin panel
      const data = await api.get('/banners?all=true');
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!imagePreview) {
      toast.error('Please select an image first');
      return;
    }

    setUploading(true);
    try {
      await api.post('/banners', {
        image: imagePreview,
        priority: 0,
        isActive: true,
      });
      toast.success('Banner uploaded successfully');
      setImagePreview('');
      fetchBanners();
    } catch (error: any) {
      console.error('Failed to upload banner:', error);
      toast.error(error.message || 'Failed to upload banner');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      await api.delete(`/banners/${id}`);
      toast.success('Banner deleted successfully');
      fetchBanners();
    } catch (error) {
      console.error('Failed to delete banner:', error);
      toast.error('Failed to delete banner');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await api.put(`/banners/${id}`, { isActive: !currentActive });
      toast.success(currentActive ? 'Banner deactivated' : 'Banner activated');
      fetchBanners();
    } catch (error) {
      console.error('Failed to update banner:', error);
      toast.error('Failed to update banner');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-black">Loading banners...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-black mb-8 text-black">Manage Banners</h1>

      {/* Upload Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-black">Upload New Banner</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Banner Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-black focus:border-black focus:outline-none"
            />
          </div>

          {imagePreview && (
            <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || !imagePreview}
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {uploading ? 'Uploading...' : 'Upload Banner'}
          </button>
        </div>
      </div>

      {/* Banners List */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Current Banners</h2>
          <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">
            {banners.length} Banner{banners.length !== 1 ? 's' : ''}
          </span>
        </div>

        {banners.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">No Banners Yet</h3>
            <p className="text-gray-600">Upload your first banner to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className={`relative rounded-xl overflow-hidden border-2 transition ${
                  banner.isActive ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="relative w-full h-48">
                  <img
                    src={banner.image}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  {!banner.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Inactive</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleActive(banner._id, banner.isActive)}
                      className={`flex-1 px-4 py-2 rounded-xl font-semibold transition ${
                        banner.isActive
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-black hover:bg-gray-400'
                      }`}
                    >
                      {banner.isActive ? '✓ Active' : 'Activate'}
                    </button>

                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Uploaded: {new Date(banner.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
