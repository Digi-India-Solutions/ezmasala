'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function CreateBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'blogs');

      const data = await api.upload('/upload', uploadFormData);
      setFormData(prev => ({ ...prev, image: data.url }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/blogs', formData);
      toast.success('Blog created successfully!');
      router.push('/blogs');
    } catch (error) {
      toast.error('Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-black mb-8 text-black">Create New Blog</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl">
        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none text-black"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Author</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none text-black"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none h-48 text-black"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-black font-semibold mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-black outline-none text-black disabled:opacity-50"
            required
          />
          {uploading && <p className="text-sm text-gray-600 mt-2">Uploading image...</p>}
          {formData.image && <img src={formData.image} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-xl" />}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
}
