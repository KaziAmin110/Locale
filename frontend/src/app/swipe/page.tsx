"use client";

import { useState, useEffect } from "react";
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
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedItem, setMatchedItem] = useState<ItemType | null>(null);

  useEffect(() => {
    loadItems(activeTab);
  }, [activeTab]);

  const loadItems = async (type: TabType) => {
    setLoading(true);
    try {
      let response;
      switch (type) {
        case "apartments":
          response = await ApiService.getApartmentFeed();
          setItems(response || []);
          break;
        case "people":
          response = await ApiService.getPeopleFeed();
          setItems(response || []);
          break;
        case "spots":
          response = await ApiService.getSpotsFeed();
          setItems(response || []);
          break;
      }
    } catch (error) {
      console.error("Failed to load items:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action: "like" | "pass") => {
    if (items.length === 0) return;

    const currentItem = items[0];
    const remainingItems = items.slice(1);
    const direction = action === "like" ? "right" : "left";

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

      setItems(remainingItems);

      // Load more items if running low
      if (remainingItems.length <= 2) {
        loadItems(activeTab);
      }
    } catch (error) {
      console.error("Swipe failed:", error);
      setItems(remainingItems); // Still update UI
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
          ) : items.length === 0 ? (
            <EmptyState
              activeTab={activeTab}
              onRefresh={() => loadItems(activeTab)}
            />
          ) : (
            <div className="relative w-full h-full max-w-sm mx-auto">
              {items.slice(0, 3).map((item, index) => (
                <SwipeCard
                  key={item.id}
                  item={item}
                  type={activeTab}
                  isTopCard={index === 0}
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

        {items.length > 0 && (
          <SwipeControls
            onPass={() => handleSwipe("pass")}
            onLike={() => handleSwipe("like")}
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
