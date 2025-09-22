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
          // Assuming the corrected ApiService returns an object with an `items` array
          response = await ApiService.getApartmentsFeed();
          setApartments(response.items || []);
          break;
        case "people":
          response = await ApiService.getPeopleFeed();
          setPeople(response.items || []);
          break;
        case "spots":
          response = await ApiService.getSpotsFeed();
          setSpots(response.items || []);
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

    // Optimistically remove the card from the UI
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
      const swipePayload = { item_id: currentItem.id, action };

      switch (activeTab) {
        case "apartments":
          response = await ApiService.swipeApartment(swipePayload);
          break;
        case "people":
          response = await ApiService.swipePerson(swipePayload);
          break;
        case "spots":
          response = await ApiService.swipeSpot(swipePayload);
          break;
      }

      if (response?.match && action === "like") {
        setMatchedItem(currentItem);
        setShowMatchModal(true);
      }

      // Check if we need to fetch more items
      if (currentItems.length <= 3) {
        await loadItems(activeTab);
      }
    } catch (error) {
      console.error("Swipe failed:", error);
      // Here you might want to add the card back if the API call fails
    } finally {
      setIsSwiping(false);
    }
  };

  const getAddressString = (a: any): string | null => {
    if (typeof a?.address === "string" && a.address.trim())
      return a.address.trim();
    return null;
  };

  const mapItems = useMemo(() => {
    const source =
      activeTab === "apartments"
        ? apartments
        : activeTab === "spots"
        ? spots
        : [];

    return source
      .map((it: any) => {
        const addr = getAddressString(it);
        return addr
          ? { id: it.id, title: it.title || it.name || "", address: addr }
          : null;
      })
      .filter(Boolean) as { id: string; title?: string; address: string }[];
  }, [activeTab, apartments, spots]);

  const activeId = currentItems[0]?.id;

  const fitKey = useMemo(() => {
    if (!mapItems.length) return null;
    const sample = mapItems[0].address;
    const tail = sample
      .split(",")
      .slice(-2)
      .map((s) => s.trim())
      .join(", ");
    return `${activeTab}:${tail}`;
  }, [activeTab, mapItems]);

  return (
    <div className="relative min-h-screen pb-20">
      {/* --- SEARCH BAR REMOVED --- */}

      {(activeTab === "apartments" || activeTab === "spots") && (
        <BackgroundMap
          items={mapItems}
          activeId={activeId}
          fitKey={fitKey}
          dim={0.1}
          focusZoom={16}
          minZoom={11}
          maxZoom={17}
          focusOffsetPx={{ x: 240, y: 0 }}
          fitPadding={{ top: 60, right: 280, bottom: 60, left: 60 }}
        />
      )}

      <div className="container relative z-10 max-w-3xl px-4 pt-6 mx-auto">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div
          className="flex items-center justify-center"
          style={{ height: "70vh" }}
        >
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
                    transform: `scale(${1 - index * 0.05}) translateY(${
                      index * 8
                    }px)`,
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
