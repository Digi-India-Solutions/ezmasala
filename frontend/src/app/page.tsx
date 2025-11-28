'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import BannerCarousel from "@/components/BannerCarousel";
import CampaignVideos from "@/components/CampaignVideos";
import CompanyTestimonials from "@/components/CompanyTestimonials";
import CustomerReviews from "@/components/CustomerReviews";
import CartSidebar from "@/components/CartSidebar";
import api from "@/lib/api";

export default function Home() {
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [campaignVideos, setCampaignVideos] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spicesData, videosData] = await Promise.all([
          api.get('/spices?type=bestsellers'),
          api.get('/videos')
        ]);

        setBestSellers(spicesData);
        setCampaignVideos(videosData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const featuredProducts = bestSellers.slice(0, 8);
  const hotDeals = bestSellers.slice(0, 4);

  return (
    <>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <div className="mb-2 md:mb-10">
        <BannerCarousel />
      </div>

      <section className="py-2 md:py-10 bg-white relative overflow-hidden">

        <div className="md:hidden w-full h-72 relative mb-10">
          <Image
            src="/spice/8.jpg"
            alt="Fresh spices"
            fill
            className="object-cover rounded-none"
          />
        </div>

        <div className="hidden md:block absolute top-0 left-0 w-1/2 h-full">
          <Image
            src="/spice/8.jpg"
            alt="Fresh spices"
            fill
            className="object-cover rounded-none"
          />
          <div className="absolute inset-0 pointer-events-none"></div>
        </div>

        {/* TEXT CONTENT */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* EMPTY SPACE FOR DESKTOP IMAGE */}
            <div className="hidden md:block"></div>

            {/* RIGHT TEXT SIDE */}
            <div>
              <div className="inline-block mb-3">
                <span className="text-sm font-montserrat font-bold tracking-widest text-gray-500 bg-gray-100 px-4 py-2 rounded-full">OUR STORY</span>
              </div>
              <h2 className="text-5xl font-lora mb-6 text-gray-900 leading-tight">Pure. Authentic. Fresh.</h2>
              <div className="space-y-4 text-base text-gray-700 leading-relaxed font-raleway">
                <p className="border-l-4 border-black pl-4">
                  At EZ Masala 🌿, we believe that great cooking starts with great ingredients. Our spices are carefully selected,
                  sourced from the finest farms 🏞️, and processed using traditional methods to preserve their natural aroma and flavor.
                </p>
                <p>
                  Every package is sealed with freshness ✨, ensuring that you get the same authentic taste that has been cherished
                  in Indian households for generations.
                </p>
                <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-gray-900">
                  <p className="font-semibold text-gray-900 font-poppins">
                    From our kitchen to yours, we promise quality, purity, and authenticity in every pinch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY USP STRIP */}
      <section className="py-8 md:py-12 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* USP 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Easy for New & Experienced Cooks</h3>
              <p className="text-sm text-gray-600">Designed for first-time cooks as well as trained chefs.</p>
            </div>

            {/* USP 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Consistent Taste, Every Time</h3>
              <p className="text-sm text-gray-600">Fixed flavour support – less guesswork, more reliability.</p>
            </div>

            {/* USP 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">One Base, Many Dishes</h3>
              <p className="text-sm text-gray-600">Use the same pack to cook different gravies, dals and curries.</p>
            </div>

            {/* USP 4 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Instructions on Every Box</h3>
              <p className="text-sm text-gray-600">All sides of the box guide you step by step.</p>
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">

          <div className="mb-8">
            <h2 className="text-4xl font-montserrat text-gray-900 mb-3">
              Cook with True Flavours of India
            </h2>
            <p className="text-gray-600 text-base font-inter">
              Discover our most loved spices, handpicked for quality and taste
            </p>
          </div>

          {(() => {
            const scrollRef = useRef<HTMLDivElement>(null);
            const [currentIndex, setCurrentIndex] = useState(0);

            const products = featuredProducts;
            const isLoading = bestSellers.length === 0;
            const noProducts = !isLoading && products.length === 0;

            const ITEMS_PER_PAGE = 4;
            const totalSlides = Math.ceil(products.length / ITEMS_PER_PAGE);

            const scrollToSlide = (index: number) => {
              if (!scrollRef.current) return;
              const container = scrollRef.current;
              const width = container.clientWidth;
              container.scrollTo({ left: width * index, behavior: "smooth" });
            };

            const nextSlide = () => {
              if (currentIndex >= totalSlides - 1) return;
              const newIndex = currentIndex + 1;
              setCurrentIndex(newIndex);
              scrollToSlide(newIndex);
            };

            const prevSlide = () => {
              if (currentIndex <= 0) return;
              const newIndex = currentIndex - 1;
              setCurrentIndex(newIndex);
              scrollToSlide(newIndex);
            };

            const goToSlide = (index: number) => {
              setCurrentIndex(index);
              scrollToSlide(index);
            };

            const isAtStart = currentIndex === 0;
            const isAtEnd = currentIndex === totalSlides - 1;

            // Skeleton shimmer animation
            const skeletonCard = (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            );

            return (
              <div className="relative max-w-6xl mx-auto">

                {/* LOADING SKELETON */}
                {isLoading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="w-full">
                        {skeletonCard}
                      </div>
                    ))}
                  </div>
                )}

                {/* NO PRODUCTS FOUND */}
                {noProducts && (
                  <div className="text-center py-20 text-gray-500 text-lg font-medium">
                    No products found.
                  </div>
                )}

                {/* PRODUCT CAROUSEL */}
                {!isLoading && !noProducts && (
                  <>
                    <div
                      ref={scrollRef}
                      className="flex overflow-x-auto scroll-smooth gap-6 snap-x snap-mandatory scrollbar-hide"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      {products.map((p) => (
                        <div
                          key={p._id}
                          className="snap-center w-[80%] sm:w-[45%] lg:w-[23%] flex-shrink-0"
                        >
                          <ProductCard
                            product={p}
                            onCartOpen={() => setIsCartOpen(true)}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {products.length > ITEMS_PER_PAGE && (
                      <div className="flex justify-center items-center gap-6 mt-10">
                        <button
                          onClick={prevSlide}
                          disabled={isAtStart}
                          className={`w-6 h-6 flex items-center justify-center rounded-full text-xs
                  ${isAtStart
                              ? "bg-gray-300 text-white cursor-not-allowed"
                              : "bg-black/40 hover:bg-black/60 text-white cursor-pointer"
                            }`}
                        >
                          ❮
                        </button>

                        <div className="flex gap-2">
                          {Array.from({ length: totalSlides }).map((_, index) => (
                            <button key={index} onClick={() => goToSlide(index)}>
                              <div
                                className={`transition-all duration-300 rounded-full ${index === currentIndex ? "bg-black/20" : "bg-black/70"
                                  }`}
                                style={{
                                  width: index === currentIndex ? "20px" : "6px",
                                  height: "6px",
                                }}
                              />
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={nextSlide}
                          disabled={isAtEnd}
                          className={`w-6 h-6 flex items-center justify-center rounded-full text-xs
                  ${isAtEnd
                              ? "bg-gray-300 text-white cursor-not-allowed"
                              : "bg-black/40 hover:bg-black/60 text-white cursor-pointer"
                            }`}
                        >
                          ❯
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })()}


        </div>
      </section>

      <section className="py-20 my-10 bg-white">
        <div className="container mx-auto px-6 text-center">
          <Image
            src="/Certifications.jpg"
            alt="Certification"
            width={1200}
            height={400}
            className="mx-auto rounded-2xl shadow-lg"
          />
        </div>
      </section>

      <CampaignVideos videos={campaignVideos} />

      <section className="py-16 bg-[#F4EDE1] text-black relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-8">
            <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-montserrat font-bold mb-3 animate-pulse">
              LIMITED TIME OFFER
            </span>
            <h2 className="text-4xl font-lora mb-3 text-black">Hot Deals 🔥</h2>
            <p className="text-gray-700 text-base font-raleway">
              Save up to 20% on our premium spice selection
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotDeals.map((product: any) => (
              <ProductCard key={product._id} product={product} onCartOpen={() => setIsCartOpen(true)} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white text-black">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <span className="text-sm font-montserrat font-bold tracking-widest text-gray-500 bg-gray-100 px-4 py-2 rounded-full mb-4 inline-block">RECIPE INSPIRATION</span>
            <h2 className="text-4xl font-lora font-black mb-4 text-gray-900">Cook With EZ Masala</h2>
            <p className="text-gray-600 text-base font-raleway max-w-2xl mx-auto leading-relaxed mb-8">
              Discover delicious recipes and cooking tips to make the most of your spices
            </p>
            <Link href="/cook">
              <button className="bg-white text-black border-2 border-black px-8 py-4 rounded-2xl font-montserrat font-bold hover:bg-black hover:text-white transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 inline-flex items-center gap-2">
                Explore Recipes
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHO IS EZ MASALA FOR? */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-lora font-black mb-4 text-gray-900">Who is EZ Masala For?</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-raleway">
              We designed EZ Masala for real kitchens and real people – not only for expert chefs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* Target User 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-green-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Home Makers & Working Couples</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Save time on daily cooking while keeping familiar home-style taste.
                  </p>
                </div>
              </div>
            </div>

            {/* Target User 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Students & New Cooks</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Even if you don't know complex recipes, you can still cook dependable meals.
                  </p>
                </div>
              </div>
            </div>

            {/* Target User 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-orange-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Home Chefs & Tiffin Services</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Maintain consistent taste for your customers, even when helpers are cooking.
                  </p>
                </div>
              </div>
            </div>

            {/* Target User 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-purple-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Small Restaurants, Canteens & Cloud Kitchens</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Use EZ Masala as your standard base and make training new staff easier.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <CompanyTestimonials />
      <CustomerReviews />

      {/* SHINE EXPORTS INFO */}
      <section className="py-12 bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="inline-block mb-4">
                <svg className="w-12 h-12 text-gray-700 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-raleway">
                EZ Masala is developed and marketed by <span className="font-bold text-gray-900">Shine Exports (India)</span> – combining years of experience in food, printing and packaging to bring clarity and support to your kitchen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
