"use client";

import { useState, useRef } from "react";

const companyTestimonials = [
  {
    id: 1,
    company: "Business Standard",
    type: "Press",
    text: "EZ Masala has revolutionized the masala industry with their commitment to quality and authenticity. Their products have become a household name across India."
  },
  {
    id: 2,
    company: "Economic Times",
    type: "Article",
    text: "A trusted brand that delivers on its promise of pure and natural masalas. EZ Masala's growth trajectory is a testament to their quality-first approach."
  },
  {
    id: 3,
    company: "The Hindu",
    type: "Press",
    text: "EZ Masala stands out in the crowded masala market with their FSSAI certified products and traditional processing methods that preserve natural flavors."
  },
  {
    id: 4,
    company: "Times of India",
    type: "Article",
    text: "From traditional households to modern kitchens, EZ Masala has captured the essence of authentic Indian cooking with their premium masala range."
  }
];

export default function CompanyTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  const startX = useRef(0);
  const endX = useRef(0);

  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % companyTestimonials.length);
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prev) =>
      prev === 0 ? companyTestimonials.length - 1 : prev - 1
    );
  };

  const handleSwipe = () => {
    const diff = endX.current - startX.current;
    if (diff > 50) prevSlide();
    if (diff < -50) nextSlide();
  };

  return (
    <section className="py-12 bg-white text-black">
      <div className="container mx-auto px-6">

        {/* Heading OUTSIDE red box */}
        <div className="text-center mb-10">
          <span className="text-sm font-bold tracking-widest text-gray-500 mb-2 block">
            PRESS & MEDIA
          </span>
          <h2 className="text-4xl font-black text-gray-900">Testimonials</h2>
        </div>

        {/* RED BOX (wider + no rounding) */}
        <div className="bg-yellow-500 px-10 py-12 max-w-6xl rounded-xl mx-auto">

          <div className="max-w-4xl mx-auto relative">

            {/* Slider Track */}
            <div
              className="overflow-hidden relative h-[250px] cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => (startX.current = e.clientX)}
              onMouseUp={(e) => {
                endX.current = e.clientX;
                handleSwipe();
              }}
              onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                endX.current = e.changedTouches[0].clientX;
                handleSwipe();
              }}
            >
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {companyTestimonials.map((t) => (
                  <div
                    key={t.id}
                    className="w-full flex-shrink-0 flex flex-col items-center text-center px-6"
                  >
                    <h3 className="text-2xl font-black mb-1 text-white">
                      {t.company}
                    </h3>

                    <p className="text-sm font-semibold text-red-100 uppercase tracking-wide mb-4">
                      {t.type}
                    </p>

                    <p className="text-lg md:text-xl max-w-2xl italic leading-relaxed text-white/90">
                      “{t.text}”
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">

              {/* Left */}
              <button
                onClick={prevSlide}
                className="w-6 h-6 flex items-center cursor-pointer justify-center bg-white/40 hover:bg-white/60 text-black rounded-full text-xs"
              >
                ❮
              </button>

              {/* Dots */}
              <div className="flex gap-2 items-center">
                {companyTestimonials.map((_, index) => (
                  <button key={index} onClick={() => setCurrentIndex(index)}>
                    <div
                      className={`
                    rounded-full transition-all duration-300
                    ${index === currentIndex ? "bg-white/70" : "bg-white/40"}
                  `}
                      style={{
                        width: index === currentIndex ? "20px" : "6px",
                        height: "6px",
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Right */}
              <button
                onClick={nextSlide}
                className="w-6 h-6 flex items-center cursor-pointer justify-center bg-white/40 hover:bg-white/60 text-black rounded-full text-xs"
              >
                ❯
              </button>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
