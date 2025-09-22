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

  // --- FIX --- Add a state to prevent double-swipes
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

    const updateState = (
      setter: React.Dispatch<React.SetStateAction<any[]>>
    ) => {
      setter((prev) => prev.slice(1));
    };

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
        await loadItems(activeTab); // wait for new items to load before unlocking
      }
    } catch (error) {
      console.error("Swipe failed:", error);
    } finally {
      // --- FIX --- Unlock the function once everything is done.
      setIsSwiping(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-md px-4 pt-6 mx-auto">
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
