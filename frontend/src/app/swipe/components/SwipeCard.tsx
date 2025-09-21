"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import type { Apartment, Person, Spot } from "@/lib/api";
import Image from "next/image";
import { Map } from "lucide-react";

type ItemType = Apartment | Person | Spot;
type TabType = "apartments" | "people" | "spots";

interface SwipeCardProps {
  item: ItemType;
  type: TabType;
  isTopCard?: boolean;
  onSwipe: (action: "like" | "pass") => void;
  style?: React.CSSProperties;
  index: number;
}

// --- SVG Icons (Self-contained for consistency) ---
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
const ImageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
      clipRule="evenodd"
    />
  </svg>
);
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5 inline-block text-yellow-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
const CategoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1.5 inline-block text-red-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5a.997.997 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);
const BedDouble = () => (
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
const Bath = () => (
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
const Grid = () => (
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

export default function SwipeCard({
  item,
  type,
  isTopCard = false,
  onSwipe,
  style,
  index,
}: SwipeCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMapView, setIsMapView] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // --- FIX --- Add ref to prevent multiple backend calls
  const hasSwipedRef = useRef(false);

  useEffect(() => {
    setIsMapView(false);
    setCurrentImageIndex(0);
    // Reset swipe flag when item changes
    hasSwipedRef.current = false;
  }, [item.id]);

  const spotInfo = useMemo(() => {
    if (type !== "spots") return null;
    const spot = item as Spot;
    const parts = spot.description?.split("•").map((p) => p.trim());
    return {
      price: parts?.find((p) => p.startsWith("$")) || "$$",
      category:
        spot.category
          ?.replace(/_/g, " ")
          ?.replace(/\b\w/g, (c) => c.toUpperCase()) || "Activity",
    };
  }, [item, type]);

  const images =
    item.photos && item.photos.length > 0
      ? item.photos
      : [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=600&fit=crop",
        ];

  const SWIPE_THRESHOLD = 100;
  const SWIPE_VELOCITY_THRESHOLD = 500;

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);

    // Prevent multiple swipe calls
    if (hasSwipedRef.current || !isTopCard) {
      return;
    }

    const { offset, velocity } = info;
    const swipeDistance = Math.abs(offset.x);
    const swipeVelocity = Math.abs(velocity.x);

    // Only trigger swipe if threshold is met
    if (
      swipeDistance > SWIPE_THRESHOLD ||
      swipeVelocity > SWIPE_VELOCITY_THRESHOLD
    ) {
      // Mark as swiped to prevent duplicate calls
      hasSwipedRef.current = true;

      // Determine swipe direction
      const action = offset.x > 0 ? "like" : "pass";

      // Call the swipe handler
      onSwipe(action);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleMapView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMapView((prev) => !prev);
  };

  const getMapUrl = () => {
    if ((type !== "apartments" && type !== "spots") || !item.address) return "";
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    const encodedAddress = encodeURIComponent(item.address);
    return `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${encodedAddress}`;
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
        <h2 className="text-2xl font-bold text-gray-900 clamp-1">
          {apartment.title}
        </h2>
        <div className="flex items-start text-sm text-gray-500">
          <LocationIcon />
          <p className="truncate">{apartment.address}</p>
        </div>
        <div className="flex items-center justify-around pt-4 mt-4 text-sm font-medium text-gray-700 border-t border-gray-100">
          <div className="flex items-center gap-1 text-center">
            <BedDouble /> {apartment.bedrooms ?? "N/A"}
          </div>
          <div className="flex items-center gap-1 text-center">
            <Bath /> {apartment.bathrooms ?? "N/A"}
          </div>
          <div className="flex items-center gap-1 text-center">
            <Grid />
            {apartment.square_feet?.toLocaleString() ?? "N/A"} sqft
          </div>
        </div>
      </>
    );
  };

  const renderSpotDetails = () => {
    const spot = item as Spot;
    return (
      <>
        <h2 className="text-2xl font-bold text-gray-900 clamp-1">
          {spot.name}
        </h2>
        <div className="flex items-start text-sm text-gray-500">
          <LocationIcon />
          <p className="truncate">{spot.address}</p>
        </div>
        <div className="flex items-center justify-between pt-4 mt-4 text-sm font-medium text-gray-700 border-t border-gray-200">
          <div className="flex items-center text-center">
            <StarIcon /> {spot.rating ?? "N/A"}
          </div>
          <div className="flex items-center text-center capitalize">
            <CategoryIcon /> {spotInfo?.category}
          </div>
          <div className="flex items-center px-2 py-1 text-sm text-center text-white bg-green-600 border border-green-600 rounded-full">
            {spotInfo?.price}
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
        {(item as Person).bio || "No description available"}
      </p>
    </>
  );

  return (
    <motion.div
      className={`absolute inset-0 w-full h-full select-none my-5 ${
        isTopCard && !isMapView
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-default"
      }`}
      style={style}
      drag={isTopCard && !isMapView ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={{
        rotate: 0,
        scale: 1,
      }}
      exit={{
        x: 300,
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.3 },
      }}
      whileDrag={{
        rotate: 0,
        scale: 1.05,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      }}
    >
      <div className="relative h-full overflow-hidden bg-white border border-gray-100 shadow-xl rounded-3xl">
        {/* Swipe indicators */}
        {isDragging && (
          <>
            <motion.div
              className="absolute z-10 px-6 py-3 text-xl font-bold text-white transform bg-green-500 top-12 right-12 rounded-2xl rotate-12"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
            >
              LIKE
            </motion.div>

            <motion.div
              className="absolute z-10 px-6 py-3 text-xl font-bold text-white transform bg-red-500 top-12 left-12 rounded-2xl -rotate-12"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
            >
              PASS
            </motion.div>
          </>
        )}

        <div className="relative overflow-hidden h-3/5">
          {isMapView && (type === "apartments" || type === "spots") ? (
            <iframe
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              src={getMapUrl()}
            ></iframe>
          ) : (
            <>
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
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full ${
                        idx === currentImageIndex
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
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
            </>
          )}
          {(type === "apartments" || type === "spots") && (
            <button
              onClick={toggleMapView}
              className="absolute z-20 p-2 text-white transition-colors rounded-full top-14 right-4 bg-black/70 backdrop-blur-sm hover:bg-black/90"
              aria-label={isMapView ? "Show images" : "Show map"}
            >
              {isMapView ? <ImageIcon /> : <Map />}
            </button>
          )}
          <div className="absolute px-3 py-1 rounded-full top-4 right-4 bg-black/70 backdrop-blur-sm">
            <span className="text-sm font-semibold text-white">
              {Math.round((item.match_score || 0.8) * 100)}% Match
            </span>
          </div>
        </div>
        {index < 2 && (
          <div className="flex flex-col justify-between p-6 h-2/5">
            {(() => {
              switch (type) {
                case "apartments":
                  return renderApartmentDetails();
                case "spots":
                  return renderSpotDetails();
                case "people":
                  return renderDefaultDetails();
                default:
                  return null;
              }
            })()}
          </div>
        )}
      </div>
    </motion.div>
  );
}
