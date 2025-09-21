import React, { useState, useRef } from "react";
import type { Apartment, Person, Spot } from "@/lib/api";
import Image from "next/image";

type ItemType = Apartment | Person | Spot;
type TabType = "apartments" | "people" | "spots";

interface SwipeCardProps {
  item: ItemType;
  type: TabType;
  isTopCard?: boolean;
  onSwipe: (action: "like" | "pass") => void;
  style?: React.CSSProperties;
}

export default function SwipeCard({
  item,
  type,
  isTopCard = false,
  onSwipe,
  style,
}: SwipeCardProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const startPos = useRef({ x: 0, y: 0 });

  const images =
    item.photos && item.photos.length > 0
      ? item.photos
      : [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=600&fit=crop",
        ];

  const handleStart = (clientX: number, clientY: number) => {
    if (!isTopCard) return;
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleEnd);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !isTopCard) return;
    e.preventDefault();

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    setDragOffset({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.1);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !isTopCard) return;
    e.preventDefault();

    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;

    setDragOffset({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.1);
  };

  const handleEnd = () => {
    if (!isDragging || !isTopCard) return;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleEnd);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleEnd);

    setIsDragging(false);
    const threshold = 100;

    if (Math.abs(dragOffset.x) > threshold) {
      const action = dragOffset.x > 0 ? "like" : "pass";
      onSwipe(action);
    }

    setDragOffset({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  const getSwipeIndicator = () => {
    if (!isDragging) return null;

    const opacity = Math.min(Math.abs(dragOffset.x) / 100, 1);

    if (dragOffset.x > 50) {
      return (
        <div
          className="absolute z-10 px-6 py-3 text-xl font-bold text-white transform bg-green-500 top-12 right-12 rounded-2xl rotate-12"
          style={{ opacity }}
        >
          LIKE
        </div>
      );
    } else if (dragOffset.x < -50) {
      return (
        <div
          className="absolute z-10 px-6 py-3 text-xl font-bold text-white transform bg-red-500 top-12 left-12 rounded-2xl -rotate-12"
          style={{ opacity }}
        >
          PASS
        </div>
      );
    }
    return null;
  };

  const displayName = ("title" in item ? item.title : item.name) || "Unknown";
  const displayDescription =
    ("description" in item ? item.description : item.bio) ||
    "No description available";

  return (
    <div
      className={`absolute inset-0 w-full h-full select-none ${
        isTopCard ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      }`}
      style={{
        ...style,
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        transition: isDragging ? "none" : "all 0.3s ease-out",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="relative h-full overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-3xl">
        {getSwipeIndicator()}

        <div className="relative h-3/5">
          <Image
            // --- ❌ REMOVED ---
            // width={400}

            // --- ✅ ADDED ---
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            priority={isTopCard} // Optional: Load the top card's image faster
            // --- UNCHANGED ---
            src={images[currentImageIndex]}
            alt={displayName}
            className="object-cover w-full h-full"
            draggable={false}
          />

          {images.length > 1 && (
            <div className="absolute flex space-x-1 transform -translate-x-1/2 top-4 left-1/2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {images.length > 1 && isTopCard && (
            <>
              <div
                className="absolute top-0 left-0 z-10 w-1/3 h-full"
                onClick={prevImage}
              />
              <div
                className="absolute top-0 right-0 z-10 w-1/3 h-full"
                onClick={nextImage}
              />
            </>
          )}

          <div className="absolute px-3 py-1 rounded-full top-4 right-4 bg-black/70 backdrop-blur-sm">
            <span className="text-sm font-semibold text-white">
              {Math.round((item.match_score || 0.8) * 100)}% match
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="flex flex-col justify-between p-6 h-2/5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900 truncate">
                {displayName}
              </h2>
              <div className="text-lg text-gray-500">
                {type === "people" && "👤"}
                {type === "apartments" && "🏠"}
                {type === "spots" && "📍"}
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
              {displayDescription}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
            <div className="flex space-x-4 text-xs text-gray-500">
              <span>
                {images.length} photo{images.length !== 1 ? "s" : ""}
              </span>
              {type === "apartments" && <span>Details</span>}
              {type === "people" && <span>Active</span>}
              {type === "spots" && <span>Popular</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
