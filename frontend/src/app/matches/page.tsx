"use client";

import { useState, useEffect } from "react";
import { Heart, MapPin, Users, Home, RefreshCw } from "lucide-react";
import { ApiService } from "@/lib/api";
import Header from "../components/Header";
import MatchList from "./components/MatchList";
import LoadingSpinner from "../components/LoadingSpinner";
import StatsCard from "./components/StatsCard";
import type { Match } from "@/lib/api";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "apartment" | "person" | "spot"
  >("all");

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await ApiService.getMatches();
      if (response.success) {
        setMatches(response.matches);
      }
    } catch (error) {
      console.error("Failed to load matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  };

  const filterOptions = [
    {
      id: "all" as const,
      label: "All Matches",
      icon: Heart,
      count: matches.length,
      color: "text-primary",
    },
    {
      id: "apartment" as const,
      label: "Apartments",
      icon: Home,
      count: matches.filter((m) => m.type === "apartment").length,
      color: "text-blue-600",
    },
    {
      id: "person" as const,
      label: "People",
      icon: Users,
      count: matches.filter((m) => m.type === "person").length,
      color: "text-green-600",
    },
    {
      id: "spot" as const,
      label: "Spots",
      icon: MapPin,
      count: matches.filter((m) => m.type === "spot").length,
      color: "text-purple-600",
    },
  ];

  const filteredMatches =
    activeFilter === "all"
      ? matches
      : matches.filter((match) => match.type === activeFilter);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="container max-w-6xl px-4 pt-6 mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mt-8 text-3xl font-bold text-gray-900">
                {getGreeting()}! 👋
              </h1>
              <p className="text-gray-600">
                You have {matches.length} match
                {matches.length !== 1 ? "es" : ""} waiting for you
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 transition-all duration-200 bg-white shadow-sm rounded-xl hover:shadow-md disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>

          {/* Stats Overview */}
          {matches.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
              {filterOptions.map(({ id, label, icon: Icon, count, color }) => (
                <StatsCard
                  key={id}
                  icon={Icon}
                  label={label}
                  count={count}
                  color={color}
                  isActive={activeFilter === id}
                  onClick={() => setActiveFilter(id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 md:mb-20">
          <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
            {filterOptions.map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all duration-200 transform hover:scale-105 ${
                  activeFilter === id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-200"
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
                {count > 0 && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      activeFilter === id
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : (
          <MatchList matches={filteredMatches} />
        )}
      </div>
    </div>
  );
}
