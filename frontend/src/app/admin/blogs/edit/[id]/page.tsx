'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import api from "@/lib/api";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const data = await api.get(`/blogs/${id}`);
      setFormData({
        title: data.title || '',
        content: data.content || '',
        author: data.author || '',
        image: data.image || '',
      });
    } catch (error) {
      toast.error('Failed to load blog');
    }
  };

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
      await api.put(`/blogs/${id}`, formData);
      toast.success('Blog updated successfully!');
      router.push('/admin/blogs');
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-black mb-8 text-black">Edit Blog</h1>

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
          />
          {uploading && <p className="text-sm text-gray-600 mt-2">Uploading image...</p>}
          {formData.image && <img src={formData.image} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-xl" />}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? 'Updating...' : 'Update Blog'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border-2 border-black rounded-xl font-bold hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
