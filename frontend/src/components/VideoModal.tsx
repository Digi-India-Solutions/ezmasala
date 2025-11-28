"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface VideoData {
  _id: string;
  videoUrl: string;
  spiceId?: {
    _id: string;
    title: string;
    price: number;
    image: string;
  } | null;
}

interface TikTokModalProps {
  current: VideoData;
  next?: VideoData;
  prev?: VideoData;
  onClose: () => void;
  goNext: () => void;
  goPrev: () => void;
}

export default function VideoModal({
  current,
  next,
  prev,
  onClose,
  goNext,
  goPrev,
}: TikTokModalProps) {
  const router = useRouter();
  const currentRef = useRef<HTMLVideoElement | null>(null);
  const nextRef = useRef<HTMLVideoElement | null>(null);
  const prevRef = useRef<HTMLVideoElement | null>(null);

  const [isMuted, setIsMuted] = useState(true);

  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const hasSpice = current.spiceId && typeof current.spiceId === "object";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  /** PLAY ONLY CURRENT VIDEO */
  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.muted = isMuted;
      currentRef.current.play().catch(() => { });
    }
    if (prevRef.current) {
      prevRef.current.pause();
      prevRef.current.currentTime = 0;
    }
    if (nextRef.current) {
      nextRef.current.pause();
      nextRef.current.currentTime = 0;
    }
  }, [current, isMuted]);

  /** WHEEL scroll change */
  const handleWheel = (e: React.WheelEvent) => {
    if (transitioning || dragging) return;

    if (e.deltaY > 30 && next) trigger("up");
    if (e.deltaY < -30 && prev) trigger("down");
  };

  /** Trigger Slide */
  const trigger = (dir: "up" | "down") => {
    if (transitioning) return;

    setDirection(dir);
    setTransitioning(true);

    // Let the CSS animation play
    setTimeout(() => {
      if (dir === "up" && next) goNext();
      if (dir === "down" && prev) goPrev();

      // Reset transition state after new video is mounted
      setTimeout(() => {
        setDirection(null);
        setTransitioning(false);
      }, 150);
    }, 300);
  };

  /** Drag Start */
  const handleStart = (y: number) => {
    if (transitioning) return;
    setDragging(true);
    setDragStart(y);
    setDragOffset(0);
  };

  /** Drag Move */
  const handleMove = (y: number) => {
    if (!dragging) return;
    setDragOffset(y - dragStart);
  };

  /** Drag End */
  const handleEnd = () => {
    if (!dragging) return;

    const diff = dragOffset;
    const threshold = 120;

    if (diff < -threshold && next) {
      trigger("up");
    } else if (diff > threshold && prev) {
      trigger("down");
    }

    setDragging(false);
    setDragOffset(0);
  };

  /** STACK TRANSFORM (moves whole stack like TikTok) */
  const getStackTransform = () => {
    if (direction === "up") return "translateY(-100%)";
    if (direction === "down") return "translateY(100%)";

    if (dragging) return `translateY(${dragOffset}px)`;

    return "translateY(0)";
  };

  /** ONE SLIDE */
  const Slide = ({
    video,
    refObj,
    pos,
  }: {
    video: VideoData;
    refObj: React.RefObject<HTMLVideoElement | null>;
    pos: "prev" | "current" | "next";
  }) => {
    const baseY = pos === "prev" ? "-100%" : pos === "next" ? "100%" : "0";

    // TikTok-like scaling
    const scale =
      pos === "current"
        ? dragging || direction
          ? 0.92
          : 1
        : 0.96;

    // Slight fade for background slides
    const opacity = pos === "current" ? 1 : 0.7;

    // Option A: blurred preload for next/prev
    const blur = pos === "current" ? "blur(0px)" : "blur(10px)";

    const hasSpice = video.spiceId && typeof video.spiceId === "object";

    return (
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${baseY}) scale(${scale})`,
          transition: dragging
            ? "none"
            : "transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.25s ease-out, filter 0.35s ease-out",
          opacity,
          filter: blur,
        }}
      >
        <video
          ref={refObj}
          src={video.videoUrl}
          className="w-full h-full object-cover"
          playsInline
          autoPlay={pos === "current"}
          loop
          muted={isMuted}
          preload={pos === "current" ? "auto" : "metadata"}
        />

        {hasSpice && (
          <div
            className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md rounded-xl p-3 pointer-events-auto"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src={video.spiceId!.image}
                  alt={video.spiceId!.title}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-bold line-clamp-2">
                  {video.spiceId!.title}
                </h3>
                <p className="text-white text-sm opacity-80">
                  ₹{video.spiceId!.price}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/product/${video.spiceId!._id}`);
              }}
              className="w-full bg-white cursor-pointer text-black text-sm px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center">
      {/* Close */}
      <button
        onClick={onClose}
        className="fixed top-5 right-5 z-[100000] bg-white/20 hover:bg-white/40 w-12 h-12 rounded-full flex items-center justify-center"
      >
        ✕
      </button>

      {/* Mute */}
      <button
        onClick={() => setIsMuted((m) => !m)}
        className="fixed top-5 left-5 z-[100000] bg-white/20 hover:bg-white/40 w-12 h-12 rounded-full flex items-center justify-center"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* MAIN STACK */}
      <div
        className="relative w-full max-w-md h-full overflow-hidden select-none"
        onWheel={handleWheel}
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseMove={(e) => handleMove(e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        style={{
          transform: getStackTransform(),
          transition: dragging
            ? "none"
            : "transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        {prev && <Slide video={prev} refObj={prevRef} pos="prev" />}
        <Slide video={current} refObj={currentRef} pos="current" />
        {next && <Slide video={next} refObj={nextRef} pos="next" />}
      </div>

      {/* ARROWS */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[100000] flex flex-col gap-6">
        {prev && (
          <button
            onClick={() => trigger("down")}
            className="bg-white/20 hover:bg-white/40 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            ↑
          </button>
        )}

        {next && (
          <button
            onClick={() => trigger("up")}
            className="bg-white/20 hover:bg-white/40 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            ↓
          </button>
        )}
      </div>
    </div>
  );
}
