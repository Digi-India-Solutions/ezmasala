'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await api.get('/blogs');
      setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    setDeletingId(id);
    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error('Failed to delete blog');
    }
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-black font-semibold">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black">Manage Blogs</h1>
          <Link href="/blogs/create" className="bg-black text-white px-4 sm:px-6 py-2 rounded-xl font-semibold hover:bg-gray-800 text-center text-sm sm:text-base">
            Add New Blog
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-black font-bold text-sm sm:text-base">Title</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-black font-bold text-sm sm:text-base">Author</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-black font-bold text-sm sm:text-base">Date</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-black font-bold text-sm sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog: any) => (
                  <tr key={blog._id} className="border-t">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-black text-sm sm:text-base">{blog.title}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-black text-sm sm:text-base">{blog.author}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-black text-sm sm:text-base">{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex gap-2">
                        <Link href={`/blogs/edit/${blog._id}`}>
                          <button className="bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deletingId === blog._id}
                          className="bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === blog._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
