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

// --- SVG Icons for Apartment Stats ---
const BedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5 inline-block"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M3 7v10h14V7H3zm-1-3a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1z" />
    <path d="M8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
  </svg>
);
const BathIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5 inline-block"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-1 5a1 1 0 00-1 1v3a1 1 0 001 1h12a1 1 0 001-1v-3a1 1 0 00-1-1H4z"
      clipRule="evenodd"
    />
  </svg>
);
const SqftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5 inline-block"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-1 5a1 1 0 00-1 1v3a1 1 0 001 1h12a1 1 0 001-1v-3a1 1 0 00-1-1H4z"
      clipRule="evenodd"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5 inline-block flex-shrink-0"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

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
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.1);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !isTopCard) return;
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

    if (Math.abs(dragOffset.x) > 100) {
      onSwipe(dragOffset.x > 0 ? "like" : "pass");
    }

    setDragOffset({ x: 0, y: 0 });
    setRotation(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
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

  const renderApartmentDetails = () => {
    const apartment = item as Apartment;
    return (
      <>
        <div className="flex items-start justify-end">
          <span className="flex-shrink-0 mb-2 ml-5 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            ${apartment.price?.toLocaleString()}/mo
          </span>
        </div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900 truncate-lines-1">
          {apartment.title}
        </h2>
        <div className="flex items-start mb-2 text-sm text-gray-500">
          <LocationIcon />
          <p className="truncate">{apartment.address}</p>
        </div>
        <p className="text-sm leading-relaxed text-gray-600 line-clamp-1">
          {apartment.description}
        </p>

        {/* Rich Stats Bar */}
        <div className="flex items-center justify-around pt-4 mt-4 text-sm font-medium text-gray-700 border-t border-gray-100">
          <div className="text-center">
            <BedIcon /> {apartment.bedrooms ?? "N/A"} beds
          </div>
          <div className="text-center">
            <BathIcon /> {apartment.bathrooms ?? "N/A"} baths
          </div>
          <div className="text-center">
            <SqftIcon /> {apartment.square_feet?.toLocaleString() ?? "N/A"} sqft
          </div>
        </div>
      </>
    );
  };

  const renderDefaultDetails = () => (
    <>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-900 truncate">
          {item.name || "Unknown"}
        </h2>
      </div>
      <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
        {item.description || item.bio || "No description available"}
      </p>
    </>
  );

  return (
    <div
      className={`absolute inset-0 w-full h-full select-none my-5 ${
        isTopCard ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      }`}
      style={{
        ...style,
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        transition: isDragging ? "none" : "all 0.3s ease-out",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }}
    >
      <div className="relative h-full overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
        {getSwipeIndicator()}

        <div className="relative overflow-hidden h-3/5">
          <Image
            src={images[currentImageIndex]}
            alt={item.name || "image"}
            fill
            className="object-cover w-full h-full"
            draggable={false}
            sizes="(max-width: 600px) 100vw, 600px"
            priority={isTopCard}
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=600&fit=crop";
            }}
          />

          {images.length > 1 && (
            <div className="absolute flex space-x-1.5 transform -translate-x-1/2 top-3 left-1/2 z-20">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full ${
                    index === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white/60 w-4"
                  }`}
                  style={{ transition: "width 0.3s ease" }}
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
              {Math.round((item.match_score || 0.8) * 100)}% Match
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="flex flex-col justify-between p-6 h-2/5">
          {type === "apartments"
            ? renderApartmentDetails()
            : renderDefaultDetails()}
        </div>
      </div>
    </div>
  );
}
