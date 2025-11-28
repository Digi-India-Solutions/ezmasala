'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import api from '@/lib/api';

export default function BannerCarousel() {
  const [banners, setBanners] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 3000;

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await api.get('/banners');

        if (data.banners && data.banners.length > 0) {
          const activeBanners = data.banners
            .filter((b: any) => b.isActive)
            .map((b: any) => b.image);

          if (activeBanners.length > 0) {
            setBanners(activeBanners);
          }
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error);
        // Keep using default banners
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, SLIDE_DURATION / 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setCurrentSlide((s) => (s + 1) % banners.length);
    }
  }, [progress]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  // Show loading skeleton while fetching
  if (loading) {
    return (
      <section className="relative w-full flex flex-col items-center gap-4">
        <div className="relative w-full overflow-hidden bg-gray-200 animate-pulse" style={{ aspectRatio: '1920/700' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="flex gap-2">
            <div className="w-5 h-1.5 bg-gray-300 rounded-full"></div>
            <div className="w-5 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        </div>
      </section>
    );
  }

  // Don't render if no banners after loading
  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full flex flex-col items-center gap-4 animate-fadeIn">
      <div className="relative w-full overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0 absolute inset-0"
              }`}
          >
            <Image
              src={banner}
              alt=""
              width={1920}
              height={700}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in 0.3s forwards;
          opacity: 0;
        }
      `}</style>

      {/* Controls */}
      <div className="flex items-center gap-4">

        {/* Left Arrow */}
        <button
          onClick={() =>
            goToSlide((currentSlide - 1 + banners.length) % banners.length)
          }
          className="w-6 h-6 cursor-pointer flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full text-xs"
        >
          ❮
        </button>

        {/* Dots */}
        <div className="flex gap-2 items-center">
          {banners.map((_, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={index}
                onClick={() => goToSlide(index)}
                className="cursor-pointer flex items-center justify-center"
              >
                <div
                  className={`
                    transition-all duration-300 
                    ${isActive ? 'bg-black/20' : 'bg-black/70'}
                    rounded-full
                  `}
                  style={{
                    width: isActive ? '20px' : '6px',
                    height: '6px',
                  }}
                >
                  {isActive && (
                    <div
                      className="h-full bg-black rounded-l-full"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => goToSlide((currentSlide + 1) % banners.length)}
          className="w-6 h-6 cursor-pointer flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full text-xs"
        >
          ❯
        </button>

      </div>
    </section>
  );
}
