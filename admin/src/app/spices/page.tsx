"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/api";

interface Spice {
  _id: string;
  title: string;
  price: number;
  stock: number;
  category: string[];
  image?: string;
}

export default function ManageSpices() {
  const [spices, setSpices] = useState<Spice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchSpices();
  }, []);

  const fetchSpices = async () => {
    try {
      const data = await api.get("/spices");
      setSpices(Array.isArray(data) ? data : data.spices || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch spices");
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories from spices
  const categories = useMemo(() => {
    const allCategories: string[] = [];
    spices.forEach(spice => {
      if (spice.category && Array.isArray(spice.category)) {
        allCategories.push(...spice.category);
      }
    });
    const uniqueCategories = Array.from(new Set(allCategories));
    return ["all", ...uniqueCategories.sort()];
  }, [spices]);

  // Filter spices by selected category
  const filteredSpices = useMemo(() => {
    if (selectedCategory === "all") {
      return spices;
    }
    return spices.filter(spice =>
      spice.category && spice.category.includes(selectedCategory)
    );
  }, [spices, selectedCategory]);

  // Helper function to get category count
  const getCategoryCount = (category: string) => {
    if (category === "all") return spices.length;
    return spices.filter(spice =>
      spice.category && spice.category.includes(category)
    ).length;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this spice?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/spices/${id}`);
      toast.success("Spice deleted successfully!");
      fetchSpices();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete spice");
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
          <Link href="/spices/create">
            <button className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:bg-gray-900 transition text-sm sm:text-base w-full sm:w-auto">
              Add New Spice
            </button>
          </Link>
        </div>

        {/* Category Filter Dropdown */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <label htmlFor="category-filter" className="font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter by Category:
            </label>
            <div className="relative">
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border-2 border-gray-300 rounded-lg px-4 py-2 pr-10 font-semibold text-sm text-gray-700 hover:border-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all cursor-pointer"
              >
                <option value="all">All Categories ({getCategoryCount("all")})</option>
                {categories.filter(cat => cat !== "all").map((category) => (
                  <option key={category} value={category}>
                    {category} ({getCategoryCount(category)})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-3xl">
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
                {filteredSpices.map((spice) => (
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
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-black">
                      <div className="flex flex-wrap gap-1">
                        {spice.category && spice.category.map((cat, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-black">₹{spice.price}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-black">{spice.stock}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex gap-2">
                        <Link href={`/spices/edit/${spice._id}`}>
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
