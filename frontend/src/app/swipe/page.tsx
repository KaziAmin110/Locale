"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
import { useJsApiLoader } from "@react-google-maps/api";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { MapPin, Loader2 } from "lucide-react";

const GOOGLE_ID = "__gmaps_on_swipe_page__";
const LIBRARIES: ("places")[] = ["places"];

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

  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  const { isLoaded } = useJsApiLoader({
    id: GOOGLE_ID,
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

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

  const getAddressString = (a: any): string | null => {
    if (typeof a?.address === "string" && a.address.trim()) return a.address.trim();
    if (typeof a?.fullAddress === "string" && a.fullAddress.trim()) return a.fullAddress.trim();
    const parts = [
      a?.street || a?.street1 || a?.line1,
      a?.city,
      a?.state || a?.region || a?.province,
      a?.zip || a?.postalCode,
    ].filter(Boolean);
    return parts.length >= 2 ? parts.join(", ") : null;
  };

  const mapItems = useMemo(() => {
    const source =
      activeTab === "apartments" ? apartments :
      activeTab === "spots" ? spots : [];

    return (source
      .map((it: any) => {
        const addr = getAddressString(it);
        return addr ? { id: it.id, title: it.title || it.name || "", address: addr } : null;
      })
      .filter(Boolean)) as { id: string; title?: string; address: string }[];
  }, [activeTab, apartments, spots]);

  const activeId = currentItems[0]?.id;

  const fitKey = useMemo(() => {
    if (!mapItems.length) return null;
    const sample = mapItems[0].address;
    const tail = sample.split(",").slice(-2).map((s) => s.trim()).join(", ");
    return `${activeTab}:${tail}:${currentQuery || ""}`;
  }, [activeTab, mapItems, currentQuery]);

  const [searchValue, setSearchValue] = useState("");

  const navigateToQuery = (q: string, lat?: number, lng?: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("q", q);
    if (typeof lat === "number" && typeof lng === "number") {
      url.searchParams.set("lat", String(lat));
      url.searchParams.set("lng", String(lng));
    } else {
      url.searchParams.delete("lat");
      url.searchParams.delete("lng");
    }
    window.location.href = url.toString();
  };

  const onSelectPlace = async (addr: string) => {
    try {
      const results = await geocodeByAddress(addr);
      const ll = await getLatLng(results[0]);
      const formatted = results[0].formatted_address || addr;
      navigateToQuery(formatted, ll.lat, ll.lng);
    } catch {
      navigateToQuery(addr);
    }
  };

  const onSubmitSearch = async () => {
    const q = searchValue.trim();
    if (!q) return;
    try {
      const results = await geocodeByAddress(q);
      if (results[0]) {
        const ll = await getLatLng(results[0]);
        const formatted = results[0].formatted_address || q;
        navigateToQuery(formatted, ll.lat, ll.lng);
        return;
      }
    } catch {}
    navigateToQuery(q);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation || !isLoaded) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const geocoder = new google.maps.Geocoder();
          const resp = await geocoder.geocode({ location: { lat, lng } });
          const formatted = resp.results?.[0]?.formatted_address || `${lat}, ${lng}`;
          navigateToQuery(formatted, lat, lng);
        } catch {
          navigateToQuery(`${lat}, ${lng}`, lat, lng);
        }
      },
      () => {
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="relative min-h-screen pb-20">
      <div className="sticky top-2 z-20 mx-auto mb-3 w-full max-w-xl px-4">
        {isLoaded ? (
          <PlacesAutocomplete
            value={searchValue}
            onChange={setSearchValue}
            onSelect={onSelectPlace}
            searchOptions={{
            }}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div className="relative">
                <input
                  {...getInputProps({
                    placeholder: "Search a city, neighborhood, or address…",
                    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onSubmitSearch();
                      }
                    },
                    className:
                      "w-full rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 pr-28 text-sm shadow-sm outline-none " +
                      "focus:border-pink-400 focus:ring-2 focus:ring-pink-200",
                  })}
                />
                <button
                  type="button"
                  onClick={onSubmitSearch}
                  className="absolute inset-y-1 right-1 rounded-xl bg-pink-500 px-4 text-sm font-medium text-white shadow hover:bg-pink-600"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={useMyLocation}
                  className="absolute inset-y-1 right-24 flex items-center gap-1 rounded-xl bg-gray-100 px-3 text-sm text-gray-700 shadow hover:bg-gray-200"
                  title="Use my location"
                >
                  <MapPin className="h-4 w-4" />
                  Me
                </button>

                {suggestions.length > 0 && (
                  <div className="absolute z-30 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                    {loading && (
                      <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                      </div>
                    )}
                    {suggestions.map((s) => {
                      const { key, ...props } = getSuggestionItemProps(s, {
                        className: "px-4 py-3 cursor-pointer hover:bg-pink-50 text-sm",
                      });
                      return (
                        <div key={s.placeId} {...props}>
                          <div className="font-medium">
                            {s.formattedSuggestion?.mainText || s.description}
                          </div>
                          {s.formattedSuggestion?.secondaryText && (
                            <div className="text-gray-500 text-xs">
                              {s.formattedSuggestion.secondaryText}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </PlacesAutocomplete>
        ) : (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading Maps…</span>
          </div>
        )}
      </div>
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

      <div className="relative z-10 container max-w-3xl px-4 pt-6 mx-auto">

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex items-center justify-center" style={{ height: "70vh" }}>
          {loading ? (
            <LoadingSpinner />
          ) : currentItems.length === 0 ? (
            <EmptyState activeTab={activeTab} onRefresh={() => loadItems(activeTab)} />
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
