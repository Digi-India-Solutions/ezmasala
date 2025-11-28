"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Breadcrumb from "@/components/Breadcrumb";
import api from "@/lib/api";

export default function SubcategoryPage({ params }: { params: Promise<{ subcategory: string }> }) {
  const [sortBy, setSortBy] = useState("featured");
  const [priceFilter, setPriceFilter] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategory, setSubcategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const init = async () => {
      const { subcategory: sub } = await params;
      setSubcategory(sub);
      fetchProducts();
    };
    init();
  }, [params]);

  const fetchProducts = async () => {
    try {
      const data = await api.get('/spices');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Get category name from slug
  const getCategoryName = (slug: string) => {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const categoryName = getCategoryName(subcategory);
  let filteredProducts: any[] = products.filter((p: any) => p.category === subcategory);

  if (priceFilter === "under-100") {
    filteredProducts = filteredProducts.filter((p: any) => p.price < 100);
  } else if (priceFilter === "100-200") {
    filteredProducts = filteredProducts.filter((p: any) => p.price >= 100 && p.price <= 200);
  } else if (priceFilter === "above-200") {
    filteredProducts = filteredProducts.filter((p: any) => p.price > 200);
  }

  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a: any, b: any) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a: any, b: any) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts = [...filteredProducts].sort((a: any, b: any) => b.ratings - a.ratings);
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="py-4 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-black">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <Breadcrumb
          items={[
            { label: "Collections", href: "/collections" },
            { label: categoryName }
          ]}
        />

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black">{categoryName}</h1>
          <p className="text-gray-600">Browse our collection of {categoryName.toLowerCase()}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-bold mb-4 text-black">Filters</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-black">Price Range</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        value="all"
                        checked={priceFilter === "all"}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-black">All Prices</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        value="under-100"
                        checked={priceFilter === "under-100"}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-black">Under ₹100</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        value="100-200"
                        checked={priceFilter === "100-200"}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-black">₹100 - ₹200</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="price"
                        value="above-200"
                        checked={priceFilter === "above-200"}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-black">Above ₹200</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{filteredProducts.length} products found</p>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-black">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-black"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found matching your criteria.</p>
              </div>
            )}

            {filteredProducts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
