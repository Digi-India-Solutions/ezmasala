"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/api";

interface Spice {
  _id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export default function ManageSpices() {
  const [spices, setSpices] = useState<Spice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSpices();
  }, []);

  const fetchSpices = async () => {
    try {
      const data = await api.get("/spices");
      setSpices(Array.isArray(data) ? data : data.spices || []);
    } catch (error) {
      toast.error("Failed to fetch spices");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this spice?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/spices/${id}`);
      toast.success("Spice deleted successfully!");
      fetchSpices();
    } catch (error) {
      toast.error("Failed to delete spice");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <p className="mt-4 text-black font-semibold">Loading spices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black">Manage Spices</h1>
          <Link href="/admin/spices/create">
            <button className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:bg-gray-900 transition text-sm sm:text-base w-full sm:w-auto">
              Add New Spice
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[768px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-bold text-sm sm:text-base text-black">Image</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-bold text-sm sm:text-base text-black">Title</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-bold text-sm sm:text-base text-black">Category</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-bold text-sm sm:text-base text-black">Price</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-bold text-sm sm:text-base text-black">Stock</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-bold text-sm sm:text-base text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {spices.map((spice) => (
                  <tr key={spice._id} className="border-t">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {spice.image ? (
                        <img
                          src={spice.image}
                          alt={spice.title}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-black">{spice.title}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-black">{spice.category}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-black">₹{spice.price}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-black">{spice.stock}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/spices/edit/${spice._id}`}>
                          <button className="bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(spice._id)}
                          disabled={deletingId === spice._id}
                          className="bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === spice._id ? "Deleting..." : "Delete"}
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
