'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  mainImage: string;
  additionalImages: string[];
  title: string;
}

export default function ImageGallery({ mainImage, additionalImages, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const allImages = [mainImage, ...additionalImages];

  const maxVisibleThumbnails = 4;
  const hasMoreImages = allImages.length > maxVisibleThumbnails;
  const visibleImages = allImages.slice(0, maxVisibleThumbnails);
  const remainingCount = allImages.length - maxVisibleThumbnails;

  // Handle keyboard navigation in modal
  useEffect(() => {
    if (!showModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, modalImageIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setShowModal(true);
  };

  const goToPrevious = () => {
    setModalImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setModalImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image Display */}
        <div
          className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-pointer"
          onClick={() => openModal(allImages.indexOf(selectedImage))}
        >
          <Image
            src={selectedImage}
            alt={title}
            fill
            className="object-cover"
          />
          {/* Zoom indicator */}
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">
            Click to zoom
          </div>
        </div>

        {/* Thumbnail Grid */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {visibleImages.map((img, idx) => {
              const isLastVisible = idx === maxVisibleThumbnails - 1 && hasMoreImages;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isLastVisible) {
                      openModal(maxVisibleThumbnails);
                    } else {
                      setSelectedImage(img);
                    }
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === img ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${title} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay for "View More" on last thumbnail */}
                  {isLastVisible && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer">
                      <div className="text-center">
                        <div className="text-white font-bold text-lg">+{remainingCount}</div>
                        <div className="text-white text-xs font-medium">View All</div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 z-10 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded-full text-sm font-medium z-10">
            {modalImageIndex + 1} / {allImages.length}
          </div>

          {/* Previous Button */}
          {allImages.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Main Image */}
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center p-8">
            <div className="relative w-full h-full">
              <Image
                src={allImages[modalImageIndex]}
                alt={`${title} ${modalImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Next Button */}
          {allImages.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-3xl w-full px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setModalImageIndex(idx)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                    modalImageIndex === idx ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
