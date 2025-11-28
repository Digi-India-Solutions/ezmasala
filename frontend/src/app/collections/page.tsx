"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";
import CartSidebar from "@/components/CartSidebar";
import api from "@/lib/api";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CollectionsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchSpices = async () => {
      try {
        const data = await api.get('/spices');
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Failed to fetch spices:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await api.get('/categories');
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchSpices();
    fetchCategories();
  }, []);

  // Filter and sort handler
  useEffect(() => {
    let filtered = [...products];

    // Filter by category - handle both string and array categories
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => {
        if (Array.isArray(p.category)) {
          return p.category.includes(selectedCategory);
        }
        return p.category === selectedCategory;
      });
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-az":
        filtered.sort((a, b) =>
          (a.title || a.name).localeCompare(b.title || b.name)
        );
        break;
      case "name-za":
        filtered.sort((a, b) =>
          (b.title || b.name).localeCompare(a.title || a.name)
        );
        break;
      case "rating":
        filtered.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, products]);

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <div className="py-4 md:py-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "Shop All" }]} />

        {/* PAGE HEADING */}
        <h1 className="text-5xl font-bold text-black text-center mb-4">
          Shop EZ Masala
        </h1>
        <p className="text-center text-gray-600 text-lg mb-10 max-w-2xl mx-auto font-semibold">
          Choose your variant and pack size – same quality, flexible quantity.
        </p>

        {/* TOP FILTER BAR */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* CATEGORY DROPDOWN */}
            <div className="flex flex-col w-full md:w-1/2">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Filter by Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={categoriesLoading}
                  className="w-full appearance-none px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="all">All Products</option>
                  {categoriesLoading ? (
                    <option disabled>Loading categories...</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>

                {/* Down Arrow Icon */}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            {/* SORT DROPDOWN */}
            <div className="flex flex-col w-full md:w-1/2">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Sort By
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="name-az">Name: A → Z</option>
                  <option value="name-za">Name: Z → A</option>
                  <option value="rating">Highest Rated</option>
                </select>

                {/* Down Arrow Icon */}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

          </div>

          {/* Product Count */}
          <div className="mt-5 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-black">
                    {filteredProducts.length}
                  </span>{" "}
                  items
                </>
              )}
            </p>
          </div>

        </div>

        {/* PRODUCT GRID */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try selecting a different category
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSortBy("default");
                }}
                className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onCartOpen={() => setIsCartOpen(true)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}