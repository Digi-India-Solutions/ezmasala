"use client";

import { useState, useRef, useEffect } from "react";
import VideoModal from "./VideoModal";

interface Video {
  _id: string;
  videoUrl: string;
  spiceId: {
    _id: string;
    title: string;
    price: number;
    image: string;
  };
}

export default function CampaignVideos({ videos }: { videos: Video[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const [scrollPos, setScrollPos] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  /** Update max scroll width */
  useEffect(() => {
    const updateSize = () => {
      if (!scrollRef.current) return;
      setMaxScroll(scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [videos]);

  /** Hover auto-play */
  const handleMouseEnter = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      video.muted = true;
      video.play().catch((err) => {
        console.log("Video play failed:", err);
      });
    }
  };

  const handleMouseLeave = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  /** Horizontal scroll buttons */
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    const card = scrollRef.current.querySelector(".video-card") as HTMLDivElement;
    if (!card) return;

    const width = card.offsetWidth + 24;

    scrollRef.current.scrollTo({
      left:
        dir === "left"
          ? scrollRef.current.scrollLeft - width
          : scrollRef.current.scrollLeft + width,
      behavior: "smooth",
    });
  };

  /** Current, Prev, Next */
  const current = selectedIndex !== null ? videos[selectedIndex] : null;

  const prev =
    selectedIndex !== null && selectedIndex > 0
      ? videos[selectedIndex - 1]
      : undefined;

  const next =
    selectedIndex !== null && selectedIndex < videos.length - 1
      ? videos[selectedIndex + 1]
      : undefined;

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-4xl font-montserrat text-gray-900 mb-3">
              Cooking with EZ Masala
            </h2>
            <p className="text-gray-600 text-base font-raleway">
              Watch our campaign videos and cooking tips
            </p>
          </div>

          {videos.length > 0 ? (
            <div className="relative max-w-6xl mx-auto">
              {/* Scroll Row */}
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
                onScroll={(e) => setScrollPos(e.currentTarget.scrollLeft)}
                style={{ scrollbarWidth: "none" }}
              >
                {videos.map((video, index) => {
                  const hasSpice = video.spiceId && typeof video.spiceId === 'object';

                  return (
                    <div
                      key={video._id}
                      className="video-card w-[220px] flex-shrink-0 bg-white rounded-2xl overflow-hidden cursor-pointer relative group"
                      onMouseEnter={() => handleMouseEnter(video._id)}
                      onMouseLeave={() => handleMouseLeave(video._id)}
                      onClick={() => setSelectedIndex(index)}
                    >
                      {/* Preview video */}
                      <video
                        ref={(el) => {
                          videoRefs.current[video._id] = el;
                        }}
                        src={video.videoUrl}
                        className="w-full h-[380px] object-cover"
                        loop
                        playsInline
                        muted
                        preload="metadata"
                      />

                      {/* Bottom overlay - only show if spiceId exists */}
                      {hasSpice && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-3 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/30">
                            <img
                              src={video.spiceId.image}
                              alt={video.spiceId.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3
                              className="text-white text-sm font-semibold truncate hover:underline cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/product/${video.spiceId._id}`;
                              }}
                            >
                              {video.spiceId.title}
                            </h3>
                            <p className="text-white text-xs opacity-90 truncate">
                              ₹{video.spiceId.price}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Play icon */}
                      <div className="absolute top-4 right-4 pointer-events-none">
                        <div className="bg-black/60 rounded-full p-3 group-hover:bg-black/80 transition-all">
                          <svg
                            className="w-7 h-7 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* LEFT ARROW */}
              {scrollPos > 10 && (
                <button
                  onClick={() => scroll("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full"
                >
                  ❮
                </button>
              )}

              {/* RIGHT ARROW */}
              {scrollPos < maxScroll - 10 && (
                <button
                  onClick={() => scroll("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg p-3 rounded-full"
                >
                  ❯
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No campaign videos available yet.
            </p>
          )}
        </div>
      </section>

      {/* TikTok Modal */}
      {current && (
        <VideoModal
          current={current}
          prev={prev}
          next={next}
          onClose={() => setSelectedIndex(null)}
          goPrev={() => setSelectedIndex((i) => (i! > 0 ? i! - 1 : i))}
          goNext={() =>
            setSelectedIndex((i) => (i! < videos.length - 1 ? i! + 1 : i))
          }
        />
      )}
    </>
  );
}
