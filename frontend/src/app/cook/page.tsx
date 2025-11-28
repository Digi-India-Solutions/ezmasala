"use client";

import { useState, useEffect } from "react";
import RecipeCard from "@/components/RecipeCard";
import Pagination from "@/components/Pagination";
import Breadcrumb from "@/components/Breadcrumb";
import api from "@/lib/api";

export default function CookPage() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await api.get("/cooks");
        setAllRecipes(data);
      } catch (error) {
        console.error('Failed to fetch recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(allRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecipes = allRecipes.slice(startIndex, endIndex);

  return (
    <div className="py-4 md:py-8 bg-gray-50">
      <div className="container mx-auto px-4">

        <Breadcrumb items={[{ label: "Recipes" }]} />

        <h1 className="text-5xl font-bold text-center text-black mb-4">
          Cooking With EZ Masala
        </h1>

        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover delicious recipes and cooking inspiration using our premium spices
        </p>

        {/* Skeleton Loader  */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : allRecipes.length === 0 ? (
          <p className="text-center text-gray-600">No recipes available yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {paginatedRecipes.map((recipe: any) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
