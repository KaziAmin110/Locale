"use client";

import { useState, useEffect, useMemo } from "react";
import { ApiService } from "@/lib/api";
import LoadingSpinner from "./components/LoadingSpinner";
import TabNavigation from "./components/TabNavigation";
import EmptyState from "./components/EmptyState";
import SwipeCard from "./components/SwipeCard";
import SwipeControls from "./components/SwipeControls";
import MatchModal from "./components/MatchModal";
import BottomNavigation from "./components/BottomNavigation";
import BackgroundMap from "./components/BackgroundMap";
import type { Apartment, Person, Spot } from "@/lib/api";

type TabType = "apartments" | "people" | "spots";
type ItemType = Apartment | Person | Spot;

export default function SwipePage() {
  const [activeTab, setActiveTab] = useState<TabType>("apartments");

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);

  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedItem, setMatchedItem] = useState<ItemType | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    const isDataMissing =
      (activeTab === "apartments" && apartments.length === 0) ||
      (activeTab === "people" && people.length === 0) ||
      (activeTab === "spots" && spots.length === 0);

    if (isDataMissing) {
      loadItems(activeTab);
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  const currentItems = useMemo(() => {
    switch (activeTab) {
      case "apartments":
        return apartments;
      case "people":
        return people;
      case "spots":
        return spots;
      default:
        return [];
    }
  }, [activeTab, apartments, people, spots]);

  const loadItems = async (type: TabType) => {
    setLoading(true);
    try {
      let response;
      switch (type) {
        case "apartments":
          response = await ApiService.getApartmentFeed();
          setApartments(response || []);
          break;
        case "people":
          response = await ApiService.getPeopleFeed();
          setPeople(response || []);
          break;
        case "spots":
          response = await ApiService.getSpotsFeed();
          setSpots(response || []);
          break;
      }
    } catch (error) {
      console.error(`Failed to load ${type}:`, error);
      if (type === "apartments") setApartments([]);
      if (type === "people") setPeople([]);
      if (type === "spots") setSpots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action: "like" | "pass") => {
    if (isSwiping || currentItems.length === 0) return;
    setIsSwiping(true);

    const currentItem = currentItems[0];
    const direction = action === "like" ? "right" : "left";

    const updateState = (setter: React.Dispatch<React.SetStateAction<any[]>>) =>
      setter((prev) => prev.slice(1));

    switch (activeTab) {
      case "apartments":
        updateState(setApartments);
        break;
      case "people":
        updateState(setPeople);
        break;
      case "spots":
        updateState(setSpots);
        break;
    }

    try {
      let response;
      switch (activeTab) {
        case "apartments":
          response = await ApiService.swipeApartment(currentItem.id, direction);
          break;
        case "people":
          response = await ApiService.swipePerson(currentItem.id, direction);
          break;
        case "spots":
          response = await ApiService.swipeSpot(currentItem.id, direction);
          break;
      }

      if (response?.match && action === "like") {
        setMatchedItem(currentItem);
        setShowMatchModal(true);
      }

      const remainingItems = currentItems.slice(1);
      if (remainingItems.length <= 2) {
        await loadItems(activeTab);
      }
    } catch (error) {
      console.error("Swipe failed:", error);
    } finally {
      setIsSwiping(false);
    }
  };

  // ---------- Map data (addresses only) ----------
  const activeId = currentItems[0]?.id;

  // Helper to build a robust address string from varying shapes
  const getAddressString = (a: any): string | null => {
    // Prefer a single full field if present
    if (typeof a.address === "string" && a.address.trim()) return a.address.trim();
    if (typeof a.fullAddress === "string" && a.fullAddress.trim()) return a.fullAddress.trim();

    // Otherwise combine pieces if present
    const parts = [
      a.street || a.street1 || a.line1,
      a.city,
      a.state || a.region || a.province,
      a.zip || a.postalCode,
    ].filter(Boolean);

    if (parts.length >= 2) return parts.join(", ");
    return null;
  };

  const mapItems =
    activeTab === "apartments"
      ? apartments
          .map((a) => {
            const addr = getAddressString(a);
            return addr
              ? {
                  id: a.id,
                  title: (a as any).title || (a as any).name || "",
                  address: addr,
                }
              : null;
          })
          .filter(Boolean) as { id: string; title?: string; address: string }[]
      : [];

  // Fit key: refit once when area changes (e.g., "Orlando, FL")
  const fitKey =
    activeTab === "apartments" && mapItems[0]?.address
      ? mapItems[0].address.split(",").slice(-2).join(",").trim()
      : null;

  // Debug (first load only gets noisy; comment out later)
  useEffect(() => {
    console.log("[page] apartments:", apartments.length);
    console.log("[page] mapItems sample:", mapItems.slice(0, 3));
  }, [apartments, mapItems.length]);

  return (
    <div className="relative min-h-screen pb-20">
      {/* Background map behind everything (apartments tab only) */}
      {activeTab === "apartments" && (
        <BackgroundMap items={mapItems} activeId={activeId} dim={0.1} fitKey={fitKey} />
      )}

      {/* Foreground UI */}
      <div className="relative z-10 container max-w-md px-4 pt-6 mx-auto">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex items-center justify-center" style={{ height: "70vh" }}>
          {loading ? (
            <LoadingSpinner />
          ) : currentItems.length === 0 ? (
            <EmptyState
              activeTab={activeTab}
              onRefresh={() => loadItems(activeTab)}
            />
          ) : (
            <div className="relative w-full h-full max-w-sm mx-auto">
              {currentItems.slice(0, 3).map((item, index) => (
                <SwipeCard
                  key={item.id}
                  item={item}
                  type={activeTab}
                  isTopCard={index === 0}
                  index={index}
                  onSwipe={index === 0 ? handleSwipe : () => {}}
                  style={{
                    zIndex: 3 - index,
                    transform: `scale(${1 - index * 0.05}) translateY(${index * 8}px)`,
                    opacity: 1 - index * 0.1,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {currentItems.length > 0 && !loading && (
          <SwipeControls
            onPass={() => handleSwipe("pass")}
            onLike={() => handleSwipe("like")}
            disabled={isSwiping}
          />
        )}
      </div>

      <MatchModal
        isOpen={showMatchModal}
        item={matchedItem}
        type={activeTab}
        onClose={() => setShowMatchModal(false)}
      />
      <BottomNavigation />
    </div>
  );
}
