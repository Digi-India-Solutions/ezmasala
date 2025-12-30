"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import api from "@/lib/api";

export default function MasalaMPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get('/spices');
        // Filter for Masala M products (you may need to adjust this based on your data structure)
        const masalaMProducts = data.filter((product: any) =>
          product.name?.includes('Masala M') || product.category?.includes('masala-m')
        );
        setProducts(masalaMProducts);
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
              { label: "EZ Masala M" }
            ]}
          />

          {/* HERO SECTION */}
          <div className="rounded-3xl shadow-xl p-8 md:p-12 mb-10" style={{ backgroundColor: '#eddee1' }}>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#eddee1' }}>
                  <span className="text-black font-bold text-4xl">M</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
                EZ Masala M
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-4">
                South Indian Style Cooking Support
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Perfect for sambar, rasam, South Indian dal and vegetable curries.<br />
                Brings authentic South Indian home-style flavours to your meals.
              </p>
            </div>
          </div>

          {/* BASIC USAGE METHOD */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-10 max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Basic Usage Method
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              The process is simple. You can adjust oil, water and main ingredients as per your preference.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#eddee1', color: '#000' }}>
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Heat Oil or Ghee</h3>
                  <p className="text-gray-700">Take a pan, add 2–3 tablespoons of oil or ghee and heat it.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#eddee1', color: '#000' }}>
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Add EZ Masala M</h3>
                  <p className="text-gray-700">Add 1–2 tablespoons (adjust to taste) and sauté lightly for 30–60 seconds until fragrant.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#eddee1', color: '#000' }}>
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Add Water & Main Ingredients</h3>
                  <p className="text-gray-700">Add your dal, vegetables, or any other main ingredient along with water, tamarind (if needed) and salt.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#eddee1', color: '#000' }}>
                  4
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Cook & Adjust</h3>
                  <p className="text-gray-700">Let it cook until done. Taste and adjust salt, tanginess or spice as needed.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#eddee1', color: '#000' }}>
                  5
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Serve Hot</h3>
                  <p className="text-gray-700">Serve with rice, idli, dosa, vada or any South Indian accompaniment.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RECIPE EXAMPLES */}
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">
              Recipe Examples with EZ Masala M
            </h2>

            {/* RECIPE 1: SAMBAR */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#eddee1' }}>
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-black">Sambar</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Ingredients:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>1 cup toor dal, cooked</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Mixed vegetables (drumstick, carrot, brinjal, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>2–3 cups water</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Tamarind paste (small lemon-sized ball)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Salt to taste</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>2–3 tablespoons oil</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>2 tablespoons EZ Masala M</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Curry leaves for garnish</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Instructions:</h4>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">1.</span>
                      <span>Heat oil in a pan.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">2.</span>
                      <span>Add EZ Masala M and sauté for 30–60 seconds.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">3.</span>
                      <span>Add mixed vegetables and cook for 2–3 minutes.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">4.</span>
                      <span>Add cooked dal, tamarind paste, water and salt. Mix well.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">5.</span>
                      <span>Let it simmer for 10–15 minutes until vegetables are cooked.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">6.</span>
                      <span>Garnish with curry leaves and serve hot with rice or idli.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* RECIPE 2: RASAM */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#eddee1' }}>
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-black">Rasam</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Ingredients:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>1/4 cup toor dal water (cooked dal extract)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>2–3 tomatoes, chopped</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Tamarind paste (small amount)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>3 cups water</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Salt to taste</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>2 tablespoons oil or ghee</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>1.5 tablespoons EZ Masala M</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Curry leaves & coriander for garnish</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Instructions:</h4>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">1.</span>
                      <span>Heat oil or ghee in a pan.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">2.</span>
                      <span>Add EZ Masala M, sauté for 30 seconds.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">3.</span>
                      <span>Add chopped tomatoes, cook till soft.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">4.</span>
                      <span>Add dal water, tamarind paste, water and salt.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">5.</span>
                      <span>Bring to a gentle boil, then simmer for 5–7 minutes.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">6.</span>
                      <span>Garnish with curry leaves and coriander. Serve hot with rice.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* RECIPE 3: VEGETABLE CURRY */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#eddee1' }}>
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-black">South Indian Style Vegetable Curry</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Ingredients:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Mixed vegetables (potato, carrot, beans, peas)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>1 onion, chopped (optional)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>1 tomato, chopped</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>1/2 cup coconut milk or grated coconut</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>2–3 tablespoons oil</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>2 tablespoons EZ Masala M</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>1.5 cups water</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Salt to taste</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Curry leaves</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Instructions:</h4>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">1.</span>
                      <span>Heat oil in a pan, add curry leaves.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">2.</span>
                      <span>Add EZ Masala M and sauté briefly.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">3.</span>
                      <span>Add onion and tomato if using, cook till soft.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">4.</span>
                      <span>Add mixed vegetables, water and salt. Cook until vegetables are tender.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">5.</span>
                      <span>Add coconut milk or grated coconut, mix well and simmer for 3–5 minutes.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-green-500">6.</span>
                      <span>Serve hot with rice, dosa or idli.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* GENERAL COOKING TIPS */}
          <div className="rounded-2xl shadow-lg p-6 md:p-10 mb-10 max-w-5xl mx-auto border-l-4" style={{ backgroundColor: '#eddee1', borderColor: '#d9c9cd' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
              General Cooking Tips with EZ Masala M
            </h2>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1" style={{ backgroundColor: '#d9c9cd' }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700"><strong>Start with 1–2 tablespoons:</strong> Adjust the quantity based on your taste preference and the amount of dish you are cooking.</p>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700"><strong>Tamarind is Your Choice:</strong> EZ Masala M works with or without tamarind. Add tamarind for tangy dishes like sambar and rasam.</p>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700"><strong>Customize Your Dish:</strong> You can add curry leaves, mustard seeds, coconut, or any other South Indian ingredients you prefer.</p>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700"><strong>Works for Multiple Dishes:</strong> Use EZ Masala M as the base for sambar, rasam, veg curries, kuzhambu and more.</p>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700"><strong>Don't Forget Salt:</strong> EZ Masala M provides flavour, but salt needs to be added separately according to your preference.</p>
              </div>
            </div>
          </div>

          {/* CTA SECTION */}
          <div className="rounded-3xl shadow-2xl p-8 md:p-12 mb-10 max-w-5xl mx-auto text-center" style={{ backgroundColor: '#eddee1' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Ready to Cook with EZ Masala M?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Choose your pack size and bring authentic South Indian flavours to your kitchen today.
            </p>
            <Link href="/collections">
              <button className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center gap-2">
                Shop EZ Masala M
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
