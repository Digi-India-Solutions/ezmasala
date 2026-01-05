"use client";

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
          api.get("/spices?type=bestsellers"),
          api.get("/videos"),
        ]);

        setBestSellers(spicesData);
        setCampaignVideos(videosData);
      } catch (error) {
        console.error("Error fetching data:", error);
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
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center justify-items-center">
            {/* YOUTUBE VIDEO */}
            <div className="w-4/5 md:w-full h-60 md:h-96">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/hs6eZ5R8-pY?autoplay=1&mute=1&controls=1"
                title="About EZ Masala"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-none"
              ></iframe>
            </div>

            {/* RIGHT TEXT SIDE */}
            <div>
              <div className="inline-block mb-3">
                <span className="text-sm font-dm-sans font-bold tracking-widest text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                  OUR STORY
                </span>
              </div>
              <h3 className="text-5xl font-dm-sans font-black mb-6 text-gray-900 leading-tight tracking-tight">
                Smart Shortcut to Everyday Cooking. Traditionally Smart.
              </h3>
              <div className="space-y-4 text-base text-gray-700 leading-relaxed font-dm-sans">
                <p className="border-l-4 border-black pl-4">
                  EZ Masala brings innovation to the conventional Indian kitchen
                  with an innovative pre-cooked masala concept (समाधान) that
                  makes everyday cooking simple and reliable. Carefully prepared
                  using selected spices and herbs, it removes the need for
                  grinding, mixing, and complex preparation. One versatile blend
                  works for every kind of dish in the Indian kitchen, delivering
                  consistent taste and aroma every time.
                </p>
                <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-gray-900">
                  <p className="font-semibold text-gray-900 font-dm-sans">
                    Designed for Indian kitchens across the world, EZ Masala
                    isn’t just a masala—it’s a smarter way (समाधान) to cook,
                    every day.
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
            {/* USP 1 - Chef Hat Icon */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 group">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/usp1.png"
                  alt="Easy for New & Experienced Cooks"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-dm-sans font-bold text-gray-900 mb-2">
                Easy for New & Experienced Cooks
              </h3>
              <p className="text-sm text-gray-600 font-dm-sans">
                Designed for first-time cooks as well as trained chefs.
              </p>
            </div>

            {/* USP 2 - Spice Mortar & Pestle Icon */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 group">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/usp2.png"
                  alt="Consistent Taste, Every Time"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-dm-sans font-bold text-gray-900 mb-2">
                Consistent Taste, Every Time
              </h3>
              <p className="text-sm text-gray-600 font-dm-sans">
                Fixed flavour support – less guesswork, more reliability.
              </p>
            </div>

            {/* USP 3 - Cooking Pot with Steam Icon */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 group">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/usp3.png"
                  alt="One Base, Many Dishes"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-dm-sans font-bold text-gray-900 mb-2">
                One Base, Many Dishes
              </h3>
              <p className="text-sm text-gray-600 font-dm-sans">
                Use the same pack to cook different gravies, dals and curries.
              </p>
            </div>

            {/* USP 4 - Recipe Card with Spices Icon */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 group">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/usp4.jpg"
                  alt="Clear Instructions on Every Box"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-dm-sans font-bold text-gray-900 mb-2">
                Clear Instructions on Every Box
              </h3>
              <p className="text-sm text-gray-600 font-dm-sans">
                All sides of the box guide you step by step.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-dm-sans font-black text-gray-900 mb-3 tracking-tight">
              Cook with True Flavours of India
            </h2>
            <p className="text-gray-600 text-lg font-dm-sans">
              Discover our most loved masalas, handpicked for quality and taste
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
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
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
                  ${
                    isAtStart
                      ? "bg-gray-300 text-white cursor-not-allowed"
                      : "bg-black/40 hover:bg-black/60 text-white cursor-pointer"
                  }`}
                        >
                          ❮
                        </button>

                        <div className="flex gap-2">
                          {Array.from({ length: totalSlides }).map(
                            (_, index) => (
                              <button
                                key={index}
                                onClick={() => goToSlide(index)}
                              >
                                <div
                                  className={`transition-all duration-300 rounded-full ${
                                    index === currentIndex
                                      ? "bg-black/20"
                                      : "bg-black/70"
                                  }`}
                                  style={{
                                    width:
                                      index === currentIndex ? "20px" : "6px",
                                    height: "6px",
                                  }}
                                />
                              </button>
                            )
                          )}
                        </div>

                        <button
                          onClick={nextSlide}
                          disabled={isAtEnd}
                          className={`w-6 h-6 flex items-center justify-center rounded-full text-xs
                  ${
                    isAtEnd
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

      <section className="py-8 my-4 bg-white">
        <div className="container mx-auto px-6 text-center">
          <img
            src="/Certificate.jpeg"
            alt="Certificate"
            className="mx-auto rounded-2xl shadow-lg h-auto w-full sm:w-3/4 lg:max-w-5xl"
          />
        </div>
      </section>

      <CampaignVideos videos={campaignVideos} />

      <section className="py-16 bg-[#F4EDE1] text-black relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-8">
            <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-dm-sans font-bold mb-3 animate-pulse">
              LIMITED TIME OFFER
            </span>
            <h2 className="text-4xl md:text-5xl font-dm-sans font-black mb-3 text-black tracking-tight">
              Hot Deals
            </h2>
            <p className="text-gray-700 text-lg font-dm-sans">
              Save up to 20% on our premium masala selection
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotDeals.map((product: any) => (
              <ProductCard
                key={product._id}
                product={product}
                onCartOpen={() => setIsCartOpen(true)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white text-black">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <span className="text-sm font-dm-sans font-bold tracking-widest text-gray-500 bg-gray-100 px-4 py-2 rounded-full mb-4 inline-block">
              RECIPE INSPIRATION
            </span>
            <h2 className="text-4xl md:text-5xl font-dm-sans font-black mb-4 text-gray-900 tracking-tight">
              Cook With EZ Masala
            </h2>
            <p className="text-gray-600 text-base font-dm-sans max-w-2xl mx-auto leading-relaxed mb-8">
              Discover delicious recipes and cooking tips to make the most of
              your masalas
            </p>
            <Link href="/cook">
              <button className="bg-white text-black border-2 border-black px-8 py-4 rounded-2xl font-dm-sans font-bold hover:bg-black hover:text-white transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 inline-flex items-center gap-3 group">
                Explore Recipes
                <svg
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
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
            <h2 className="text-4xl md:text-5xl font-dm-sans font-black mb-4 text-gray-900 tracking-tight">
              Who is EZ Masala For?
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-dm-sans">
              We designed EZ Masala for real kitchens and real people – not only
              for expert chefs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Target User 1 - Family/Home Icon */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-amber-500 group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    viewBox="0 0 64 64"
                    fill="currentColor"
                  >
                    <path d="M32 6L8 26v30a4 4 0 004 4h16V44a4 4 0 014-4h0a4 4 0 014 4v16h16a4 4 0 004-4V26L32 6z" />
                    <path
                      d="M32 6L8 26h48L32 6z"
                      fill="currentColor"
                      opacity="0.8"
                    />
                    <circle cx="32" cy="30" r="6" fill="white" opacity="0.9" />
                    <rect
                      x="26"
                      y="44"
                      width="12"
                      height="16"
                      rx="2"
                      fill="white"
                      opacity="0.7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-dm-sans font-bold text-gray-900 mb-3">
                    Home Makers & Working Couples
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-dm-sans">
                    Save time on daily cooking while keeping familiar home-style
                    taste.
                  </p>
                </div>
              </div>
            </div>

            {/* Target User 2 - Student/Learning Icon */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-emerald-500 group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    viewBox="0 0 64 64"
                    fill="currentColor"
                  >
                    <path d="M32 8L4 22l28 14 28-14L32 8z" />
                    <path
                      d="M12 28v16c0 6 9 12 20 12s20-6 20-12V28L32 38 12 28z"
                      fill="currentColor"
                      opacity="0.85"
                    />
                    <rect
                      x="52"
                      y="22"
                      width="4"
                      height="24"
                      rx="2"
                      fill="currentColor"
                    />
                    <circle
                      cx="54"
                      cy="48"
                      r="4"
                      fill="currentColor"
                      opacity="0.9"
                    />
                    <ellipse
                      cx="32"
                      cy="36"
                      rx="8"
                      ry="3"
                      fill="white"
                      opacity="0.3"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-dm-sans font-bold text-gray-900 mb-3">
                    Students & New Cooks
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-dm-sans">
                    Even if you don't know complex recipes, you can still cook
                    dependable meals.
                  </p>
                </div>
              </div>
            </div>

            {/* Target User 3 - Tiffin/Food Container Icon */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-rose-500 group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    viewBox="0 0 64 64"
                    fill="currentColor"
                  >
                    <ellipse
                      cx="32"
                      cy="12"
                      rx="20"
                      ry="6"
                      fill="currentColor"
                    />
                    <path
                      d="M12 12v8c0 3.3 8.95 6 20 6s20-2.7 20-6v-8c0 3.3-8.95 6-20 6s-20-2.7-20-6z"
                      fill="currentColor"
                      opacity="0.9"
                    />
                    <path
                      d="M12 24v8c0 3.3 8.95 6 20 6s20-2.7 20-6v-8c0 3.3-8.95 6-20 6s-20-2.7-20-6z"
                      fill="currentColor"
                      opacity="0.8"
                    />
                    <path
                      d="M12 36v8c0 3.3 8.95 6 20 6s20-2.7 20-6v-8c0 3.3-8.95 6-20 6s-20-2.7-20-6z"
                      fill="currentColor"
                      opacity="0.7"
                    />
                    <path
                      d="M12 48v4c0 3.3 8.95 6 20 6s20-2.7 20-6v-4c0 3.3-8.95 6-20 6s-20-2.7-20-6z"
                      fill="currentColor"
                      opacity="0.6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-dm-sans font-bold text-gray-900 mb-3">
                    Home Chefs & Tiffin Services
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-dm-sans">
                    Maintain consistent taste for your customers, even when
                    helpers are cooking.
                  </p>
                </div>
              </div>
            </div>

            {/* Target User 4 - Restaurant/Kitchen Icon */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-violet-500 group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
                    viewBox="0 0 64 64"
                    fill="currentColor"
                  >
                    <rect
                      x="8"
                      y="20"
                      width="48"
                      height="36"
                      rx="4"
                      fill="currentColor"
                    />
                    <rect
                      x="12"
                      y="8"
                      width="40"
                      height="14"
                      rx="2"
                      fill="currentColor"
                      opacity="0.85"
                    />
                    <rect
                      x="16"
                      y="12"
                      width="8"
                      height="6"
                      rx="1"
                      fill="white"
                      opacity="0.4"
                    />
                    <rect
                      x="28"
                      y="12"
                      width="8"
                      height="6"
                      rx="1"
                      fill="white"
                      opacity="0.4"
                    />
                    <rect
                      x="40"
                      y="12"
                      width="8"
                      height="6"
                      rx="1"
                      fill="white"
                      opacity="0.4"
                    />
                    <circle cx="20" cy="36" r="6" fill="white" opacity="0.3" />
                    <circle cx="44" cy="36" r="6" fill="white" opacity="0.3" />
                    <rect
                      x="26"
                      y="42"
                      width="12"
                      height="14"
                      rx="2"
                      fill="white"
                      opacity="0.5"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-dm-sans font-bold text-gray-900 mb-3">
                    Small Restaurants, Canteens & Cloud Kitchens
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-dm-sans">
                    Use EZ Masala as your standard base and make training new
                    staff easier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <CompanyTestimonials /> */}
      <CustomerReviews />

      {/* SHINE EXPORTS INFO */}
      <section className="py-12 bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <svg
                    className="w-10 h-10 text-white"
                    viewBox="0 0 64 64"
                    fill="currentColor"
                  >
                    <path d="M32 4c-2 0-4 2-4 4v8c-8 2-14 10-14 18v4h36v-4c0-8-6-16-14-18V8c0-2-2-4-4-4z" />
                    <ellipse
                      cx="32"
                      cy="38"
                      rx="18"
                      ry="4"
                      fill="currentColor"
                      opacity="0.8"
                    />
                    <rect
                      x="14"
                      y="40"
                      width="36"
                      height="6"
                      rx="2"
                      fill="currentColor"
                    />
                    <path
                      d="M18 46v10a4 4 0 004 4h20a4 4 0 004-4V46H18z"
                      fill="currentColor"
                      opacity="0.9"
                    />
                    <circle cx="26" cy="52" r="3" fill="white" opacity="0.3" />
                    <circle cx="38" cy="52" r="3" fill="white" opacity="0.3" />
                    <path d="M30 4h4v2h-4z" fill="currentColor" opacity="0.7" />
                  </svg>
                </div>
              </div>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-dm-sans">
                EZ Masala is developed and marketed by{" "}
                <span className="font-bold text-gray-900">
                  Shine Exports (India)
                </span>{" "}
                – combining years of experience in food, printing and packaging
                to bring clarity and support to your kitchen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
