"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import api from "@/lib/api";

export default function MasalaJPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get('/spices');
        // Filter for Masala J products (you may need to adjust this based on your data structure)
        const masalaJProducts = data.filter((product: any) =>
          product.name?.includes('Masala J') || product.category?.includes('masala-j')
        );
        setProducts(masalaJProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <div className="py-4 md:py-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Shop", href: "/collections" },
              { label: "EZ Masala J" }
            ]}
          />

          {/* HERO SECTION */}
          <div className="rounded-3xl shadow-xl p-8 md:p-12 mb-10" style={{ backgroundColor: '#eae6d2' }}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#eae6d2' }}>
                  <span className="text-black font-bold text-4xl">J</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
                EZ Masala J
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-4">
                North Indian Style Cooking Support
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Made for dal tadka, chole, rajma, paneer gravies and everyday sabzis.<br />
                Brings that familiar North Indian home-style flavour to your kitchen.
              </p>
            </div>
          </div>

          {/* BASIC USAGE METHOD */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-10 max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Basic Usage Method
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              The process is simple. You can adjust oil, water and main ingredients as per your preference.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#eae6d2', color: '#000' }}>
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Heat Oil or Ghee</h3>
                  <p className="text-gray-700">Take a pan, add 2–3 tablespoons of oil or ghee and heat it.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#eae6d2', color: '#000' }}>
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Add EZ Masala J</h3>
                  <p className="text-gray-700">Add 1–2 tablespoons (adjust to taste) and sauté lightly for 30–60 seconds until fragrant.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#eae6d2', color: '#000' }}>
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Add Water & Main Ingredients</h3>
                  <p className="text-gray-700">Add your dal, vegetables, paneer, or any other main ingredient along with water and salt.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#eae6d2', color: '#000' }}>
                  4
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Cook & Adjust</h3>
                  <p className="text-gray-700">Let it cook until done. Taste and adjust salt, spice or garnish as needed.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#eae6d2', color: '#000' }}>
                  5
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Serve Hot</h3>
                  <p className="text-gray-700">Garnish with fresh coriander, lemon or cream if desired and serve with roti, rice or paratha.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RECIPE EXAMPLES */}
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">
              Recipe Examples with EZ Masala J
            </h2>

            {/* RECIPE 1: DAL TADKA */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#eae6d2' }}>
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-black">Dal Tadka</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Ingredients:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>1 cup toor dal (arhar dal), washed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>2–3 cups water</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>Salt to taste</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>2–3 tablespoons oil or ghee</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>1.5–2 tablespoons EZ Masala J</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>Fresh coriander for garnish</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Instructions:</h4>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">1.</span>
                      <span>Pressure cook the dal with water and salt until soft.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">2.</span>
                      <span>In a separate pan, heat oil or ghee.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">3.</span>
                      <span>Add EZ Masala J and sauté for 30–60 seconds.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">4.</span>
                      <span>Pour this tadka over the cooked dal and mix well.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">5.</span>
                      <span>Garnish with coriander and serve hot with rice or roti.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* RECIPE 2: CHOLE (CHICKPEA CURRY) */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#eae6d2' }}>
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-black">Chole (Chickpea Curry)</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Ingredients:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>1.5 cups boiled chickpeas (chole)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>1 onion, finely chopped (optional)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>1 tomato, chopped (optional)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>2–3 tablespoons oil</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>2 tablespoons EZ Masala J</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>1.5 cups water</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>Salt to taste</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Instructions:</h4>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">1.</span>
                      <span>Heat oil in a pan.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">2.</span>
                      <span>Add EZ Masala J, sauté for 30 seconds.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">3.</span>
                      <span>Add chopped onion and tomato if using, cook till soft.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">4.</span>
                      <span>Add boiled chickpeas, water and salt. Mix well.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">5.</span>
                      <span>Let it simmer for 10–15 minutes until the gravy thickens.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">6.</span>
                      <span>Garnish with onion rings and coriander. Serve with bhature or kulcha.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* RECIPE 3: PANEER MASALA */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#eae6d2' }}>
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-black">Paneer Masala</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Ingredients:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>200 g paneer, cubed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>1 onion, chopped</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>1 tomato, chopped</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>2–3 tablespoons oil or butter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>2 tablespoons EZ Masala J</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>1 cup water or cream</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>Salt to taste</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>Fresh coriander for garnish</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Instructions:</h4>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">1.</span>
                      <span>Heat oil or butter in a pan.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">2.</span>
                      <span>Add EZ Masala J and sauté briefly.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">3.</span>
                      <span>Add chopped onion and tomato, cook till soft.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">4.</span>
                      <span>Add paneer cubes, mix gently.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">5.</span>
                      <span>Add water or cream and salt, let it simmer for 5–7 minutes.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-orange-500">6.</span>
                      <span>Garnish with coriander and serve with naan or roti.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* GENERAL COOKING TIPS */}
          <div className="rounded-2xl shadow-lg p-6 md:p-10 mb-10 max-w-5xl mx-auto border-l-4" style={{ backgroundColor: '#eae6d2', borderColor: '#d4c4b0' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
              General Cooking Tips with EZ Masala J
            </h2>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1" style={{ backgroundColor: '#d4c4b0' }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700"><strong>Start Small:</strong> Use 1–2 tablespoons per dish initially, then adjust according to your taste preference.</p>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700"><strong>Don't Skip the Sauté:</strong> Lightly sauté EZ Masala J in oil or ghee for 30–60 seconds to release the flavours.</p>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700"><strong>Add Your Touch:</strong> You can add ginger, garlic, green chillies, or your favourite spices alongside EZ Masala J.</p>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700"><strong>Adjust Water & Salt:</strong> Salt is not included in EZ Masala J, so add it separately as per your preference.</p>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700"><strong>Works for Dry & Gravy:</strong> EZ Masala J can be used for both dry sabzis and wet gravies – just adjust the water quantity.</p>
              </div>
            </div>
          </div>

          {/* CTA SECTION */}
          <div className="rounded-3xl shadow-2xl p-8 md:p-12 mb-10 max-w-5xl mx-auto text-center" style={{ backgroundColor: '#eae6d2' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Ready to Cook with EZ Masala J?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Choose your pack size and bring consistent North Indian flavours to your kitchen today.
            </p>
            <Link href="/collections">
              <button className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center gap-2">
                Shop EZ Masala J
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>
          </div>

          {/* PRODUCTS SECTION */}
          {!loading && products.length > 0 && (
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">
                Available Pack Sizes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onCartOpen={() => setIsCartOpen(true)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
